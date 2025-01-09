import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function NotificationSettings() {
  return (
    <Card className="flex items-center justify-center p-6">
      <div className="text-center">
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
          <CardDescription>Notification settings will be available in a future update.</CardDescription>
        </CardHeader>
      </div>
    </Card>
  )
}

