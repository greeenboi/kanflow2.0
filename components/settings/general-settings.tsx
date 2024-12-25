import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Info } from 'lucide-react'

export default function GeneralSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>General Settings</CardTitle>
        <CardDescription>Manage your general preferences.</CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="appearance">
            <AccordionTrigger>Appearance</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="dark-mode">Dark Mode</Label>
                  <Switch id="dark-mode" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select>
                    <SelectTrigger id="language">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="notifications">
            <AccordionTrigger>Notifications</AccordionTrigger>
            <AccordionContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Label htmlFor="notifications">Enable Notifications</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Receive notifications for important updates and messages.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Switch id="notifications" />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  )
}

