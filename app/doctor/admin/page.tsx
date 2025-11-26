"use client"

import { useState } from "react"
import { DoctorLayout } from "@/components/doctor-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { PlusCircle, Pencil, Trash2, Search } from "lucide-react"

export default function DoctorAdminPage() {
  const [activeTab, setActiveTab] = useState("patients")
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)

  // Sample data
  const [patients, setPatients] = useState([
    { id: 1, name: "Rahul Sharma", age: 45, gender: "Male", condition: "Hypertension", lastVisit: "2023-04-15" },
    { id: 2, name: "Priya Patel", age: 32, gender: "Female", condition: "Diabetes", lastVisit: "2023-04-10" },
    { id: 3, name: "Amit Kumar", age: 28, gender: "Male", condition: "Asthma", lastVisit: "2023-04-05" },
    { id: 4, name: "Sneha Gupta", age: 35, gender: "Female", condition: "Arthritis", lastVisit: "2023-03-28" },
    {
      id: 5,
      name: "Vikram Singh",
      age: 50,
      gender: "Male",
      condition: "Coronary Artery Disease",
      lastVisit: "2023-03-20",
    },
  ])

  const [prescriptions, setPrescriptions] = useState([
    {
      id: 1,
      patientName: "Rahul Sharma",
      medication: "Lisinopril 10mg",
      dosage: "Once daily",
      duration: "30 days",
      date: "2023-04-15",
    },
    {
      id: 2,
      patientName: "Priya Patel",
      medication: "Metformin 500mg",
      dosage: "Twice daily",
      duration: "90 days",
      date: "2023-04-10",
    },
    {
      id: 3,
      patientName: "Amit Kumar",
      medication: "Albuterol Inhaler",
      dosage: "As needed",
      duration: "30 days",
      date: "2023-04-05",
    },
    {
      id: 4,
      patientName: "Sneha Gupta",
      medication: "Ibuprofen 400mg",
      dosage: "Three times daily",
      duration: "14 days",
      date: "2023-03-28",
    },
    {
      id: 5,
      patientName: "Vikram Singh",
      medication: "Atorvastatin 20mg",
      dosage: "Once daily",
      duration: "90 days",
      date: "2023-03-20",
    },
  ])

  const [appointments, setAppointments] = useState([
    {
      id: 1,
      patientName: "Rahul Sharma",
      date: "2023-05-15",
      time: "10:00 AM",
      status: "Scheduled",
      type: "Follow-up",
    },
    {
      id: 2,
      patientName: "Priya Patel",
      date: "2023-05-12",
      time: "11:30 AM",
      status: "Scheduled",
      type: "Regular Checkup",
    },
    { id: 3, patientName: "Amit Kumar", date: "2023-05-10", time: "2:00 PM", status: "Scheduled", type: "Follow-up" },
    {
      id: 4,
      patientName: "Sneha Gupta",
      date: "2023-05-08",
      time: "9:30 AM",
      status: "Scheduled",
      type: "New Patient",
    },
    { id: 5, patientName: "Vikram Singh", date: "2023-05-05", time: "3:30 PM", status: "Scheduled", type: "Follow-up" },
  ])

  const [articles, setArticles] = useState([
    { id: 1, title: "Understanding Hypertension", category: "Cardiology", status: "Published", date: "2023-04-01" },
    { id: 2, title: "Managing Diabetes", category: "Endocrinology", status: "Published", date: "2023-03-15" },
    { id: 3, title: "Asthma Treatment Options", category: "Pulmonology", status: "Draft", date: "2023-04-10" },
    { id: 4, title: "Arthritis Pain Management", category: "Rheumatology", status: "Published", date: "2023-02-28" },
    { id: 5, title: "Heart Health Tips", category: "Cardiology", status: "Draft", date: "2023-03-25" },
  ])

  // Filter data based on search term
  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.condition.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredPrescriptions = prescriptions.filter(
    (prescription) =>
      prescription.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.medication.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredAppointments = appointments.filter(
    (appointment) =>
      appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.type.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredArticles = articles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Handle add new item
  const handleAdd = () => {
    setSelectedItem(null)
    setIsAddDialogOpen(true)
  }

  // Handle edit item
  const handleEdit = (item: any) => {
    setSelectedItem(item)
    setIsEditDialogOpen(true)
  }

  // Handle delete item
  const handleDelete = (item: any) => {
    setSelectedItem(item)
    setIsDeleteDialogOpen(true)
  }

  // Handle save (add or edit)
  const handleSave = () => {
    // In a real app, you would save to a database
    toast({
      title: "Success",
      description: isEditDialogOpen ? "Item updated successfully" : "Item added successfully",
    })

    setIsAddDialogOpen(false)
    setIsEditDialogOpen(false)
  }

  // Handle confirm delete
  const handleConfirmDelete = () => {
    // In a real app, you would delete from a database
    if (activeTab === "patients" && selectedItem) {
      setPatients(patients.filter((patient) => patient.id !== selectedItem.id))
    } else if (activeTab === "prescriptions" && selectedItem) {
      setPrescriptions(prescriptions.filter((prescription) => prescription.id !== selectedItem.id))
    } else if (activeTab === "appointments" && selectedItem) {
      setAppointments(appointments.filter((appointment) => appointment.id !== selectedItem.id))
    } else if (activeTab === "articles" && selectedItem) {
      setArticles(articles.filter((article) => article.id !== selectedItem.id))
    }

    toast({
      title: "Success",
      description: "Item deleted successfully",
    })

    setIsDeleteDialogOpen(false)
  }

  return (
    <DoctorLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Doctor Admin Dashboard</h1>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <Button onClick={handleAdd}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="patients">Patients</TabsTrigger>
            <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="articles">Articles</TabsTrigger>
          </TabsList>

          <TabsContent value="patients">
            <Card>
              <CardHeader>
                <CardTitle>Patients</CardTitle>
                <CardDescription>Manage your patient records</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Age</TableHead>
                      <TableHead>Gender</TableHead>
                      <TableHead>Condition</TableHead>
                      <TableHead>Last Visit</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPatients.map((patient) => (
                      <TableRow key={patient.id}>
                        <TableCell>{patient.name}</TableCell>
                        <TableCell>{patient.age}</TableCell>
                        <TableCell>{patient.gender}</TableCell>
                        <TableCell>{patient.condition}</TableCell>
                        <TableCell>{patient.lastVisit}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="icon" onClick={() => handleEdit(patient)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(patient)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="prescriptions">
            <Card>
              <CardHeader>
                <CardTitle>Prescriptions</CardTitle>
                <CardDescription>Manage patient prescriptions</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>Medication</TableHead>
                      <TableHead>Dosage</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPrescriptions.map((prescription) => (
                      <TableRow key={prescription.id}>
                        <TableCell>{prescription.patientName}</TableCell>
                        <TableCell>{prescription.medication}</TableCell>
                        <TableCell>{prescription.dosage}</TableCell>
                        <TableCell>{prescription.duration}</TableCell>
                        <TableCell>{prescription.date}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="icon" onClick={() => handleEdit(prescription)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(prescription)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appointments">
            <Card>
              <CardHeader>
                <CardTitle>Appointments</CardTitle>
                <CardDescription>Manage your appointment schedule</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAppointments.map((appointment) => (
                      <TableRow key={appointment.id}>
                        <TableCell>{appointment.patientName}</TableCell>
                        <TableCell>{appointment.date}</TableCell>
                        <TableCell>{appointment.time}</TableCell>
                        <TableCell>{appointment.type}</TableCell>
                        <TableCell>{appointment.status}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="icon" onClick={() => handleEdit(appointment)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(appointment)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="articles">
            <Card>
              <CardHeader>
                <CardTitle>Articles</CardTitle>
                <CardDescription>Manage your health articles</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredArticles.map((article) => (
                      <TableRow key={article.id}>
                        <TableCell>{article.title}</TableCell>
                        <TableCell>{article.category}</TableCell>
                        <TableCell>{article.status}</TableCell>
                        <TableCell>{article.date}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="icon" onClick={() => handleEdit(article)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(article)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New {activeTab.slice(0, -1)}</DialogTitle>
            <DialogDescription>Enter the details for the new {activeTab.slice(0, -1)}.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {activeTab === "patients" && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input id="name" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="age" className="text-right">
                    Age
                  </Label>
                  <Input id="age" type="number" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="gender" className="text-right">
                    Gender
                  </Label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="condition" className="text-right">
                    Condition
                  </Label>
                  <Input id="condition" className="col-span-3" />
                </div>
              </>
            )}

            {activeTab === "prescriptions" && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="patient" className="text-right">
                    Patient
                  </Label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select patient" />
                    </SelectTrigger>
                    <SelectContent>
                      {patients.map((patient) => (
                        <SelectItem key={patient.id} value={patient.id.toString()}>
                          {patient.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="medication" className="text-right">
                    Medication
                  </Label>
                  <Input id="medication" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="dosage" className="text-right">
                    Dosage
                  </Label>
                  <Input id="dosage" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="duration" className="text-right">
                    Duration
                  </Label>
                  <Input id="duration" className="col-span-3" />
                </div>
              </>
            )}

            {activeTab === "appointments" && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="patient" className="text-right">
                    Patient
                  </Label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select patient" />
                    </SelectTrigger>
                    <SelectContent>
                      {patients.map((patient) => (
                        <SelectItem key={patient.id} value={patient.id.toString()}>
                          {patient.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="date" className="text-right">
                    Date
                  </Label>
                  <Input id="date" type="date" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="time" className="text-right">
                    Time
                  </Label>
                  <Input id="time" type="time" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="type" className="text-right">
                    Type
                  </Label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="follow-up">Follow-up</SelectItem>
                      <SelectItem value="new-patient">New Patient</SelectItem>
                      <SelectItem value="regular-checkup">Regular Checkup</SelectItem>
                      <SelectItem value="emergency">Emergency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {activeTab === "articles" && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    Title
                  </Label>
                  <Input id="title" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">
                    Category
                  </Label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cardiology">Cardiology</SelectItem>
                      <SelectItem value="dermatology">Dermatology</SelectItem>
                      <SelectItem value="endocrinology">Endocrinology</SelectItem>
                      <SelectItem value="neurology">Neurology</SelectItem>
                      <SelectItem value="orthopedics">Orthopedics</SelectItem>
                      <SelectItem value="pediatrics">Pediatrics</SelectItem>
                      <SelectItem value="psychiatry">Psychiatry</SelectItem>
                      <SelectItem value="pulmonology">Pulmonology</SelectItem>
                      <SelectItem value="rheumatology">Rheumatology</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="content" className="text-right">
                    Content
                  </Label>
                  <Textarea id="content" className="col-span-3" rows={5} />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">
                    Status
                  </Label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit {activeTab.slice(0, -1)}</DialogTitle>
            <DialogDescription>Update the details for this {activeTab.slice(0, -1)}.</DialogDescription>
          </DialogHeader>
          {/* Similar form fields as Add Dialog, but pre-populated with selectedItem data */}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this {activeTab.slice(0, -1)}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DoctorLayout>
  )
}
