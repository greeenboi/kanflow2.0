import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function DeviceSettings() {
  return (
    <Card className="flex items-center justify-center p-6">
      <div className="text-center">
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
          <CardDescription>
            Configure your device settings including global shortcuts, 
            and system-wide integrations. Stay tuned for powerful customization options!
          </CardDescription>
        </CardHeader>
      </div>
    </Card>
  )
}

