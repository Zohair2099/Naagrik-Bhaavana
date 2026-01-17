'use client';

import { useState, useMemo } from 'react';
import { collection, doc, increment } from 'firebase/firestore';
import { useFirestore, useCollection, useUser, useMemoFirebase } from '@/firebase';
import { updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useToast } from '@/hooks/use-toast';
import type { Issue } from '@/lib/types';
import { IssueCard } from './issue-card';
import { Skeleton } from '../ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { AlertTriangle } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';


const allStatuses = ['Reported', 'In Progress', 'Resolved'];


function Hero({ totalIssues, resolvedIssues }: { totalIssues: number, resolvedIssues: number }) {
  const successRate = totalIssues > 0 ? Math.round((resolvedIssues / totalIssues) * 100) : 0;
  return (
    <div className="relative mb-8 overflow-hidden rounded-2xl bg-secondary p-8 text-secondary-foreground shadow-lg">
       <div className="relative z-10 max-w-3xl">
          <h2 className="text-4xl font-bold font-headline mb-2">
            Building Better Communities Together
          </h2>
          <p className="text-lg text-secondary-foreground/90 mb-8">
            Report civic issues, track progress, and make your voice heard.
          </p>
          <div className="flex flex-col sm:flex-row gap-8">
            <div className="text-center">
              <div className="font-code text-5xl font-bold text-accent">{totalIssues}</div>
              <div className="text-sm uppercase tracking-wider text-secondary-foreground/80 mt-1">Total Reports</div>
            </div>
            <div className="text-center">
              <div className="font-code text-5xl font-bold text-accent">{resolvedIssues}</div>
              <div className="text-sm uppercase tracking-wider text-secondary-foreground/80 mt-1">Resolved Issues</div>
            </div>
             <div className="text-center">
              <div className="font-code text-5xl font-bold text-accent">{successRate}%</div>
              <div className="text-sm uppercase tracking-wider text-secondary-foreground/80 mt-1">Success Rate</div>
            </div>
          </div>
       </div>
    </div>
  );
}


export function DashboardClient() {
  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();

  const issuesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'issues');
  }, [firestore]);

  const { data: issues, isLoading, error } = useCollection<Issue>(issuesQuery);

  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredIssues = useMemo(() => {
    if (!issues) return [];
    return issues
      .filter((issue) => {
        const categoryMatch = filterCategory === 'all' || issue.category === filterCategory;
        const statusMatch = filterStatus === 'all' || issue.status === filterStatus;
        return categoryMatch && statusMatch;
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [issues, filterCategory, filterStatus]);
  
  const uniqueCategories = useMemo(() => {
    if (!issues) return [];
    // Sort categories alphabetically for a stable UI, preventing reordering glitches
    const categories = [...new Set(issues.map((i) => i.category))].sort();
    return ['all', ...categories];
  }, [issues]);

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
  
  const totalIssues = issues?.length ?? 0;
  const resolvedIssues = issues?.filter(i => i.status === 'Resolved').length ?? 0;


  return (
    <div className="space-y-6">
      <Hero totalIssues={totalIssues} resolvedIssues={resolvedIssues} />
      
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
        <h2 className="text-3xl font-bold text-secondary font-headline">All Issues</h2>
        <div className="flex flex-wrap items-center gap-2">
           <div className="flex flex-wrap gap-2 border border-border p-1 rounded-full bg-card shadow-sm">
              {uniqueCategories.map((cat) => (
                <Button
                  key={cat}
                  variant={filterCategory === cat ? 'default' : 'ghost'}
                  className={cn("capitalize rounded-full", filterCategory === cat ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'hover:bg-muted')}
                  onClick={() => setFilterCategory(cat)}
                  size="sm"
                >
                  {cat}
                </Button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 border border-border p-1 rounded-full bg-card shadow-sm">
              {['all', ...allStatuses].map((status) => (
                <Button
                  key={status}
                  variant={filterStatus === status ? 'default' : 'ghost'}
                  className={cn("capitalize rounded-full", filterStatus === status ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'hover:bg-muted')}
                  onClick={() => setFilterStatus(status)}
                  size="sm"
                >
                  {status}
                </Button>
              ))}
            </div>
        </div>
      </div>


      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton className="h-[280px] w-full rounded-2xl" />
          <Skeleton className="h-[280px] w-full rounded-2xl" />
          <Skeleton className="h-[280px] w-full rounded-2xl" />
        </div>
      )}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error Loading Issues</AlertTitle>
          <AlertDescription>
            There was a problem fetching the issue data. It's possible you don't have permission or there's a network issue.
          </AlertDescription>
        </Alert>
      )}
      {!isLoading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIssues.length > 0 ? (
            filteredIssues.map((issue) => 
                <IssueCard key={issue.id} issue={issue} onUpvote={handleUpvote} />
            )
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-2xl h-64 bg-card">
              <p className="text-4xl">📋</p>
              <p className="text-lg font-medium mt-4">No issues found.</p>
              <p className="text-muted-foreground">Try adjusting your filters or be the first to report one!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
