'use server';

import { z } from 'zod';
import { categorizeIssueReport } from '@/ai/flows/categorize-issue-reports';

const formSchema = z.object({
  description: z.string().min(10, {
    message: 'Description must be at least 10 characters.',
  }),
  location: z.string().min(3, {
    message: 'Location must be at least 3 characters.',
  }),
});

export type FormState = {
  message: string;
  fields?: Record<string, string>;
  issues?: string[];
  success: boolean;
};

export async function submitIssue(
  prevState: FormState,
  data: FormData
): Promise<FormState> {
  const formData = Object.fromEntries(data);
  const parsed = formSchema.safeParse(formData);

  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const key of Object.keys(formData)) {
      fields[key] = formData[key].toString();
    }
    return {
      message: 'Invalid form data',
      fields,
      issues: parsed.error.issues.map((issue) => issue.message),
      success: false,
    };
  }

  try {
    const { description, location } = parsed.data;

    // Call the AI to categorize the issue
    const categorization = await categorizeIssueReport({ description, location });

    console.log('AI Categorization Result:', categorization);
    
    // In a real app, you would save the parsed.data and categorization result to your database.
    // For example:
    // await db.collection('issues').add({
    //   ...parsed.data,
    //   category: categorization.category,
    //   severity: categorization.severity,
    //   status: 'Reported',
    //   createdAt: new Date(),
    // });

    return { 
        message: `Issue submitted successfully! AI classified it as a "${categorization.severity}" severity issue in the "${categorization.category}" category.`,
        success: true 
    };
  } catch (error) {
    console.error('Error submitting issue:', error);
    return { 
        message: 'An unexpected error occurred. Please try again.',
        success: false 
    };
  }
}
