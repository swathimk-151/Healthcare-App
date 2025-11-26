"use client"

import { useState, useEffect } from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"

interface Notification {
  id: string
  title: string
  message: string
  time: string
  read: boolean
  type: "appointment" | "order" | "system"
}

export function NotificationsWrapper() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    // Initial notifications
    setNotifications([
      {
        id: "notif-1",
        title: "Appointment Reminder",
        message: "Your appointment with Dr. Smith is tomorrow at 10:00 AM",
        time: "1 hour ago",
        read: false,
        type: "appointment",
      },
      {
        id: "notif-2",
        title: "Order Update",
        message: "Your medicine order #12345 has been shipped",
        time: "3 hours ago",
        read: false,
        type: "order",
      },
      {
        id: "notif-3",
        title: "Lab Results",
        message: "Your lab test results are now available",
        time: "Yesterday",
        read: true,
        type: "system",
      },
    ])

    // Simulate real-time notifications
    const interval = setInterval(() => {
      const shouldAddNotification = Math.random() > 0.7 // 30% chance

      if (shouldAddNotification) {
        const notificationTypes = [
          {
            type: "appointment",
            titles: ["Appointment Confirmed", "Appointment Rescheduled", "Appointment Reminder"],
            messages: [
              "Your appointment with Dr. Johnson has been confirmed for tomorrow",
              "Your appointment with Dr. Williams has been rescheduled to next week",
              "Reminder: You have an appointment in 2 hours",
            ],
          },
          {
            type: "order",
            titles: ["Order Processed", "Order Shipped", "Order Delivered"],
            messages: [
              "Your medicine order #54321 has been processed",
              "Your order is out for delivery",
              "Your order has been delivered",
            ],
          },
        ]

        const selectedType = notificationTypes[Math.floor(Math.random() * notificationTypes.length)]
        const titleIndex = Math.floor(Math.random() * selectedType.titles.length)

        const newNotification: Notification = {
          id: `notif-${Date.now()}`,
          title: selectedType.titles[titleIndex],
          message: selectedType.messages[titleIndex],
          time: "Just now",
          read: false,
          type: selectedType.type as "appointment" | "order",
        }

        setNotifications((prev) => [newNotification, ...prev])

        // Show toast for new notification
        toast({
          title: newNotification.title,
          description: newNotification.message,
        })
      }
    }, 30000) // Check every 30 seconds

    return () => clearInterval(interval)
  }, [])

  // Update unread count whenever notifications change
  useEffect(() => {
    setUnreadCount(notifications.filter((n) => !n.read).length)
  }, [notifications])

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({
        ...notification,
        read: true,
      })),
    )
  }

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-medium">Notifications</h3>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              Mark all as read
            </Button>
          )}
        </div>
        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">No notifications</div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 border-b last:border-0 ${notification.read ? "" : "bg-muted/50"}`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex justify-between items-start">
                  <h4 className="font-medium">{notification.title}</h4>
                  <span className="text-xs text-muted-foreground">{notification.time}</span>
                </div>
                <p className="text-sm mt-1">{notification.message}</p>
              </div>
            ))
          )}
        </div>
        <div className="p-2 border-t">
          <Button variant="ghost" size="sm" className="w-full">
            View all notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
