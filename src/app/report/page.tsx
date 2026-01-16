import { ReportForm } from '@/components/report/report-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ReportIssuePage() {
  return (
    <div className="container mx-auto max-w-2xl py-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-headline">Report a New Issue</CardTitle>
          <CardDescription>
            Help improve our community by reporting a problem. Provide as much detail as possible.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ReportForm />
        </CardContent>
      </Card>
    </div>
  );
}
