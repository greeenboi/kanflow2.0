import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { platform } from '@tauri-apps/plugin-os'
import { invoke } from '@tauri-apps/api/core';
import { fetch } from '@tauri-apps/plugin-http';
import { getVersion } from '@tauri-apps/api/app'
import { useEffect, useState } from "react"
import { BugReportModal } from "./bug-report-modal"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { toast } from "sonner"

export default function GeneralSettings() {
  const [systemInfo, setSystemInfo] = useState<string>('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [appVersion, setAppVersion] = useState<string>('')

  useEffect(() => {
    const getSystemInfo = async () => {
      const currentPlatform = platform()
      const version = await getVersion()
      setSystemInfo(currentPlatform)
      setAppVersion(version)
    }
    getSystemInfo()
  }, [])

  const openInBrowser = async (url: string) => {
    try {
      console.log('Opening URL:', url);
      const result = invoke('open_link_on_click', { url: url });
      console.log('Result:', result);
    } catch (error) {
      console.error('Failed to open URL:', error);
    }
  };
  
  const checkForUpdates = async () => {
    interface VersionResponse {
      version: string;
      published_at: string;
      html_url: string;
    }
    
    try {
      const response = await fetch('https://version-checker-api.suvan-gowrishanker-204.workers.dev/api/version/greeenboi/kanflow2.0', {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      const data: VersionResponse = await response.json();
      
      if (data.version !== appVersion) {
        toast.info("Update Available!", {
          description: `Version ${data.version} is available. Current version: ${appVersion}`,
          action: {
            label: "View Release",
            onClick: () => openInBrowser(data.html_url)
          }
        });
      } else {
        toast.success("You're up to date!", {
          description: `Current version: ${appVersion}`
        });
      }
    } catch (error) {
      toast.error("Failed to check for updates", {
        description: "Please try again later or check your connection."
      });
    }
  }

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

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="app-info">
            <AccordionTrigger>Application Information</AccordionTrigger>
            <AccordionContent>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Application Name</TableCell>
                    <TableCell>Kanflow</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Version</TableCell>
                    <TableCell>{appVersion}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Updates</TableCell>
                    <TableCell>
                      <Button variant="outline" onClick={checkForUpdates}>
                        Check for Updates
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  )
}

