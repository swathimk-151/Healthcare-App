"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Activity,
  Calendar,
  Clock,
  FileText,
  Users,
  Pill,
  AlertCircle,
  CheckCircle2,
  ClipboardList,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { DoctorLayout } from "@/components/doctor-layout"
import { useDoctorData } from "@/contexts/doctor-data-context"
import { format } from "date-fns"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function DoctorDashboard() {
  const router = useRouter()
  const [doctor, setDoctor] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null)
  const [isAppointmentDetailsOpen, setIsAppointmentDetailsOpen] = useState(false)

  const { appointments, patients, prescriptions, tasks, updateAppointmentStatus, completeTask } = useDoctorData()

  useEffect(() => {
    // Check if doctor is logged in
    const doctorData = localStorage.getItem("doctorUser")

    if (doctorData) {
      setDoctor(JSON.parse(doctorData))
    } else {
      router.push("/doctor/login")
    }

    setLoading(false)
  }, [router])

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!doctor) {
    return null // Router will redirect
  }

  // Get today's appointments
  const todayDate = new Date().toISOString().split("T")[0]
  const todayAppointments = appointments.filter((a) => a.date === todayDate)
  const completedToday = todayAppointments.filter((a) => a.status === "Completed").length
  const totalToday = todayAppointments.length
  const completionPercentage = totalToday > 0 ? (completedToday / totalToday) * 100 : 0

  // Get upcoming appointments (today and tomorrow)
  const tomorrowDate = new Date(Date.now() + 86400000).toISOString().split("T")[0]
  const upcomingAppointments = appointments
    .filter(
      (a) =>
        (a.date === todayDate || a.date === tomorrowDate) &&
        ["Scheduled", "Confirmed", "In Progress"].includes(a.status),
    )
    .sort((a, b) => {
      // Sort by date first, then by time
      if (a.date !== b.date) {
        return a.date.localeCompare(b.date)
      }
      return a.time.localeCompare(b.time)
    })

  // Get recent patients
  const recentPatients = patients
    .sort((a, b) => new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime())
    .slice(0, 3)

  // Get pending tasks
  const pendingTasks = tasks.filter((t) => !t.completed)
  const highPriorityTasks = pendingTasks.filter((t) => t.priority === "high").length
  const mediumPriorityTasks = pendingTasks.filter((t) => t.priority === "medium").length
  const lowPriorityTasks = pendingTasks.filter((t) => t.priority === "low").length

  // Get prescription stats
  const activePrescriptions = prescriptions.filter((p) => p.status === "Active").length
  const expiredPrescriptions = prescriptions.filter((p) => p.status === "Expired").length

  const handleStartAppointment = (appointmentId: number) => {
    updateAppointmentStatus(appointmentId, "In Progress")
  }

  const handleCompleteAppointment = (appointmentId: number) => {
    updateAppointmentStatus(appointmentId, "Completed")
  }

  const handleCompleteTask = (taskId: number) => {
    completeTask(taskId)
  }

  const handleViewAppointmentDetails = (appointment: any) => {
    setSelectedAppointment(appointment)
    setIsAppointmentDetailsOpen(true)
  }

  return (
    <DoctorLayout>
      <div className="page-container">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="page-title text-healthcare-scrubs-green">Doctor Dashboard</h1>
            <p className="page-subtitle">Welcome back, Dr. {doctor.name}</p>
          </div>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <Button className="btn-doctor" onClick={() => router.push("/doctor/appointments")}>
              <Calendar className="mr-2 h-4 w-4" />
              Schedule
            </Button>
            <Button variant="outline" className="border-healthcare-scrubs-green text-healthcare-scrubs-green">
              <FileText className="mr-2 h-4 w-4" />
              Reports
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="card-doctor">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Today&apos;s Appointments</p>
                  <h3 className="text-2xl font-bold text-healthcare-scrubs-green">{totalToday}</h3>
                </div>
                <div className="p-2 bg-healthcare-scrubs-green/10 rounded-full">
                  <Calendar className="h-6 w-6 text-healthcare-scrubs-green" />
                </div>
              </div>
              <Progress value={completionPercentage} className="h-1 mt-4" />
              <p className="text-xs text-muted-foreground mt-2">
                {completedToday} of {totalToday} appointments completed
              </p>
            </CardContent>
          </Card>

          <Card className="card-doctor">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Patients Seen Today</p>
                  <h3 className="text-2xl font-bold text-healthcare-hospital-blue">{completedToday}</h3>
                </div>
                <div className="p-2 bg-healthcare-hospital-blue/10 rounded-full">
                  <Users className="h-6 w-6 text-healthcare-hospital-blue" />
                </div>
              </div>
              <Progress value={completionPercentage} className="h-1 mt-4" />
              <p className="text-xs text-muted-foreground mt-2">
                {completedToday} of {totalToday} appointments completed
              </p>
            </CardContent>
          </Card>

          <Card className="card-doctor">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending Tasks</p>
                  <h3 className="text-2xl font-bold text-healthcare-purple">{pendingTasks.length}</h3>
                </div>
                <div className="p-2 bg-healthcare-purple/10 rounded-full">
                  <ClipboardList className="h-6 w-6 text-healthcare-purple" />
                </div>
              </div>
              <div className="flex items-center justify-between mt-4">
                <Badge className="bg-healthcare-red/20 text-healthcare-red border-none">
                  High: {highPriorityTasks}
                </Badge>
                <Badge className="bg-healthcare-yellow/20 text-healthcare-yellow border-none">
                  Medium: {mediumPriorityTasks}
                </Badge>
                <Badge className="bg-healthcare-blue/20 text-healthcare-blue border-none">
                  Low: {lowPriorityTasks}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="card-doctor">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Prescriptions</p>
                  <h3 className="text-2xl font-bold text-healthcare-pill-orange">
                    {activePrescriptions + expiredPrescriptions}
                  </h3>
                </div>
                <div className="p-2 bg-healthcare-pill-orange/10 rounded-full">
                  <Pill className="h-6 w-6 text-healthcare-pill-orange" />
                </div>
              </div>
              <div className="flex items-center justify-between mt-4">
                <Badge className="bg-healthcare-green/20 text-healthcare-green border-none">
                  Active: {activePrescriptions}
                </Badge>
                <Badge className="bg-healthcare-blue/20 text-healthcare-blue border-none">
                  Expired: {expiredPrescriptions}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="appointments" className="mb-6">
          <TabsList className="mb-4">
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="patients">Recent Patients</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
          </TabsList>

          <TabsContent value="appointments">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Appointments</CardTitle>
                <CardDescription>Manage your scheduled appointments for today and tomorrow</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex items-center justify-between p-3 border rounded-lg card-hover"
                    >
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage
                            src={appointment.patientImage || "/placeholder.svg"}
                            alt={appointment.patientName}
                          />
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
                            <Calendar className="mr-1 h-3 w-3" />
                            <span>{appointment.date === todayDate ? "Today" : "Tomorrow"}</span>
                            <Clock className="ml-2 mr-1 h-3 w-3" />
                            <span>{appointment.time}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge
                          className={
                            appointment.status === "Confirmed"
                              ? "bg-healthcare-green/20 text-healthcare-green"
                              : appointment.status === "In Progress"
                                ? "bg-healthcare-purple/20 text-healthcare-purple"
                                : "bg-healthcare-yellow/20 text-healthcare-yellow"
                          }
                        >
                          {appointment.status}
                        </Badge>
                        {appointment.status === "Scheduled" || appointment.status === "Confirmed" ? (
                          <Button variant="outline" size="sm" onClick={() => handleStartAppointment(appointment.id)}>
                            Start
                          </Button>
                        ) : appointment.status === "In Progress" ? (
                          <Button variant="outline" size="sm" onClick={() => handleCompleteAppointment(appointment.id)}>
                            Complete
                          </Button>
                        ) : (
                          <Button variant="outline" size="sm" onClick={() => handleViewAppointmentDetails(appointment)}>
                            View
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                  {upcomingAppointments.length === 0 && (
                    <div className="text-center py-4 text-muted-foreground">No upcoming appointments</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="patients">
            <Card>
              <CardHeader>
                <CardTitle>Recent Patients</CardTitle>
                <CardDescription>Patients you&apos;ve seen recently</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentPatients.map((patient) => (
                    <div
                      key={patient.id}
                      className="flex items-center justify-between p-3 border rounded-lg card-hover"
                    >
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={patient.image || "/placeholder.svg"} alt={patient.name} />
                          <AvatarFallback>
                            {patient.name
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{patient.name}</p>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <span>Age: {patient.age}</span>
                            <span className="mx-2">•</span>
                            <span>
                              Last visit:{" "}
                              {patient.lastVisit === todayDate
                                ? "Today"
                                : patient.lastVisit === tomorrowDate
                                  ? "Tomorrow"
                                  : format(new Date(patient.lastVisit), "MMM d, yyyy")}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <Badge className="bg-healthcare-hospital-blue/20 text-healthcare-hospital-blue mb-1">
                          {patient.condition}
                        </Badge>
                        <Button variant="outline" size="sm" onClick={() => router.push("/doctor/patients")}>
                          View Records
                        </Button>
                      </div>
                    </div>
                  ))}
                  {recentPatients.length === 0 && (
                    <div className="text-center py-4 text-muted-foreground">No recent patients</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tasks">
            <Card>
              <CardHeader>
                <CardTitle>Pending Tasks</CardTitle>
                <CardDescription>Tasks that require your attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingTasks.slice(0, 5).map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg card-hover">
                      <div className="flex items-center space-x-3">
                        {task.priority === "high" ? (
                          <AlertCircle className="h-5 w-5 text-healthcare-red" />
                        ) : task.priority === "medium" ? (
                          <Activity className="h-5 w-5 text-healthcare-yellow" />
                        ) : (
                          <CheckCircle2 className="h-5 w-5 text-healthcare-blue" />
                        )}
                        <div>
                          <p className="font-medium">{task.task}</p>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <span>Due: {task.due}</span>
                            <span className="mx-2">•</span>
                            <Badge
                              className={
                                task.priority === "high"
                                  ? "bg-healthcare-red/20 text-healthcare-red"
                                  : task.priority === "medium"
                                    ? "bg-healthcare-yellow/20 text-healthcare-yellow"
                                    : "bg-healthcare-blue/20 text-healthcare-blue"
                              }
                            >
                              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleCompleteTask(task.id)}>
                          Complete
                        </Button>
                      </div>
                    </div>
                  ))}
                  {pendingTasks.length === 0 && (
                    <div className="text-center py-4 text-muted-foreground">No pending tasks</div>
                  )}
                  {pendingTasks.length > 5 && (
                    <div className="text-center">
                      <Button
                        variant="link"
                        className="text-healthcare-scrubs-green"
                        onClick={() => router.push("/doctor/tasks")}
                      >
                        View all {pendingTasks.length} tasks
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Appointment Details Dialog */}
      <Dialog open={isAppointmentDetailsOpen} onOpenChange={setIsAppointmentDetailsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Appointment Details</DialogTitle>
            <DialogDescription>View appointment information</DialogDescription>
          </DialogHeader>
          {selectedAppointment && (
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
                  <p className="text-sm font-medium text-muted-foreground">Date</p>
                  <p className="font-medium">{selectedAppointment.date}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Time</p>
                  <p className="font-medium">{selectedAppointment.time}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Type</p>
                  <p className="font-medium">{selectedAppointment.type}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Reason</p>
                  <p className="font-medium">{selectedAppointment.reason || "Not specified"}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DoctorLayout>
  )
}
