import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"

export default function PlanSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Plan Settings</CardTitle>
        <CardDescription>Manage your subscription plan.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Current Plan</Label>
          <p className="text-sm font-medium">Pro Plan - $9.99/month</p>
        </div>
        <div className="space-y-2">
          <Label>Change Plan</Label>
          <RadioGroup defaultValue="pro">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="basic" id="basic" />
              <Label htmlFor="basic">Basic - $4.99/month</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="pro" id="pro" />
              <Label htmlFor="pro">Pro - $9.99/month</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="enterprise" id="enterprise" />
              <Label htmlFor="enterprise">Enterprise - Contact Sales</Label>
            </div>
          </RadioGroup>
        </div>
        <Button>Update Plan</Button>
      </CardContent>
    </Card>
  )
}

