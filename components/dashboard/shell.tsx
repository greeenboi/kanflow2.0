import { ThemeToggle } from "@/components/theme/theme-toggle"
import { Sidebar } from "@/components/dashboard/sidebar"

interface DashboardShellProps {
  children: React.ReactNode
}

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <header className="sticky top-0 z-40 border-b bg-background">
          <div className="container flex h-16 items-center justify-between py-4 px-4">
            <h2 className="text-lg font-bold">Kanban</h2>
            <ThemeToggle />
          </div>
        </header>
        <main className="container flex w-full flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}