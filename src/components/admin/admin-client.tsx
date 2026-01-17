'use client';

import { useState } from 'react';
import { collection, doc } from 'firebase/firestore';
import { useFirestore, useCollection, useUser, useMemoFirebase } from '@/firebase';
import { updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import type { Issue } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { AlertTriangle, Loader2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Button } from '../ui/button';
import Link from 'next/link';

export function AdminClient() {
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();

  const issuesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    // In a real app, you might add ordering or filtering here
    return collection(firestore, 'issues');
  }, [firestore]);

  const { data: issues, isLoading, error } = useCollection<Issue>(issuesQuery);

  const handleStatusUpdate = (issueId: string, newStatus: string) => {
    if (!firestore || !user) return;
    const issueRef = doc(firestore, 'issues', issueId);
    updateDocumentNonBlocking(issueRef, {
      status: newStatus,
      updatedAt: new Date().toISOString(),
    });
  };

  const getSeverityVariant = (severity: Issue['severity']) => {
    switch (severity) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'secondary';
      case 'low':
      default:
        return 'outline';
    }
  }

  if (isUserLoading || isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
        <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg h-full">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">Admin Access Required</p>
            <p className="text-muted-foreground mb-4">Please log in to manage issues.</p>
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
        <AlertTitle>Error Loading Issues</AlertTitle>
        <AlertDescription>
          There was a problem fetching the issue data. You may not have the required permissions.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Severity</TableHead>
            <TableHead>Reported By</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {issues && issues.length > 0 ? (
            issues.map((issue) => (
              <TableRow key={issue.id}>
                <TableCell className="font-medium">{issue.title}</TableCell>
                <TableCell>
                  <Badge variant="outline">{issue.category}</Badge>
                </TableCell>
                <TableCell className="capitalize">
                   <Badge variant={getSeverityVariant(issue.severity)}>
                    {issue.severity}
                  </Badge>
                </TableCell>
                <TableCell>{issue.reporterName}</TableCell>
                <TableCell>{format(new Date(issue.createdAt), 'PP')}</TableCell>
                <TableCell className="text-right">
                   <Select
                      defaultValue={issue.status}
                      onValueChange={(value) => handleStatusUpdate(issue.id, value)}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Set status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Reported">Reported</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Resolved">Resolved</SelectItem>
                      </SelectContent>
                    </Select>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No issues reported yet.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
