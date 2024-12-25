import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"

export default function NotificationSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Settings</CardTitle>
        <CardDescription>Manage your notification preferences.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <Label htmlFor="push-notifications">Push Notifications</Label>
          <Switch id="push-notifications" />
        </div>
        <div className="space-y-2">
          <Label>Notification Types</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="messages" />
              <Label htmlFor="messages">Messages</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="updates" />
              <Label htmlFor="updates">Updates</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="promotions" />
              <Label htmlFor="promotions">Promotions</Label>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="email-notifications">Email Notifications</Label>
          <Switch id="email-notifications" />
        </div>
      </CardContent>
    </Card>
  )
}

