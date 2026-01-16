'use client';

import { collection, doc } from 'firebase/firestore';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import type { Issue, IssueStatus, Severity } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const allStatuses: IssueStatus[] = ['Reported', 'In Progress', 'Resolved'];

const severityConfig: Record<Severity, { className: string }> = {
  low: { className: 'bg-accent text-accent-foreground hover:bg-accent/80' },
  medium: { className: 'bg-yellow-500 text-white hover:bg-yellow-500/80' },
  high: { className: 'bg-destructive text-destructive-foreground hover:bg-destructive/80' },
};

const statusConfig: Record<IssueStatus, { className: string; icon: React.ReactNode }> = {
  Reported: { className: 'bg-blue-500 text-white hover:bg-blue-500/80', icon: <Clock className="h-3 w-3" /> },
  'In Progress': { className: 'bg-orange-500 text-white hover:bg-orange-500/80', icon: <Clock className="h-3 w-3" /> },
  Resolved: { className: 'bg-accent text-accent-foreground hover:bg-accent/80', icon: <CheckCircle className="h-3 w-3" /> },
};


export function AdminDashboardClient() {
  const firestore = useFirestore();

  const issuesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'issues');
  }, [firestore]);

  const { data: issues, isLoading, error } = useCollection<Issue>(issuesQuery);

  const handleStatusChange = (issueId: string, newStatus: IssueStatus) => {
    if (!firestore) return;
    const issueRef = doc(firestore, 'issues', issueId);
    updateDocumentNonBlocking(issueRef, {
      status: newStatus,
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold font-headline tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage and track all reported civic issues.</p>
      </header>
      <div className="border rounded-lg bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Reported On</TableHead>
              <TableHead>Reporter</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading &&
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-9 w-36" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-28" /></TableCell>
                </TableRow>
              ))}
            {error && (
              <TableRow>
                <TableCell colSpan={6}>
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Error Loading Issues</AlertTitle>
                    <AlertDescription>
                      There was a problem fetching data. Please check your permissions or network.
                    </AlertDescription>
                  </Alert>
                </TableCell>
              </TableRow>
            )}
            {!isLoading && !error && issues && issues.length > 0 ? (
              issues.map((issue) => (
                <TableRow key={issue.id}>
                  <TableCell className="font-medium">{issue.title}</TableCell>
                  <TableCell><Badge variant="secondary">{issue.category}</Badge></TableCell>
                  <TableCell>
                     <Badge className={cn('capitalize', severityConfig[issue.severity].className)}>
                        {issue.severity}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={issue.status}
                      onValueChange={(newStatus: IssueStatus) => handleStatusChange(issue.id, newStatus)}
                    >
                      <SelectTrigger className="w-[150px]">
                         <SelectValue asChild>
                            <Badge className={cn("flex items-center gap-1.5 capitalize pl-2 w-fit", statusConfig[issue.status].className)}>
                                {statusConfig[issue.status].icon}
                                {issue.status}
                            </Badge>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {allStatuses.map((status) => (
                          <SelectItem key={status} value={status}>
                             <div className="flex items-center gap-2">
                                <div className={cn("h-2 w-2 rounded-full", statusConfig[status].className)} />
                                {status}
                             </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>{format(new Date(issue.createdAt), 'PP')}</TableCell>
                  <TableCell>{issue.reporterName}</TableCell>
                </TableRow>
              ))
            ) : (
              !isLoading && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-24">
                    No issues reported yet.
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
