"use client"

import {
  Calculator,
  Calendar,
  CreditCard,
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

export function CommandDialogMenu({
    open,
    setOpen
} : {
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList className="[&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-muted-foreground/20 [&::-webkit-scrollbar-track]:bg-transparent">
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
            <CommandItem>
                <Calendar />
                <span>Calendar</span>
            </CommandItem>
            <CommandItem>
                <Smile />
                <span>Search Emoji</span>
            </CommandItem>
            <CommandItem>
                <Calculator />
                <span>Calculator</span>
            </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Settings">
            <CommandItem>
                <User />
                <span>Profile</span>
                <CommandShortcut>⌘P</CommandShortcut>
            </CommandItem>
            <CommandItem>
                <CreditCard />
                <span>Billing</span>
                <CommandShortcut>⌘B</CommandShortcut>
            </CommandItem>
            <CommandItem>
                <Settings />
                <span>Settings</span>
                <CommandShortcut>⌘S</CommandShortcut>
            </CommandItem>
            </CommandGroup>
        </CommandList>
    </CommandDialog>
  )
}
