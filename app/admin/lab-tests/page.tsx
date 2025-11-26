"use client"

import type React from "react"

import { useState } from "react"
import { AdminLayout } from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Search, Plus, Edit, Trash2, Filter, Download, MoreHorizontal } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Sample lab tests data
const labTests = [
  {
    id: 1,
    name: "Complete Blood Count (CBC)",
    description: "Measures different components of your blood",
    category: "Blood",
    price: 25.99,
    duration: "1 day",
    status: "Active",
  },
  {
    id: 2,
    name: "Lipid Profile",
    description: "Measures cholesterol and triglycerides",
    category: "Blood",
    price: 35.5,
    duration: "1 day",
    status: "Active",
  },
  {
    id: 3,
    name: "Thyroid Function Test",
    description: "Measures thyroid hormone levels",
    category: "Blood",
    price: 45.0,
    duration: "2 days",
    status: "Active",
  },
  {
    id: 4,
    name: "Liver Function Test",
    description: "Assesses liver function and detects liver damage",
    category: "Blood",
    price: 40.0,
    duration: "1 day",
    status: "Active",
  },
  {
    id: 5,
    name: "Kidney Function Test",
    description: "Evaluates how well your kidneys are working",
    category: "Blood, Urine",
    price: 38.5,
    duration: "1 day",
    status: "Active",
  },
  {
    id: 6,
    name: "Vitamin D Test",
    description: "Measures vitamin D levels in your blood",
    category: "Blood",
    price: 30.0,
    duration: "2 days",
    status: "Inactive",
  },
  {
    id: 7,
    name: "HbA1c",
    description: "Measures average blood glucose levels over the past 2-3 months",
    category: "Blood",
    price: 32.0,
    duration: "1 day",
    status: "Active",
  },
  {
    id: 8,
    name: "Urinalysis",
    description: "Analyzes the physical, chemical, and microscopic properties of urine",
    category: "Urine",
    price: 20.0,
    duration: "1 day",
    status: "Active",
  },
]

// Sample packages data
const packages = [
  {
    id: 1,
    name: "Basic Health Checkup",
    description: "Essential tests to assess your overall health",
    tests: ["Complete Blood Count", "Lipid Profile", "Blood Glucose", "Liver Function"],
    price: 99.99,
    status: "Active",
  },
  {
    id: 2,
    name: "Comprehensive Health Checkup",
    description: "Thorough assessment of your health status",
    tests: [
      "Complete Blood Count",
      "Lipid Profile",
      "Thyroid Function",
      "Liver Function",
      "Kidney Function",
      "Vitamin D",
      "Vitamin B12",
    ],
    price: 199.99,
    status: "Active",
  },
  {
    id: 3,
    name: "Diabetes Checkup",
    description: "Tests focused on diabetes detection and monitoring",
    tests: ["Fasting Blood Glucose", "HbA1c", "Lipid Profile", "Kidney Function"],
    price: 89.99,
    status: "Active",
  },
  {
    id: 4,
    name: "Women's Health Package",
    description: "Comprehensive tests for women's health",
    tests: ["Complete Blood Count", "Thyroid Function", "Vitamin D", "Calcium", "Iron"],
    price: 149.99,
    status: "Inactive",
  },
]

export default function AdminLabTestsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddTestOpen, setIsAddTestOpen] = useState(false)
  const [isAddPackageOpen, setIsAddPackageOpen] = useState(false)
  const [selectedTest, setSelectedTest] = useState<any>(null)
  const [selectedPackage, setSelectedPackage] = useState<any>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeletePackageDialogOpen, setIsDeletePackageDialogOpen] = useState(false)

  const filteredTests = labTests.filter(
    (test) =>
      test.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredPackages = packages.filter(
    (pkg) =>
      pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddTest = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: selectedTest ? "Test updated" : "Test added",
      description: selectedTest
        ? "The lab test has been updated successfully."
        : "The new lab test has been added to the system.",
    })
    setIsAddTestOpen(false)
  }

  const handleAddPackage = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: selectedPackage ? "Package updated" : "Package added",
      description: selectedPackage
        ? "The health package has been updated successfully."
        : "The new health package has been added to the system.",
    })
    setIsAddPackageOpen(false)
  }

  const handleEditTest = (test: any) => {
    setSelectedTest(test)
    setIsAddTestOpen(true)
  }

  const handleEditPackage = (pkg: any) => {
    setSelectedPackage(pkg)
    setIsAddPackageOpen(true)
  }

  const handleDeleteTest = () => {
    toast({
      title: "Lab test deleted",
      description: `${selectedTest.name} has been removed from the system.`,
    })
    setIsDeleteDialogOpen(false)
    setSelectedTest(null)
  }

  const handleDeletePackage = () => {
    toast({
      title: "Health package deleted",
      description: `${selectedPackage.name} has been removed from the system.`,
    })
    setIsDeletePackageDialogOpen(false)
    setSelectedPackage(null)
  }

  const confirmDeleteTest = (test: any) => {
    setSelectedTest(test)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeletePackage = (pkg: any) => {
    setSelectedPackage(pkg)
    setIsDeletePackageDialogOpen(true)
  }

  return (
    <AdminLayout>
      <div className="page-container">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="page-title gradient-text-blue">Lab Test Management</h1>
            <p className="page-subtitle">Manage all lab tests and health packages</p>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <Button
              className="bg-healthcare-green hover:bg-healthcare-blue"
              onClick={() => {
                setSelectedTest(null)
                setIsAddTestOpen(true)
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add New Test
            </Button>
            <Button
              className="bg-healthcare-purple hover:bg-healthcare-blue"
              onClick={() => {
                setSelectedPackage(null)
                setIsAddPackageOpen(true)
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add New Package
            </Button>
          </div>
        </div>

        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search lab tests or packages..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex items-center">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
                <Button variant="outline" className="flex items-center">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="tests" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="tests">Lab Tests</TabsTrigger>
            <TabsTrigger value="packages">Health Packages</TabsTrigger>
            <TabsTrigger value="bookings">Test Bookings</TabsTrigger>
          </TabsList>

          <TabsContent value="tests">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>All Lab Tests</CardTitle>
                <CardDescription>
                  Showing {filteredTests.length} of {labTests.length} total lab tests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead className="hidden md:table-cell">Description</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTests.map((test) => (
                      <TableRow key={test.id}>
                        <TableCell className="font-medium">{test.name}</TableCell>
                        <TableCell className="hidden md:table-cell">{test.description}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="bg-healthcare-lightblue/30 text-healthcare-blue border-healthcare-blue/30"
                          >
                            {test.category}
                          </Badge>
                        </TableCell>
                        <TableCell>${test.price.toFixed(2)}</TableCell>
                        <TableCell>{test.duration}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              test.status === "Active"
                                ? "bg-healthcare-lightgreen/30 text-healthcare-green border-healthcare-green/30"
                                : "bg-healthcare-lightred/30 text-healthcare-red border-healthcare-red/30"
                            }
                          >
                            {test.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleEditTest(test)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => confirmDeleteTest(test)} className="text-healthcare-red">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="packages">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Health Packages</CardTitle>
                <CardDescription>
                  Showing {filteredPackages.length} of {packages.length} total health packages
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead className="hidden md:table-cell">Description</TableHead>
                      <TableHead className="hidden md:table-cell">Included Tests</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPackages.map((pkg) => (
                      <TableRow key={pkg.id}>
                        <TableCell className="font-medium">{pkg.name}</TableCell>
                        <TableCell className="hidden md:table-cell">{pkg.description}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="max-w-[300px] truncate">{pkg.tests.join(", ")}</div>
                        </TableCell>
                        <TableCell>${pkg.price.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              pkg.status === "Active"
                                ? "bg-healthcare-lightgreen/30 text-healthcare-green border-healthcare-green/30"
                                : "bg-healthcare-lightred/30 text-healthcare-red border-healthcare-red/30"
                            }
                          >
                            {pkg.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleEditPackage(pkg)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => confirmDeletePackage(pkg)}
                                className="text-healthcare-red"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookings">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Recent Test Bookings</CardTitle>
                <CardDescription>Manage lab test bookings and results</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Booking ID</TableHead>
                      <TableHead>Patient</TableHead>
                      <TableHead>Test/Package</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">BK-12345</TableCell>
                      <TableCell>John Doe</TableCell>
                      <TableCell>Complete Blood Count</TableCell>
                      <TableCell>May 15, 2023</TableCell>
                      <TableCell>
                        <Badge className="bg-healthcare-lightyellow/30 text-healthcare-yellow border-healthcare-yellow/30">
                          Scheduled
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">BK-12346</TableCell>
                      <TableCell>Jane Smith</TableCell>
                      <TableCell>Basic Health Checkup</TableCell>
                      <TableCell>May 12, 2023</TableCell>
                      <TableCell>
                        <Badge className="bg-healthcare-lightblue/30 text-healthcare-blue border-healthcare-blue/30">
                          Sample Collected
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">BK-12347</TableCell>
                      <TableCell>Michael Johnson</TableCell>
                      <TableCell>Lipid Profile</TableCell>
                      <TableCell>May 10, 2023</TableCell>
                      <TableCell>
                        <Badge className="bg-healthcare-lightgreen/30 text-healthcare-green border-healthcare-green/30">
                          Completed
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">
                          View Results
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add/Edit Test Dialog */}
      <Dialog open={isAddTestOpen} onOpenChange={setIsAddTestOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{selectedTest ? "Edit Lab Test" : "Add New Lab Test"}</DialogTitle>
            <DialogDescription>
              {selectedTest ? "Update lab test information" : "Fill in the details to add a new lab test"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddTest}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input id="name" defaultValue={selectedTest?.name || ""} className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="description"
                  defaultValue={selectedTest?.description || ""}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Category
                </Label>
                <Input id="category" defaultValue={selectedTest?.category || ""} className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price" className="text-right">
                  Price ($)
                </Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  defaultValue={selectedTest?.price || ""}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="duration" className="text-right">
                  Duration
                </Label>
                <Input id="duration" defaultValue={selectedTest?.duration || ""} className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <Select defaultValue={selectedTest?.status || "Active"}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="bg-healthcare-green hover:bg-healthcare-blue">
                {selectedTest ? "Save Changes" : "Add Lab Test"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Package Dialog */}
      <Dialog open={isAddPackageOpen} onOpenChange={setIsAddPackageOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{selectedPackage ? "Edit Health Package" : "Add New Health Package"}</DialogTitle>
            <DialogDescription>
              {selectedPackage
                ? "Update health package information"
                : "Fill in the details to add a new health package"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddPackage}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="pkg-name" className="text-right">
                  Name
                </Label>
                <Input id="pkg-name" defaultValue={selectedPackage?.name || ""} className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="pkg-description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="pkg-description"
                  defaultValue={selectedPackage?.description || ""}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="pkg-tests" className="text-right">
                  Included Tests
                </Label>
                <Textarea
                  id="pkg-tests"
                  defaultValue={selectedPackage?.tests ? selectedPackage.tests.join(", ") : ""}
                  className="col-span-3"
                  placeholder="Enter test names separated by commas"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="pkg-price" className="text-right">
                  Price ($)
                </Label>
                <Input
                  id="pkg-price"
                  type="number"
                  step="0.01"
                  defaultValue={selectedPackage?.price || ""}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="pkg-status" className="text-right">
                  Status
                </Label>
                <Select defaultValue={selectedPackage?.status || "Active"}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="bg-healthcare-purple hover:bg-healthcare-blue">
                {selectedPackage ? "Save Changes" : "Add Health Package"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Test Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedTest?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex space-x-2 pt-4">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteTest}
              className="bg-healthcare-red hover:bg-healthcare-red/90"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Package Confirmation Dialog */}
      <Dialog open={isDeletePackageDialogOpen} onOpenChange={setIsDeletePackageDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedPackage?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex space-x-2 pt-4">
            <Button variant="outline" onClick={() => setIsDeletePackageDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeletePackage}
              className="bg-healthcare-red hover:bg-healthcare-red/90"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  )
}
