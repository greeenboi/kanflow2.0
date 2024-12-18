'use client';
import { RefreshCcw } from "lucide-react";
import { Suspense } from "react";

export default function Layout({ children } : { children: React.ReactNode }) {    
  return (
    <Suspense fallback={<RefreshCcw  className="animate-spin"/>} unstable_expectedLoadTime={1000}>
        {children}
    </Suspense>
  );
}