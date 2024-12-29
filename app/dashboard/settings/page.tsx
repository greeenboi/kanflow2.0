'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import GeneralSettings from '@/components/settings/general-settings'
import AccountSettings from '@/components/settings/account-settings'
import DeviceSettings from '@/components/settings/device-settings'
import ApplicationSettings from '@/components/settings/application-settings'
import NotificationSettings from '@/components/settings/notification-settings'
// import StorageSettings from '@/components/settings/storage-settings'
import PlanSettings from '@/components/settings/plan-settings'
import { toast } from 'sonner'


export default function SettingsPage() {
  const searchParams = useSearchParams()
  const activeTabParam = searchParams.get('tab') ?? 'general'
  const [activeTab, setActiveTab] = useState(activeTabParam)

  const Router = useRouter();

  const handleSave = () => {
    toast.success("Settings saved", {
      description: "Your settings have been saved successfully.",
      action: {
        label: "Go back",
        onClick: () => Router.back(),
      },
    })
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>Manage your account settings and preferences.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <ScrollArea className="w-full whitespace-nowrap">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="device">Device</TabsTrigger>
                <TabsTrigger value="application">Application</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                {/* <TabsTrigger value="storage">Storage</TabsTrigger> */}
                <TabsTrigger value="plans">Plans</TabsTrigger>
              </TabsList>
            </ScrollArea>
            <div className="mt-6">
              <TabsContent value="general">
                <GeneralSettings />
              </TabsContent>
              <TabsContent value="account">
                <AccountSettings />
              </TabsContent>
              <TabsContent value="device">
                <DeviceSettings />
              </TabsContent>
              <TabsContent value="application">
                <ApplicationSettings />
              </TabsContent>
              <TabsContent value="notifications">
                <NotificationSettings />
              </TabsContent>
              {/* <TabsContent value="storage">
                <StorageSettings />
              </TabsContent> */}
              <TabsContent value="plans">
                <PlanSettings />
              </TabsContent>
            </div>
          </Tabs>
          <div className="mt-6 flex justify-end">
            <Button onClick={handleSave}>Save All Settings</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

