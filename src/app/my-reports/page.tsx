import { MyReportsClient } from '@/components/my-reports/my-reports-client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function MyReportsPage() {
  return (
    <div className="container mx-auto max-w-4xl py-8">
       <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-headline">My Reported Issues</CardTitle>
          <CardDescription>
            Here you can track the status of all the issues you've submitted.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <MyReportsClient />
        </CardContent>
      </Card>
    </div>
  );
}
