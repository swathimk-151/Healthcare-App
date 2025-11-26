"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, Filter, Plus, Pill, Calendar, Download } from "lucide-react"
import { DoctorLayout } from "@/components/doctor-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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

// Sample data
const prescriptions = [
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
    date: "2023-05-15",
    medications: [{ name: "Metformin", dosage: "1000mg", frequency: "Twice daily", duration: "90 days" }],
    diagnosis: "Type 2 Diabetes",
    notes: "Take with meals to reduce GI side effects. Monitor blood glucose regularly.",
    status: "Active",
  },
  {
    id: "RX10004",
    patientName: "Lakshmi Narayanan",
    patientId: "P10048",
    patientImage: "/placeholder.svg?height=40&width=40",
    date: "2023-05-15",
    medications: [{ name: "Acetaminophen", dosage: "500mg", frequency: "Twice daily", duration: "14 days" }],
    diagnosis: "Osteoarthritis",
    notes: "Take for pain as needed. Do not exceed 4000mg in 24 hours.",
    status: "Active",
  },
  {
    id: "RX10005",
    patientName: "Ananya Sharma",
    patientId: "P10050",
    patientImage: "/placeholder.svg?height=40&width=40",
    date: "2023-05-16",
    medications: [{ name: "Alprazolam", dosage: "0.25mg", frequency: "As needed", duration: "14 days" }],
    diagnosis: "Anxiety",
    notes: "Take as needed for anxiety. May cause drowsiness.",
    status: "Active",
  },
  {
    id: "RX10006",
    patientName: "Deepak Verma",
    patientId: "P10051",
    patientImage: "/placeholder.svg?height=40&width=40",
    date: "2023-02-28",
    medications: [{ name: "Lisinopril", dosage: "10mg", frequency: "Once daily", duration: "90 days" }],
    diagnosis: "Hypertension",
    notes: "Take in the morning. May cause dizziness initially.",
    status: "Expired",
  },
  {
    id: "RX10007",
    patientName: "Meena Sundaram",
    patientId: "P10052",
    patientImage: "/placeholder.svg?height=40&width=40",
    date: "2023-03-15",
    medications: [
      { name: "Metformin", dosage: "500mg", frequency: "Twice daily", duration: "90 days" },
      { name: "Glimepiride", dosage: "2mg", frequency: "Once daily", duration: "90 days" },
    ],
    diagnosis: "Type 2 Diabetes",
    notes: "Take Metformin with meals. Take Glimepiride with breakfast.",
    status: "Expired",
  },
]

// Sample patients for dropdown
const patients = [
  { id: "P10045", name: "Rajesh Kumar" },
  { id: "P10046", name: "Priya Venkatesh" },
  { id: "P10047", name: "Karthik Rajan" },
  { id: "P10048", name: "Lakshmi Narayanan" },
  { id: "P10049", name: "Vijay Prakash" },
  { id: "P10050", name: "Ananya Sharma" },
  { id: "P10051", name: "Deepak Verma" },
  { id: "P10052", name: "Meena Sundaram" },
]

// Sample medications for dropdown
const medications = [
  "Amlodipine",
  "Metformin",
  "Lisinopril",
  "Atorvastatin",
  "Levothyroxine",
  "Omeprazole",
  "Albuterol",
  "Acetaminophen",
  "Ibuprofen",
  "Amoxicillin",
  "Alprazolam",
  "Sumatriptan",
  "Glimepiride",
]

export default function DoctorPrescriptionsPage() {
  const router = useRouter()
  const [doctor, setDoctor] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedPrescription, setSelectedPrescription] = useState<any>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isNewPrescriptionOpen, setIsNewPrescriptionOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("active")

  // New prescription form state
  const [newPrescription, setNewPrescription] = useState({
    patientId: "",
    diagnosis: "",
    notes: "",
    medications: [{ name: "", dosage: "", frequency: "", duration: "" }],
  })

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

  // Filter prescriptions based on search term, status, and active tab
  const filteredPrescriptions = prescriptions.filter((prescription) => {
    const matchesSearch =
      prescription.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.medications.some((med) => med.name.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = statusFilter === "all" || prescription.status.toLowerCase() === statusFilter.toLowerCase()

    const matchesTab =
      (activeTab === "active" && prescription.status === "Active") ||
      (activeTab === "expired" && prescription.status === "Expired") ||
      activeTab === "all"

    return matchesSearch && matchesStatus && matchesTab
  })

  const handleViewDetails = (prescription: any) => {
    setSelectedPrescription(prescription)
    setIsDetailsOpen(true)
  }

  const handleAddMedication = () => {
    setNewPrescription({
      ...newPrescription,
      medications: [...newPrescription.medications, { name: "", dosage: "", frequency: "", duration: "" }],
    })
  }

  const handleRemoveMedication = (index: number) => {
    const updatedMedications = [...newPrescription.medications]
    updatedMedications.splice(index, 1)
    setNewPrescription({
      ...newPrescription,
      medications: updatedMedications,
    })
  }

  const handleMedicationChange = (index: number, field: string, value: string) => {
    const updatedMedications = [...newPrescription.medications]
    updatedMedications[index] = {
      ...updatedMedications[index],
      [field]: value,
    }
    setNewPrescription({
      ...newPrescription,
      medications: updatedMedications,
    })
  }

  const handleCreatePrescription = () => {
    // In a real app, this would add to the database
    console.log("Creating new prescription:", newPrescription)
    setIsNewPrescriptionOpen(false)
    // Reset form
    setNewPrescription({
      patientId: "",
      diagnosis: "",
      notes: "",
      medications: [{ name: "", dosage: "", frequency: "", duration: "" }],
    })
  }

  return (
    <DoctorLayout>
      <div className="page-container">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="page-title text-healthcare-scrubs-green">Prescriptions</h1>
            <p className="page-subtitle">Manage patient prescriptions</p>
          </div>
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <Dialog open={isNewPrescriptionOpen} onOpenChange={setIsNewPrescriptionOpen}>
              <DialogTrigger asChild>
                <Button className="btn-doctor">
                  <Plus className="mr-2 h-4 w-4" />
                  New Prescription
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Create New Prescription</DialogTitle>
                  <DialogDescription>Prescribe medication for a patient</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="patientId" className="text-right">
                      Patient
                    </Label>
                    <Select
                      value={newPrescription.patientId}
                      onValueChange={(value) => setNewPrescription({ ...newPrescription, patientId: value })}
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
                    <Label htmlFor="diagnosis" className="text-right">
                      Diagnosis
                    </Label>
                    <Input
                      id="diagnosis"
                      value={newPrescription.diagnosis}
                      onChange={(e) => setNewPrescription({ ...newPrescription, diagnosis: e.target.value })}
                      className="col-span-3"
                    />
                  </div>

                  <div className="col-span-4">
                    <div className="flex items-center justify-between mb-2">
                      <Label>Medications</Label>
                      <Button type="button" variant="outline" size="sm" onClick={handleAddMedication}>
                        <Plus className="h-4 w-4 mr-1" /> Add Medication
                      </Button>
                    </div>

                    {newPrescription.medications.map((medication, index) => (
                      <div key={index} className="grid grid-cols-12 gap-2 mb-3 items-center">
                        <div className="col-span-3">
                          <Select
                            value={medication.name}
                            onValueChange={(value) => handleMedicationChange(index, "name", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Medication" />
                            </SelectTrigger>
                            <SelectContent>
                              {medications.map((med) => (
                                <SelectItem key={med} value={med}>
                                  {med}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="col-span-2">
                          <Input
                            placeholder="Dosage"
                            value={medication.dosage}
                            onChange={(e) => handleMedicationChange(index, "dosage", e.target.value)}
                          />
                        </div>
                        <div className="col-span-3">
                          <Select
                            value={medication.frequency}
                            onValueChange={(value) => handleMedicationChange(index, "frequency", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Frequency" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Once daily">Once daily</SelectItem>
                              <SelectItem value="Twice daily">Twice daily</SelectItem>
                              <SelectItem value="Three times daily">Three times daily</SelectItem>
                              <SelectItem value="Four times daily">Four times daily</SelectItem>
                              <SelectItem value="Every morning">Every morning</SelectItem>
                              <SelectItem value="Every night">Every night</SelectItem>
                              <SelectItem value="As needed">As needed</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="col-span-3">
                          <Select
                            value={medication.duration}
                            onValueChange={(value) => handleMedicationChange(index, "duration", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Duration" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="7 days">7 days</SelectItem>
                              <SelectItem value="14 days">14 days</SelectItem>
                              <SelectItem value="30 days">30 days</SelectItem>
                              <SelectItem value="60 days">60 days</SelectItem>
                              <SelectItem value="90 days">90 days</SelectItem>
                              <SelectItem value="PRN">PRN (as needed)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="col-span-1">
                          {index > 0 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveMedication(index)}
                              className="text-healthcare-red"
                            >
                              ✕
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label htmlFor="notes" className="text-right pt-2">
                      Notes
                    </Label>
                    <Textarea
                      id="notes"
                      value={newPrescription.notes}
                      onChange={(e) => setNewPrescription({ ...newPrescription, notes: e.target.value })}
                      className="col-span-3"
                      placeholder="Special instructions or notes for the patient"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsNewPrescriptionOpen(false)}>
                    Cancel
                  </Button>
                  <Button className="btn-doctor" onClick={handleCreatePrescription}>
                    Create Prescription
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
              placeholder="Search by patient name, ID, medication, or diagnosis..."
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
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="active" className="mb-6" onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="active">Active Prescriptions</TabsTrigger>
            <TabsTrigger value="expired">Expired Prescriptions</TabsTrigger>
            <TabsTrigger value="all">All Prescriptions</TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            <Card>
              <CardHeader>
                <CardTitle>Active Prescriptions</CardTitle>
                <CardDescription>Currently active prescriptions for your patients</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredPrescriptions.map((prescription) => (
                    <PrescriptionCard
                      key={prescription.id}
                      prescription={prescription}
                      onViewDetails={handleViewDetails}
                    />
                  ))}
                  {filteredPrescriptions.length === 0 && (
                    <div className="text-center py-4 text-muted-foreground">No active prescriptions found</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="expired">
            <Card>
              <CardHeader>
                <CardTitle>Expired Prescriptions</CardTitle>
                <CardDescription>Past prescriptions that are no longer active</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredPrescriptions.map((prescription) => (
                    <PrescriptionCard
                      key={prescription.id}
                      prescription={prescription}
                      onViewDetails={handleViewDetails}
                    />
                  ))}
                  {filteredPrescriptions.length === 0 && (
                    <div className="text-center py-4 text-muted-foreground">No expired prescriptions found</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="all">
            <Card>
              <CardHeader>
                <CardTitle>All Prescriptions</CardTitle>
                <CardDescription>Complete prescription history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredPrescriptions.map((prescription) => (
                    <PrescriptionCard
                      key={prescription.id}
                      prescription={prescription}
                      onViewDetails={handleViewDetails}
                    />
                  ))}
                  {filteredPrescriptions.length === 0 && (
                    <div className="text-center py-4 text-muted-foreground">No prescriptions found</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Prescription Details Dialog */}
        {selectedPrescription && (
          <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Prescription Details</DialogTitle>
                <DialogDescription>Prescription #{selectedPrescription.id}</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={selectedPrescription.patientImage || "/placeholder.svg"}
                      alt={selectedPrescription.patientName}
                    />
                    <AvatarFallback>
                      {selectedPrescription.patientName
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{selectedPrescription.patientName}</h3>
                    <p className="text-sm text-muted-foreground">Patient ID: {selectedPrescription.patientId}</p>
                  </div>
                  <Badge
                    className={
                      selectedPrescription.status === "Active"
                        ? "bg-healthcare-green/20 text-healthcare-green ml-auto"
                        : "bg-healthcare-red/20 text-healthcare-red ml-auto"
                    }
                  >
                    {selectedPrescription.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Date Prescribed</Label>
                    <p className="font-medium">{selectedPrescription.date}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Diagnosis</Label>
                    <p className="font-medium">{selectedPrescription.diagnosis}</p>
                  </div>
                </div>

                <div>
                  <Label className="text-muted-foreground mb-2 block">Medications</Label>
                  <div className="space-y-2">
                    {selectedPrescription.medications.map((medication: any, index: number) => (
                      <div key={index} className="border rounded-md p-3">
                        <div className="flex items-center">
                          <Pill className="h-4 w-4 mr-2 text-healthcare-pill-orange" />
                          <p className="font-medium">
                            {medication.name} {medication.dosage}
                          </p>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {medication.frequency} for {medication.duration}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-muted-foreground">Notes</Label>
                  <div className="border rounded-md p-3 mt-1">{selectedPrescription.notes || "No notes available"}</div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
                  Close
                </Button>
                <Button variant="outline" className="border-healthcare-blue text-healthcare-blue">
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </Button>
                <Button className="btn-doctor">Renew Prescription</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </DoctorLayout>
  )
}

function PrescriptionCard({
  prescription,
  onViewDetails,
}: { prescription: any; onViewDetails: (prescription: any) => void }) {
  return (
    <div className="flex items-center justify-between p-3 border rounded-lg card-hover">
      <div className="flex items-center space-x-3">
        <Avatar>
          <AvatarImage src={prescription.patientImage || "/placeholder.svg"} alt={prescription.patientName} />
          <AvatarFallback>
            {prescription.patientName
              .split(" ")
              .map((n: string) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="flex items-center">
            <p className="font-medium">{prescription.patientName}</p>
            <p className="text-xs text-muted-foreground ml-2">({prescription.patientId})</p>
          </div>
          <div className="flex items-center text-sm">
            <Pill className="h-3 w-3 mr-1 text-healthcare-pill-orange" />
            <span className="font-medium text-healthcare-pill-orange">
              {prescription.medications.map((m: any) => m.name).join(", ")}
            </span>
          </div>
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            <Calendar className="h-3 w-3 mr-1" />
            <span>{prescription.date}</span>
            <span className="mx-1">•</span>
            <span>{prescription.diagnosis}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Badge
          className={
            prescription.status === "Active"
              ? "bg-healthcare-green/20 text-healthcare-green"
              : "bg-healthcare-red/20 text-healthcare-red"
          }
        >
          {prescription.status}
        </Badge>
        <Button variant="outline" size="sm" onClick={() => onViewDetails(prescription)}>
          View
        </Button>
      </div>
    </div>
  )
}
