"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Calendar, Clock, Search, Video } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useAppointments, type Appointment, type AppointmentStatus } from "@/contexts/appointments-context"
import { useUserProfile } from "@/contexts/user-profile-context"
import { useRouter } from "next/navigation"

export default function AppointmentsPage() {
  const router = useRouter()
  const { appointments, updateAppointment } = useAppointments()
  const { userProfile } = useUserProfile()

  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [isRescheduleDialogOpen, setIsRescheduleDialogOpen] = useState(false)
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false)
  const [isNotesDialogOpen, setIsNotesDialogOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [notes, setNotes] = useState("")
  const [isClient, setIsClient] = useState(false)

  // Set isClient to true once the component is mounted
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Filter appointments to only show the current user's appointments
  useEffect(() => {
    if (isClient && userProfile) {
      const userAppointments = appointments.filter(
        (appointment) =>
          appointment.patientId === userProfile.id ||
          appointment.patientName === `${userProfile.firstName} ${userProfile.lastName}`,
      )

      let filtered = [...userAppointments]

      // Filter by tab
      if (activeTab !== "all") {
        filtered = filtered.filter((appointment) => appointment.status.toLowerCase() === activeTab.toLowerCase())
      }

      // Filter by search
      if (searchTerm) {
        filtered = filtered.filter(
          (appointment) =>
            appointment.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            appointment.doctorSpecialty.toLowerCase().includes(searchTerm.toLowerCase()),
        )
      }

      setFilteredAppointments(filtered)
    }
  }, [activeTab, searchTerm, appointments, userProfile, isClient])

  const handleReschedule = () => {
    if (!selectedAppointment) return

    setLoading(true)

    // Simulate network request
    setTimeout(() => {
      updateAppointment(selectedAppointment.id, {
        status: "Rescheduled",
        date: "2023-05-30",
        time: "11:00 AM",
      })

      toast({
        title: "Appointment Rescheduled",
        description: `Your appointment with ${selectedAppointment.doctorName} has been rescheduled to May 30, 2023 at 11:00 AM.`,
      })

      setLoading(false)
      setIsRescheduleDialogOpen(false)
      setSelectedAppointment(null)
    }, 1000)
  }

  const handleCancel = () => {
    if (!selectedAppointment) return

    setLoading(true)

    // Simulate network request
    setTimeout(() => {
      updateAppointment(selectedAppointment.id, { status: "Cancelled" })

      toast({
        title: "Appointment Cancelled",
        description: `Your appointment with ${selectedAppointment.doctorName} has been cancelled.`,
      })

      setLoading(false)
      setIsCancelDialogOpen(false)
      setSelectedAppointment(null)
    }, 1000)
  }

  const handleSaveNotes = () => {
    if (!selectedAppointment) return

    setLoading(true)

    // Simulate network request
    setTimeout(() => {
      updateAppointment(selectedAppointment.id, { notes })

      toast({
        title: "Notes Saved",
        description: "Your appointment notes have been saved.",
      })

      setLoading(false)
      setIsNotesDialogOpen(false)
      setSelectedAppointment(null)
    }, 1000)
  }

  const joinVideoCall = (appointmentId: string) => {
    toast({
      title: "Joining Video Call",
      description: "Preparing to connect to your virtual appointment...",
    })

    // Simulate joining video call
    setTimeout(() => {
      toast({
        title: "Video Call Active",
        description: "You are now connected to your virtual appointment.",
      })
    }, 2000)
  }

  const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      case "Upcoming":
      case "Scheduled":
        return "bg-healthcare-lightblue/50 text-healthcare-blue border-healthcare-blue/30"
      case "Completed":
        return "bg-healthcare-lightgreen/50 text-healthcare-green border-healthcare-green/30"
      case "Cancelled":
        return "bg-healthcare-lightred/50 text-healthcare-red border-healthcare-red/30"
      case "Rescheduled":
        return "bg-healthcare-lightyellow/50 text-healthcare-yellow border-healthcare-yellow/30"
      case "Confirmed":
        return "bg-healthcare-lightgreen/50 text-healthcare-green border-healthcare-green/30"
      case "In Progress":
        return "bg-healthcare-lightpurple/50 text-healthcare-purple border-healthcare-purple/30"
      default:
        return ""
    }
  }

  if (!isClient) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Appointments</h1>
          <p className="text-gray-500 mt-2">Manage your doctor appointments</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search appointments..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button
            className="ml-auto bg-healthcare-blue hover:bg-healthcare-blue/90"
            onClick={() => {
              router.push("/dashboard/doctors")
            }}
          >
            Book New Appointment
          </Button>
        </div>

        <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Appointments</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {filteredAppointments.length === 0 ? (
              <EmptyAppointments />
            ) : (
              filteredAppointments.map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  getStatusColor={getStatusColor}
                  onReschedule={() => {
                    setSelectedAppointment(appointment)
                    setIsRescheduleDialogOpen(true)
                  }}
                  onCancel={() => {
                    setSelectedAppointment(appointment)
                    setIsCancelDialogOpen(true)
                  }}
                  onViewNotes={() => {
                    setSelectedAppointment(appointment)
                    setNotes(appointment.notes || "")
                    setIsNotesDialogOpen(true)
                  }}
                  onJoinVideoCall={joinVideoCall}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="upcoming" className="space-y-4">
            {filteredAppointments.length === 0 ? (
              <EmptyAppointments />
            ) : (
              filteredAppointments.map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  getStatusColor={getStatusColor}
                  onReschedule={() => {
                    setSelectedAppointment(appointment)
                    setIsRescheduleDialogOpen(true)
                  }}
                  onCancel={() => {
                    setSelectedAppointment(appointment)
                    setIsCancelDialogOpen(true)
                  }}
                  onViewNotes={() => {
                    setSelectedAppointment(appointment)
                    setNotes(appointment.notes || "")
                    setIsNotesDialogOpen(true)
                  }}
                  onJoinVideoCall={joinVideoCall}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {filteredAppointments.length === 0 ? (
              <EmptyAppointments />
            ) : (
              filteredAppointments.map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  getStatusColor={getStatusColor}
                  onReschedule={() => {
                    setSelectedAppointment(appointment)
                    setIsRescheduleDialogOpen(true)
                  }}
                  onCancel={() => {
                    setSelectedAppointment(appointment)
                    setIsCancelDialogOpen(true)
                  }}
                  onViewNotes={() => {
                    setSelectedAppointment(appointment)
                    setNotes(appointment.notes || "")
                    setIsNotesDialogOpen(true)
                  }}
                  onJoinVideoCall={joinVideoCall}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="cancelled" className="space-y-4">
            {filteredAppointments.length === 0 ? (
              <EmptyAppointments />
            ) : (
              filteredAppointments.map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  getStatusColor={getStatusColor}
                  onReschedule={() => {
                    setSelectedAppointment(appointment)
                    setIsRescheduleDialogOpen(true)
                  }}
                  onCancel={() => {
                    setSelectedAppointment(appointment)
                    setIsCancelDialogOpen(true)
                  }}
                  onViewNotes={() => {
                    setSelectedAppointment(appointment)
                    setNotes(appointment.notes || "")
                    setIsNotesDialogOpen(true)
                  }}
                  onJoinVideoCall={joinVideoCall}
                />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Reschedule Dialog */}
      <Dialog open={isRescheduleDialogOpen} onOpenChange={setIsRescheduleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reschedule Appointment</DialogTitle>
            <DialogDescription>
              Are you sure you want to reschedule your appointment with {selectedAppointment?.doctorName}?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Your appointment will be rescheduled to the next available slot. We'll notify you once the new appointment
              is confirmed.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRescheduleDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleReschedule}
              disabled={loading}
              className="bg-healthcare-blue hover:bg-healthcare-blue/90"
            >
              {loading ? "Processing..." : "Confirm Reschedule"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Dialog */}
      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Appointment</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel your appointment with {selectedAppointment?.doctorName}?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              This action cannot be undone. You may be subject to a cancellation fee if cancelled within 24 hours of the
              appointment.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCancelDialogOpen(false)}>
              Go Back
            </Button>
            <Button variant="destructive" onClick={handleCancel} disabled={loading}>
              {loading ? "Processing..." : "Confirm Cancellation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Notes Dialog */}
      <Dialog open={isNotesDialogOpen} onOpenChange={setIsNotesDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Appointment Notes</DialogTitle>
            <DialogDescription>
              View or edit notes for your appointment with {selectedAppointment?.doctorName}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add your notes here..."
              className="mt-2"
              rows={5}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNotesDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveNotes}
              disabled={loading}
              className="bg-healthcare-green hover:bg-healthcare-green/90"
            >
              {loading ? "Saving..." : "Save Notes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}

interface AppointmentCardProps {
  appointment: Appointment
  getStatusColor: (status: AppointmentStatus) => string
  onReschedule: () => void
  onCancel: () => void
  onViewNotes: () => void
  onJoinVideoCall: (id: string) => void
}

function AppointmentCard({
  appointment,
  getStatusColor,
  onReschedule,
  onCancel,
  onViewNotes,
  onJoinVideoCall,
}: AppointmentCardProps) {
  const isUpcoming =
    appointment.status === "Upcoming" || appointment.status === "Rescheduled" || appointment.status === "Scheduled"
  const isVideoCall = appointment.type === "Video Call"
  const appointmentDate = new Date(appointment.date)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Check if appointment is today
  const isToday = appointmentDate.getTime() === today.getTime()

  // Check if appointment is within 15 minutes (for video calls)
  const appointmentTime = appointment.time.match(/(\d+):(\d+)\s*([AP]M)/)
  let isWithin15Min = false

  if (isToday && appointmentTime) {
    const hours = Number.parseInt(appointmentTime[1])
    const minutes = Number.parseInt(appointmentTime[2])
    const ampm = appointmentTime[3]

    const appointmentDateTime = new Date()
    appointmentDateTime.setHours(
      ampm === "PM" && hours < 12 ? hours + 12 : ampm === "AM" && hours === 12 ? 0 : hours,
      minutes,
      0,
      0,
    )

    const timeDiff = appointmentDateTime.getTime() - new Date().getTime()
    isWithin15Min = timeDiff > 0 && timeDiff <= 15 * 60 * 1000
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center">
            <div className="mr-4">
              <img
                src={appointment.doctorImage || "/placeholder.svg?height=60&width=60"}
                alt={appointment.doctorName}
                className="w-16 h-16 rounded-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-medium">{appointment.doctorName}</h3>
              <p className="text-sm text-muted-foreground">{appointment.doctorSpecialty}</p>
              <div className="flex items-center mt-1">
                <Calendar className="h-4 w-4 text-muted-foreground mr-1" />
                <span className="text-sm">
                  {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                </span>
              </div>
              <div className="flex items-center mt-1">
                {isVideoCall ? (
                  <Video className="h-4 w-4 text-muted-foreground mr-1" />
                ) : (
                  <Clock className="h-4 w-4 text-muted-foreground mr-1" />
                )}
                <span className="text-sm">{appointment.type}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start md:items-end gap-2">
            <Badge className={getStatusColor(appointment.status)}>{appointment.status}</Badge>

            <div className="flex flex-wrap gap-2">
              {isUpcoming && (
                <>
                  <Button variant="outline" size="sm" onClick={onReschedule}>
                    Reschedule
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-healthcare-red hover:text-healthcare-red hover:bg-red-50"
                    onClick={onCancel}
                  >
                    Cancel
                  </Button>
                </>
              )}

              {isVideoCall && isUpcoming && isWithin15Min && (
                <Button
                  size="sm"
                  className="bg-healthcare-blue hover:bg-healthcare-blue/90"
                  onClick={() => onJoinVideoCall(appointment.id)}
                >
                  <Video className="h-4 w-4 mr-1" />
                  Join Now
                </Button>
              )}

              {appointment.status === "Completed" && (
                <Button variant="outline" size="sm" onClick={onViewNotes}>
                  {appointment.notes ? "View Notes" : "Add Notes"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function EmptyAppointments() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-10">
        <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">No appointments found</h3>
        <p className="text-muted-foreground mt-1">You don't have any appointments matching the current filters.</p>
        <Button className="mt-4 bg-healthcare-blue hover:bg-healthcare-blue/90">Book New Appointment</Button>
      </CardContent>
    </Card>
  )
}
