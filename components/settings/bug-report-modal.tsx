import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useState } from "react"
import { Octokit } from "@octokit/rest"
import { toast } from "sonner"

interface BugReportModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  systemInfo: string
}

export function BugReportModal({ open, onOpenChange, systemInfo }: BugReportModalProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [type, setType] = useState("bug")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const octokit = new Octokit({
        auth: process.env.NEXT_PUBLIC_GITHUB_TOKEN
      })

      await octokit.issues.create({
        owner: "greeenboi",
        repo: "kanflow2.0",
        title: title,
        body: `
          This is a Report generated from Kanflow2.0 APP.\n\n---\nOverview:${title}\n\nSummary:${description}\n\n---\nSystem Info: ${systemInfo}
        `,
        labels: [type]
      })

      setTitle("")
      setDescription("")
      toast.success("Report Submitted successfully!",{ 
        description: "Your report has been submitted successfully.", 
        action: { 
          label: "View", 
          onClick: () => window.open("https://github.com/greeenboi/kanflow2.0/issues") 
        } 
      })
      onOpenChange(false)
    } catch (error) {
      console.error("Failed to create issue:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Submit Feedback</DialogTitle>
            <DialogDescription>
              Create a new issue on GitHub for bugs or feature requests.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <RadioGroup
              defaultValue="bug"
              value={type}
              onValueChange={setType}
              className="grid grid-cols-2 gap-4"
            >
              <div>
                <RadioGroupItem value="bug" id="bug" className="peer sr-only" />
                <Label
                  htmlFor="bug"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  Bug Report
                </Label>
              </div>
              <div>
                <RadioGroupItem value="enhancement" id="feature" className="peer sr-only" />
                <Label
                  htmlFor="feature"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  Feature Request
                </Label>
              </div>
            </RadioGroup>
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Brief summary of the issue"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detailed description..."
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
