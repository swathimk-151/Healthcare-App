"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Search, Send, Clock, User } from "lucide-react"
import { DoctorLayout } from "@/components/doctor-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useDoctorData } from "@/contexts/doctor-data-context"
import { format, formatDistanceToNow } from "date-fns"

export default function DoctorMessagesPage() {
  const router = useRouter()
  const [doctor, setDoctor] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { messages, patients, addMessage, markMessageAsRead } = useDoctorData()

  useEffect(() => {
    // Check if doctor is logged in
    const doctorData = localStorage.getItem("doctorUser")

    if (doctorData) {
      setDoctor(JSON.parse(doctorData))
    } else {
      router.push("/login")
    }

    setLoading(false)
  }, [router])

  useEffect(() => {
    // Scroll to bottom of messages when new messages arrive or patient changes
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [selectedPatientId, messages])

  useEffect(() => {
    // Mark messages as read when patient is selected
    if (selectedPatientId) {
      messages
        .filter((m) => m.patientId === selectedPatientId && !m.read && m.sender === "patient")
        .forEach((m) => markMessageAsRead(m.id))
    }
  }, [selectedPatientId, messages, markMessageAsRead])

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!doctor) {
    return null // Router will redirect
  }

  // Get unique patients who have messages
  const messagePatients = Array.from(new Set(messages.map((m) => m.patientId)))
    .map((patientId) => {
      const patient = patients.find((p) => p.id === patientId)
      const lastMessage = messages
        .filter((m) => m.patientId === patientId)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0]

      const unreadCount = messages.filter((m) => m.patientId === patientId && !m.read && m.sender === "patient").length

      return {
        id: patientId,
        name: patient?.name || "Unknown Patient",
        image: patient?.image || "/placeholder.svg",
        lastMessage,
        unreadCount,
      }
    })
    .filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      // Sort by unread count first, then by last message time
      if (a.unreadCount !== b.unreadCount) {
        return b.unreadCount - a.unreadCount
      }
      return new Date(b.lastMessage.timestamp).getTime() - new Date(a.lastMessage.timestamp).getTime()
    })

  // Get messages for selected patient
  const patientMessages = selectedPatientId
    ? messages
        .filter((m) => m.patientId === selectedPatientId)
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    : []

  const selectedPatient = selectedPatientId ? patients.find((p) => p.id === selectedPatientId) : null

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedPatientId) return

    addMessage({
      patientId: selectedPatientId,
      patientName: selectedPatient?.name || "Unknown Patient",
      patientImage: selectedPatient?.image || "/placeholder.svg",
      content: newMessage,
      sender: "doctor",
    })

    setNewMessage("")
  }

  return (
    <DoctorLayout>
      <div className="page-container">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="page-title text-healthcare-scrubs-green">Messages</h1>
            <p className="page-subtitle">Communicate with your patients</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[calc(100vh-220px)]">
          {/* Patient List */}
          <Card className="md:col-span-1 flex flex-col h-full">
            <CardHeader className="pb-2">
              <CardTitle>Conversations</CardTitle>
              <CardDescription>Your patient messages</CardDescription>
              <div className="relative mt-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search patients..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden p-0">
              <ScrollArea className="h-full">
                <div className="px-4 py-2 space-y-2">
                  {messagePatients.map((patient) => (
                    <div
                      key={patient.id}
                      className={`flex items-center p-3 rounded-lg cursor-pointer hover:bg-muted ${
                        selectedPatientId === patient.id ? "bg-muted" : ""
                      }`}
                      onClick={() => setSelectedPatientId(patient.id)}
                    >
                      <div className="relative">
                        <Avatar>
                          <AvatarImage src={patient.image || "/placeholder.svg"} alt={patient.name} />
                          <AvatarFallback>
                            {patient.name
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        {patient.unreadCount > 0 && (
                          <span className="absolute -top-1 -right-1 bg-healthcare-red text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {patient.unreadCount}
                          </span>
                        )}
                      </div>
                      <div className="ml-3 flex-1 overflow-hidden">
                        <p className="font-medium">{patient.name}</p>
                        <p className="text-sm text-muted-foreground truncate">{patient.lastMessage.content}</p>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(patient.lastMessage.timestamp), { addSuffix: true })}
                      </div>
                    </div>
                  ))}
                  {messagePatients.length === 0 && (
                    <div className="text-center py-4 text-muted-foreground">No conversations found</div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Message Area */}
          <Card className="md:col-span-2 flex flex-col h-full">
            {selectedPatientId ? (
              <>
                <CardHeader className="pb-2 border-b">
                  <div className="flex items-center">
                    <Avatar>
                      <AvatarImage
                        src={selectedPatient?.image || "/placeholder.svg"}
                        alt={selectedPatient?.name || ""}
                      />
                      <AvatarFallback>
                        {selectedPatient?.name
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("") || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="ml-3">
                      <CardTitle>{selectedPatient?.name}</CardTitle>
                      <CardDescription>
                        <div className="flex items-center">
                          <User className="h-3 w-3 mr-1" />
                          <span>Patient ID: {selectedPatient?.id}</span>
                        </div>
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 overflow-hidden p-0">
                  <ScrollArea className="h-full">
                    <div className="p-4 space-y-4">
                      {patientMessages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.sender === "doctor" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[80%] p-3 rounded-lg ${
                              message.sender === "doctor"
                                ? "bg-healthcare-scrubs-green/10 text-healthcare-scrubs-green"
                                : "bg-muted"
                            }`}
                          >
                            <p>{message.content}</p>
                            <div className="flex items-center justify-end mt-1">
                              <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">
                                {format(new Date(message.timestamp), "h:mm a")}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>
                </CardContent>
                <div className="p-4 border-t">
                  <div className="flex items-center space-x-2">
                    <Input
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault()
                          handleSendMessage()
                        }
                      }}
                    />
                    <Button onClick={handleSendMessage} className="btn-doctor">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <h3 className="text-lg font-medium">Select a conversation</h3>
                  <p className="text-muted-foreground">Choose a patient to view their messages</p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </DoctorLayout>
  )
}
