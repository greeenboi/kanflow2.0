'use client';

import { KanbanSquare, LayoutDashboard, Search, Settings } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import type { Board } from '@/actions/dashboard/kanban/boards';
import { getUserBoards } from '@/actions/dashboard/kanban/boards';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useUser } from '@/context/UserContext';
import { Label } from '../ui/label';
import {
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
} from '../ui/sidebar';
import { DatePicker } from './date-picker';
import { NavMain } from './nav-boards';
import { NavUser } from './nav-user';

const sidebarNavItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [boards, setBoards] = useState<Board[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useUser();

  const fetchBoards = useCallback(async () => {
    const userId = user?.id || 1; // Replace with actual user ID
    const userBoards = await getUserBoards(userId);
    setBoards(userBoards);
  }, [user]);

  useEffect(() => {
    fetchBoards();
  }, [fetchBoards]);

  const filteredBoards = boards.filter(board =>
    board.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const boardsNavItem = {
    title: 'Kanban Boards',
    url: '#',
    icon: KanbanSquare,
    isActive: true,
    items: filteredBoards.map(board => ({
      title: board.name,
      url: `/dashboard/board?board=${board.id}`,
    })),
  };

  const refreshBoards = () => {
    // Refresh the boards list after creation
    const userId = user?.id || 1;
    fetchBoards();
  };

  return (
    <SidebarProvider className="flex h-screen w-72 flex-col fixed left-0 top-0 border-r">
      <SidebarHeader className="h-16 border-b border-border flex items-center justify-center">
        <h2 className="text-lg font-semibold">Welcome {user?.first_name}</h2>
      </SidebarHeader>
      <SidebarContent>
        <ScrollArea className="flex-1 px-4 space-y-4">
          <SidebarGroup className="py-0 space-y-2">
            <SidebarGroupLabel>My Boards</SidebarGroupLabel>
            <SidebarGroupContent className="relative">
              <Label htmlFor="search" className="sr-only">
                Search
              </Label>
              <SidebarInput
                id="search"
                placeholder="Search boards..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-8"
              />
              <Search className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 select-none opacity-50" />
            </SidebarGroupContent>
            <nav className="flex flex-col gap-2">
              <NavMain items={[boardsNavItem]} refreshBoards={refreshBoards} />
            </nav>
          </SidebarGroup>
        </ScrollArea>
        <SidebarSeparator className=" bg-border border-border mx-0" />
        {/* implement task tracker on calendar */}
        <DatePicker />
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel>Navigate</SidebarGroupLabel>
          <SidebarMenu>
            {sidebarNavItems.map(item => {
              const Icon = item.icon;
              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton variant="default" asChild>
                    <Link
                      key={item.href}
                      href={item.href}
                      className="w-full justify-start gap-2"
                    >
                      <Icon className="h-4 w-4" />
                      {item.title}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t">
        {user && <NavUser user={user} />}
      </SidebarFooter>
    </SidebarProvider>
  );
}
