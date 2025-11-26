"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CalendarIcon, Clock, Filter, Search, Plus, CheckCircle2, XCircle } from "lucide-react"
import { format } from "date-fns"
import { DoctorLayout } from "@/components/doctor-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Textarea } from "@/components/ui/textarea"
import { DoctorDataProvider, useDoctorData } from "@/contexts/doctor-data-context"
import { toast } from "@/components/ui/use-toast"
import { useAppointments } from "@/contexts/appointments-context"

// Create a client component that uses the context
function DoctorAppointmentsContent() {
  const router = useRouter()
  const [doctor, setDoctor] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false)
  const [appointmentNotes, setAppointmentNotes] = useState("")

  const { patients } = useDoctorData()
  const { appointments, addAppointment, updateAppointment } = useAppointments()

  const [newAppointment, setNewAppointment] = useState({
    patientId: "",
    patientName: "",
    patientImage: "/placeholder.svg?height=40&width=40",
    date: format(new Date(), "yyyy-MM-dd"),
    time: "",
    type: "Consultation",
    reason: "",
    status: "Scheduled" as const,
    notes: "",
  })

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
    if (selectedAppointment) {
      setAppointmentNotes(selectedAppointment.notes || "")
    }
  }, [selectedAppointment])

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!doctor) {
    return null // Router will redirect
  }

  // Filter appointments based on search term, status, type, and date
  const doctorAppointments = appointments.filter(
    (appointment) => appointment.doctorId === doctor.id || appointment.doctorName === doctor.name,
  )

  const filteredAppointments = doctorAppointments.filter((appointment) => {
    const matchesSearch =
      appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (appointment.reason && appointment.reason.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = statusFilter === "all" || appointment.status.toLowerCase() === statusFilter.toLowerCase()

    const matchesType = typeFilter === "all" || appointment.type.toLowerCase() === typeFilter.toLowerCase()

    const matchesDate = !selectedDate || appointment.date === format(selectedDate, "yyyy-MM-dd")

    return matchesSearch && matchesStatus && matchesType && matchesDate
  })

  const handleViewDetails = (appointment: any) => {
    setSelectedAppointment(appointment)
    setIsDetailsOpen(true)
  }

  const handleStatusChange = (appointmentId: string, newStatus: string) => {
    updateAppointment(appointmentId, { status: newStatus as any })
    toast({
      title: "Appointment Updated",
      description: `Appointment status changed to ${newStatus}`,
    })
    setIsDetailsOpen(false)
  }

  const handleSaveNotes = () => {
    if (selectedAppointment) {
      updateAppointment(selectedAppointment.id, { notes: appointmentNotes })
      toast({
        title: "Notes Saved",
        description: "Appointment notes have been updated",
      })
    }
  }

  const handleCreateAppointment = () => {
    if (!newAppointment.patientId || !newAppointment.date || !newAppointment.time) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    // Find the patient to get their name and image
    const patient = patients.find((p) => p.id === newAppointment.patientId)
    if (patient) {
      const appointmentToAdd = {
        ...newAppointment,
        patientName: patient.name,
        patientImage: patient.image,
        doctorId: doctor.id,
        doctorName: doctor.name,
        doctorSpecialty: doctor.specialty || "General Physician",
      }

      addAppointment(appointmentToAdd)

      toast({
        title: "Appointment Created",
        description: `Appointment scheduled with ${patient.name} on ${newAppointment.date} at ${newAppointment.time}`,
      })

      setIsNewAppointmentOpen(false)
      // Reset form
      setNewAppointment({
        patientId: "",
        patientName: "",
        patientImage: "/placeholder.svg?height=40&width=40",
        date: format(new Date(), "yyyy-MM-dd"),
        time: "",
        type: "Consultation",
        reason: "",
        status: "Scheduled",
        notes: "",
      })
    }
  }

  return (
    <div className="page-container">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="page-title text-healthcare-scrubs-green">Appointments</h1>
          <p className="page-subtitle">Manage your patient appointments</p>
        </div>
        <div className="flex items-center space-x-2 mt-4 md:mt-0">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="border-healthcare-scrubs-green text-healthcare-scrubs-green">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <CalendarComponent mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />
            </PopoverContent>
          </Popover>

          <Dialog open={isNewAppointmentOpen} onOpenChange={setIsNewAppointmentOpen}>
            <DialogTrigger asChild>
              <Button className="btn-doctor">
                <Plus className="mr-2 h-4 w-4" />
                New Appointment
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Schedule New Appointment</DialogTitle>
                <DialogDescription>Create a new appointment for a patient.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="patientId" className="text-right">
                    Patient
                  </Label>
                  <Select
                    value={newAppointment.patientId}
                    onValueChange={(value) => setNewAppointment({ ...newAppointment, patientId: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select patient" />
                    </SelectTrigger>
                    <SelectContent>
                      {patients.map((patient) => (
                        <SelectItem key={patient.id} value={patient.id}>
                          {patient.name} ({patient.id})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="date" className="text-right">
                    Date
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={newAppointment.date}
                    onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="time" className="text-right">
                    Time
                  </Label>
                  <Select
                    value={newAppointment.time}
                    onValueChange={(value) => setNewAppointment({ ...newAppointment, time: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="09:00 AM">09:00 AM</SelectItem>
                      <SelectItem value="10:00 AM">10:00 AM</SelectItem>
                      <SelectItem value="11:00 AM">11:00 AM</SelectItem>
                      <SelectItem value="01:00 PM">01:00 PM</SelectItem>
                      <SelectItem value="02:00 PM">02:00 PM</SelectItem>
                      <SelectItem value="03:00 PM">03:00 PM</SelectItem>
                      <SelectItem value="04:00 PM">04:00 PM</SelectItem>
                      <SelectItem value="05:00 PM">05:00 PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="type" className="text-right">
                    Type
                  </Label>
                  <Select
                    value={newAppointment.type}
                    onValueChange={(value) => setNewAppointment({ ...newAppointment, type: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Consultation">Consultation</SelectItem>
                      <SelectItem value="Follow-up">Follow-up</SelectItem>
                      <SelectItem value="Check-up">Check-up</SelectItem>
                      <SelectItem value="Urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="reason" className="text-right">
                    Reason
                  </Label>
                  <Input
                    id="reason"
                    value={newAppointment.reason}
                    onChange={(e) => setNewAppointment({ ...newAppointment, reason: e.target.value })}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsNewAppointmentOpen(false)}>
                  Cancel
                </Button>
                <Button className="btn-doctor" onClick={handleCreateAppointment}>
                  Create Appointment
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by patient name, ID, or reason..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="in progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[150px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="consultation">Consultation</SelectItem>
              <SelectItem value="follow-up">Follow-up</SelectItem>
              <SelectItem value="check-up">Check-up</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="upcoming" className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
          <TabsTrigger value="all">All Appointments</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Appointments</CardTitle>
              <CardDescription>Appointments scheduled for today and future dates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredAppointments
                  .filter((app) => ["Scheduled", "Confirmed", "In Progress"].includes(app.status))
                  .map((appointment) => (
                    <AppointmentCard key={appointment.id} appointment={appointment} onViewDetails={handleViewDetails} />
                  ))}
                {filteredAppointments.filter((app) => ["Scheduled", "Confirmed", "In Progress"].includes(app.status))
                  .length === 0 && (
                  <div className="text-center py-4 text-muted-foreground">No upcoming appointments found</div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="past">
          <Card>
            <CardHeader>
              <CardTitle>Past Appointments</CardTitle>
              <CardDescription>Completed or cancelled appointments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredAppointments
                  .filter((app) => ["Completed", "Cancelled"].includes(app.status))
                  .map((appointment) => (
                    <AppointmentCard key={appointment.id} appointment={appointment} onViewDetails={handleViewDetails} />
                  ))}
                {filteredAppointments.filter((app) => ["Completed", "Cancelled"].includes(app.status)).length === 0 && (
                  <div className="text-center py-4 text-muted-foreground">No past appointments found</div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All Appointments</CardTitle>
              <CardDescription>Complete appointment history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredAppointments.map((appointment) => (
                  <AppointmentCard key={appointment.id} appointment={appointment} onViewDetails={handleViewDetails} />
                ))}
                {filteredAppointments.length === 0 && (
                  <div className="text-center py-4 text-muted-foreground">No appointments found</div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Appointment Details Dialog */}
      {selectedAppointment && (
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Appointment Details</DialogTitle>
              <DialogDescription>View and manage appointment information</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={selectedAppointment.patientImage || "/placeholder.svg"}
                    alt={selectedAppointment.patientName}
                  />
                  <AvatarFallback>
                    {selectedAppointment.patientName
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{selectedAppointment.patientName}</h3>
                  <p className="text-sm text-muted-foreground">Patient ID: {selectedAppointment.patientId}</p>
                </div>
                <Badge
                  className={
                    selectedAppointment.status === "Completed"
                      ? "bg-healthcare-green/20 text-healthcare-green ml-auto"
                      : selectedAppointment.status === "Cancelled"
                        ? "bg-healthcare-red/20 text-healthcare-red ml-auto"
                        : selectedAppointment.status === "In Progress"
                          ? "bg-healthcare-purple/20 text-healthcare-purple ml-auto"
                          : "bg-healthcare-blue/20 text-healthcare-blue ml-auto"
                  }
                >
                  {selectedAppointment.status}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Date</Label>
                  <p className="font-medium">{selectedAppointment.date}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Time</Label>
                  <p className="font-medium">{selectedAppointment.time}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Type</Label>
                  <p className="font-medium">{selectedAppointment.type}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Reason</Label>
                  <p className="font-medium">{selectedAppointment.reason || "Not specified"}</p>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center">
                  <Label className="text-muted-foreground">Notes</Label>
                  <Button variant="ghost" size="sm" onClick={handleSaveNotes}>
                    Save Notes
                  </Button>
                </div>
                <Textarea
                  value={appointmentNotes}
                  onChange={(e) => setAppointmentNotes(e.target.value)}
                  className="mt-1"
                  placeholder="Add notes about the appointment..."
                />
              </div>
              <div className="mt-4">
                <Label>Update Status</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedAppointment.status !== "Completed" && (
                    <Button
                      variant="outline"
                      className="border-healthcare-green text-healthcare-green"
                      onClick={() => handleStatusChange(selectedAppointment.id, "Completed")}
                    >
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Mark as Completed
                    </Button>
                  )}
                  {selectedAppointment.status !== "In Progress" &&
                    selectedAppointment.status !== "Completed" &&
                    selectedAppointment.status !== "Cancelled" && (
                      <Button
                        variant="outline"
                        className="border-healthcare-purple text-healthcare-purple"
                        onClick={() => handleStatusChange(selectedAppointment.id, "In Progress")}
                      >
                        <Clock className="mr-2 h-4 w-4" />
                        Start Appointment
                      </Button>
                    )}
                  {selectedAppointment.status !== "Cancelled" && selectedAppointment.status !== "Completed" && (
                    <Button
                      variant="outline"
                      className="border-healthcare-red text-healthcare-red"
                      onClick={() => handleStatusChange(selectedAppointment.id, "Cancelled")}
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Cancel Appointment
                    </Button>
                  )}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

// Wrap the component with the provider
export default function DoctorAppointmentsPage() {
  return (
    <DoctorDataProvider>
      <DoctorLayout>
        <DoctorAppointmentsContent />
      </DoctorLayout>
    </DoctorDataProvider>
  )
}

function AppointmentCard({
  appointment,
  onViewDetails,
}: { appointment: any; onViewDetails: (appointment: any) => void }) {
  const statusColors = {
    Completed: "bg-healthcare-green/20 text-healthcare-green",
    Cancelled: "bg-healthcare-red/20 text-healthcare-red",
    "In Progress": "bg-healthcare-purple/20 text-healthcare-purple",
    Confirmed: "bg-healthcare-blue/20 text-healthcare-blue",
    Scheduled: "bg-healthcare-yellow/20 text-healthcare-yellow",
  }

  const statusColor = statusColors[appointment.status as keyof typeof statusColors] || "bg-gray-200 text-gray-800"

  return (
    <div className="flex items-center justify-between p-3 border rounded-lg card-hover">
      <div className="flex items-center space-x-3">
        <Avatar>
          <AvatarImage src={appointment.patientImage || "/placeholder.svg"} alt={appointment.patientName} />
          <AvatarFallback>
            {appointment.patientName
              .split(" ")
              .map((n: string) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{appointment.patientName}</p>
          <div className="flex items-center text-sm text-muted-foreground">
            <CalendarIcon className="mr-1 h-3 w-3" />
            <span>{appointment.date}</span>
            <Clock className="ml-2 mr-1 h-3 w-3" />
            <span>{appointment.time}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">{appointment.reason || "No reason specified"}</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Badge className={statusColor}>{appointment.status}</Badge>
        <Button variant="outline" size="sm" onClick={() => onViewDetails(appointment)}>
          View
        </Button>
      </div>
    </div>
  )
}
