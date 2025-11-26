"use client"

import { useState, useEffect } from "react"
import { Bell } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

// Sample notifications data
const initialNotifications = [
  {
    id: 1,
    type: "appointment",
    message: "Your appointment with Dr. Anand Subramanian is confirmed for tomorrow at 10:00 AM",
    time: "10 minutes ago",
    read: false,
  },
  {
    id: 2,
    type: "medicine",
    message: "Your medicine order #12345 has been shipped",
    time: "30 minutes ago",
    read: false,
  },
  {
    id: 3,
    type: "lab_test",
    message: "Your lab test results are now available",
    time: "1 hour ago",
    read: false,
  },
  {
    id: 4,
    type: "article",
    message: "New health article: Managing Diabetes During Summer",
    time: "2 hours ago",
    read: true,
  },
]

export function PatientNotifications() {
  const [notifications, setNotifications] = useState(initialNotifications)
  const [unreadCount, setUnreadCount] = useState(0)

  // Calculate unread notifications
  useEffect(() => {
    const count = notifications.filter((notification) => !notification.read).length
    setUnreadCount(count)
  }, [notifications])

  // Simulate real-time notifications
  useEffect(() => {
    const interval = setInterval(() => {
      // 10% chance of new notification every 30 seconds
      if (Math.random() < 0.1) {
        const notificationTypes = [
          {
            type: "appointment",
            message: "Reminder: Your appointment with Dr. Senthil Murugan is tomorrow at 2:00 PM",
          },
          {
            type: "medicine",
            message: "Your medicine order #12346 has been delivered",
          },
          {
            type: "lab_test",
            message: "Your lab test appointment is confirmed for tomorrow",
          },
        ]

        const randomType = notificationTypes[Math.floor(Math.random() * notificationTypes.length)]

        const newNotification = {
          id: Date.now(),
          type: randomType.type,
          message: randomType.message,
          time: "Just now",
          read: false,
        }

        setNotifications((prev) => [newNotification, ...prev])
      }
    }, 30000) // Check every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({
        ...notification,
        read: true,
      })),
    )
  }

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-2 -right-2 px-1.5 py-0.5 bg-healthcare-blue text-white">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between p-2">
          <DropdownMenuLabel>Notifications</DropdownMenuLabel>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs">
              Mark all as read
            </Button>
          )}
        </div>
        <DropdownMenuSeparator />
        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">No notifications</div>
          ) : (
            notifications.map((notification) => (
              <DropdownMenuItem key={notification.id} className="cursor-default p-0">
                <button
                  className={`w-full text-left p-3 ${notification.read ? "" : "bg-muted/50"}`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <p className={`text-sm ${notification.read ? "" : "font-medium"}`}>{notification.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                    </div>
                    {!notification.read && <div className="h-2 w-2 bg-healthcare-blue rounded-full mt-1.5"></div>}
                  </div>
                </button>
              </DropdownMenuItem>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
