"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export type AppointmentStatus =
  | "Scheduled"
  | "Confirmed"
  | "In Progress"
  | "Completed"
  | "Cancelled"
  | "Rescheduled"
  | "Upcoming"
export type AppointmentType = "In-person" | "Video Call" | "Follow-up" | "Consultation" | "Check-up"

export interface Appointment {
  id: string
  patientId: string
  patientName: string
  doctorId: string
  doctorName: string
  doctorSpecialty: string
  doctorImage: string
  date: string
  time: string
  type: AppointmentType
  status: AppointmentStatus
  reason: string
  notes: string
  image?: string
}

interface AppointmentsContextType {
  appointments: Appointment[]
  addAppointment: (appointment: Omit<Appointment, "id">) => void
  updateAppointment: (id: string, updates: Partial<Appointment>) => void
  deleteAppointment: (id: string) => void
  getPatientAppointments: (patientId: string) => Appointment[]
  getDoctorAppointments: (doctorId: string) => Appointment[]
}

// Sample appointments data
const sampleAppointments: Appointment[] = [
  {
    id: "apt1",
    patientId: "P1001",
    patientName: "Rajesh Kumar",
    doctorId: "D1001",
    doctorName: "Dr. Priya Sharma",
    doctorSpecialty: "Cardiologist",
    doctorImage: "/placeholder.svg?height=60&width=60",
    date: "2023-05-20",
    time: "10:00 AM",
    type: "In-person",
    status: "Upcoming",
    reason: "Annual heart checkup",
    notes: "",
  },
  {
    id: "apt2",
    patientId: "P1001",
    patientName: "Rajesh Kumar",
    doctorId: "D1002",
    doctorName: "Dr. Vikram Patel",
    doctorSpecialty: "Neurologist",
    doctorImage: "/placeholder.svg?height=60&width=60",
    date: "2023-05-15",
    time: "2:30 PM",
    type: "Video Call",
    status: "Completed",
    reason: "Headache consultation",
    notes: "Patient reported frequent migraines. Prescribed sumatriptan and recommended keeping a headache diary.",
  },
  {
    id: "apt3",
    patientId: "P1002",
    patientName: "Ananya Desai",
    doctorId: "D1001",
    doctorName: "Dr. Priya Sharma",
    doctorSpecialty: "Cardiologist",
    doctorImage: "/placeholder.svg?height=60&width=60",
    date: "2023-05-22",
    time: "11:15 AM",
    type: "In-person",
    status: "Scheduled",
    reason: "Blood pressure check",
    notes: "",
  },
]

const AppointmentsContext = createContext<AppointmentsContextType | undefined>(undefined)

export function AppointmentsProvider({ children }: { children: ReactNode }) {
  const [appointments, setAppointments] = useState<Appointment[]>(sampleAppointments)
  const [isClient, setIsClient] = useState(false)

  // Set isClient to true once the component is mounted
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Load appointments from localStorage on initial render
  useEffect(() => {
    if (isClient) {
      const storedAppointments = localStorage.getItem("appointments")
      if (storedAppointments) {
        try {
          setAppointments(JSON.parse(storedAppointments))
        } catch (e) {
          console.error("Failed to parse stored appointments:", e)
        }
      }
    }
  }, [isClient])

  // Save appointments to localStorage whenever they change
  useEffect(() => {
    if (isClient) {
      localStorage.setItem("appointments", JSON.stringify(appointments))
    }
  }, [appointments, isClient])

  const addAppointment = (appointment: Omit<Appointment, "id">) => {
    const newAppointment = {
      ...appointment,
      id: `apt${Date.now()}`,
    }
    setAppointments((prev) => [...prev, newAppointment])
  }

  const updateAppointment = (id: string, updates: Partial<Appointment>) => {
    setAppointments((prev) =>
      prev.map((appointment) => (appointment.id === id ? { ...appointment, ...updates } : appointment)),
    )
  }

  const deleteAppointment = (id: string) => {
    setAppointments((prev) => prev.filter((appointment) => appointment.id !== id))
  }

  const getPatientAppointments = (patientId: string) => {
    return appointments.filter((appointment) => appointment.patientId === patientId)
  }

  const getDoctorAppointments = (doctorId: string) => {
    return appointments.filter((appointment) => appointment.doctorId === doctorId)
  }

  return (
    <AppointmentsContext.Provider
      value={{
        appointments,
        addAppointment,
        updateAppointment,
        deleteAppointment,
        getPatientAppointments,
        getDoctorAppointments,
      }}
    >
      {children}
    </AppointmentsContext.Provider>
  )
}

export function useAppointments() {
  const context = useContext(AppointmentsContext)
  if (context === undefined) {
    throw new Error("useAppointments must be used within an AppointmentsProvider")
  }
  return context
}
