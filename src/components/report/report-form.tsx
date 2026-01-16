'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { useEffect, useRef, useState } from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { submitIssue, type FormState } from '@/app/report/actions';

const formSchema = z.object({
  description: z.string().min(10, "Please provide a detailed description (at least 10 characters)."),
  location: z.string().min(3, "Please provide a specific location."),
  media: z.any().optional(),
});

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
        </>
      ) : (
        'Submit Issue'
      )}
    </Button>
  );
}

export function ReportForm() {
  const { toast } = useToast();
  const [isLocating, setIsLocating] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [formState, formAction] = useFormState<FormState, FormData>(submitIssue, {
    message: '',
    success: false,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: '',
      location: '',
    },
  });

  useEffect(() => {
    if (formState.message) {
      if (formState.success) {
        toast({
          title: 'Success!',
          description: formState.message,
        });
        form.reset();
        formRef.current?.reset();
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: formState.message,
        });
      }
    }
  }, [formState, toast, form]);

  const handleGetLocation = () => {
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // In a real app, you might reverse-geocode this. For now, we'll just use coords.
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

  return (
    <Form {...form}>
      <form ref={formRef} action={formAction} className="space-y-6">
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the issue in detail. What is it, and why is it a problem?"
                  rows={5}
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
              <FormLabel>Location</FormLabel>
              <div className="flex gap-2">
                <FormControl>
                  <Input placeholder="e.g., Corner of Main St & Oak Ave" {...field} />
                </FormControl>
                <Button type="button" variant="outline" onClick={handleGetLocation} disabled={isLocating}>
                  {isLocating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <MapPin className="h-4 w-4" />
                  )}
                  <span className="sr-only">Get current location</span>
                </Button>
              </div>
              <FormDescription>
                Be as specific as possible for a faster response.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="media"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Attach Photo/Video (Optional)</FormLabel>
              <FormControl>
                <Input type="file" {...field} />
              </FormControl>
              <FormDescription>
                A picture is worth a thousand words.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <SubmitButton />
      </form>
    </Form>
  );
}
