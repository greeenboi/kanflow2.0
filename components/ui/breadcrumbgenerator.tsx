'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';

import { useMediaQuery } from '@/hooks/use-media-query';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Home } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { ChevronDownIcon } from 'lucide-react';

const formatLabel = (segment: string): string => {
  return segment
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const parallelPaths: Record<string, { label: string; href: string }[]> = {
  dashboard: [
    { label: 'Learn More', href: '/learnmore' },
    { label: 'Dashboard', href: '/dashboard' },
  ],
};

export function BreadcrumbComponent() {
  const pathname = usePathname();

  const generateBreadcrumbs = () => {
    const segments = pathname.split('/').filter(segment => segment !== '');
    const breadcrumbs = [{ href: '/', label: 'Welcome' }];

    segments.forEach((segment, index) => {
      const href = `/${segments.slice(0, index + 1).join('/')}`;
      breadcrumbs.push({ href, label: formatLabel(segment) });
    });

    return breadcrumbs;
  };

  const items = generateBreadcrumbs();

  return (
    <Breadcrumb>
      <BreadcrumbList className="rounded-lg border border-border bg-background px-3 py-2 shadow-sm shadow-black/5">
        <BreadcrumbItem>
          <BreadcrumbLink href="/">
            <Home size={16} strokeWidth={2} aria-hidden="true" />
            <span className="sr-only">Home</span>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {items.slice(1).map((item, index) => (
          <React.Fragment key={index}>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {index === 0 && parallelPaths[item.label.toLowerCase()] ? (
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-1">
                    {item.label}
                    <ChevronDownIcon />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    {parallelPaths[item.label.toLowerCase()].map((menuItem, idx) => (
                      <DropdownMenuItem key={idx} asChild>
                        <a href={menuItem.href}>{menuItem.label}</a>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : item.href ? (
                <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
