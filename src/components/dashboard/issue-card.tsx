'use client';

import { format } from 'date-fns';
import { ThumbsUp, MapPin, Calendar } from 'lucide-react';
import type { Issue } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface IssueCardProps {
  issue: Issue;
  onUpvote: (issueId: string) => void;
}

const categoryColors: Record<string, string> = {
  Pothole: "bg-[#FEE2E2] text-[#991B1B]",
  Garbage: "bg-[#FEF3C7] text-[#92400E]",
  'Street Light': "bg-[#DBEAFE] text-[#1E40AF]",
  Water: "bg-[#DCFCE7] text-[#166534]",
  Drainage: "bg-[#E0E7FF] text-[#3730A3]",
  Other: "bg-[#F3F4F6] text-[#374151]",
};

const severityColors: Record<string, string> = {
  low: "bg-[#D1FAE5] text-[#065F46]",
  medium: "bg-[#FED7AA] text-[#9A3412]",
  high: "bg-[#FEE2E2] text-[#991B1B]",
};

const statusColors: Record<string, string> = {
  Reported: "bg-[#FEF3C7] text-[#92400E]",
  'In Progress': "bg-[#DBEAFE] text-[#1E40AF]",
  Resolved: "bg-[#D1FAE5] text-[#065F46]",
};

export function IssueCard({ issue, onUpvote }: IssueCardProps) {
  return (
    <div className="group flex cursor-pointer flex-col rounded-2xl border-2 border-transparent bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-primary">
        <div className="mb-4 flex items-start justify-between">
            <span className={cn(
                "rounded-md px-3 py-1 text-xs font-bold uppercase tracking-wider",
                categoryColors[issue.category] || categoryColors['Other']
            )}>
                {issue.category}
            </span>
            <span className={cn(
                "rounded-md px-3 py-1 text-xs font-bold capitalize",
                severityColors[issue.severity]
            )}>
                {issue.severity}
            </span>
        </div>

        <h3 className="mb-2 text-lg font-bold text-gray-800 group-hover:text-primary">
            {issue.title}
        </h3>

        <p className="mb-4 text-sm text-gray-600 line-clamp-2 flex-grow">
            {issue.description}
        </p>

        <div className="mb-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
            <div className="flex items-center gap-1.5">
                <MapPin className="h-3 w-3" />
                <span>{issue.location}</span>
            </div>
            <div className="flex items-center gap-1.5">
                <Calendar className="h-3 w-3" />
                <span>{format(new Date(issue.createdAt), 'PP')}</span>
            </div>
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
             <span className={cn(
                "rounded-md px-3 py-1 text-xs font-bold",
                statusColors[issue.status]
            )}>
                {issue.status}
            </span>
            <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                    e.stopPropagation(); // Prevent card click
                    onUpvote(issue.id);
                }}
                className="flex items-center gap-2 rounded-lg border-border bg-background px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground"
            >
                <ThumbsUp className="h-4 w-4" />
                <span>{issue.upvotes}</span>
            </Button>
        </div>
    </div>
  );
}
