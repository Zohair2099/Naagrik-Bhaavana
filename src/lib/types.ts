export type IssueStatus = 'Reported' | 'In Progress' | 'Resolved';
export type Severity = 'low' | 'medium' | 'high';

export type Issue = {
  id: string;
  userId: string;
  title: string;
  description: string;
  location: string;
  reporterName: string;
  reporterAvatarUrl?: string;
  status: IssueStatus;
  category: string;
  severity: Severity;
  upvotes: number;
  createdAt: string;
  updatedAt: string;
  imageUrl?: string;
  imageHint?: string;
};
