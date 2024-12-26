'use client';

import * as React from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Cross, Delete, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const presetLabels = [
  { value: "backlog", label: "Backlog" },
  { value: "issue", label: "Issue" },
  { value: "need-help", label: "Need Help" },
];

interface LabelSelectorProps {
  selectedLabels: string[];
  onLabelsChange: (newLabels: string[]) => void;
}

export function LabelSelector({ selectedLabels, onLabelsChange }: LabelSelectorProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const handleSelect = (value: string) => {
    if (!selectedLabels.includes(value)) {
      onLabelsChange([...selectedLabels, value]);
    }
    setOpen(false);
    setInputValue("");
  };

  const handleCreateLabel = (value: string) => {
    if (value.trim() && !selectedLabels.includes(value.trim())) {
      onLabelsChange([...selectedLabels, value.trim()]);
    }
    setInputValue("");
  };

  const handleRemoveLabel = (label: string) => {
    onLabelsChange(selectedLabels.filter(l => l !== label));
  };

  const LabelList = () => (
    <Command >
      <CommandInput 
        placeholder="Type to search or create..." 
        value={inputValue}
        onValueChange={setInputValue}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && inputValue) {
            handleCreateLabel(inputValue);
            e.preventDefault();
          }
        }}
      />
      <CommandList>
        <CommandEmpty>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start"
            onClick={() => handleCreateLabel(inputValue)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Create &quot;{inputValue}&quot;
          </Button>
        </CommandEmpty>
        <CommandGroup heading="Preset Labels">
          {presetLabels.map((label) => (
            <CommandItem
              key={label.value}
              value={label.value}
              onSelect={handleSelect}
            >
              {label.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );

  
    return (
        <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
                {selectedLabels.map((label) => (
                <Badge
                    key={label}
                    variant="secondary"
                    className="cursor-pointer flex gap-1"
                    onClick={() => handleRemoveLabel(label)}
                >
                    {label}
                    <Delete className="w-4 h-4 "/>
                </Badge>
                ))}
            </div>
            <Popover open={open} onOpenChange={setOpen} >
                <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Label
                </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0" align="start">
                <LabelList />
                </PopoverContent>
            </Popover>
        </div>
    );
  

  
}
