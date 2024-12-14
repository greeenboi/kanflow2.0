"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { useMediaQuery } from "@/hooks/use-media-query"
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Slash } from "lucide-react"

const formatLabel = (segment: string): string => {
  return segment
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

const ITEMS_TO_DISPLAY = 3

export function BreadcrumbComponent() {
  const [open, setOpen] = React.useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const pathname = usePathname()

  const generateBreadcrumbs = () => {
    const segments = pathname.split('/').filter(segment => segment !== '')
    const breadcrumbs = [{ href: "/", label: "Welcome" }]

    segments.forEach((segment, index) => {
      const href = `/${segments.slice(0, index + 1).join('/')}`
      breadcrumbs.push({ href, label: formatLabel(segment) })
    })

    return breadcrumbs
  }

  const items = generateBreadcrumbs()

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Welcome</BreadcrumbLink>
        </BreadcrumbItem>
        {items.slice(1).map((item, index) => (
          <React.Fragment key={index}>
            <BreadcrumbSeparator>
                <Slash />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              {item.href ? (
                <BreadcrumbLink href={item.href}>
                  {item.label}
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
