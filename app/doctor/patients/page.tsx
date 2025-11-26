"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, Filter, Plus, FileText, Pill, Activity, Calendar, ClipboardList } from "lucide-react"
import { DoctorLayout } from "@/components/doctor-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// Sample data with South Indian names
const patients = [
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
    lastVisit: "2023-05-15",
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
    lastVisit: "2023-05-15",
    condition: "Diabetes management",
    status: "Active",
    image: "/placeholder.svg?height=40&width=40",
    medicalHistory: [
      { date: "2023-05-15", diagnosis: "Type 2 Diabetes", treatment: "Adjusted medication dosage" },
      { date: "2023-02-28", diagnosis: "Diabetic Foot Exam", treatment: "No issues found" },
      { date: "2022-12-15", diagnosis: "Type 2 Diabetes", treatment: "Initial diagnosis, lifestyle changes" },
    ],
    prescriptions: [
      { date: "2023-05-15", medication: "Metformin", dosage: "1000mg twice daily", duration: "90 days" },
      { date: "2022-12-15", medication: "Metformin", dosage: "500mg twice daily", duration: "90 days" },
    ],
  },
  {
    id: "P10050",
    name: "Ananya Sharma",
    age: 32,
    gender: "Female",
    contact: "+91 43210 98765",
    email: "ananya.s@example.com",
    address: "333 River View, Delhi",
    bloodGroup: "A-",
    lastVisit: "2023-05-16",
    condition: "Chest pain",
    status: "Active",
    image: "/placeholder.svg?height=40&width=40",
    medicalHistory: [
      { date: "2023-05-16", diagnosis: "Anxiety", treatment: "Prescribed anti-anxiety medication" },
      { date: "2023-04-05", diagnosis: "Gastritis", treatment: "Prescribed antacids" },
    ],
    prescriptions: [
      { date: "2023-05-16", medication: "Alprazolam", dosage: "0.25mg as needed", duration: "14 days" },
      { date: "2023-04-05", medication: "Pantoprazole", dosage: "40mg once daily", duration: "30 days" },
    ],
  },
]

export default function DoctorPatientsPage() {
  const router = useRouter()
  const [doctor, setDoctor] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedPatient, setSelectedPatient] = useState<any>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("all")

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

  // Filter patients based on search term, status, and active tab
  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.condition.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || patient.status.toLowerCase() === statusFilter.toLowerCase()

    // For the "recent" tab, we could filter based on last visit date
    // This is a simplified example - in a real app, you'd use actual date comparison
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "recent" && patient.lastVisit >= "2023-05-01") ||
      (activeTab === "critical" && ["Diabetes management", "Chest pain", "Hypertension"].includes(patient.condition))

    return matchesSearch && matchesStatus && matchesTab
  })

  const handleViewDetails = (patient: any) => {
    setSelectedPatient(patient)
    setIsDetailsOpen(true)
  }

  return (
    <DoctorLayout>
      <div className="page-container">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="page-title text-healthcare-scrubs-green">Patients</h1>
            <p className="page-subtitle">Manage your patient records</p>
          </div>
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <Button className="btn-doctor">
              <Plus className="mr-2 h-4 w-4" />
              Add New Patient
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name, ID, condition, or email..."
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
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="all" className="mb-6" onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Patients</TabsTrigger>
            <TabsTrigger value="recent">Recent Patients</TabsTrigger>
            <TabsTrigger value="critical">Critical Conditions</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <Card>
              <CardHeader>
                <CardTitle>Patient Directory</CardTitle>
                <CardDescription>Complete list of all your patients</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredPatients.map((patient) => (
                    <PatientCard key={patient.id} patient={patient} onViewDetails={handleViewDetails} />
                  ))}
                  {filteredPatients.length === 0 && (
                    <div className="text-center py-4 text-muted-foreground">No patients found</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recent">
            <Card>
              <CardHeader>
                <CardTitle>Recent Patients</CardTitle>
                <CardDescription>Patients you've seen in the last 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredPatients.map((patient) => (
                    <PatientCard key={patient.id} patient={patient} onViewDetails={handleViewDetails} />
                  ))}
                  {filteredPatients.length === 0 && (
                    <div className="text-center py-4 text-muted-foreground">No recent patients found</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="critical">
            <Card>
              <CardHeader>
                <CardTitle>Critical Conditions</CardTitle>
                <CardDescription>Patients with conditions requiring close monitoring</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredPatients.map((patient) => (
                    <PatientCard key={patient.id} patient={patient} onViewDetails={handleViewDetails} />
                  ))}
                  {filteredPatients.length === 0 && (
                    <div className="text-center py-4 text-muted-foreground">
                      No patients with critical conditions found
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Patient Details Dialog */}
        {selectedPatient && (
          <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
            <DialogContent className="sm:max-w-[800px]">
              <DialogHeader>
                <DialogTitle>Patient Details</DialogTitle>
                <DialogDescription>Complete medical information for {selectedPatient.name}</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={selectedPatient.image || "/placeholder.svg"} alt={selectedPatient.name} />
                    <AvatarFallback>
                      {selectedPatient.name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-medium">{selectedPatient.name}</h3>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-muted-foreground">ID: {selectedPatient.id}</p>
                      <Badge className="bg-healthcare-blue/20 text-healthcare-blue">{selectedPatient.gender}</Badge>
                      <Badge className="bg-healthcare-purple/20 text-healthcare-purple">
                        {selectedPatient.age} years
                      </Badge>
                      <Badge className="bg-healthcare-red/20 text-healthcare-red">
                        Blood: {selectedPatient.bloodGroup}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Contact</p>
                    <p>{selectedPatient.contact}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p>{selectedPatient.email}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Address</p>
                    <p>{selectedPatient.address}</p>
                  </div>
                </div>

                <Tabs defaultValue="history" className="mt-4">
                  <TabsList>
                    <TabsTrigger value="history" className="flex items-center">
                      <FileText className="mr-2 h-4 w-4" />
                      Medical History
                    </TabsTrigger>
                    <TabsTrigger value="prescriptions" className="flex items-center">
                      <Pill className="mr-2 h-4 w-4" />
                      Prescriptions
                    </TabsTrigger>
                    <TabsTrigger value="vitals" className="flex items-center">
                      <Activity className="mr-2 h-4 w-4" />
                      Vitals
                    </TabsTrigger>
                    <TabsTrigger value="appointments" className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4" />
                      Appointments
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="history" className="mt-4">
                    <Card>
                      <CardContent className="p-4">
                        <h4 className="font-medium mb-2">Medical History</h4>
                        <div className="space-y-3">
                          {selectedPatient.medicalHistory.map((record: any, index: number) => (
                            <div key={index} className="border-b pb-2 last:border-0">
                              <div className="flex justify-between">
                                <p className="font-medium">{record.diagnosis}</p>
                                <p className="text-sm text-muted-foreground">{record.date}</p>
                              </div>
                              <p className="text-sm">{record.treatment}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-end">
                        <Button variant="outline" size="sm">
                          <Plus className="mr-2 h-4 w-4" />
                          Add Record
                        </Button>
                      </CardFooter>
                    </Card>
                  </TabsContent>

                  <TabsContent value="prescriptions" className="mt-4">
                    <Card>
                      <CardContent className="p-4">
                        <h4 className="font-medium mb-2">Prescriptions</h4>
                        <div className="space-y-3">
                          {selectedPatient.prescriptions.map((prescription: any, index: number) => (
                            <div key={index} className="border-b pb-2 last:border-0">
                              <div className="flex justify-between">
                                <p className="font-medium">{prescription.medication}</p>
                                <p className="text-sm text-muted-foreground">{prescription.date}</p>
                              </div>
                              <p className="text-sm">
                                {prescription.dosage} for {prescription.duration}
                              </p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-end">
                        <Button variant="outline" size="sm">
                          <Plus className="mr-2 h-4 w-4" />
                          Add Prescription
                        </Button>
                      </CardFooter>
                    </Card>
                  </TabsContent>

                  <TabsContent value="vitals" className="mt-4">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <ClipboardList className="h-12 w-12 mx-auto text-muted-foreground" />
                        <p className="mt-2">No vitals records available</p>
                      </CardContent>
                      <CardFooter className="flex justify-center">
                        <Button variant="outline" size="sm">
                          <Plus className="mr-2 h-4 w-4" />
                          Add Vitals
                        </Button>
                      </CardFooter>
                    </Card>
                  </TabsContent>

                  <TabsContent value="appointments" className="mt-4">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <Calendar className="h-12 w-12 mx-auto text-muted-foreground" />
                        <p className="mt-2">No appointment history available</p>
                      </CardContent>
                      <CardFooter className="flex justify-center">
                        <Button variant="outline" size="sm">
                          <Plus className="mr-2 h-4 w-4" />
                          Schedule Appointment
                        </Button>
                      </CardFooter>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
                  Close
                </Button>
                <Button className="btn-doctor">Edit Patient</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </DoctorLayout>
  )
}

function PatientCard({ patient, onViewDetails }: { patient: any; onViewDetails: (patient: any) => void }) {
  return (
    <div className="flex items-center justify-between p-3 border rounded-lg card-hover">
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
          <div className="flex items-center">
            <p className="font-medium">{patient.name}</p>
            <p className="text-xs text-muted-foreground ml-2">({patient.id})</p>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <span>{patient.age} years</span>
            <span className="mx-1">•</span>
            <span>{patient.gender}</span>
            <span className="mx-1">•</span>
            <span>Blood: {patient.bloodGroup}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Last visit: {patient.lastVisit}</p>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <Badge className="bg-healthcare-hospital-blue/20 text-healthcare-hospital-blue mb-1">{patient.condition}</Badge>
        <Button variant="outline" size="sm" onClick={() => onViewDetails(patient)}>
          View Records
        </Button>
      </div>
    </div>
  )
}
