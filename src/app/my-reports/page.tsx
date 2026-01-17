'use client';

import { MyReportsClient } from '@/components/my-reports/my-reports-client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@/firebase';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Shield } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function MyReportsPage() {
  const { user, isUserLoading } = useUser();
  const isAdminUser = user?.email === '160923733200@gmail.com';

  return (
    <div className="container mx-auto max-w-5xl py-8">
       <Card className="shadow-lg">
        <CardHeader>
           <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-3xl font-headline">My Reported Issues</CardTitle>
              <CardDescription>
                Here you can track the status of all the issues you've submitted.
              </CardDescription>
            </div>
            {isUserLoading ? (
              <Skeleton className="h-10 w-36" />
            ) : (
              isAdminUser && (
                <Button asChild variant="outline">
                  <Link href="/admin">
                    <Shield className="mr-2 h-4 w-4" />
                    Admin Panel
                  </Link>
                </Button>
              )
            )}
          </div>
        </CardHeader>
        <CardContent>
            <MyReportsClient />
        </CardContent>
      </Card>
    </div>
  );
}
