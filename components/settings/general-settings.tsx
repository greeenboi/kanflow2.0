import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { platform } from '@tauri-apps/plugin-os'
import { useEffect, useState } from "react"
import { BugReportModal } from "./bug-report-modal"

export default function GeneralSettings() {
  const [systemInfo, setSystemInfo] = useState<string>('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const getSystemInfo = async () => {
      const currentPlatform = await platform()
      setSystemInfo(currentPlatform)
    }
    getSystemInfo()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>General Settings</CardTitle>
        <CardDescription>System information and feedback.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>System Information</Label>
          <div className="text-sm text-muted-foreground">
            Platform: {systemInfo}
          </div>
        </div>

        <div className="space-y-2">
          <Button onClick={() => setIsModalOpen(true)}>
            Report Bug / Request Feature
          </Button>
        </div>

        <BugReportModal 
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          systemInfo={systemInfo}
        />
      </CardContent>
    </Card>
  )
}

