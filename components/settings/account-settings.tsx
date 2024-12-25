import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from 'lucide-react'
import { Switch } from '../ui/switch'

export default function AccountSettings() {
  const [showSecurityAlert, setShowSecurityAlert] = useState(false)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Settings</CardTitle>
        <CardDescription>Manage your account information.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" placeholder="John Doe" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="john@example.com" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" />
        </div>
        <div className="flex space-x-2">
          <Button onClick={() => setShowSecurityAlert(true)}>Update Account</Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">Security Options</Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="grid gap-4">
                <h4 className="font-medium leading-none">Security Settings</h4>
                <div className="grid gap-2">
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="two-factor">Two-factor Auth</Label>
                    <Switch id="two-factor" className="col-span-2" />
                  </div>
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="recovery-email">Recovery Email</Label>
                    <Input id="recovery-email" placeholder="backup@example.com" className="col-span-2" />
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        {showSecurityAlert && (
          <Alert variant="default">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Heads up!</AlertTitle>
            <AlertDescription>
              Your account has been updated. For security reasons, you may be asked to log in again on your devices.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}

