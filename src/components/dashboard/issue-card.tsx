'use client';

import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { ThumbsUp, MapPin, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import type { Issue, IssueStatus, Severity } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface IssueCardProps {
  issue: Issue;
  onUpvote: (issueId: string) => void;
}

const severityConfig: Record<Severity, { color: string; icon: React.ReactNode }> = {
  low: { color: 'bg-green-500', icon: <CheckCircle className="h-4 w-4" /> },
  medium: { color: 'bg-yellow-500', icon: <AlertTriangle className="h-4 w-4" /> },
  high: { color: 'bg-red-500', icon: <AlertTriangle className="h-4 w-4" /> },
};

const statusConfig: Record<IssueStatus, { color: string; textColor: string; icon: React.ReactNode }> = {
  Reported: { color: 'bg-blue-100', textColor: 'text-blue-800', icon: <Clock className="h-3 w-3" /> },
  'In Progress': { color: 'bg-yellow-100', textColor: 'text-yellow-800', icon: <Clock className="h-3 w-3" /> },
  Resolved: { color: 'bg-accent', textColor: 'text-accent-foreground', icon: <CheckCircle className="h-3 w-3" /> },
};

export function IssueCard({ issue, onUpvote }: IssueCardProps) {
  const timeAgo = formatDistanceToNow(new Date(issue.createdAt), { addSuffix: true });
  const currentStatus = statusConfig[issue.status];
  const currentSeverity = severityConfig[issue.severity];

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
            <div>
                <CardTitle className="font-headline text-xl mb-1">{issue.title}</CardTitle>
                <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-1.5" />
                    <span>{issue.location}</span>
                </div>
            </div>
            <Badge variant="secondary" className="capitalize shrink-0">{issue.category}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        {issue.imageUrl && (
            <div className="mb-4 rounded-lg overflow-hidden aspect-video relative">
                <Image 
                    src={issue.imageUrl}
                    alt={issue.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                    data-ai-hint={issue.imageHint}
                />
            </div>
        )}
        <p className="text-muted-foreground text-sm">{issue.description}</p>
      </CardContent>
      <CardFooter className="flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4 bg-muted/50 py-3 px-6">
        <div className="flex items-center space-x-4">
            <div className="flex items-center">
                <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage src={issue.reporter.avatarUrl} alt={issue.reporter.name} />
                    <AvatarFallback>{issue.reporter.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                    <p className="text-sm font-medium">{issue.reporter.name}</p>
                    <p className="text-xs text-muted-foreground">{timeAgo}</p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                 <Badge className={cn("flex items-center gap-1.5 capitalize pl-2", currentStatus.color, currentStatus.textColor, 'hover:'+currentStatus.color)}>
                    {currentStatus.icon}
                    {issue.status}
                </Badge>
                <Badge className={cn("flex items-center gap-1.5 capitalize pl-2", currentSeverity.color, "text-white", 'hover:'+currentSeverity.color)}>
                    {currentSeverity.icon}
                    {issue.severity}
                </Badge>
            </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => onUpvote(issue.id)} className="bg-background">
          <ThumbsUp className="mr-2 h-4 w-4" />
          Upvote
          <span className="ml-2 inline-flex items-center justify-center rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
            {issue.upvotes}
          </span>
        </Button>
      </CardFooter>
    </Card>
  );
}
