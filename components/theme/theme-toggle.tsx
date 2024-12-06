'use client';

import { Moon, Sun, Palette, Check } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

const colorSchemes = [
  { name: 'Default', value: 'default', color: 'bg-zinc-50 dark:bg-zinc-950' },
  { name: 'Red', value: 'red', color: 'bg-red-500' },
  { name: 'Green', value: 'green', color: 'bg-green-500' },
  { name: 'Purple', value: 'purple', color: 'bg-purple-500' },
  { name: 'Yellow', value: 'yellow', color: 'bg-yellow-500' },
  { name: 'Teal', value: 'teal', color: 'bg-teal-500' },
];

export function ThemeToggle() {
  const { setTheme, theme = '' } = useTheme();

  const isDark = theme?.includes('dark');

  const setColorScheme = (baseTheme: 'light' | 'dark', color?: string) => {
    if (!color || color === 'default') {
      setTheme(baseTheme);
      return;
    }
    setTheme(`${color}${baseTheme}`);
  };

  const isCurrentScheme = (schemeValue: string) => {
    if (schemeValue === 'default') {
      return theme === 'light' || theme === 'dark';
    }
    return theme?.includes(schemeValue);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          {isDark ? (
            <Moon className="h-[1.2rem] w-[1.2rem]" />
          ) : (
            <Sun className="h-[1.2rem] w-[1.2rem]" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => {
            const currentScheme = colorSchemes.find(scheme =>
              isCurrentScheme(scheme.value)
            )?.value;
            setColorScheme('light', currentScheme);
          }}
        >
          Light
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            const currentScheme = colorSchemes.find(scheme =>
              isCurrentScheme(scheme.value)
            )?.value;
            setColorScheme('dark', currentScheme);
          }}
        >
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>
          System
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Palette className="mr-2 h-4 w-4" />
            <span>Color Scheme</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {colorSchemes.map(scheme => (
              <DropdownMenuItem
                key={scheme.value}
                onClick={() =>
                  setColorScheme(
                    theme?.includes('dark') ? 'dark' : 'light',
                    scheme.value
                  )
                }
                className="gap-2"
              >
                <div
                  className={cn(
                    isCurrentScheme(scheme.value)
                      ? 'border-2 border-white rounded-md '
                      : '',
                    `h-4 w-4 rounded ${scheme.color}`
                  )}
                />
                <span>{scheme.name}</span>
                {isCurrentScheme(scheme.value) && (
                  <Check className="h-4 w-4 ml-auto" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
