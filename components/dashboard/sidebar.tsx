'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import {
  LayoutDashboard,
  KanbanSquare,
  Settings,
  User as UserIcon,
} from 'lucide-react';
import { getUserBoards } from '@/actions/dashboard/kanban/boards';
import type { Board } from '@/actions/dashboard/kanban/boards';
import { useUser } from '@/context/UserContext';

const sidebarNavItems = [
  {
    title: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
  },
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [boards, setBoards] = useState<Board[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useUser();

  useEffect(() => {
    const fetchBoards = async () => {
      const userId = user?.id || 1; // Replace with actual user ID
      const userBoards = await getUserBoards(userId);
      setBoards(userBoards);
    };
    fetchBoards();
  }, [user]);

  const filteredBoards = boards.filter(board =>
    board.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen w-64 flex-col fixed left-0 top-0 border-r">
      <div className="p-6">
        <h2 className="text-lg font-semibold">Kanban</h2>
      </div>
      <ScrollArea className="flex-1 px-4">
        <nav className="flex flex-col gap-2">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="boards">
              <AccordionTrigger className="py-2">
                <div className="flex items-center gap-2">
                  <KanbanSquare className="h-4 w-4" />
                  <span>Kanban Boards</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="p-2">
                  <Input
                    placeholder="Search boards..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="mb-2"
                  />
                </div>
                <ScrollArea className="h-[200px] w-full">
                  <div className="flex flex-col gap-1">
                    {filteredBoards.map(board => (
                      <Link 
                        key={board.id} 
                        href={`/dashboard/board?board=${board.id}`}
                      >
                        <Button
                          variant="ghost"
                          className="w-full justify-start pl-6 text-sm"
                          size="sm"
                        >
                          {board.name}
                        </Button>
                      </Link>
                    ))}
                    {filteredBoards.length === 0 && (
                      <p className="text-sm text-center text-muted-foreground">
                        No boards found.
                      </p>
                    )}
                  </div>
                </ScrollArea>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </nav>
      </ScrollArea>
      <nav className=' my-2 mx-4'>
        {sidebarNavItems.map(item => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href}>
                <Button
                  variant={pathname === item.href ? 'secondary' : 'ghost'}
                  className="w-full justify-start gap-2"
                  >
                  <Icon className="h-4 w-4" />
                  {item.title}
                </Button>
              </Link>
            );
          })}
      </nav>
      <div className="p-4 border-t">
        {user && (
          <div className="flex items-center gap-2">
            <UserIcon className="h-6 w-6" />
            <div>
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


