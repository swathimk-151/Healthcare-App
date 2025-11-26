"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
import { Search, Edit, Trash2, UserPlus, Filter, Download, MoreHorizontal, Bell, RefreshCw } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"

// Sample user data with South Indian names
const initialUsers = [
  {
    id: 1,
    name: "Rajesh Kumar",
    email: "rajesh.kumar@example.com",
    phone: "+91 98765 43210",
    role: "Patient",
    status: "Active",
    joinDate: "Jan 15, 2023",
    idNumber: "ABCDE1234F",
  },
  {
    id: 2,
    name: "Priya Venkatesh",
    email: "priya.v@example.com",
    phone: "+91 87654 32109",
    role: "Patient",
    status: "Active",
    joinDate: "Feb 3, 2023",
    idNumber: "FGHIJ5678K",
  },
  {
    id: 3,
    name: "Dr. Anand Subramanian",
    email: "anand.s@example.com",
    phone: "+91 76543 21098",
    role: "Doctor",
    status: "Active",
    joinDate: "Dec 10, 2022",
    idNumber: "KLMNO9012P",
    specialty: "Cardiology",
  },
  {
    id: 4,
    name: "Dr. Lakshmi Narayanan",
    email: "lakshmi.n@example.com",
    phone: "+91 65432 10987",
    role: "Doctor",
    status: "Pending",
    joinDate: "Mar 5, 2023",
    idNumber: "PQRST3456U",
    specialty: "Neurology",
  },
  {
    id: 5,
    name: "Karthik Rajan",
    email: "karthik.r@example.com",
    phone: "+91 54321 09876",
    role: "Patient",
    status: "Inactive",
    joinDate: "Nov 20, 2022",
    idNumber: "UVWXY7890Z",
  },
  {
    id: 6,
    name: "Divya Chandran",
    email: "divya.c@example.com",
    phone: "+91 43210 98765",
    role: "Patient",
    status: "Active",
    joinDate: "Apr 12, 2023",
    idNumber: "ABCDE5678F",
  },
  {
    id: 7,
    name: "Dr. Senthil Murugan",
    email: "senthil.m@example.com",
    phone: "+91 32109 87654",
    role: "Doctor",
    status: "Active",
    joinDate: "Jan 8, 2023",
    idNumber: "FGHIJ9012K",
    specialty: "Orthopedics",
  },
  {
    id: 8,
    name: "Meena Sundaram",
    email: "meena.s@example.com",
    phone: "+91 21098 76543",
    role: "Patient",
    status: "Pending",
    joinDate: "Feb 25, 2023",
    idNumber: "KLMNO3456P",
  },
  {
    id: 9,
    name: "Vijay Prakash",
    email: "vijay.p@example.com",
    phone: "+91 10987 65432",
    role: "Patient",
    status: "Pending",
    joinDate: "Apr 18, 2023",
    idNumber: "PQRST7890U",
  },
  {
    id: 10,
    name: "Kavitha Ramachandran",
    email: "kavitha.r@example.com",
    phone: "+91 09876 54321",
    role: "Patient",
    status: "Pending",
    joinDate: "May 5, 2023",
    idNumber: "UVWXY1234Z",
  },
]

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [pendingCount, setPendingCount] = useState(0)
  const [allUsers, setAllUsers] = useState(initialUsers)
  const [useIdAsPassword, setUseIdAsPassword] = useState(false)
  const [specialty, setSpecialty] = useState("")
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Load pending users from localStorage on component mount
  useEffect(() => {
    const loadPendingUsers = () => {
      try {
        const pendingUsersString = localStorage.getItem("pendingUsers")
        if (pendingUsersString) {
          const pendingUsers = JSON.parse(pendingUsersString)

          // Merge with existing users, avoiding duplicates by email
          const existingEmails = new Set(allUsers.map((user) => user.email))
          const newUsers = pendingUsers.filter((user) => !existingEmails.has(user.email))

          if (newUsers.length > 0) {
            setAllUsers((prev) => [...prev, ...newUsers])

            toast({
              title: `${newUsers.length} new registration${newUsers.length > 1 ? "s" : ""} found`,
              description: "New user registrations have been loaded.",
            })
          }
        }
      } catch (error) {
        console.error("Error loading pending users:", error)
      }
    }

    loadPendingUsers()
  }, [])

  // Calculate pending users count
  useEffect(() => {
    const count = allUsers.filter((user) => user.status === "Pending").length
    setPendingCount(count)
  }, [allUsers])

  const filteredUsers = allUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault()

    // Get form data
    const formData = new FormData(e.target as HTMLFormElement)
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string
    const role = formData.get("role") as string
    const status = formData.get("status") as string
    const idNumber = formData.get("idNumber") as string

    // Add specialty if doctor
    let doctorSpecialty = ""
    if (role === "Doctor") {
      doctorSpecialty = specialty || "General Medicine"
    }

    // Create new user
    const newUser = {
      id: Date.now(),
      name,
      email,
      phone,
      role,
      status,
      joinDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      idNumber,
      specialty: doctorSpecialty,
    }

    // Add user to list
    setAllUsers((prev) => [...prev, newUser])

    toast({
      title: "User added successfully",
      description: `${name} has been added to the system${useIdAsPassword ? " with ID as password" : ""}.`,
    })
    setIsAddUserOpen(false)
    setSpecialty("")
  }

  const handleEditUser = (user: any) => {
    setSelectedUser(user)
    setSpecialty(user.specialty || "")
    setIsAddUserOpen(true)
  }

  const handleDeleteUser = () => {
    setAllUsers((prev) => prev.filter((user) => user.id !== selectedUser.id))

    toast({
      title: "User deleted",
      description: `${selectedUser.name} has been removed from the system.`,
    })
    setIsDeleteDialogOpen(false)
    setSelectedUser(null)
  }

  const confirmDelete = (user: any) => {
    setSelectedUser(user)
    setIsDeleteDialogOpen(true)
  }

  const handleApproveUser = (userId: number) => {
    setAllUsers((prev) => prev.map((user) => (user.id === userId ? { ...user, status: "Active" } : user)))

    const user = allUsers.find((u) => u.id === userId)

    toast({
      title: "User approved",
      description: `${user?.name} has been approved and can now access the system.`,
    })
  }

  const handleRejectUser = (userId: number) => {
    setAllUsers((prev) => prev.map((user) => (user.id === userId ? { ...user, status: "Rejected" } : user)))

    const user = allUsers.find((u) => u.id === userId)

    toast({
      title: "User rejected",
      description: `${user?.name}'s registration has been rejected.`,
    })
  }

  const refreshPendingUsers = () => {
    setIsRefreshing(true)

    // Simulate loading
    setTimeout(() => {
      try {
        const pendingUsersString = localStorage.getItem("pendingUsers")
        if (pendingUsersString) {
          const pendingUsers = JSON.parse(pendingUsersString)

          // Merge with existing users, avoiding duplicates by email
          const existingEmails = new Set(allUsers.map((user) => user.email))
          const newUsers = pendingUsers.filter((user) => !existingEmails.has(user.email))

          if (newUsers.length > 0) {
            setAllUsers((prev) => [...prev, ...newUsers])

            toast({
              title: `${newUsers.length} new registration${newUsers.length > 1 ? "s" : ""} found`,
              description: "New user registrations have been loaded.",
            })
          } else {
            toast({
              title: "No new registrations",
              description: "There are no new user registrations at this time.",
            })
          }
        }
      } catch (error) {
        console.error("Error loading pending users:", error)
        toast({
          title: "Error refreshing users",
          description: "There was a problem loading new registrations.",
          variant: "destructive",
        })
      }

      setIsRefreshing(false)
    }, 1000)
  }

  return (
    <AdminLayout>
      <div className="page-container">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="page-title gradient-text-blue">User Management</h1>
            <p className="page-subtitle">Manage all users of the healthcare platform</p>
          </div>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            {pendingCount > 0 && (
              <Button variant="outline" className="relative">
                <Bell className="mr-2 h-4 w-4" />
                Pending Approvals
                <Badge className="absolute -top-2 -right-2 bg-healthcare-red text-white">{pendingCount}</Badge>
              </Button>
            )}
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={refreshPendingUsers}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
              {isRefreshing ? "Refreshing..." : "Refresh"}
            </Button>
            <Button
              className="bg-healthcare-green hover:bg-healthcare-blue"
              onClick={() => {
                setSelectedUser(null)
                setIsAddUserOpen(true)
              }}
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Add New User
            </Button>
          </div>
        </div>

        <Card className="mb-6 border-2 border-healthcare-blue/20 shadow-md">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search users..."
                  className="pl-8 border-healthcare-blue/30 focus:border-healthcare-blue"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex items-center border-healthcare-blue/30 hover:bg-healthcare-blue/10"
                >
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center border-healthcare-green/30 hover:bg-healthcare-green/10"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-4 bg-healthcare-lightblue/20">
            <TabsTrigger value="all" className="data-[state=active]:bg-healthcare-blue data-[state=active]:text-white">
              All Users
            </TabsTrigger>
            <TabsTrigger
              value="patients"
              className="data-[state=active]:bg-healthcare-blue data-[state=active]:text-white"
            >
              Patients
            </TabsTrigger>
            <TabsTrigger
              value="doctors"
              className="data-[state=active]:bg-healthcare-blue data-[state=active]:text-white"
            >
              Doctors
            </TabsTrigger>
            <TabsTrigger
              value="pending"
              className="relative data-[state=active]:bg-healthcare-yellow data-[state=active]:text-white"
            >
              Pending Approval
              {pendingCount > 0 && <Badge className="ml-2 bg-healthcare-red text-white">{pendingCount}</Badge>}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <Card className="border-2 border-healthcare-blue/20 shadow-md">
              <CardHeader className="pb-2 bg-gradient-to-r from-healthcare-lightblue/30 to-healthcare-blue/10">
                <CardTitle>All Users</CardTitle>
                <CardDescription>
                  Showing {filteredUsers.length} of {allUsers.length} total users
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead className="hidden md:table-cell">Phone</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden md:table-cell">Join Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell className="hidden md:table-cell">{user.phone}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              user.role === "Doctor"
                                ? "bg-healthcare-lightpurple/30 text-healthcare-purple border-healthcare-purple/30"
                                : "bg-healthcare-lightblue/30 text-healthcare-blue border-healthcare-blue/30"
                            }
                          >
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              user.status === "Active"
                                ? "bg-healthcare-lightgreen/30 text-healthcare-green border-healthcare-green/30"
                                : user.status === "Pending"
                                  ? "bg-healthcare-lightyellow/30 text-healthcare-yellow border-healthcare-yellow/30"
                                  : user.status === "Rejected"
                                    ? "bg-red-100 text-red-800 border-red-200"
                                    : "bg-healthcare-lightred/30 text-healthcare-red border-healthcare-red/30"
                            }
                          >
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{user.joinDate}</TableCell>
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
                              {user.status === "Pending" && (
                                <>
                                  <DropdownMenuItem
                                    onClick={() => handleApproveUser(user.id)}
                                    className="text-healthcare-green"
                                  >
                                    Approve
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleRejectUser(user.id)}
                                    className="text-healthcare-red"
                                  >
                                    Reject
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                </>
                              )}
                              <DropdownMenuItem onClick={() => handleEditUser(user)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => confirmDelete(user)} className="text-healthcare-red">
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

          <TabsContent value="patients">
            <Card className="border-2 border-healthcare-blue/20 shadow-md">
              <CardHeader className="pb-2 bg-gradient-to-r from-healthcare-lightblue/30 to-healthcare-blue/10">
                <CardTitle>Patients</CardTitle>
                <CardDescription>Manage patient accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead className="hidden md:table-cell">Phone</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden md:table-cell">Join Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers
                      .filter((user) => user.role === "Patient")
                      .map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell className="hidden md:table-cell">{user.phone}</TableCell>
                          <TableCell>
                            <Badge
                              className={
                                user.status === "Active"
                                  ? "bg-healthcare-lightgreen/30 text-healthcare-green border-healthcare-green/30"
                                  : user.status === "Pending"
                                    ? "bg-healthcare-lightyellow/30 text-healthcare-yellow border-healthcare-yellow/30"
                                    : user.status === "Rejected"
                                      ? "bg-red-100 text-red-800 border-red-200"
                                      : "bg-healthcare-lightred/30 text-healthcare-red border-healthcare-red/30"
                              }
                            >
                              {user.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">{user.joinDate}</TableCell>
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
                                {user.status === "Pending" && (
                                  <>
                                    <DropdownMenuItem
                                      onClick={() => handleApproveUser(user.id)}
                                      className="text-healthcare-green"
                                    >
                                      Approve
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => handleRejectUser(user.id)}
                                      className="text-healthcare-red"
                                    >
                                      Reject
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                  </>
                                )}
                                <DropdownMenuItem onClick={() => handleEditUser(user)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => confirmDelete(user)} className="text-healthcare-red">
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

          <TabsContent value="doctors">
            <Card className="border-2 border-healthcare-purple/20 shadow-md">
              <CardHeader className="pb-2 bg-gradient-to-r from-healthcare-lightpurple/30 to-healthcare-purple/10">
                <CardTitle>Doctors</CardTitle>
                <CardDescription>Manage doctor accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead className="hidden md:table-cell">Phone</TableHead>
                      <TableHead className="hidden md:table-cell">Specialty</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden md:table-cell">Join Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers
                      .filter((user) => user.role === "Doctor")
                      .map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell className="hidden md:table-cell">{user.phone}</TableCell>
                          <TableCell className="hidden md:table-cell">{user.specialty || "General Medicine"}</TableCell>
                          <TableCell>
                            <Badge
                              className={
                                user.status === "Active"
                                  ? "bg-healthcare-lightgreen/30 text-healthcare-green border-healthcare-green/30"
                                  : user.status === "Pending"
                                    ? "bg-healthcare-lightyellow/30 text-healthcare-yellow border-healthcare-yellow/30"
                                    : user.status === "Rejected"
                                      ? "bg-red-100 text-red-800 border-red-200"
                                      : "bg-healthcare-lightred/30 text-healthcare-red border-healthcare-red/30"
                              }
                            >
                              {user.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">{user.joinDate}</TableCell>
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
                                {user.status === "Pending" && (
                                  <>
                                    <DropdownMenuItem
                                      onClick={() => handleApproveUser(user.id)}
                                      className="text-healthcare-green"
                                    >
                                      Approve
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => handleRejectUser(user.id)}
                                      className="text-healthcare-red"
                                    >
                                      Reject
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                  </>
                                )}
                                <DropdownMenuItem onClick={() => handleEditUser(user)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => confirmDelete(user)} className="text-healthcare-red">
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

          <TabsContent value="pending">
            <Card className="border-2 border-healthcare-yellow/20 shadow-md">
              <CardHeader className="pb-2 bg-gradient-to-r from-healthcare-lightyellow/30 to-healthcare-yellow/10">
                <CardTitle>Pending Approval</CardTitle>
                <CardDescription>Users waiting for account approval</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead className="hidden md:table-cell">Phone</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead className="hidden md:table-cell">Join Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers
                      .filter((user) => user.status === "Pending")
                      .map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell className="hidden md:table-cell">{user.phone}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                user.role === "Doctor"
                                  ? "bg-healthcare-lightpurple/30 text-healthcare-purple border-healthcare-purple/30"
                                  : "bg-healthcare-lightblue/30 text-healthcare-blue border-healthcare-blue/30"
                              }
                            >
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">{user.joinDate}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                size="sm"
                                className="bg-healthcare-green hover:bg-healthcare-green/90"
                                onClick={() => handleApproveUser(user.id)}
                              >
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-healthcare-red border-healthcare-red hover:bg-healthcare-red/10"
                                onClick={() => handleRejectUser(user.id)}
                              >
                                Reject
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

      {/* Add/Edit User Dialog */}
      <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{selectedUser ? "Edit User" : "Add New User"}</DialogTitle>
            <DialogDescription>
              {selectedUser ? "Update user information" : "Fill in the details to create a new user"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddUser}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={selectedUser?.name || ""}
                  className="col-span-3 border-healthcare-blue/30 focus:border-healthcare-blue"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  defaultValue={selectedUser?.email || ""}
                  className="col-span-3 border-healthcare-blue/30 focus:border-healthcare-blue"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Phone
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  defaultValue={selectedUser?.phone || ""}
                  className="col-span-3 border-healthcare-blue/30 focus:border-healthcare-blue"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="idNumber" className="text-right">
                  ID Number
                </Label>
                <Input
                  id="idNumber"
                  name="idNumber"
                  defaultValue={selectedUser?.idNumber || ""}
                  className="col-span-3 border-healthcare-blue/30 focus:border-healthcare-blue"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="col-span-4 flex items-center space-x-2">
                  <Checkbox
                    id="useIdAsPassword"
                    checked={useIdAsPassword}
                    onCheckedChange={(checked) => {
                      setUseIdAsPassword(checked as boolean)
                    }}
                  />
                  <label
                    htmlFor="useIdAsPassword"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Use ID number as password
                  </label>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">
                  Role
                </Label>
                <Select
                  defaultValue={selectedUser?.role || "Patient"}
                  name="role"
                  onValueChange={(value) => {
                    if (value === "Doctor") {
                      setSpecialty(selectedUser?.specialty || "")
                    }
                  }}
                >
                  <SelectTrigger className="col-span-3 border-healthcare-blue/30 focus:border-healthcare-blue">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Patient">Patient</SelectItem>
                    <SelectItem value="Doctor">Doctor</SelectItem>
                    <SelectItem value="Admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Show specialty field only for doctors */}
              {(selectedUser?.role === "Doctor" || specialty) && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="specialty" className="text-right">
                    Specialty
                  </Label>
                  <Select value={specialty} onValueChange={setSpecialty}>
                    <SelectTrigger className="col-span-3 border-healthcare-purple/30 focus:border-healthcare-purple">
                      <SelectValue placeholder="Select specialty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="General Medicine">General Medicine</SelectItem>
                      <SelectItem value="Cardiology">Cardiology</SelectItem>
                      <SelectItem value="Dermatology">Dermatology</SelectItem>
                      <SelectItem value="Neurology">Neurology</SelectItem>
                      <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                      <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                      <SelectItem value="Gynecology">Gynecology</SelectItem>
                      <SelectItem value="Ophthalmology">Ophthalmology</SelectItem>
                      <SelectItem value="ENT">ENT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <Select defaultValue={selectedUser?.status || "Active"} name="status">
                  <SelectTrigger className="col-span-3 border-healthcare-blue/30 focus:border-healthcare-blue">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="bg-healthcare-green hover:bg-healthcare-green/90">
                {selectedUser ? "Save Changes" : "Add User"}
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
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex space-x-2 pt-4">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteUser}
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
