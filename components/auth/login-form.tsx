'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Loader2, VenetianMask } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { CoolMode } from '../ui/cool-mode';
import { invoke } from '@tauri-apps/api/core';
// import { listen } from "@tauri-apps/api/event";
// import { Command } from "@tauri-apps/api/";
import { onOpenUrl } from '@tauri-apps/plugin-deep-link';
import { toast } from 'sonner';
import { supabase } from '@/utils/supabase/client';

type LoginFormData = {
  email: string;
  password: string;
  rememberMe: boolean;
};


const openInBrowser = async (url: string) => {
  try {
    console.log('Opening URL:', url);
    const result = invoke('open_link_on_click', { url: url });
    console.log('Result:', result);
  } catch (error) {
    console.error('Failed to open URL:', error);
  }
};
export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<LoginFormData>({
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [port, setPort] = useState<number | null>(null);

  

  const handleLogin = async (data: LoginFormData) => {
    setLoading(true);

    const { data: userdata, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Logged in successfully');

      console.log('User data:', userdata);
    }
    setLoading(false);
  };

  const onProviderLogin = (provider: "google" | "github") => async () => {
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithOAuth({
      options: {
        skipBrowserRedirect: true,
        scopes: provider === "google" ? "profile email" : "",
        redirectTo: "kanflow://",
      },
      provider: provider,
    });

    if (data.url) {
      openInBrowser(data.url);
    } else {
      alert(error?.message);
    }
  };

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      await handleLogin(data);
      router.push('/dashboard');
    } catch (error) {
      // Error notifications are handled within the action
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = () => {
    toast('Continuing as guest user.');
    setTimeout(() => {
      router.push('/dashboard');
    }, 1000);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 w-full max-w-lg"
      >
        <FormField
          control={form.control}
          name="email"
          rules={{
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address',
            },
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="name@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          rules={{
            required: 'Password is required',
            minLength: {
              value: 8,
              message: 'Password must be at least 8 characters',
            },
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    {...field}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="rememberMe"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Remember me
              </FormLabel>
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <Button className="w-full" type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? 'Signing in...' : 'Sign in'}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or
              </span>
            </div>
          </div>

          <CoolMode>
            <Button
              variant="ghost"
              className="w-full"
              type="button"
              onClick={handleGuestLogin}
            >
              <VenetianMask className="mr-2 h-4 w-4" />
              Continue as Guest
            </Button>
          </CoolMode>
        </div>
      </form>
    </Form>
  );
}
