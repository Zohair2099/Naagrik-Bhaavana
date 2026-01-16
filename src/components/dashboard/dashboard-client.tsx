'use client';

import { useState, useMemo } from 'react';
import { collection, doc, increment } from 'firebase/firestore';
import { useFirestore, useCollection, useUser, useMemoFirebase } from '@/firebase';
import { updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useToast } from '@/hooks/use-toast';
import type { Issue, Severity } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { IssueCard } from './issue-card';
import { MapPlaceholder } from './map-placeholder';
import { Separator } from '../ui/separator';
import { Skeleton } from '../ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { AlertTriangle } from 'lucide-react';

const allSeverities: Severity[] = ['low', 'medium', 'high'];

export function DashboardClient() {
  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();

  const issuesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'issues');
  }, [firestore]);

  const { data: issues, isLoading, error } = useCollection<Issue>(issuesQuery);

  const [categoryFilter, setCategoryFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('');

  const filteredIssues = useMemo(() => {
    if (!issues) return [];
    return issues.filter((issue) => {
      const categoryMatch = categoryFilter === 'all' || issue.category === categoryFilter;
      const severityMatch = severityFilter === 'all' || issue.severity === severityFilter;
      const locationMatch = issue.location.toLowerCase().includes(locationFilter.toLowerCase());
      return categoryMatch && severityMatch && locationMatch;
    });
  }, [issues, categoryFilter, severityFilter, locationFilter]);

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

  const allCategories = useMemo(() => {
    if (!issues) return [];
    return [...new Set(issues.map((i) => i.category))];
  }, [issues]);

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold font-headline tracking-tight">Community Dashboard</h1>
        <p className="text-muted-foreground">Browse, filter, and track civic issues reported by the community.</p>
      </header>

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <Input
          placeholder="Filter by location..."
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          className="w-full md:max-w-xs bg-card"
        />
        <div className="flex gap-4">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px] bg-card">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {allCategories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={severityFilter} onValueChange={setSeverityFilter}>
            <SelectTrigger className="w-[180px] bg-card">
              <SelectValue placeholder="Filter by severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severities</SelectItem>
              {allSeverities.map((sev) => (
                <SelectItem key={sev} value={sev} className="capitalize">
                  {sev}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <MapPlaceholder />
        </div>
        <div className="lg:col-span-2 space-y-4">
          {isLoading && (
            <div className="space-y-4">
              <Skeleton className="h-[250px] w-full rounded-lg" />
              <Skeleton className="h-[250px] w-full rounded-lg" />
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
            filteredIssues.length > 0 ? (
              filteredIssues.map((issue) => <IssueCard key={issue.id} issue={issue} onUpvote={handleUpvote} />)
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg h-full">
                <p className="text-lg font-medium">No issues found.</p>
                <p className="text-muted-foreground">Be the first to report one!</p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
