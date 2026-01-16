import { mockIssues } from '@/lib/data';
import { DashboardClient } from '@/components/dashboard/dashboard-client';

export default function Home() {
  const issues = mockIssues;

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <DashboardClient initialIssues={issues} />
    </div>
  );
}
