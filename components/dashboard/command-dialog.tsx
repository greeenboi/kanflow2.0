"use client"


import { useLogout, useUser } from "@/context/UserContext"
import { useCallback, useEffect, useState } from "react"
import { Bell, BadgeCheck, CreditCard, LogOut, Sparkles, KanbanSquare } from "lucide-react"

import {
  Calculator,
  Calendar,
  CreditCard as CreditCardIcon,
  Settings,
  Smile,
  User,
} from "lucide-react"

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import { getUserBoards, type Board } from "@/actions/dashboard/kanban/boards"
import Link from "next/link"

export function CommandDialogMenu({
    open,
    setOpen
} : {
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const [boards, setBoards] = useState<Board[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const { user } = useUser()

  const logoutUser = useLogout();

  const fetchBoards = useCallback(async () => {
    const userId = user?.id || 1
    const userBoards = await getUserBoards(userId)
    setBoards(userBoards)
  }, [user])

  useEffect(() => {
    fetchBoards()
  }, [fetchBoards])

  const filteredBoards = boards.filter((board) =>
    board.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput
        placeholder="Type a command or search..."
        value={searchQuery}
        onValueChange={setSearchQuery}
      />
      <CommandList className="[&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-muted-foreground/20 [&::-webkit-scrollbar-track]:bg-transparent">
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Boards">
          {filteredBoards.map((board) => (
            <CommandItem
              key={board.id}
              asChild
            >
                <Link href={`/dashboard/board?board=${board.id}`}>
                    <KanbanSquare />
                    <span>{board.name}</span>
                </Link>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Settings">
          <CommandItem asChild>
            <Link href="/dashboard/settings?tab=plans">
                <Sparkles />
                <span>Upgrade to Pro</span>
            </Link>
          </CommandItem>
          <CommandItem asChild>
            <Link href="/dashboard/settings?tab=account">
            <BadgeCheck />
            <span>Account</span>
            </Link>
          </CommandItem>
          <CommandItem asChild>
            <Link href="/dashboard/settings?tab=notifications">
                <Bell />
                <span>Notifications</span>
            </Link>
          </CommandItem>
          <CommandItem onSelect={() => logoutUser()}>
            <LogOut />
            <span>Log out</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
