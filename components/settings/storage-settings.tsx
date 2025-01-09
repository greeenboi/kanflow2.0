import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const storageData = [
  { type: "Documents", size: "1.2 GB", files: 143 },
  { type: "Images", size: "0.8 GB", files: 352 },
  { type: "Videos", size: "1.3 GB", files: 24 },
  { type: "Other", size: "0.5 GB", files: 76 },
]

export default function StorageSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Storage Settings</CardTitle>
        <CardDescription>Manage your storage usage.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Storage Usage</Label>
          <Progress value={33} className="w-full" />
          <p className="text-sm text-muted-foreground">3.8 GB of 10 GB used</p>
        </div>
        <ResizablePanelGroup direction="vertical" className="min-h-[200px] max-w-md rounded-lg border">
          <ResizablePanel defaultSize={50}>
            <div className="flex h-full items-center justify-center p-6">
              <div className="space-y-2">
                <h3 className="font-semibold">Storage Breakdown</h3>
                <p className="text-sm text-muted-foreground">Resize this panel to see more details</p>
              </div>
            </div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={50}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Files</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {storageData.map((item) => (
                  <TableRow key={item.type}>
                    <TableCell>{item.type}</TableCell>
                    <TableCell>{item.size}</TableCell>
                    <TableCell>{item.files}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ResizablePanel>
        </ResizablePanelGroup>
        <Button variant="outline">Manage Storage</Button>
      </CardContent>
    </Card>
  )
}

