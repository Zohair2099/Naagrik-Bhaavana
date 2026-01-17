import { AdminClient } from '@/components/admin/admin-client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminPage() {
  return (
    <div className="container mx-auto max-w-7xl py-8">
       <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-headline">Administrator Dashboard</CardTitle>
          <CardDescription>
            View, manage, and update the status of all reported civic issues.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <AdminClient />
        </CardContent>
      </Card>
    </div>
  );
}
