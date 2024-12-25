import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"

export default function ApplicationSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Application Settings</CardTitle>
        <CardDescription>Customize your application experience.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="startup">Startup Behavior</Label>
          <Select>
            <SelectTrigger id="startup">
              <SelectValue placeholder="Select startup behavior" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="launch">Launch on startup</SelectItem>
              <SelectItem value="minimize">Minimize on startup</SelectItem>
              <SelectItem value="nothing">Do nothing</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="font-size">Font Size</Label>
          <Slider id="font-size" defaultValue={[14]} max={24} min={8} step={1} />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="auto-update">Auto Update</Label>
          <Switch id="auto-update" />
        </div>
      </CardContent>
    </Card>
  )
}

