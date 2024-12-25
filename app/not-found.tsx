'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { toast } from "sonner"
import { Search, AlertTriangle, ArrowLeft, Home } from 'lucide-react'

const suggestedLinks = [
  { title: 'Home', href: '/' },
  { title: 'Settings', href: '/settings' },
  { title: 'Profile', href: '/profile' },
  { title: 'Help Center', href: '/help' },
]

export default function NotFound() {
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    toast.info(`Searching for "${searchQuery}"...`)
    // Implement actual search functionality here
  }

  const handleReportIssue = () => {
    toast.success('Issue reported', {
      description: 'Thank you for your feedback. We\'ll look into it.',
    })
  }

  return (
    <div className="container mx-auto flex items-center justify-center min-h-screen px-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-4xl font-bold text-center">404 - Page Not Found</CardTitle>
          <CardDescription className="text-center text-lg mt-2">
            Oops! The page you&apos;re looking for doesn&apos;t exist.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              The requested page could not be found. This might be due to a typo in the URL or the page may have been moved or deleted.
            </AlertDescription>
          </Alert>

          <form onSubmit={handleSearch} className="flex space-x-2">
            <Input
              type="search"
              placeholder="Search for content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-grow"
            />
            <Button type="submit">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </form>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="suggested-links">
              <AccordionTrigger>Suggested Links</AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-2">
                  {suggestedLinks.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="text-blue-500 hover:underline">
                        {link.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="flex justify-center space-x-4">
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
            <Button variant="outline" onClick={() => router.push('/')}>
              <Home className="h-4 w-4 mr-2" />
              Home
            </Button>
          </div>
        </CardContent>
        <CardFooter className="justify-center">
          <Button variant="link" onClick={handleReportIssue}>
            Report this issue
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}