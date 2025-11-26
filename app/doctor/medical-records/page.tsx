"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, Filter, Plus, FileText, Download, Eye, Calendar, User } from "lucide-react"
import { DoctorLayout } from "@/components/doctor-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useDoctorData } from "@/contexts/doctor-data-context"
import { format } from "date-fns"

export default function DoctorMedicalRecordsPage() {
  const router = useRouter()
  const [doctor, setDoctor] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [recordTypeFilter, setRecordTypeFilter] = useState("all")
  const [selectedRecord, setSelectedRecord] = useState<any>(null)
  const [isViewRecordOpen, setIsViewRecordOpen] = useState(false)

  const { patients } = useDoctorData()

  // Mock medical records data
  const [medicalRecords, setMedicalRecords] = useState([
    {
      id: "rec-001",
      patientId: "pat-001",
      patientName: "John Smith",
      patientImage: "/placeholder.svg?height=40&width=40",
      recordType: "Lab Results",
      date: "2023-05-15",
      title: "Blood Test Results",
      description: "Complete blood count and metabolic panel",
      content: "WBC: 7.2, RBC: 4.8, Hemoglobin: 14.2, Hematocrit: 42%, Platelets: 250,000",
      doctor: "Dr. Sarah Johnson",
    },
    {
      id: "rec-002",
      patientId: "pat-002",
      patientName: "Emily Davis",
      patientImage: "/placeholder.svg?height=40&width=40",
      recordType: "Diagnosis",
      date: "2023-05-10",
      title: "Initial Consultation",
      description: "Patient presented with symptoms of seasonal allergies",
      content: "Patient reports sneezing, runny nose, and itchy eyes for the past week. Prescribed antihistamine.",
      doctor: "Dr. Sarah Johnson",
    },
    {
      id: "rec-003",
      patientId: "pat-003",
      patientName: "Michael Brown",
      patientImage: "/placeholder.svg?height=40&width=40",
      recordType: "Imaging",
      date: "2023-05-08",
      title: "Chest X-Ray",
      description: "Routine chest X-ray for annual checkup",
      content: "No abnormalities detected. Lungs clear. Heart size normal.",
      doctor: "Dr. Sarah Johnson",
    },
    {
      id: "rec-004",
      patientId: "pat-001",
      patientName: "John Smith",
      patientImage: "/placeholder.svg?height=40&width=40",
      recordType: "Prescription",
      date: "2023-05-01",
      title: "Medication Renewal",
      description: "Renewal of hypertension medication",
      content: "Lisinopril 10mg, once daily. 30-day supply with 3 refills.",
      doctor: "Dr. Sarah Johnson",
    },
    {
      id: "rec-005",
      patientId: "pat-004",
      patientName: "Sarah Wilson",
      patientImage: "/placeholder.svg?height=40&width=40",
      recordType: "Surgery",
      date: "2023-04-20",
      title: "Appendectomy Report",
      description: "Laparoscopic appendectomy procedure",
      content: "Procedure performed without complications. Patient recovered well post-op.",
      doctor: "Dr. Sarah Johnson",
    },
  ])

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

  // Filter records based on search term and record type
  const filteredRecords = medicalRecords.filter((record) => {
    const matchesSearch =
      record.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = recordTypeFilter === "all" || record.recordType.toLowerCase() === recordTypeFilter.toLowerCase()

    return matchesSearch && matchesType
  })

  const handleViewRecord = (record: any) => {
    setSelectedRecord(record)
    setIsViewRecordOpen(true)
  }

  const getRecordTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "lab results":
        return <FileText className="h-5 w-5 text-healthcare-blue" />
      case "diagnosis":
        return <FileText className="h-5 w-5 text-healthcare-green" />
      case "imaging":
        return <FileText className="h-5 w-5 text-healthcare-purple" />
      case "prescription":
        return <FileText className="h-5 w-5 text-healthcare-pill-orange" />
      case "surgery":
        return <FileText className="h-5 w-5 text-healthcare-red" />
      default:
        return <FileText className="h-5 w-5 text-healthcare-blue" />
    }
  }

  const getRecordTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "lab results":
        return "bg-healthcare-blue/20 text-healthcare-blue"
      case "diagnosis":
        return "bg-healthcare-green/20 text-healthcare-green"
      case "imaging":
        return "bg-healthcare-purple/20 text-healthcare-purple"
      case "prescription":
        return "bg-healthcare-pill-orange/20 text-healthcare-pill-orange"
      case "surgery":
        return "bg-healthcare-red/20 text-healthcare-red"
      default:
        return "bg-healthcare-blue/20 text-healthcare-blue"
    }
  }

  return (
    <DoctorLayout>
      <div className="page-container">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="page-title text-healthcare-scrubs-green">Medical Records</h1>
            <p className="page-subtitle">View and manage patient medical records</p>
          </div>
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="btn-doctor">
                  <Plus className="mr-2 h-4 w-4" />
                  New Record
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Create New Medical Record</DialogTitle>
                  <DialogDescription>Add a new medical record for a patient</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  {/* Form fields would go here */}
                  <p className="text-center text-muted-foreground">Record creation form would go here</p>
                </div>
                <DialogFooter>
                  <Button variant="outline">Cancel</Button>
                  <Button className="btn-doctor">Create Record</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search records by patient name, title, or description..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Select value={recordTypeFilter} onValueChange={setRecordTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Record Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Record Types</SelectItem>
                <SelectItem value="lab results">Lab Results</SelectItem>
                <SelectItem value="diagnosis">Diagnosis</SelectItem>
                <SelectItem value="imaging">Imaging</SelectItem>
                <SelectItem value="prescription">Prescription</SelectItem>
                <SelectItem value="surgery">Surgery</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="all" className="mb-6">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Records</TabsTrigger>
            <TabsTrigger value="recent">Recent Records</TabsTrigger>
            <TabsTrigger value="by-patient">By Patient</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <Card>
              <CardHeader>
                <CardTitle>All Medical Records</CardTitle>
                <CardDescription>Complete list of patient medical records</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredRecords.map((record) => (
                    <div
                      key={record.id}
                      className="flex items-center justify-between p-3 border rounded-lg card-hover"
                    >
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={record.patientImage || "/placeholder.svg"} alt={record.patientName} />
                          <AvatarFallback>
                            {record.patientName
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{record.title}</p>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <User className="mr-1 h-3 w-3" />
                            <span>{record.patientName}</span>
                            <span className="mx-1">•</span>
                            <Calendar className="mr-1 h-3 w-3" />
                            <span>{format(new Date(record.date), "MMM d, yyyy")}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{record.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getRecordTypeColor(record.recordType)}>{record.recordType}</Badge>
                        <Button variant="outline" size="sm" onClick={() => handleViewRecord(record)}>
                          <Eye className="mr-1 h-3 w-3" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="mr-1 h-3 w-3" />
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                  {filteredRecords.length === 0 && (
                    <div className="text-center py-4 text-muted-foreground">No records found</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recent">
            <Card>
              <CardHeader>
                <CardTitle>Recent Records</CardTitle>
                <CardDescription>Records from the past 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredRecords
                    .filter((record) => {
                      const recordDate = new Date(record.date)
                      const thirtyDaysAgo = new Date()
                      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
                      return recordDate >= thirtyDaysAgo
                    })
                    .map((record) => (
                      <div
                        key={record.id}
                        className="flex items-center justify-between p-3 border rounded-lg card-hover"
                      >
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage src={record.patientImage || "/placeholder.svg"} alt={record.patientName} />
                            <AvatarFallback>
                              {record.patientName
                                .split(" ")
                                .map((n: string) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{record.title}</p>
                            <div className="flex items-\
