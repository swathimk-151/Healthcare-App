"use client"

import type React from "react"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Bell, ChevronDown, Menu, X, LogOut, User, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PatientNotifications } from "@/components/patient-notifications"
import { useUserProfile } from "@/contexts/user-profile-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const navigation = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Appointments", href: "/dashboard/appointments" },
  { name: "Doctors", href: "/dashboard/doctors" },
  { name: "Medicines", href: "/dashboard/medicines" },
  { name: "Lab Tests", href: "/dashboard/lab-tests" },
  { name: "Orders", href: "/dashboard/orders" },
  { name: "Articles", href: "/dashboard/articles" },
]

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const { userProfile, updateUserProfile, isFirstLogin } = useUserProfile()
  const [isClient, setIsClient] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  // Set isClient to true once the component is mounted
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Redirect to onboarding if first login
  useEffect(() => {
    if (isClient && isFirstLogin) {
      router.push("/onboarding")
    }
  }, [isClient, isFirstLogin, router])

  const firstName = userProfile?.firstName || ""
  const lastName = userProfile?.lastName || ""
  const initials = firstName && lastName ? `${firstName.charAt(0)}${lastName.charAt(0)}` : "U"
  const fullName = firstName && lastName ? `${firstName} ${lastName}` : "User"

  const handleLogout = () => {
    // Clear user data from localStorage
    if (typeof window !== "undefined") {
      localStorage.removeItem("userProfile")
      localStorage.removeItem("userAppointments")
      // Add any other user-related data that needs to be cleared
    }

    // Redirect to login page
    router.push("/login")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-4 md:gap-8">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72">
                <div className="flex flex-col space-y-6">
                  <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center gap-2">
                      <span className="text-xl font-bold">HealthCare</span>
                    </Link>
                  </div>
                  <nav className="flex flex-col space-y-1">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium ${
                          pathname === item.href
                            ? "bg-muted text-foreground"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        }`}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
            <Link href="/" className="hidden items-center gap-2 md:flex">
              <span className="text-xl font-bold">HealthCare</span>
            </Link>
            <nav className="hidden md:flex md:gap-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-sm font-medium ${
                    pathname === item.href ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              >
                <Bell className="h-5 w-5" />
                <span className="sr-only">Toggle notifications</span>
                <span className="absolute right-1 top-1 flex h-2 w-2 rounded-full bg-red-600"></span>
              </Button>
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-md border bg-background shadow-lg">
                  <div className="flex items-center justify-between border-b p-4">
                    <h3 className="font-semibold">Notifications</h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5"
                      onClick={() => setIsNotificationsOpen(false)}
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Close notifications</span>
                    </Button>
                  </div>
                  <PatientNotifications />
                </div>
              )}
            </div>
            <DropdownMenu open={isUserMenuOpen} onOpenChange={setIsUserMenuOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <div className="flex items-center gap-2">
                    <Avatar>
                      <AvatarImage src="/placeholder.svg?height=32&width=32" alt={fullName} />
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <div className="hidden flex-col md:flex">
                      <span className="text-sm font-medium">{fullName}</span>
                      <span className="text-xs text-muted-foreground">Patient</span>
                    </div>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex flex-col space-y-1 p-2">
                  <p className="text-sm font-medium leading-none">{fullName}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {userProfile?.email || "patient@example.com"}
                  </p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      <main className="flex-1 bg-muted/40">
        <div className="container py-6 md:py-8">{children}</div>
      </main>
    </div>
  )
}
