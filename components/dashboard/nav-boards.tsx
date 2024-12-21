'use client';

import { ChevronRight, Plus, type LucideIcon } from 'lucide-react';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { CreateBoardDialog } from './create-board-dialog';
import { useState } from 'react';

export function NavMain({
  items,
  refreshBoards,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
  refreshBoards?: () => void;
}) {
  const [isCreateBoardDialogOpen, setIsCreateBoardDialogOpen] = useState(false);

  if (items[0]?.items?.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-4">
        <p className="text-sm text-muted-foreground">No boards found</p>
        <CreateBoardDialog
          open={isCreateBoardDialogOpen}
          onOpenChange={setIsCreateBoardDialogOpen}
          onBoardCreated={refreshBoards}
        >
          <SidebarMenuButton size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Create Board
          </SidebarMenuButton>
        </CreateBoardDialog>
      </div>
    );
  }

  return (
    <SidebarMenu>
      {items.map(item => (
        <Collapsible
          key={item.title}
          asChild
          defaultOpen={item.isActive}
          className="group/collapsible"
        >
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton tooltip={item.title}>
                {item.icon && <item.icon />}
                <span>{item.title}</span>
                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                {item.items?.map(subItem => (
                  <SidebarMenuSubItem key={subItem.title}>
                    <SidebarMenuSubButton asChild>
                      <a href={subItem.url}>
                        <span className="">{subItem.title}</span>
                      </a>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      ))}
    </SidebarMenu>
  );
}
