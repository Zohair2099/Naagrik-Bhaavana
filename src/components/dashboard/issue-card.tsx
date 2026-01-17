'use client';

import { format } from 'date-fns';
import { ThumbsUp, MapPin, Calendar, FileImage } from 'lucide-react';
import type { Issue } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';


interface IssueCardProps {
  issue: Issue;
  onUpvote: (issueId: string) => void;
}


export function IssueCard({ issue, onUpvote }: IssueCardProps) {

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

  const getStatusVariant = (status: Issue['status']) => {
    switch (status) {
      case 'Resolved':
        return 'default';
      case 'In Progress':
        return 'secondary';
      case 'Reported':
      default:
        return 'outline';
    }
  }


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
            <div className="mb-3 flex items-start justify-between gap-2">
                <Badge variant="outline" className="uppercase truncate">
                    {issue.category}
                </Badge>
                <Badge variant={getSeverityVariant(issue.severity)} className="capitalize">
                    {issue.severity}
                </Badge>
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
                <Badge variant={getStatusVariant(issue.status)}>
                    {issue.status}
                </Badge>
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
          <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
            <Badge variant="outline" className="uppercase">{issue.category}</Badge>
            <Badge variant={getSeverityVariant(issue.severity)} className="capitalize">{issue.severity}</Badge>
            <Badge variant={getStatusVariant(issue.status)}>{issue.status}</Badge>
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
