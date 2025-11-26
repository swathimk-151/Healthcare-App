"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DoctorLayout } from "@/components/doctor-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function DoctorSettingsPage() {
  const router = useRouter()
  const [doctor, setDoctor] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Profile form state
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [specialty, setSpecialty] = useState("")
  const [bio, setBio] = useState("")
  const [experience, setExperience] = useState("")
  const [education, setEducation] = useState("")
  const [languages, setLanguages] = useState("")

  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [smsNotifications, setSmsNotifications] = useState(true)
  const [appointmentReminders, setAppointmentReminders] = useState(true)
  const [patientMessages, setPatientMessages] = useState(true)
  const [systemUpdates, setSystemUpdates] = useState(false)

  useEffect(() => {
    // Check if doctor is logged in
    const doctorData = localStorage.getItem("doctorUser")

    if (doctorData) {
      const doctorInfo = JSON.parse(doctorData)
      setDoctor(doctorInfo)

      // Set initial form values
      setName(doctorInfo.name || "")
      setEmail("doctor@healthcare.com") // Default email
      setPhone("+91 9876543210") // Default phone
      setSpecialty(doctorInfo.specialty || "")
      setBio("Experienced healthcare professional dedicated to providing quality patient care.")
      setExperience("10+ years of clinical experience")
      setEducation("MBBS, MD - All India Institute of Medical Sciences")
      setLanguages("English, Hindi, Tamil")
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

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault()

    // Update doctor profile
    const updatedDoctor = {
      ...doctor,
      name,
      email,
      phone,
      specialty,
      bio,
      experience,
      education,
      languages,
    }

    // Save to localStorage
    localStorage.setItem("doctorUser", JSON.stringify(updatedDoctor))
    setDoctor(updatedDoctor)

    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully.",
    })
  }

  const handleNotificationUpdate = () => {
    toast({
      title: "Notification Settings Updated",
      description: "Your notification preferences have been saved.",
    })
  }

  return (
    <DoctorLayout>
      <div className="page-container">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="page-title text-healthcare-scrubs-green">Settings</h1>
            <p className="page-subtitle">Manage your account settings and preferences</p>
          </div>
        </div>

        <Tabs defaultValue="profile" className="mb-6">
          <TabsList className="mb-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal and professional information</CardDescription>
              </CardHeader>
              <form onSubmit={handleProfileUpdate}>
                <CardContent className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex flex-col items-center space-y-4">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src={doctor.image || "/placeholder.svg?height=96&width=96"} alt={doctor.name} />
                        <AvatarFallback>{doctor.name?.charAt(0) || "D"}</AvatarFallback>
                      </Avatar>
                      <Button variant="outline" size="sm">
                        Change Photo
                      </Button>
                    </div>
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="specialty">Specialty</Label>
                        <Select value={specialty} onValueChange={setSpecialty}>
                          <SelectTrigger id="specialty">
                            <SelectValue placeholder="Select specialty" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Cardiologist">Cardiologist</SelectItem>
                            <SelectItem value="Dermatologist">Dermatologist</SelectItem>
                            <SelectItem value="Neurologist">Neurologist</SelectItem>
                            <SelectItem value="Orthopedic Surgeon">Orthopedic Surgeon</SelectItem>
                            <SelectItem value="Pediatrician">Pediatrician</SelectItem>
                            <SelectItem value="General Physician">General Physician</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Professional Bio</Label>
                    <Textarea
                      id="bio"
                      rows={4}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Write a brief professional bio"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="experience">Experience</Label>
                      <Input id="experience" value={experience} onChange={(e) => setExperience(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="education">Education</Label>
                      <Input id="education" value={education} onChange={(e) => setEducation(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="languages">Languages</Label>
                      <Input id="languages" value={languages} onChange={(e) => setLanguages(e.target.value)} />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="bg-healthcare-scrubs-green hover:bg-healthcare-scrubs-green/90">
                    Save Changes
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Manage how you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Email Notifications</h4>
                      <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                    </div>
                    <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">SMS Notifications</h4>
                      <p className="text-sm text-muted-foreground">Receive notifications via SMS</p>
                    </div>
                    <Switch checked={smsNotifications} onCheckedChange={setSmsNotifications} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Appointment Reminders</h4>
                      <p className="text-sm text-muted-foreground">Get reminders about upcoming appointments</p>
                    </div>
                    <Switch checked={appointmentReminders} onCheckedChange={setAppointmentReminders} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Patient Messages</h4>
                      <p className="text-sm text-muted-foreground">Get notified when patients send messages</p>
                    </div>
                    <Switch checked={patientMessages} onCheckedChange={setPatientMessages} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">System Updates</h4>
                      <p className="text-sm text-muted-foreground">Get notified about system updates and maintenance</p>
                    </div>
                    <Switch checked={systemUpdates} onCheckedChange={setSystemUpdates} />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={handleNotificationUpdate}
                  className="bg-healthcare-scrubs-green hover:bg-healthcare-scrubs-green/90"
                >
                  Save Preferences
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your account security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium">Change Password</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Update your password regularly for better security
                    </p>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="current-password">Current Password</Label>
                        <Input id="current-password" type="password" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input id="new-password" type="password" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <Input id="confirm-password" type="password" />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <h4 className="font-medium">Two-Factor Authentication</h4>
                    <p className="text-sm text-muted-foreground mb-4">Add an extra layer of security to your account</p>

                    <Button variant="outline">Enable Two-Factor Authentication</Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="bg-healthcare-scrubs-green hover:bg-healthcare-scrubs-green/90">
                  Update Security Settings
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DoctorLayout>
  )
}
