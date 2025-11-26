"use client"

import { useState, useEffect } from "react"
import { Bell, Calendar, MessageSquare, FileText, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

interface Notification {
  id: string
  type: "appointment" | "message" | "task" | "system"
  title: string
  description: string
  time: string
  read: boolean
  priority?: "high" | "normal" | "low"
}

export function DoctorNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    // In a real app, this would be fetched from an API
    const mockNotifications: Notification[] = [
      {
        id: "1",
        type: "appointment",
        title: "New Appointment",
        description: "Patient John Doe scheduled an appointment for tomorrow at 10:00 AM",
        time: "10 minutes ago",
        read: false,
        priority: "normal",
      },
      {
        id: "2",
        type: "message",
        title: "New Message",
        description: "You received a new message from Patient Sarah Johnson regarding her medication",
        time: "30 minutes ago",
        read: false,
        priority: "high",
      },
      {
        id: "3",
        type: "task",
        title: "Task Reminder",
        description: "Review lab results for Patient Michael Brown",
        time: "1 hour ago",
        read: true,
        priority: "high",
      },
      {
        id: "4",
        type: "system",
        title: "System Update",
        description: "The healthcare platform will undergo maintenance tonight from 2:00 AM to 4:00 AM",
        time: "2 hours ago",
        read: true,
        priority: "low",
      },
      {
        id: "5",
        type: "appointment",
        title: "Appointment Cancelled",
        description: "Patient Emily Wilson cancelled her appointment scheduled for today at 3:30 PM",
        time: "3 hours ago",
        read: true,
        priority: "normal",
      },
    ]

    setNotifications(mockNotifications)
  }, [])

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
  }

  const filteredNotifications = notifications.filter((notification) => {
    if (activeTab === "all") return true
    if (activeTab === "unread") return !notification.read
    return notification.type === activeTab
  })

  const unreadCount = notifications.filter((notification) => !notification.read).length

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "appointment":
        return <Calendar className="h-4 w-4" />
      case "message":
        return <MessageSquare className="h-4 w-4" />
      case "task":
        return <FileText className="h-4 w-4" />
      case "system":
        return <Bell className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const getPriorityColor = (priority: string | undefined) => {
    switch (priority) {
      case "high":
        return "text-red-500 bg-red-100"
      case "normal":
        return "text-blue-500 bg-blue-100"
      case "low":
        return "text-green-500 bg-green-100"
      default:
        return "text-gray-500 bg-gray-100"
    }
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Bell className="h-5 w-5 mr-2 text-healthcare-scrubs-green" />
          <h3 className="text-lg font-medium">Notifications</h3>
          {unreadCount > 0 && (
            <Badge variant="outline" className="ml-2 bg-healthcare-scrubs-green/10 text-healthcare-scrubs-green">
              {unreadCount} new
            </Badge>
          )}
        </div>
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" onClick={markAllAsRead}>
            Mark all as read
          </Button>
        )}
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="appointment">Appts</TabsTrigger>
          <TabsTrigger value="message">Msgs</TabsTrigger>
          <TabsTrigger value="task">Tasks</TabsTrigger>
          <TabsTrigger value="unread">Unread</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          <ScrollArea className="h-[300px]">
            {filteredNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <CheckCircle className="h-8 w-8 text-gray-400 mb-2" />
                <p className="text-gray-500">No notifications to display</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      "p-3 rounded-lg border transition-colors",
                      notification.read ? "bg-white" : "bg-healthcare-scrubs-green/5",
                    )}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start">
                      <div className={cn("p-2 rounded-full mr-3", getPriorityColor(notification.priority))}>
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium">{notification.title}</h4>
                          {!notification.read && (
                            <span className="h-2 w-2 bg-healthcare-scrubs-green rounded-full"></span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{notification.description}</p>
                        <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  )
}
