'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { LayoutDashboard, LogOut, User as UserIcon, Shield } from 'lucide-react';

export function SiteHeader() {
  const { user } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const isLoggedIn = !!user;

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };
  
  const getInitials = (email: string | null | undefined) => {
    if (!email) return '..';
    return email.substring(0, 2).toUpperCase();
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center">
        <div className="mr-6 flex items-center space-x-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary text-2xl font-bold text-secondary-foreground">
            🏛️
          </div>
          <div>
            <Link href="/" className="text-xl font-bold font-headline text-primary">
              Nagrik Bhavana
            </Link>
            <p className="text-sm text-muted-foreground font-code">
              Civic Issue Reporting
            </p>
          </div>
        </div>

        <nav className="hidden md:flex flex-1 items-center space-x-2">
            <Link href="/" legacyBehavior passHref>
                <Button variant="ghost">Dashboard</Button>
            </Link>
            <Link href="/report" legacyBehavior passHref>
                <Button variant="ghost">Report Issue</Button>
            </Link>
        </nav>

        <div className="flex items-center space-x-2">
          {isLoggedIn ? (
             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.photoURL ?? ''} alt={user.email ?? ''} />
                      <AvatarFallback>{getInitials(user.email)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">My Account</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push('/my-reports')}>
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>My Reports</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/admin')}>
                    <Shield className="mr-2 h-4 w-4" />
                    <span>Admin Panel</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href="/login" legacyBehavior passHref>
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/signup" legacyBehavior passHref>
                <Button>Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
