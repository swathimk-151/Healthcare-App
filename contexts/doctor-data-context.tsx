"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Define types for our data
export interface Medication {
  name: string
  dosage: string
  frequency: string
  duration: string
}

export interface MedicalRecord {
  date: string
  diagnosis: string
  treatment: string
}

export interface Prescription {
  id: string
  patientName: string
  patientId: string
  patientImage: string
  date: string
  medications: Medication[]
  diagnosis: string
  notes: string
  status: "Active" | "Expired"
}

export interface Appointment {
  id: number
  patientName: string
  patientId: string
  patientImage: string
  date: string
  time: string
  type: string
  status: "Scheduled" | "Confirmed" | "In Progress" | "Completed" | "Cancelled"
  reason: string
  notes: string
}

export interface Patient {
  id: string
  name: string
  age: number
  gender: string
  contact: string
  email: string
  address: string
  bloodGroup: string
  lastVisit: string
  condition: string
  status: "Active" | "Inactive"
  image: string
  medicalHistory: MedicalRecord[]
  prescriptions: {
    date: string
    medication: string
    dosage: string
    duration: string
  }[]
}

export interface Task {
  id: number
  task: string
  priority: "high" | "medium" | "low"
  due: string
  completed: boolean
  patientId?: string
  appointmentId?: number
}

export interface Message {
  id: number
  patientId: string
  patientName: string
  patientImage: string
  content: string
  timestamp: string
  read: boolean
  sender: "patient" | "doctor"
}

interface DoctorDataContextType {
  appointments: Appointment[]
  patients: Patient[]
  prescriptions: Prescription[]
  tasks: Task[]
  messages: Message[]

  // Appointment methods
  addAppointment: (appointment: Omit<Appointment, "id">) => void
  updateAppointmentStatus: (id: number, status: Appointment["status"]) => void
  updateAppointmentNotes: (id: number, notes: string) => void

  // Patient methods
  addPatient: (patient: Omit<Patient, "id" | "medicalHistory" | "prescriptions">) => void
  addMedicalRecord: (patientId: string, record: MedicalRecord) => void

  // Prescription methods
  addPrescription: (prescription: Omit<Prescription, "id">) => void
  renewPrescription: (id: string) => void

  // Task methods
  addTask: (task: Omit<Task, "id" | "completed">) => void
  completeTask: (id: number) => void

  // Message methods
  addMessage: (message: Omit<Message, "id" | "timestamp" | "read">) => void
  markMessageAsRead: (id: number) => void
}

// Sample data
const sampleAppointments: Appointment[] = [
  {
    id: 1,
    patientName: "Rajesh Kumar",
    patientId: "P10045",
    patientImage: "/placeholder.svg?height=40&width=40",
    date: "2023-05-15",
    time: "09:00 AM",
    type: "Follow-up",
    status: "Completed",
    reason: "Blood pressure check",
    notes: "Patient's blood pressure has improved. Continue current medication.",
  },
  {
    id: 2,
    patientName: "Priya Venkatesh",
    patientId: "P10046",
    patientImage: "/placeholder.svg?height=40&width=40",
    date: "2023-05-15",
    time: "10:30 AM",
    type: "Consultation",
    status: "Completed",
    reason: "Migraine",
    notes: "Prescribed sumatriptan for acute attacks. Advised to keep a headache diary.",
  },
  {
    id: 3,
    patientName: "Karthik Rajan",
    patientId: "P10047",
    patientImage: "/placeholder.svg?height=40&width=40",
    date: "2023-05-15",
    time: "11:45 AM",
    type: "Check-up",
    status: "In Progress",
    reason: "Annual physical",
    notes: "",
  },
  {
    id: 4,
    patientName: "Lakshmi Narayanan",
    patientId: "P10048",
    patientImage: "/placeholder.svg?height=40&width=40",
    date: new Date().toISOString().split("T")[0],
    time: "02:15 PM",
    type: "Consultation",
    status: "Confirmed",
    reason: "Joint pain",
    notes: "",
  },
  {
    id: 5,
    patientName: "Vijay Prakash",
    patientId: "P10049",
    patientImage: "/placeholder.svg?height=40&width=40",
    date: new Date().toISOString().split("T")[0],
    time: "03:30 PM",
    type: "Follow-up",
    status: "Confirmed",
    reason: "Diabetes management",
    notes: "",
  },
  {
    id: 6,
    patientName: "Ananya Sharma",
    patientId: "P10050",
    patientImage: "/placeholder.svg?height=40&width=40",
    date: new Date(Date.now() + 86400000).toISOString().split("T")[0], // Tomorrow
    time: "09:00 AM",
    type: "Consultation",
    status: "Scheduled",
    reason: "Chest pain",
    notes: "",
  },
  {
    id: 7,
    patientName: "Deepak Verma",
    patientId: "P10051",
    patientImage: "/placeholder.svg?height=40&width=40",
    date: new Date(Date.now() + 86400000).toISOString().split("T")[0], // Tomorrow
    time: "10:30 AM",
    type: "Follow-up",
    status: "Scheduled",
    reason: "Hypertension follow-up",
    notes: "",
  },
]

const samplePatients: Patient[] = [
  {
    id: "P10045",
    name: "Rajesh Kumar",
    age: 42,
    gender: "Male",
    contact: "+91 98765 43210",
    email: "rajesh.kumar@example.com",
    address: "123 Main Street, Chennai",
    bloodGroup: "O+",
    lastVisit: "2023-05-15",
    condition: "Hypertension",
    status: "Active",
    image: "/placeholder.svg?height=40&width=40",
    medicalHistory: [
      { date: "2023-05-15", diagnosis: "Hypertension", treatment: "Prescribed Amlodipine 5mg" },
      { date: "2023-02-10", diagnosis: "Common Cold", treatment: "Prescribed antihistamines and rest" },
      { date: "2022-11-05", diagnosis: "Annual Check-up", treatment: "No issues found" },
    ],
    prescriptions: [
      { date: "2023-05-15", medication: "Amlodipine", dosage: "5mg once daily", duration: "30 days" },
      { date: "2023-02-10", medication: "Cetirizine", dosage: "10mg once daily", duration: "5 days" },
    ],
  },
  {
    id: "P10046",
    name: "Priya Venkatesh",
    age: 35,
    gender: "Female",
    contact: "+91 87654 32109",
    email: "priya.v@example.com",
    address: "456 Park Avenue, Bangalore",
    bloodGroup: "A+",
    lastVisit: "2023-05-15",
    condition: "Migraine",
    status: "Active",
    image: "/placeholder.svg?height=40&width=40",
    medicalHistory: [
      { date: "2023-05-15", diagnosis: "Migraine", treatment: "Prescribed Sumatriptan" },
      { date: "2023-03-22", diagnosis: "Allergic Rhinitis", treatment: "Prescribed nasal spray" },
    ],
    prescriptions: [
      { date: "2023-05-15", medication: "Sumatriptan", dosage: "50mg as needed", duration: "PRN" },
      { date: "2023-03-22", medication: "Fluticasone", dosage: "1 spray each nostril daily", duration: "30 days" },
    ],
  },
  {
    id: "P10047",
    name: "Karthik Rajan",
    age: 28,
    gender: "Male",
    contact: "+91 76543 21098",
    email: "karthik.r@example.com",
    address: "789 Lake View, Mumbai",
    bloodGroup: "B+",
    lastVisit: "2023-05-15",
    condition: "Annual physical",
    status: "Active",
    image: "/placeholder.svg?height=40&width=40",
    medicalHistory: [
      { date: "2023-05-15", diagnosis: "Annual Check-up", treatment: "No issues found" },
      { date: "2022-08-17", diagnosis: "Sprained Ankle", treatment: "RICE protocol, prescribed pain relievers" },
    ],
    prescriptions: [
      { date: "2022-08-17", medication: "Ibuprofen", dosage: "400mg three times daily", duration: "7 days" },
    ],
  },
  {
    id: "P10048",
    name: "Lakshmi Narayanan",
    age: 52,
    gender: "Female",
    contact: "+91 65432 10987",
    email: "lakshmi.n@example.com",
    address: "101 Temple Street, Coimbatore",
    bloodGroup: "AB-",
    lastVisit: new Date().toISOString().split("T")[0],
    condition: "Joint pain",
    status: "Active",
    image: "/placeholder.svg?height=40&width=40",
    medicalHistory: [
      { date: "2023-05-15", diagnosis: "Osteoarthritis", treatment: "Prescribed pain management" },
      { date: "2023-01-30", diagnosis: "Vitamin D Deficiency", treatment: "Prescribed supplements" },
    ],
    prescriptions: [
      { date: "2023-05-15", medication: "Acetaminophen", dosage: "500mg twice daily", duration: "14 days" },
      { date: "2023-01-30", medication: "Vitamin D3", dosage: "60,000 IU weekly", duration: "8 weeks" },
    ],
  },
  {
    id: "P10049",
    name: "Vijay Prakash",
    age: 45,
    gender: "Male",
    contact: "+91 54321 09876",
    email: "vijay.p@example.com",
    address: "222 Green Road, Hyderabad",
    bloodGroup: "O-",
    lastVisit: new Date().toISOString().split("T")[0],
    condition: "Diabetes management",
    status: "Active",
    image: "/placeholder.svg?height=40&width=40",
    medicalHistory: [
      {
        date: new Date().toISOString().split("T")[0],
        diagnosis: "Type 2 Diabetes",
        treatment: "Adjusted medication dosage",
      },
      { date: "2023-02-28", diagnosis: "Diabetic Foot Exam", treatment: "No issues found" },
      { date: "2022-12-15", diagnosis: "Type 2 Diabetes", treatment: "Initial diagnosis, lifestyle changes" },
    ],
    prescriptions: [
      {
        date: new Date().toISOString().split("T")[0],
        medication: "Metformin",
        dosage: "1000mg twice daily",
        duration: "90 days",
      },
      { date: "2022-12-15", medication: "Metformin", dosage: "500mg twice daily", duration: "90 days" },
    ],
  },
]

const samplePrescriptions: Prescription[] = [
  {
    id: "RX10001",
    patientName: "Rajesh Kumar",
    patientId: "P10045",
    patientImage: "/placeholder.svg?height=40&width=40",
    date: "2023-05-15",
    medications: [{ name: "Amlodipine", dosage: "5mg", frequency: "Once daily", duration: "30 days" }],
    diagnosis: "Hypertension",
    notes: "Take with or without food. Monitor blood pressure weekly.",
    status: "Active",
  },
  {
    id: "RX10002",
    patientName: "Priya Venkatesh",
    patientId: "P10046",
    patientImage: "/placeholder.svg?height=40&width=40",
    date: "2023-05-15",
    medications: [{ name: "Sumatriptan", dosage: "50mg", frequency: "As needed", duration: "PRN" }],
    diagnosis: "Migraine",
    notes: "Take at first sign of migraine. Do not exceed 200mg in 24 hours.",
    status: "Active",
  },
  {
    id: "RX10003",
    patientName: "Vijay Prakash",
    patientId: "P10049",
    patientImage: "/placeholder.svg?height=40&width=40",
    date: new Date().toISOString().split("T")[0],
    medications: [{ name: "Metformin", dosage: "1000mg", frequency: "Twice daily", duration: "90 days" }],
    diagnosis: "Type 2 Diabetes",
    notes: "Take with meals to reduce GI side effects. Monitor blood glucose regularly.",
    status: "Active",
  },
]

const sampleTasks: Task[] = [
  {
    id: 201,
    task: "Review lab results for Ananya Sharma",
    priority: "high",
    due: "Today",
    completed: false,
    patientId: "P10050",
  },
  {
    id: 202,
    task: "Complete medical certificate for Rajesh Kumar",
    priority: "medium",
    due: "Today",
    completed: false,
    patientId: "P10045",
  },
  {
    id: 203,
    task: "Update treatment plan for Priya Patel",
    priority: "medium",
    due: "Tomorrow",
    completed: false,
    patientId: "P10046",
  },
  { id: 204, task: "Sign prescription refills", priority: "low", due: "This week", completed: false },
]

const sampleMessages: Message[] = [
  {
    id: 1,
    patientId: "P10045",
    patientName: "Rajesh Kumar",
    patientImage: "/placeholder.svg?height=40&width=40",
    content:
      "Doctor, I've been taking the new medication for a week now and my blood pressure readings are much better.",
    timestamp: new Date(Date.now() - 30 * 60000).toISOString(), // 30 minutes ago
    read: false,
    sender: "patient",
  },
  {
    id: 2,
    patientId: "P10046",
    patientName: "Priya Venkatesh",
    patientImage: "/placeholder.svg?height=40&width=40",
    content: "I'm experiencing some side effects from the migraine medication. Can we discuss alternatives?",
    timestamp: new Date(Date.now() - 2 * 3600000).toISOString(), // 2 hours ago
    read: false,
    sender: "patient",
  },
  {
    id: 3,
    patientId: "P10050",
    patientName: "Ananya Sharma",
    patientImage: "/placeholder.svg?height=40&width=40",
    content: "Thank you for the quick appointment scheduling. I'll see you tomorrow.",
    timestamp: new Date(Date.now() - 5 * 3600000).toISOString(), // 5 hours ago
    read: true,
    sender: "patient",
  },
]

// Create the context
const DoctorDataContext = createContext<DoctorDataContextType | undefined>(undefined)

// Provider component
export function DoctorDataProvider({ children }: { children: ReactNode }) {
  const [appointments, setAppointments] = useState<Appointment[]>(sampleAppointments)
  const [patients, setPatients] = useState<Patient[]>(samplePatients)
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(samplePrescriptions)
  const [tasks, setTasks] = useState<Task[]>(sampleTasks)
  const [messages, setMessages] = useState<Message[]>(sampleMessages)

  // Load data from localStorage on initial render
  useEffect(() => {
    const storedAppointments = localStorage.getItem("doctorAppointments")
    const storedPatients = localStorage.getItem("doctorPatients")
    const storedPrescriptions = localStorage.getItem("doctorPrescriptions")
    const storedTasks = localStorage.getItem("doctorTasks")
    const storedMessages = localStorage.getItem("doctorMessages")

    if (storedAppointments) setAppointments(JSON.parse(storedAppointments))
    if (storedPatients) setPatients(JSON.parse(storedPatients))
    if (storedPrescriptions) setPrescriptions(JSON.parse(storedPrescriptions))
    if (storedTasks) setTasks(JSON.parse(storedTasks))
    if (storedMessages) setMessages(JSON.parse(storedMessages))
  }, [])

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("doctorAppointments", JSON.stringify(appointments))
    localStorage.setItem("doctorPatients", JSON.stringify(patients))
    localStorage.setItem("doctorPrescriptions", JSON.stringify(prescriptions))
    localStorage.setItem("doctorTasks", JSON.stringify(tasks))
    localStorage.setItem("doctorMessages", JSON.stringify(messages))
  }, [appointments, patients, prescriptions, tasks, messages])

  // Appointment methods
  const addAppointment = (appointment: Omit<Appointment, "id">) => {
    const newAppointment = {
      ...appointment,
      id: appointments.length > 0 ? Math.max(...appointments.map((a) => a.id)) + 1 : 1,
    }
    setAppointments((prev) => [...prev, newAppointment])

    // Update patient's last visit date if the appointment is for today
    if (appointment.date === new Date().toISOString().split("T")[0]) {
      setPatients((prev) =>
        prev.map((p) => (p.id === appointment.patientId ? { ...p, lastVisit: appointment.date } : p)),
      )
    }

    // Add a task for the doctor to prepare for the appointment
    addTask({
      task: `Prepare for ${appointment.patientName}'s ${appointment.type.toLowerCase()} appointment`,
      priority: "medium",
      due: appointment.date === new Date().toISOString().split("T")[0] ? "Today" : "Upcoming",
      patientId: appointment.patientId,
      appointmentId: newAppointment.id,
    })
  }

  const updateAppointmentStatus = (id: number, status: Appointment["status"]) => {
    setAppointments((prev) =>
      prev.map((appointment) => (appointment.id === id ? { ...appointment, status } : appointment)),
    )

    // If appointment is completed, update the patient's last visit date
    const appointment = appointments.find((a) => a.id === id)
    if (status === "Completed" && appointment) {
      setPatients((prev) =>
        prev.map((p) => (p.id === appointment.patientId ? { ...p, lastVisit: appointment.date } : p)),
      )

      // Complete any related tasks
      setTasks((prev) => prev.map((task) => (task.appointmentId === id ? { ...task, completed: true } : task)))
    }
  }

  const updateAppointmentNotes = (id: number, notes: string) => {
    setAppointments((prev) =>
      prev.map((appointment) => (appointment.id === id ? { ...appointment, notes } : appointment)),
    )
  }

  // Patient methods
  const addPatient = (patient: Omit<Patient, "id" | "medicalHistory" | "prescriptions">) => {
    const newPatient = {
      ...patient,
      id: `P${10000 + patients.length}`,
      medicalHistory: [],
      prescriptions: [],
    }
    setPatients((prev) => [...prev, newPatient])
  }

  const addMedicalRecord = (patientId: string, record: MedicalRecord) => {
    setPatients((prev) =>
      prev.map((patient) =>
        patient.id === patientId
          ? {
              ...patient,
              medicalHistory: [record, ...patient.medicalHistory],
              condition: record.diagnosis, // Update current condition
            }
          : patient,
      ),
    )
  }

  // Prescription methods
  const addPrescription = (prescription: Omit<Prescription, "id">) => {
    const newPrescription = {
      ...prescription,
      id: `RX${10000 + prescriptions.length}`,
    }
    setPrescriptions((prev) => [...prev, newPrescription])

    // Add to patient's prescription history
    const patient = patients.find((p) => p.id === prescription.patientId)
    if (patient) {
      setPatients((prev) =>
        prev.map((p) =>
          p.id === prescription.patientId
            ? {
                ...p,
                prescriptions: [
                  ...prescription.medications.map((med) => ({
                    date: prescription.date,
                    medication: med.name,
                    dosage: `${med.dosage} ${med.frequency}`,
                    duration: med.duration,
                  })),
                  ...p.prescriptions,
                ],
              }
            : p,
        ),
      )
    }

    // Complete any related tasks
    setTasks((prev) =>
      prev.map((task) =>
        task.task.includes("prescription") && task.patientId === prescription.patientId
          ? { ...task, completed: true }
          : task,
      ),
    )
  }

  const renewPrescription = (id: string) => {
    const prescription = prescriptions.find((p) => p.id === id)
    if (prescription) {
      const newPrescription = {
        ...prescription,
        id: `RX${10000 + prescriptions.length}`,
        date: new Date().toISOString().split("T")[0],
        status: "Active" as const,
      }
      setPrescriptions((prev) => [...prev, newPrescription])

      // Update the old prescription to expired if it's not already
      if (prescription.status !== "Expired") {
        setPrescriptions((prev) => prev.map((p) => (p.id === id ? { ...p, status: "Expired" as const } : p)))
      }

      // Add to patient's prescription history
      const patient = patients.find((p) => p.id === prescription.patientId)
      if (patient) {
        setPatients((prev) =>
          prev.map((p) =>
            p.id === prescription.patientId
              ? {
                  ...p,
                  prescriptions: [
                    ...prescription.medications.map((med) => ({
                      date: newPrescription.date,
                      medication: med.name,
                      dosage: `${med.dosage} ${med.frequency}`,
                      duration: med.duration,
                    })),
                    ...p.prescriptions,
                  ],
                }
              : p,
          ),
        )
      }
    }
  }

  // Task methods
  const addTask = (task: Omit<Task, "id" | "completed">) => {
    const newTask = {
      ...task,
      id: tasks.length > 0 ? Math.max(...tasks.map((t) => t.id)) + 1 : 1,
      completed: false,
    }
    setTasks((prev) => [...prev, newTask])
  }

  const completeTask = (id: number) => {
    setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, completed: true } : task)))
  }

  // Message methods
  const addMessage = (message: Omit<Message, "id" | "timestamp" | "read">) => {
    const newMessage = {
      ...message,
      id: messages.length > 0 ? Math.max(...messages.map((m) => m.id)) + 1 : 1,
      timestamp: new Date().toISOString(),
      read: false,
    }
    setMessages((prev) => [...prev, newMessage])
  }

  const markMessageAsRead = (id: number) => {
    setMessages((prev) => prev.map((message) => (message.id === id ? { ...message, read: true } : message)))
  }

  const value = {
    appointments,
    patients,
    prescriptions,
    tasks,
    messages,
    addAppointment,
    updateAppointmentStatus,
    updateAppointmentNotes,
    addPatient,
    addMedicalRecord,
    addPrescription,
    renewPrescription,
    addTask,
    completeTask,
    addMessage,
    markMessageAsRead,
  }

  return <DoctorDataContext.Provider value={value}>{children}</DoctorDataContext.Provider>
}

// Custom hook to use the context
export function useDoctorData() {
  const context = useContext(DoctorDataContext)
  if (context === undefined) {
    throw new Error("useDoctorData must be used within a DoctorDataProvider")
  }
  return context
}
