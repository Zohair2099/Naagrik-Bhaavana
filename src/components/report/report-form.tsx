'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { MapPin, Loader2, AlertTriangle, UploadCloud, FileCheck2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useFirestore, useUser, useStorage } from '@/firebase';
import { categorizeIssueReport, CategorizeIssueReportOutput } from '@/ai/flows/categorize-issue-reports';
import { cn } from '@/lib/utils';

const MAX_FILE_SIZE_MB = 50;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ACCEPTED_MEDIA_TYPES = ['image/jpeg', 'image/png', 'video/mp4', 'video/quicktime'];

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
  const storage = useStorage();
  const { user, isUserLoading } = useUser();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStep, setSubmissionStep] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: '', description: '', location: '' },
  });
  
  const mediaFile = form.watch('media');

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

    setIsSubmitting(true);

    let imageUrl = '';
    let categorization: CategorizeIssueReportOutput;

    // Step 1: Upload Media
    try {
      setSubmissionStep('Uploading media...');
      const storagePath = `issues/${user.uid}/${Date.now()}-${values.media.name}`;
      const storageRef = ref(storage, storagePath);
      await uploadBytes(storageRef, values.media);
      imageUrl = await getDownloadURL(storageRef);
    } catch (uploadError) {
      console.error('Media upload failed:', uploadError);
      toast({
        variant: 'destructive',
        title: 'Upload Failed',
        description: 'Could not upload your media file. Please check your connection and try again.',
      });
      setIsSubmitting(false);
      setSubmissionStep('');
      return;
    }

    // Step 2: AI Analysis
    try {
      setSubmissionStep('Analyzing issue...');
      const photoDataUri = await fileToDataUri(values.media);
      categorization = await categorizeIssueReport({
        description: values.description || values.title,
        location: values.location,
        category: values.category,
        photoDataUri,
      });
    } catch (aiError) {
      console.warn("AI categorization failed, using fallback.", aiError);
      categorization = { severity: 'low', imageHint: 'user provided' };
      toast({
        title: "AI Analysis Skipped",
        description: "A default severity was assigned. Your report will still be submitted.",
      });
    }

    // Step 3: Save to Firestore
    try {
      setSubmissionStep('Saving report...');
      const issuesCollectionRef = collection(firestore, 'issues');
      const newIssue = {
        userId: user.uid,
        title: values.title,
        description: values.description || 'No description provided.',
        location: values.location,
        category: values.category,
        severity: categorization.severity,
        status: 'Reported' as const,
        upvotes: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        reporterName: user.displayName || user.email || 'Anonymous',
        reporterAvatarUrl: user.photoURL || `https://api.dicebear.com/8.x/initials/svg?seed=${user.email}`,
        imageUrl,
        imageHint: categorization.imageHint
      };
      await addDoc(issuesCollectionRef, newIssue);
    } catch (dbError) {
      console.error('Firestore save failed:', dbError);
      toast({
        variant: 'destructive',
        title: 'Save Failed',
        description: 'Could not save your report to the database. Please try again.',
      });
      setIsSubmitting(false);
      setSubmissionStep('');
      return;
    }

    // Step 4: Success
    setSubmissionStep('Done!');
    toast({
      title: 'Issue Reported Successfully!',
      description: "Thank you for helping improve your community.",
    });

    form.reset();
    setIsSubmitting(false);
    setSubmissionStep('');
    router.push('/my-reports');
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
          render={({ field: { onChange, ...rest } }) => (
             <FormItem>
                <FormLabel>Attach Photo or Video <span className="text-destructive">*</span></FormLabel>
                <FormControl>
                    <label htmlFor="media-upload" className={cn(
                        "group relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-input bg-background p-6 text-center transition-colors hover:border-primary hover:bg-primary/5",
                        mediaFile && "border-solid border-primary bg-primary/5"
                    )}>
                        {mediaFile ? (
                            <>
                                <FileCheck2 className="h-10 w-10 text-primary" />
                                <p className="mt-2 text-sm font-medium text-primary">{mediaFile.name}</p>
                                <p className="text-xs text-muted-foreground">Click to change file</p>
                            </>
                        ) : (
                            <>
                                <UploadCloud className="h-10 w-10 text-muted-foreground group-hover:text-primary" />
                                <p className="mt-2 text-sm text-muted-foreground">
                                    <span className="font-semibold text-primary">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-xs text-muted-foreground">PNG, JPG, MP4, or MOV (max {MAX_FILE_SIZE_MB}MB)</p>
                            </>
                        )}
                        <Input 
                          id="media-upload"
                          type="file" 
                          className="sr-only"
                          accept="image/jpeg,image/png,video/mp4,video/quicktime"
                          onChange={(e) => onChange(e.target.files ? e.target.files[0] : null)}
                          {...rest}
                        />
                    </label>
                </FormControl>
                <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> {submissionStep || 'Submitting...'}
            </>
          ) : (
            'Send Report'
          )}
        </Button>
      </form>
    </Form>
  );
}
