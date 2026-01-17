'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { collection } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { MapPin, Loader2, AlertTriangle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useFirestore, useUser, useFirebaseApp, addDocumentNonBlocking } from '@/firebase';
import { categorizeIssueReport } from '@/ai/flows/categorize-issue-reports';

const MAX_FILE_SIZE_MB = 50;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ACCEPTED_MEDIA_TYPES = ['image/jpeg', 'image/png', 'video/mp4', 'video/quicktime']; // .mov is video/quicktime

const formSchema = z.object({
  title: z.string().min(5, 'A title of at least 5 characters is required.'),
  description: z.string().optional(),
  location: z.string().min(3, 'A specific location is required.'),
  category: z.string({ required_error: 'You must select an issue category.' }),
  media: z
    .instanceof(File, { message: 'A photo or video file is required.' })
    .refine((file) => file.size > 0, 'A photo or video file is required.')
    .refine(
      (file) => file.size <= MAX_FILE_SIZE_BYTES,
      `The maximum file size is ${MAX_FILE_SIZE_MB}MB.`
    )
    .refine(
      (file) => ACCEPTED_MEDIA_TYPES.includes(file.type),
      'Invalid file type. Please upload a JPEG, PNG, MP4, or MOV file.'
    ),
});


// Helper to convert a file to a data URI
const fileToDataUri = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export function ReportForm() {
  const { toast } = useToast();
  const router = useRouter();
  const firestore = useFirestore();
  const firebaseApp = useFirebaseApp();
  const { user, isUserLoading } = useUser();

  const [isLoading, setIsLoading] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      location: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Authentication Required',
        description: 'You must be logged in to report an issue.',
      });
      router.push('/login');
      return;
    }

    setIsLoading(true);

    try {
      let imageUrl: string | undefined;
      let imageHint: string | undefined;
      
      const photoDataUri = await fileToDataUri(values.media);
      const storage = getStorage(firebaseApp);
      const storageRef = ref(storage, `issues/${user.uid}/${Date.now()}-${values.media.name}`);
      
      const uploadResult = await uploadBytes(storageRef, values.media);
      imageUrl = await getDownloadURL(uploadResult.ref);

      const categorization = await categorizeIssueReport({
        description: values.description || values.title, // Use title if description is empty
        location: values.location,
        photoDataUri: photoDataUri,
      });
      
      imageHint = categorization.imageHint;

      const issuesCollectionRef = collection(firestore, 'issues');
      const newIssue = {
        userId: user.uid,
        title: values.title,
        description: values.description || 'No description provided.',
        location: values.location,
        category: values.category, // Use user-selected category
        severity: categorization.severity, // Use AI-assessed severity
        status: 'Reported' as const,
        upvotes: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        reporterName: user.displayName || user.email || 'Anonymous',
        reporterAvatarUrl: user.photoURL || `https://api.dicebear.com/8.x/initials/svg?seed=${user.email}`,
        imageUrl,
        imageHint
      };

      addDocumentNonBlocking(issuesCollectionRef, newIssue);
      
      toast({
        title: 'Issue Reported Successfully!',
        description: `Thank you for your submission. Your report is now live.`,
      });

      form.reset();
      router.push('/');

    } catch (error) {
      console.error('Error submitting issue:', error);
      toast({
        variant: 'destructive',
        title: 'Submission Failed',
        description: 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetLocation = () => {
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        form.setValue('location', `Lat: ${latitude.toFixed(5)}, Lon: ${longitude.toFixed(5)}`, {
          shouldValidate: true,
        });
        setIsLocating(false);
      },
      (error) => {
        console.error("Error getting location", error);
        toast({
          variant: 'destructive',
          title: 'Location Error',
          description: 'Could not retrieve your location. Please enter it manually.',
        });
        setIsLocating(false);
      }
    );
  };
  
  if (isUserLoading) {
    return (
      <div className="flex items-center justify-center p-8 min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg min-h-[400px]">
          <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium">Authentication Required</p>
          <p className="text-muted-foreground mb-4">You need to be logged in to report an issue.</p>
          <Link href="/login">
            <Button>Login to Report</Button>
          </Link>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title <span className="text-destructive">*</span></FormLabel>
              <FormControl>
                <Input placeholder="e.g., Large pothole causing traffic issues" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type of Issue <span className="text-destructive">*</span></FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                    <SelectItem value="Pothole">Road Repair / Pothole</SelectItem>
                    <SelectItem value="Traffic">Traffic & Signals</SelectItem>
                    <SelectItem value="Safety">Public Safety Concern</SelectItem>
                    <SelectItem value="Garbage">Garbage & Sanitation</SelectItem>
                    <SelectItem value="Street Light">Street Light Outage</SelectItem>
                    <SelectItem value="Water">Water Leakage / Supply</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Provide additional details about the issue."
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location <span className="text-destructive">*</span></FormLabel>
              <div className="flex gap-2">
                <FormControl>
                  <Input placeholder="e.g., Corner of Main St & Oak Ave" {...field} />
                </FormControl>
                <Button type="button" variant="outline" onClick={handleGetLocation} disabled={isLocating}>
                  {isLocating ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
                  <span className="sr-only">Get current location</span>
                </Button>
              </div>
              <FormDescription>Be as specific as possible for a faster response.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="media"
          render={({ field: { onChange, value, ...rest } }) => (
             <FormItem>
              <FormLabel>Attach Photo or Video <span className="text-destructive">*</span></FormLabel>
              <FormControl>
                <Input 
                  type="file" 
                  accept="image/jpeg,image/png,video/mp4,video/quicktime"
                  onChange={(e) => onChange(e.target.files ? e.target.files[0] : null)}
                  className="pt-2 file:text-primary file:cursor-pointer"
                />
              </FormControl>
              <FormDescription>A picture or video is required. Max file size: {MAX_FILE_SIZE_MB}MB.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting Report...
            </>
          ) : (
            'Send Report'
          )}
        </Button>
      </form>
    </Form>
  );
}
