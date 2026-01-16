import type { Issue } from './types';
import { PlaceHolderImages } from './placeholder-images';

const getImageUrl = (id: string) => PlaceHolderImages.find(img => img.id === id)?.imageUrl;
const getImageHint = (id: string) => PlaceHolderImages.find(img => img.id === id)?.imageHint;

export const mockIssues: Issue[] = [
  {
    id: '1',
    title: 'Large Pothole on Main St',
    description: 'A large and dangerous pothole has formed in the middle of Main St, near the intersection with Oak Ave. It has already caused a flat tire.',
    location: 'Main St & Oak Ave',
    reporter: {
      name: 'Jane Doe',
      avatarUrl: getImageUrl('user-avatar-1')!,
    },
    status: 'Reported',
    category: 'Pothole',
    severity: 'high',
    upvotes: 15,
    createdAt: '2024-05-20T10:00:00Z',
    imageUrl: getImageUrl('issue-pothole'),
    imageHint: getImageHint('issue-pothole'),
  },
  {
    id: '2',
    title: 'Streetlight Out',
    description: 'The streetlight at the corner of 2nd and Pine is completely out. It\'s very dark and feels unsafe at night.',
    location: '2nd St & Pine St',
    reporter: {
      name: 'John Smith',
      avatarUrl: getImageUrl('user-avatar-2')!,
    },
    status: 'In Progress',
    category: 'Street Lighting',
    severity: 'medium',
    upvotes: 8,
    createdAt: '2024-05-18T14:30:00Z',
    imageUrl: getImageUrl('issue-light'),
    imageHint: getImageHint('issue-light'),
  },
  {
    id: '3',
    title: 'Overflowing Garbage Can',
    description: 'The public garbage can at City Park is overflowing. Trash is starting to blow around the park.',
    location: 'City Park',
    reporter: {
      name: 'Emily White',
      avatarUrl: getImageUrl('user-avatar-3')!,
    },
    status: 'Resolved',
    category: 'Garbage',
    severity: 'low',
    upvotes: 3,
    createdAt: '2024-05-15T09:00:00Z',
    imageUrl: getImageUrl('issue-garbage'),
    imageHint: getImageHint('issue-garbage'),
  },
  {
    id: '4',
    title: 'Damaged Park Bench',
    description: 'One of the benches near the pond has a broken slat, making it unusable.',
    location: 'City Park Pond',
    reporter: {
      name: 'Michael Brown',
      avatarUrl: getImageUrl('user-avatar-4')!,
    },
    status: 'Reported',
    category: 'Park Maintenance',
    severity: 'low',
    upvotes: 5,
    createdAt: '2024-05-21T11:45:00Z',
    imageUrl: getImageUrl('issue-park'),
    imageHint: getImageHint('issue-park'),
  },
];
