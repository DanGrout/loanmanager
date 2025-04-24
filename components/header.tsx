"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { PlusCircle, BarChart2, Calculator } from "lucide-react"

export default function Header() {
  const pathname = usePathname()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl">Loan Manager</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === "/" ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/loans"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname.startsWith("/loans") && !pathname.includes("/analytics")
                  ? "text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              Loans
            </Link>
            <Link
              href="/analytics"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname.startsWith("/analytics") ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              Analytics
            </Link>
            <Link
              href="/calculators"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname.startsWith("/calculators") ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              Calculators
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm" className="gap-1 hidden sm:flex">
            <Link href="/calculators">
              <Calculator className="h-4 w-4" />
              <span>Calculators</span>
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="gap-1 hidden sm:flex">
            <Link href="/analytics">
              <BarChart2 className="h-4 w-4" />
              <span>Analytics</span>
            </Link>
          </Button>
          <Button asChild variant="default" size="sm" className="gap-1">
            <Link href="/loans/create">
              <PlusCircle className="h-4 w-4" />
              <span>New Loan</span>
            </Link>
          </Button>
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
