"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import {
  Bell,
  Calendar,
  ClipboardList,
  FileText,
  Home,
  LogOut,
  Menu,
  MessageSquare,
  Pill,
  Settings,
  User,
  Users,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { DoctorNotifications } from "@/components/doctor-notifications"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { ArticleProvider } from "@/contexts/article-context"

interface DoctorLayoutProps {
  children: React.ReactNode
}

export function DoctorLayout({ children }: DoctorLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [doctor, setDoctor] = useState<any>(null)
  const [notificationsOpen, setNotificationsOpen] = useState(false)

  useEffect(() => {
    // Check if doctor is logged in
    const doctorData = localStorage.getItem("doctorUser")

    if (doctorData) {
      try {
        setDoctor(JSON.parse(doctorData))
      } catch (error) {
        console.error("Error parsing doctor data:", error)
        router.push("/doctor/login")
      }
    } else {
      router.push("/doctor/login")
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("doctorUser")
    router.push("/doctor/login")
  }

  const navigation = [
    { name: "Dashboard", href: "/doctor/dashboard", icon: Home },
    { name: "Appointments", href: "/doctor/appointments", icon: Calendar },
    { name: "Patients", href: "/doctor/patients", icon: Users },
    { name: "Prescriptions", href: "/doctor/prescriptions", icon: Pill },
    { name: "Medical Records", href: "/doctor/medical-records", icon: ClipboardList },
    { name: "Messages", href: "/doctor/messages", icon: MessageSquare },
    { name: "Tasks", href: "/doctor/tasks", icon: FileText },
    { name: "Articles", href: "/doctor/articles", icon: FileText },
    { name: "Profile", href: "/doctor/profile", icon: User },
    { name: "Settings", href: "/doctor/settings", icon: Settings },
    { name: "Admin", href: "/doctor/admin", icon: Settings },
  ]

  if (!doctor) {
    return null
  }

  return (
    <ArticleProvider>
      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar for desktop */}
        <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
          <div className="flex flex-col flex-grow pt-5 bg-white border-r overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4 mb-5">
              <span className="text-xl font-bold text-healthcare-scrubs-green">Healthcare</span>
            </div>
            <div className="mt-5 flex-1 flex flex-col">
              <nav className="flex-1 px-2 space-y-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        isActive
                          ? "bg-healthcare-scrubs-green/10 text-healthcare-scrubs-green"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                        "group flex items-center px-2 py-2 text-sm font-medium rounded-md",
                      )}
                    >
                      <item.icon
                        className={cn(
                          isActive ? "text-healthcare-scrubs-green" : "text-gray-400 group-hover:text-gray-500",
                          "mr-3 flex-shrink-0 h-5 w-5",
                        )}
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  )
                })}
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
              <div className="flex items-center">
                <div>
                  <Avatar>
                    <AvatarImage src="/placeholder.svg" alt={doctor.name} />
                    <AvatarFallback>
                      {doctor.name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700">Dr. {doctor.name}</p>
                  <Button variant="link" className="text-xs text-gray-500 p-0" onClick={handleLogout}>
                    <LogOut className="h-3 w-3 mr-1" />
                    Sign out
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile header */}
        <div className="md:pl-64 flex flex-col flex-1">
          <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white shadow md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="px-4">
                  <span className="sr-only">Open sidebar</span>
                  <Menu className="h-6 w-6" aria-hidden="true" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xl font-bold text-healthcare-scrubs-green">Healthcare</span>
                  <Button variant="ghost" size="icon">
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <nav className="flex flex-col space-y-1">
                  {navigation.map((item) => {
                    const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={cn(
                          isActive
                            ? "bg-healthcare-scrubs-green/10 text-healthcare-scrubs-green"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                          "group flex items-center px-2 py-2 text-base font-medium rounded-md",
                        )}
                      >
                        <item.icon
                          className={cn(
                            isActive ? "text-healthcare-scrubs-green" : "text-gray-400 group-hover:text-gray-500",
                            "mr-4 flex-shrink-0 h-5 w-5",
                          )}
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    )
                  })}
                </nav>
                <div className="mt-auto pt-4 border-t border-gray-200">
                  <div className="flex items-center px-2">
                    <div>
                      <Avatar>
                        <AvatarImage src="/placeholder.svg" alt={doctor.name} />
                        <AvatarFallback>
                          {doctor.name
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-700">Dr. {doctor.name}</p>
                      <Button variant="link" className="text-xs text-gray-500 p-0" onClick={handleLogout}>
                        <LogOut className="h-3 w-3 mr-1" />
                        Sign out
                      </Button>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            <div className="flex-1 flex justify-between px-4">
              <div className="flex-1 flex items-center">
                <span className="text-xl font-bold text-healthcare-scrubs-green">Healthcare</span>
              </div>
              <div className="flex items-center">
                <Dialog open={notificationsOpen} onOpenChange={setNotificationsOpen}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <span className="sr-only">View notifications</span>
                      <Bell className="h-6 w-6" aria-hidden="true" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Notifications</DialogTitle>
                      <DialogDescription>Stay updated with your latest notifications</DialogDescription>
                    </DialogHeader>
                    <DoctorNotifications />
                  </DialogContent>
                </Dialog>
                <div className="ml-3">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg" alt={doctor.name} />
                    <AvatarFallback>
                      {doctor.name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop header */}
          <div className="hidden md:flex md:justify-end md:px-8 md:py-4">
            <Dialog open={notificationsOpen} onOpenChange={setNotificationsOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <span className="sr-only">View notifications</span>
                  <Bell className="h-6 w-6" aria-hidden="true" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Notifications</DialogTitle>
                  <DialogDescription>Stay updated with your latest notifications</DialogDescription>
                </DialogHeader>
                <DoctorNotifications />
              </DialogContent>
            </Dialog>
          </div>

          {/* Main content */}
          <main className="flex-1">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">{children}</div>
            </div>
          </main>
        </div>
      </div>
    </ArticleProvider>
  )
}
