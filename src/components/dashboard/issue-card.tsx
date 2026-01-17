'use client';

import { format } from 'date-fns';
import { ThumbsUp, MapPin, Calendar, FileImage } from 'lucide-react';
import type { Issue } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const categoryColors: Record<string, string> = {
  Pothole: "bg-red-100 text-red-800",
  Garbage: "bg-yellow-100 text-yellow-800",
  'Street Light': "bg-blue-100 text-blue-800",
  Water: "bg-green-100 text-green-800",
  Drainage: "bg-indigo-100 text-indigo-800",
  Other: "bg-gray-100 text-gray-800",
};

const severityColors: Record<string, string> = {
  low: "bg-green-100 text-green-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-red-100 text-red-800",
};

const statusColors: Record<string, string> = {
  Reported: "bg-yellow-100 text-yellow-800",
  'In Progress': "bg-blue-100 text-blue-800",
  Resolved: "bg-green-100 text-green-800",
};

interface IssueCardProps {
  issue: Issue;
  onUpvote: (issueId: string) => void;
}


export function IssueCard({ issue, onUpvote }: IssueCardProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="group flex cursor-pointer flex-col rounded-2xl border bg-card p-0 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-primary overflow-hidden">
          {issue.imageUrl ? (
            <div className="relative h-40 w-full">
              <Image
                src={issue.imageUrl}
                alt={issue.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          ) : (
            <div className="flex h-40 w-full items-center justify-center bg-muted">
              <FileImage className="h-12 w-12 text-muted-foreground" />
            </div>
          )}

          <div className="p-5 flex flex-col flex-grow">
            <div className="mb-3 flex items-start justify-between">
                <span className={cn(
                    "rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider",
                    categoryColors[issue.category] || categoryColors['Other']
                )}>
                    {issue.category}
                </span>
                <span className={cn(
                    "rounded-full px-3 py-1 text-xs font-bold capitalize",
                    severityColors[issue.severity]
                )}>
                    {issue.severity}
                </span>
            </div>

            <h3 className="mb-2 text-lg font-bold text-card-foreground group-hover:text-primary truncate">
                {issue.title}
            </h3>

            <div className="mb-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                    <MapPin className="h-3 w-3" />
                    <span className="truncate">{issue.location}</span>
                </div>
            </div>

            <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
                <span className={cn(
                    "rounded-full px-3 py-1 text-xs font-bold",
                    statusColors[issue.status]
                )}>
                    {issue.status}
                </span>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                        e.stopPropagation();
                        onUpvote(issue.id);
                    }}
                    className="flex items-center gap-2 rounded-full border-border bg-background px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground"
                >
                    <ThumbsUp className="h-4 w-4" />
                    <span>{issue.upvotes}</span>
                </Button>
            </div>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-headline">{issue.title}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {issue.imageUrl && (
            <div className="relative h-64 w-full rounded-lg overflow-hidden">
               <Image src={issue.imageUrl} alt={issue.title} fill className="object-cover"/>
            </div>
          )}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className={cn("rounded-full px-3 py-1 text-xs font-bold", categoryColors[issue.category] || categoryColors['Other'])}>{issue.category}</span>
            <span className={cn("rounded-full px-3 py-1 text-xs font-bold capitalize", severityColors[issue.severity])}>{issue.severity}</span>
            <span className={cn("rounded-full px-3 py-1 text-xs font-bold", statusColors[issue.status])}>{issue.status}</span>
          </div>
           <p className="text-muted-foreground">{issue.description}</p>
          <div className="space-y-2 text-sm">
             <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span>{issue.location}</span>
            </div>
            <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                <span>Reported on {format(new Date(issue.createdAt), 'PPP')}</span>
            </div>
          </div>
          <Button
            onClick={() => onUpvote(issue.id)}
            className="w-full"
          >
            <ThumbsUp className="mr-2 h-4 w-4" /> Upvote ({issue.upvotes})
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
