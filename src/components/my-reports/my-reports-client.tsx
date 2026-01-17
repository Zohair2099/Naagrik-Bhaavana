'use client';

import { useMemo, useState } from 'react';
import { useUser } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import type { Issue } from '@/lib/types';
import { mockIssues as allMockIssues } from '@/lib/mock-data';
import { IssueCard } from '@/components/dashboard/issue-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { Button } from '../ui/button';
import Link from 'next/link';

function MyReportsSkeletons() {
    return (
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-[280px] w-full rounded-2xl" />
            <Skeleton className="h-[280px] w-full rounded-2xl" />
        </div>
    )
}

export function MyReportsClient() {
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();

  const [allIssues, setAllIssues] = useState<Issue[]>(allMockIssues);

  const issues = useMemo(() => {
    // For demo purposes, we'll assign the current logged-in user to 'user-1' from our mock data.
    if (!user) return [];
    return allIssues.filter(issue => issue.userId === 'user-1');
  }, [user, allIssues]);

  const isLoading = false;
  const error = null;

  const handleUpvote = (issueId: string) => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Authentication Required',
        description: 'You must be logged in to upvote issues.',
      });
      return;
    }
    setAllIssues(currentIssues => 
      currentIssues.map(issue => 
        issue.id === issueId ? { ...issue, upvotes: issue.upvotes + 1 } : issue
      )
    );
  };

  // State 1: Still checking for user
  if (isUserLoading) {
    return <MyReportsSkeletons />;
  }

  // State 2: No user found
  if (!user) {
      return (
        <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-2xl h-full bg-card">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">Please log in</p>
            <p className="text-muted-foreground mb-4">You need to be logged in to view your reported issues.</p>
            <Link href="/login">
              <Button>Login</Button>
            </Link>
        </div>
      )
  }
  
  // From here, we have a user. Now check for issues loading or errors.
  
  // State 3: Loading user's issues
  if (isLoading) {
      return <MyReportsSkeletons />
  }

  // State 4: Error loading issues
  if (error) {
      return (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error Loading Your Issues</AlertTitle>
          <AlertDescription>
            There was a problem fetching your data. Please try again later.
          </AlertDescription>
        </Alert>
      )
  }

  // State 5: Data loaded, render issues or empty state
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {issues && issues.length > 0 ? (
        issues.map((issue) => <IssueCard key={issue.id} issue={issue} onUpvote={handleUpvote} />)
      ) : (
        <div className="col-span-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-2xl h-64 bg-card">
          <p className="text-4xl">📝</p>
          <p className="text-lg font-medium mt-4">No reports yet.</p>
          <p className="text-muted-foreground">You haven't reported any issues. Let's change that!</p>
          <Link href="/report" className="mt-4">
            <Button>Report an Issue</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
