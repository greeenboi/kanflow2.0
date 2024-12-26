import { Keyboard } from 'lucide-react';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { Button } from './button';

const shortcuts = [
  { keys: ['Ctrl', 'K'], description: 'Command Menu' },
  { keys: ['Ctrl', 'S'], description: 'Save changes' },
  { keys: ['Ctrl', 'N'], description: 'New task' },
  { keys: ['Ctrl', 'Shift', 'N'], description: 'New board' },
];

export function KeyboardShortcuts() {
  return (
    <HoverCard>
      <HoverCardTrigger className='bg-transparent' asChild>
        <Button className="p-2 bg-transparent rounded-md">
          <Keyboard className="h-4 w-4" />
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-64">
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Keyboard Shortcuts</h4>
          <div className="space-y-2">
            {shortcuts.map((shortcut, index) => (
              <div
                key={index}
                className="flex items-center justify-between text-sm"
              >
                <span>{shortcut.description}</span>
                <div className="flex gap-1">
                  {shortcut.keys.map((key, keyIndex) => (
                    <kbd
                      key={keyIndex}
                      className="px-2 py-1 bg-muted rounded text-xs"
                    >
                      {key}
                    </kbd>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
