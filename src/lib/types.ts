export type IssueStatus = 'Reported' | 'In Progress' | 'Resolved';
export type Severity = 'low' | 'medium' | 'high';

export type Issue = {
  id: string;
  title: string;
  description: string;
  location: string;
  reporter: {
    name: string;
    avatarUrl: string;
  };
  status: IssueStatus;
  category: string;
  severity: Severity;
  upvotes: number;
  createdAt: string;
  imageUrl?: string;
  imageHint?: string;
};
