'use client';

import { useMemo } from 'react';
import { collection, query, where, doc, increment } from 'firebase/firestore';
import { useFirestore, useCollection, useUser, useMemoFirebase } from '@/firebase';
import { updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useToast } from '@/hooks/use-toast';
import type { Issue } from '@/lib/types';
import { IssueCard } from '@/components/dashboard/issue-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { Button } from '../ui/button';
import Link from 'next/link';

export function MyReportsClient() {
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();

  const issuesQuery = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return query(collection(firestore, 'issues'), where('userId', '==', user.uid));
  }, [firestore, user?.uid]);

  const { data: issues, isLoading, error } = useCollection<Issue>(issuesQuery);

  const handleUpvote = (issueId: string) => {
    if (!firestore) return;
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Authentication Required',
        description: 'You must be logged in to upvote issues.',
      });
      return;
    }
    const issueRef = doc(firestore, 'issues', issueId);
    updateDocumentNonBlocking(issueRef, {
      upvotes: increment(1),
    });
  };

  if (isUserLoading || (isLoading && !issues)) {
    return (
        <div className="space-y-4">
            <Skeleton className="h-[250px] w-full rounded-lg" />
            <Skeleton className="h-[250px] w-full rounded-lg" />
        </div>
    );
  }

  if (!user && !isUserLoading) {
      return (
        <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg h-full">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">Please log in</p>
            <p className="text-muted-foreground mb-4">You need to be logged in to view your reported issues.</p>
            <Link href="/login">
              <Button>Login</Button>
            </Link>
        </div>
      )
  }

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

  return (
    <div className="space-y-4">
      {!isLoading && issues && issues.length > 0 ? (
        issues.map((issue) => <IssueCard key={issue.id} issue={issue} onUpvote={handleUpvote} />)
      ) : (
        <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg h-full">
          <p className="text-lg font-medium">No issues reported yet.</p>
          <p className="text-muted-foreground mb-4">You haven't reported any issues. Let's change that!</p>
          <Link href="/report">
            <Button>Report an Issue</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
