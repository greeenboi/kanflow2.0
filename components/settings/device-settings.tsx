import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function DeviceSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Device Settings</CardTitle>
        <CardDescription>Manage your device preferences.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <Label htmlFor="location">Location Services</Label>
          <Switch id="location" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="theme">Device Theme</Label>
          <Select>
            <SelectTrigger id="theme">
              <SelectValue placeholder="Select theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="bluetooth">Bluetooth</Label>
          <Switch id="bluetooth" />
        </div>
      </CardContent>
    </Card>
  )
}

