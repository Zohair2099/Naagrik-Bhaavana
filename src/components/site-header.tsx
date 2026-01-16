'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Megaphone, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth, useUser } from '@/firebase';
import { signOut } from 'firebase/auth';

export function SiteHeader() {
  const { user } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const isLoggedIn = !!user;

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Megaphone className="h-6 w-6 text-primary" />
          <span className="hidden font-bold sm:inline-block font-headline">
            Naagarik Bhaavana
          </span>
        </Link>
        <nav className="flex flex-1 items-center space-x-4">
          {/* Future navigation links can go here */}
        </nav>
        <div className="flex items-center space-x-2">
          {isLoggedIn && (
            <Link href="/report">
              <Button>Report an Issue</Button>
            </Link>
          )}
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon" className="rounded-full">
                  <User className="h-5 w-5" />
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{user.email || 'My Account'}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/')}>Dashboard</DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/admin')}>Admin</DropdownMenuItem>
                <DropdownMenuItem>My Reports</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href="/report">
                <Button>Report an Issue</Button>
              </Link>
              <Link href="/login">
                <Button variant="outline">Login</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
