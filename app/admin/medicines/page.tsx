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

// Sample medicine data
const medicines = [
  {
    id: 1,
    name: "Paracetamol 500mg",
    description: "Pain reliever and fever reducer",
    category: "OTC",
    price: 5.99,
    stock: 250,
    manufacturer: "PharmaCorp",
    status: "In Stock",
  },
  {
    id: 2,
    name: "Amoxicillin 250mg",
    description: "Antibiotic used to treat bacterial infections",
    category: "Prescription",
    price: 12.5,
    stock: 120,
    manufacturer: "MediPharm",
    status: "In Stock",
  },
  {
    id: 3,
    name: "Vitamin D3 1000 IU",
    description: "Supports bone health and immune function",
    category: "Supplements",
    price: 8.99,
    stock: 180,
    manufacturer: "VitaHealth",
    status: "In Stock",
  },
  {
    id: 4,
    name: "Ibuprofen 200mg",
    description: "Anti-inflammatory pain reliever",
    category: "OTC",
    price: 6.49,
    stock: 200,
    manufacturer: "PharmaCorp",
    status: "In Stock",
  },
  {
    id: 5,
    name: "Loratadine 10mg",
    description: "Antihistamine for allergy relief",
    category: "OTC",
    price: 9.99,
    stock: 150,
    manufacturer: "AllerCare",
    status: "In Stock",
  },
  {
    id: 6,
    name: "Metformin 500mg",
    description: "Oral diabetes medicine",
    category: "Prescription",
    price: 15.99,
    stock: 80,
    manufacturer: "DiabeCare",
    status: "Low Stock",
  },
  {
    id: 7,
    name: "Aspirin 81mg",
    description: "Blood thinner, pain reliever",
    category: "OTC",
    price: 4.99,
    stock: 300,
    manufacturer: "HeartCare",
    status: "In Stock",
  },
  {
    id: 8,
    name: "Lisinopril 10mg",
    description: "ACE inhibitor for high blood pressure",
    category: "Prescription",
    price: 18.5,
    stock: 0,
    manufacturer: "CardioMed",
    status: "Out of Stock",
  },
]

export default function MedicinesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddMedicineOpen, setIsAddMedicineOpen] = useState(false)
  const [selectedMedicine, setSelectedMedicine] = useState<any>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const filteredMedicines = medicines.filter(
    (medicine) =>
      medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medicine.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medicine.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddMedicine = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: selectedMedicine ? "Medicine updated" : "Medicine added",
      description: selectedMedicine
        ? "The medicine has been updated successfully."
        : "The new medicine has been added to the system.",
    })
    setIsAddMedicineOpen(false)
  }

  const handleEditMedicine = (medicine: any) => {
    setSelectedMedicine(medicine)
    setIsAddMedicineOpen(true)
  }

  const handleDeleteMedicine = () => {
    toast({
      title: "Medicine deleted",
      description: `${selectedMedicine.name} has been removed from the system.`,
    })
    setIsDeleteDialogOpen(false)
    setSelectedMedicine(null)
  }

  const confirmDelete = (medicine: any) => {
    setSelectedMedicine(medicine)
    setIsDeleteDialogOpen(true)
  }

  return (
    <AdminLayout>
      <div className="page-container">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="page-title gradient-text-green">Medicine Management</h1>
            <p className="page-subtitle">Manage all medicines in the healthcare platform</p>
          </div>
          <Button
            className="bg-healthcare-green hover:bg-healthcare-blue mt-4 md:mt-0"
            onClick={() => setIsAddMedicineOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add New Medicine
          </Button>
        </div>

        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search medicines..."
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

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Medicines</TabsTrigger>
            <TabsTrigger value="otc">OTC</TabsTrigger>
            <TabsTrigger value="prescription">Prescription</TabsTrigger>
            <TabsTrigger value="supplements">Supplements</TabsTrigger>
            <TabsTrigger value="low-stock">Low Stock</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>All Medicines</CardTitle>
                <CardDescription>
                  Showing {filteredMedicines.length} of {medicines.length} total medicines
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
                      <TableHead>Stock</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMedicines.map((medicine) => (
                      <TableRow key={medicine.id}>
                        <TableCell className="font-medium">{medicine.name}</TableCell>
                        <TableCell className="hidden md:table-cell">{medicine.description}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              medicine.category === "Prescription"
                                ? "bg-healthcare-lightpurple/30 text-healthcare-purple border-healthcare-purple/30"
                                : medicine.category === "OTC"
                                  ? "bg-healthcare-lightblue/30 text-healthcare-blue border-healthcare-blue/30"
                                  : "bg-healthcare-lightgreen/30 text-healthcare-green border-healthcare-green/30"
                            }
                          >
                            {medicine.category}
                          </Badge>
                        </TableCell>
                        <TableCell>${medicine.price.toFixed(2)}</TableCell>
                        <TableCell>{medicine.stock}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              medicine.status === "In Stock"
                                ? "bg-healthcare-lightgreen/30 text-healthcare-green border-healthcare-green/30"
                                : medicine.status === "Low Stock"
                                  ? "bg-healthcare-lightyellow/30 text-healthcare-yellow border-healthcare-yellow/30"
                                  : "bg-healthcare-lightred/30 text-healthcare-red border-healthcare-red/30"
                            }
                          >
                            {medicine.status}
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
                              <DropdownMenuItem onClick={() => handleEditMedicine(medicine)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => confirmDelete(medicine)} className="text-healthcare-red">
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

          <TabsContent value="otc">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Over-the-Counter Medicines</CardTitle>
                <CardDescription>Manage OTC medicines</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead className="hidden md:table-cell">Description</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMedicines
                      .filter((medicine) => medicine.category === "OTC")
                      .map((medicine) => (
                        <TableRow key={medicine.id}>
                          <TableCell className="font-medium">{medicine.name}</TableCell>
                          <TableCell className="hidden md:table-cell">{medicine.description}</TableCell>
                          <TableCell>${medicine.price.toFixed(2)}</TableCell>
                          <TableCell>{medicine.stock}</TableCell>
                          <TableCell>
                            <Badge
                              className={
                                medicine.status === "In Stock"
                                  ? "bg-healthcare-lightgreen/30 text-healthcare-green border-healthcare-green/30"
                                  : medicine.status === "Low Stock"
                                    ? "bg-healthcare-lightyellow/30 text-healthcare-yellow border-healthcare-yellow/30"
                                    : "bg-healthcare-lightred/30 text-healthcare-red border-healthcare-red/30"
                              }
                            >
                              {medicine.status}
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
                                <DropdownMenuItem onClick={() => handleEditMedicine(medicine)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => confirmDelete(medicine)}
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

          <TabsContent value="prescription">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Prescription Medicines</CardTitle>
                <CardDescription>Manage prescription medicines</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead className="hidden md:table-cell">Description</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMedicines
                      .filter((medicine) => medicine.category === "Prescription")
                      .map((medicine) => (
                        <TableRow key={medicine.id}>
                          <TableCell className="font-medium">{medicine.name}</TableCell>
                          <TableCell className="hidden md:table-cell">{medicine.description}</TableCell>
                          <TableCell>${medicine.price.toFixed(2)}</TableCell>
                          <TableCell>{medicine.stock}</TableCell>
                          <TableCell>
                            <Badge
                              className={
                                medicine.status === "In Stock"
                                  ? "bg-healthcare-lightgreen/30 text-healthcare-green border-healthcare-green/30"
                                  : medicine.status === "Low Stock"
                                    ? "bg-healthcare-lightyellow/30 text-healthcare-yellow border-healthcare-yellow/30"
                                    : "bg-healthcare-lightred/30 text-healthcare-red border-healthcare-red/30"
                              }
                            >
                              {medicine.status}
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
                                <DropdownMenuItem onClick={() => handleEditMedicine(medicine)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => confirmDelete(medicine)}
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

          <TabsContent value="supplements">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Supplements</CardTitle>
                <CardDescription>Manage supplements and vitamins</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead className="hidden md:table-cell">Description</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMedicines
                      .filter((medicine) => medicine.category === "Supplements")
                      .map((medicine) => (
                        <TableRow key={medicine.id}>
                          <TableCell className="font-medium">{medicine.name}</TableCell>
                          <TableCell className="hidden md:table-cell">{medicine.description}</TableCell>
                          <TableCell>${medicine.price.toFixed(2)}</TableCell>
                          <TableCell>{medicine.stock}</TableCell>
                          <TableCell>
                            <Badge
                              className={
                                medicine.status === "In Stock"
                                  ? "bg-healthcare-lightgreen/30 text-healthcare-green border-healthcare-green/30"
                                  : medicine.status === "Low Stock"
                                    ? "bg-healthcare-lightyellow/30 text-healthcare-yellow border-healthcare-yellow/30"
                                    : "bg-healthcare-lightred/30 text-healthcare-red border-healthcare-red/30"
                              }
                            >
                              {medicine.status}
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
                                <DropdownMenuItem onClick={() => handleEditMedicine(medicine)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => confirmDelete(medicine)}
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

          <TabsContent value="low-stock">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Low Stock Medicines</CardTitle>
                <CardDescription>Medicines that need to be restocked</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMedicines
                      .filter((medicine) => medicine.status === "Low Stock" || medicine.status === "Out of Stock")
                      .map((medicine) => (
                        <TableRow key={medicine.id}>
                          <TableCell className="font-medium">{medicine.name}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                medicine.category === "Prescription"
                                  ? "bg-healthcare-lightpurple/30 text-healthcare-purple border-healthcare-purple/30"
                                  : medicine.category === "OTC"
                                    ? "bg-healthcare-lightblue/30 text-healthcare-blue border-healthcare-blue/30"
                                    : "bg-healthcare-lightgreen/30 text-healthcare-green border-healthcare-green/30"
                              }
                            >
                              {medicine.category}
                            </Badge>
                          </TableCell>
                          <TableCell>{medicine.stock}</TableCell>
                          <TableCell>
                            <Badge
                              className={
                                medicine.status === "Low Stock"
                                  ? "bg-healthcare-lightyellow/30 text-healthcare-yellow border-healthcare-yellow/30"
                                  : "bg-healthcare-lightred/30 text-healthcare-red border-healthcare-red/30"
                              }
                            >
                              {medicine.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button size="sm" className="bg-healthcare-green hover:bg-healthcare-blue">
                              Restock
                            </Button>
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

      {/* Add/Edit Medicine Dialog */}
      <Dialog open={isAddMedicineOpen} onOpenChange={setIsAddMedicineOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{selectedMedicine ? "Edit Medicine" : "Add New Medicine"}</DialogTitle>
            <DialogDescription>
              {selectedMedicine ? "Update medicine information" : "Fill in the details to add a new medicine"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddMedicine}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input id="name" defaultValue={selectedMedicine?.name || ""} className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="description"
                  defaultValue={selectedMedicine?.description || ""}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Category
                </Label>
                <Select defaultValue={selectedMedicine?.category || "OTC"}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="OTC">OTC</SelectItem>
                    <SelectItem value="Prescription">Prescription</SelectItem>
                    <SelectItem value="Supplements">Supplements</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price" className="text-right">
                  Price ($)
                </Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  defaultValue={selectedMedicine?.price || ""}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="stock" className="text-right">
                  Stock
                </Label>
                <Input
                  id="stock"
                  type="number"
                  defaultValue={selectedMedicine?.stock || ""}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="manufacturer" className="text-right">
                  Manufacturer
                </Label>
                <Input
                  id="manufacturer"
                  defaultValue={selectedMedicine?.manufacturer || ""}
                  className="col-span-3"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="bg-healthcare-green hover:bg-healthcare-blue">
                {selectedMedicine ? "Save Changes" : "Add Medicine"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedMedicine?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex space-x-2 pt-4">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteMedicine}
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
