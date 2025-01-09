import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "../ui/button"
import { InfoIcon, Sparkles, X } from "lucide-react"
import { toast } from "sonner"
import { enable, isEnabled, disable } from '@tauri-apps/plugin-autostart';
import { useEffect, useState } from 'react';

export default function ApplicationSettings() {
  const [autostartEnabled, setAutostartEnabled] = useState(false);
  
  useEffect(() => {
    // Check initial autostart status
    const checkAutostart = async () => {
      const enabled = await isEnabled();
      setAutostartEnabled(enabled);
    };
    checkAutostart();
  }, []);

  const handleAutostart = async (checked: boolean) => {
    try {
      if (checked) {
        await enable();
      } else {
        await disable();
      }
      setAutostartEnabled(checked);
      toast.success(checked ? "Autostart enabled" : "Autostart disabled");
    } catch (error) {
      toast.error("Failed to update autostart settings");
    }
  };

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
  return (
    <Card>
      <CardHeader>
        <CardTitle>Application Settings</CardTitle>
        <CardDescription>Customize your application experience.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <Label htmlFor="autostart">Launch on Startup</Label>
          <Switch 
            id="autostart" 
            checked={autostartEnabled}
            onCheckedChange={handleAutostart}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="auto-update" className="flex gap-2 items-center">Auto Update <InfoIcon className="w-4 h-4 cursor-pointer" onClick={handleComingSoon}  /></Label>
          <Switch id="auto-update" disabled/>
        </div>
      </CardContent>
    </Card>
  )
}

