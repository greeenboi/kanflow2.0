import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ChevronRight, ArrowLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { BreadcrumbComponent } from '@/components/ui/breadcrumbgenerator'

export default function Page() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen text-white">
      <div className='w-full flex gap-4 items-center mb-6'>
            <Button
                variant="link"
                className=" text-gray-300 hover:text-white"
                asChild
                >
                <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
                </Link>
            </Button>
            <BreadcrumbComponent />
        </div>
      <h1 className="text-5xl font-extrabold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
        Kanban, Agile, and Task Management
      </h1>
      
      <div className="grid gap-8 md:grid-cols-2">
        <Card className="bg-gray-800 border-gray-700 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500">
            <CardTitle className="text-2xl font-bold">Kanban Board 101</CardTitle>
          </CardHeader>
          <CardContent className="mt-4">
            <p className="mb-4 text-gray-300">
              A visual project management powerhouse that supercharges team efficiency and workflow visualization.
            </p>
            <h3 className="text-xl font-semibold mb-2 text-purple-400">Key Components:</h3>
            <ul className="space-y-2">
              {["Visual signals", "Columns", "WIP limits", "Commitment point", "Delivery point"].map((item, index) => (
                <li key={index} className="flex items-center">
                  <ChevronRight className="mr-2 h-4 w-4 text-pink-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-teal-500">
            <CardTitle className="text-2xl font-bold">Agile Methods Unleashed</CardTitle>
          </CardHeader>
          <CardContent className="mt-4">
            <p className="mb-4 text-gray-300">
              An iterative approach to project management that delivers value faster and with less friction.
            </p>
            <h3 className="text-xl font-semibold mb-2 text-blue-400">Core Principles:</h3>
            <div className="flex flex-wrap gap-2">
              {[
                "Customer-centric", "Adaptable", "Frequent delivery", "Collaboration",
                "Face-to-face", "Working software", "Sustainable", "Technical excellence",
                "Simplicity", "Self-organizing", "Regular adaptation"
              ].map((principle, index) => (
                <Badge key={index} variant="secondary" className="bg-teal-900 text-teal-100">
                  {principle}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700 overflow-hidden md:col-span-2">
          <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500">
            <CardTitle className="text-2xl font-bold">Team Superpowers & Project Planning</CardTitle>
          </CardHeader>
          <CardContent className="mt-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold mb-2 text-orange-400">Team Benefits:</h3>
                <ul className="space-y-2">
                  {[
                    "Crystal-clear project visibility",
                    "Turbo-charged collaboration",
                    "Flexibility on steroids",
                    "Bottleneck busting",
                    "Psychic-level estimation skills"
                  ].map((benefit, index) => (
                    <li key={index} className="flex items-center">
                      <ChevronRight className="mr-2 h-4 w-4 text-red-500" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-orange-400">Planning Applications:</h3>
                <ul className="space-y-2">
                  {[
                    "Scrum sprint planning",
                    "Kanban flow mastery",
                    "Backlog wizardry",
                    "Resource Tetris",
                    "Risk-busting strategies"
                  ].map((application, index) => (
                    <li key={index} className="flex items-center">
                      <ChevronRight className="mr-2 h-4 w-4 text-red-500" />
                      <span>{application}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700 overflow-hidden md:col-span-2">
          <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500">
            <CardTitle className="text-2xl font-bold">Task Management Revolution</CardTitle>
          </CardHeader>
          <CardContent className="mt-4">
            <p className="mb-4 text-gray-300">
              Kanban and Agile methods are breaking free from software development and conquering new territories:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                "Personal Productivity", "Marketing Campaigns", "HR Processes", "Event Planning",
                "Content Creation", "Customer Support", "Manufacturing", "R&D Projects"
              ].map((area, index) => (
                <div key={index} className="bg-emerald-900 rounded-lg p-3 text-center">
                  <span className="text-emerald-100 font-medium">{area}</span>
                </div>
              ))}
            </div>
            <Separator className="my-6 bg-emerald-700" />
            <p className="text-gray-300">
              The flexibility of Kanban and Agile principles allows them to adapt to various industries, 
              promoting efficiency and continuous improvement in any task management scenario.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

