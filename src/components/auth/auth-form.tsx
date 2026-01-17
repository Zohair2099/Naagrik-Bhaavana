'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useAuth, useUser } from '@/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  AuthError,
} from 'firebase/auth';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

interface AuthFormProps {
  mode: 'login' | 'signup';
}

export function AuthForm({ mode }: AuthFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isGovernmentEmployee, setIsGovernmentEmployee] = useState(false);
  const { toast } = useToast();
  const auth = useAuth();
  const { user } = useUser();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '', password: '' },
  });

  useEffect(() => {
    if (user) {
      toast({
        title: mode === 'login' ? 'Logged In!' : 'Account Created!',
        description: "You're being redirected to the dashboard.",
      });
      router.push('/');
    }
  }, [user, router, mode, toast]);


  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    const isLogin = mode === 'login';
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, values.email, values.password);
      } else {
        await createUserWithEmailAndPassword(auth, values.email, values.password);
      }
      // The `useEffect` hook above will handle the redirect on successful login/signup.
    } catch (error) {
      const authError = error as AuthError;
      console.error(authError);

      let errorMessage = authError.message || 'An unexpected error occurred.';
      if (
        isLogin &&
        (authError.code === 'auth/user-not-found' ||
          authError.code === 'auth/wrong-password' ||
          authError.code === 'auth/invalid-credential')
      ) {
        errorMessage = 'Wrong email or password.';
      }

      toast({
        variant: 'destructive',
        title: isLogin ? 'Login Failed' : 'Sign Up Failed',
        description: errorMessage,
      });
      setIsLoading(false);
    }
  };

  const isLogin = mode === 'login';

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="you@example.com" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {isLogin && (
          <div className="flex items-center space-x-2">
            <Switch id="government-mode" checked={isGovernmentEmployee} onCheckedChange={setIsGovernmentEmployee} />
            <Label htmlFor="government-mode">Government Employee Mode</Label>
          </div>
        )}

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLogin ? 'Login' : 'Create Account'}
        </Button>
      </form>
      <div className="mt-6 text-center text-sm">
        {isLogin ? "Don't have an account? " : 'Already have an account? '}
        <Link href={isLogin ? '/signup' : '/login'} className="font-medium text-primary hover:underline">
          {isLogin ? 'Sign up' : 'Login'}
        </Link>
      </div>
    </Form>
  );
}
