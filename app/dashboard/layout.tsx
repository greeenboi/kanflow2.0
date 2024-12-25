'use client';
import { CommandDialogMenu } from '@/components/dashboard/command-dialog';
import { DashboardShell } from '@/components/dashboard/shell';
import { RefreshCcw } from 'lucide-react';
import { Suspense, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  useHotkeys(
    'ctrl+k',
    e => {
      e.preventDefault();
      // open command menu
      setOpen(true);
      console.log('ctrl+k');
    },
    []
  );
  return (
    <DashboardShell>
      <Suspense 
        fallback={<RefreshCcw className="animate-spin" />}
        unstable_expectedLoadTime={1000}
      >
        {children}
        <CommandDialogMenu open={open} setOpen={setOpen} />
      </Suspense>
    </DashboardShell>
  );
}
