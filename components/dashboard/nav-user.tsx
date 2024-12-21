'use client';

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CircleCheck,
  CreditCard,
  LogOut,
  Sparkles,
  UserIcon,
  X,
} from 'lucide-react';
import { Toast } from '../ui/toast';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import type { User } from '@/lib/db/actions';
import { useLogout } from '@/context/UserContext';
import { toast } from 'sonner';
import { Button } from '../ui/button';

export function NavUser({
  user,
}: {
  user: User;
}) {
  const { isMobile } = useSidebar();
  const logoutUser = useLogout();

  const handleComingSoon = () => {
    toast.custom(t => (
      <div className="w-[var(--width)] rounded-lg border border-border bg-background px-4 py-3">
        <div className="flex gap-2">
          <div className="flex grow gap-3">
            <Sparkles
              className="mt-0.5 shrink-0 text-blue-500"
              size={16}
              strokeWidth={2}
              aria-hidden="true"
            />
            <div className="flex grow justify-between gap-12">
              <p className="text-sm">Coming soon!</p>
              <div className="whitespace-nowrap text-sm">
                <button
                  type="button"
                  className="text-sm font-medium hover:underline"
                  onClick={() => toast.dismiss(t)}
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            className="group -my-1.5 -me-2 size-8 shrink-0 p-0 hover:bg-transparent"
            onClick={() => toast.dismiss(t)}
            aria-label="Close banner"
          >
            <X
              size={16}
              strokeWidth={2}
              className="opacity-60 transition-opacity group-hover:opacity-100"
              aria-hidden="true"
            />
          </Button>
        </div>
      </div>
    ));
  };

  const handleLogout = async () => {
    logoutUser();
    toast('Logged out successfully', {
      icon: <LogOut />,
      duration: 5000,
    });
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <UserIcon className="h-8 w-8" />
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <UserIcon className="h-8 w-8" />
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {user.username}
                  </span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={handleComingSoon}>
                <Sparkles />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={handleComingSoon}>
                <BadgeCheck />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleComingSoon}>
                <CreditCard />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleComingSoon}>
                <Bell />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
