'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
    <header className="sticky top-0 z-40 w-full bg-secondary text-secondary-foreground shadow-md">
      <div className="container flex h-20 items-center">
        <div className="mr-6 flex items-center space-x-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent text-secondary text-2xl font-bold">
            🏛️
          </div>
          <div>
            <Link href="/" className="text-xl font-bold font-headline">
              Nagrik Bhavana
            </Link>
            <p className="text-sm text-secondary-foreground/90 font-code">
              Civic Issue Reporting
            </p>
          </div>
        </div>

        <nav className="hidden md:flex flex-1 items-center space-x-2">
            <Link href="/" legacyBehavior passHref>
                <Button variant="ghost" className="text-secondary-foreground hover:bg-secondary-foreground/10">Dashboard</Button>
            </Link>
            <Link href="/report" legacyBehavior passHref>
                <Button variant="ghost" className="text-secondary-foreground hover:bg-secondary-foreground/10">Report Issue</Button>
            </Link>
             {isLoggedIn && (
                 <Link href="/my-reports" legacyBehavior passHref>
                    <Button variant="ghost" className="text-secondary-foreground hover:bg-secondary-foreground/10">My Reports</Button>
                </Link>
             )}
        </nav>

        <div className="flex items-center space-x-2">
          {isLoggedIn ? (
             <div className="flex items-center gap-4">
                <span className="hidden sm:inline text-sm">{user.email}</span>
                 <Button onClick={handleLogout} variant="outline" className="border-secondary-foreground/50 text-secondary-foreground hover:bg-secondary-foreground hover:text-secondary">
                    Logout
                </Button>
             </div>
          ) : (
            <>
              <Link href="/login" legacyBehavior passHref>
                <Button variant="outline" className="border-secondary-foreground/50 text-secondary-foreground hover:bg-secondary-foreground hover:text-secondary">Login</Button>
              </Link>
              <Link href="/signup" legacyBehavior passHref>
                <Button variant="default" className="bg-primary hover:bg-primary/90">Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
