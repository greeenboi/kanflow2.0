'use client';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { Sidebar } from '@/components/dashboard/sidebar';
import { BreadcrumbComponent } from '../ui/breadcrumbgenerator';
import { KeyboardShortcuts } from '../ui/keyboard-shortcuts';

interface DashboardShellProps {
  children: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-72">
        <header className="sticky top-0 z-40 border-b bg-background h-16 flex items-center">
          <div className="container flex items-center justify-between py-4 px-4">
            {/* <h2 className="text-lg font-bold">{user && <p className="text-md">Welcome, {user.name}!</p>}</h2> */}
            <BreadcrumbComponent />
            <span className='flex gap-2 items-center'>
              <KeyboardShortcuts />
              <ThemeToggle />
            </span>
          </div>
        </header>
        <main className="container flex w-full flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
