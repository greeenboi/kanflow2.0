'use client';

import FlickeringGrid from "@/components/ui/flickering-grid";
import { useContainerSize } from "@/hooks/use-container-size";
import { useRef } from "react";

export default function Layout({ children } : { children: React.ReactNode }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const { width, height } = useContainerSize(containerRef);
  return (
    <main ref={containerRef} className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-black">
        <span className="z-50 absolute top-0 inset-0 overflow-y-auto">
            {children}
        </span>
        <FlickeringGrid
            className="z-0 absolute right-0 size-full"
            squareSize={4}
            gridGap={6}
            color="#6B7280"
            maxOpacity={0.5}
            flickerChance={0.1}
            height={height}
            width={width}
        />
    </main>
  );
}