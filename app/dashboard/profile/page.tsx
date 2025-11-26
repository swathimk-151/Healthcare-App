"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"
import { Loader2, Plus, X } from "lucide-react"
import { PatientRecordsStorage } from "@/components/patient-records-storage"
import { useUserProfile } from "@/contexts/user-profile-context"

export default function ProfilePage() {
  const { userProfile, updateUserProfile } = useUserProfile()
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Form state
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [dob, setDob] = useState("")
  const [gender, setGender] = useState("")
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [zip, setZip] = useState("")

  // Medical information
  const [newAllergy, setNewAllergy] = useState("")
  const [allergies, setAllergies] = useState<string[]>([])

  const [newMedication, setNewMedication] = useState({ name: "", dosage: "" })
  const [medications, setMedications] = useState<Array<{ name: string; dosage: string }>>([])

  const [newCondition, setNewCondition] = useState({ name: "", diagnosedYear: "" })
  const [conditions, setConditions] = useState<Array<{ name: string; diagnosedYear: string }>>([])

  const [newFamilyHistory, setNewFamilyHistory] = useState({ relation: "", condition: "" })
  const [familyHistory, setFamilyHistory] = useState<Array<{ relation: string; condition: string }>>([])

  // Load user profile data
  useEffect(() => {
    if (userProfile) {
      setFirstName(userProfile.firstName || "")
      setLastName(userProfile.lastName || "")
      setEmail(userProfile.email || "")
      setPhone(userProfile.phone || "")
      setDob(userProfile.dob || "")
      setGender(userProfile.gender || "")
      setAddress(userProfile.address || "")
      setCity(userProfile.city || "")
      setState(userProfile.state || "")
      setZip(userProfile.zip || "")
      setAllergies(userProfile.allergies || [])
      setMedications(userProfile.medications || [])
      setConditions(userProfile.conditions || [])
      setFamilyHistory(userProfile.familyHistory || [])
    }
  }, [userProfile])

  const handleAddAllergy = () => {
    if (newAllergy.trim()) {
      const updatedAllergies = [...allergies, newAllergy.trim()]
      setAllergies(updatedAllergies)
      updateUserProfile({ allergies: updatedAllergies })
      setNewAllergy("")
    }
  }

  const handleRemoveAllergy = (index: number) => {
    const updatedAllergies = allergies.filter((_, i) => i !== index)
    setAllergies(updatedAllergies)
    updateUserProfile({ allergies: updatedAllergies })
  }

  const handleAddMedication = () => {
    if (newMedication.name.trim() && newMedication.dosage.trim()) {
      const updatedMedications = [...medications, { ...newMedication }]
      setMedications(updatedMedications)
      updateUserProfile({ medications: updatedMedications })
      setNewMedication({ name: "", dosage: "" })
    }
  }

  const handleRemoveMedication = (index: number) => {
    const updatedMedications = medications.filter((_, i) => i !== index)
    setMedications(updatedMedications)
    updateUserProfile({ medications: updatedMedications })
  }

  const handleAddCondition = () => {
    if (newCondition.name.trim()) {
      const updatedConditions = [...conditions, { ...newCondition }]
      setConditions(updatedConditions)
      updateUserProfile({ conditions: updatedConditions })
      setNewCondition({ name: "", diagnosedYear: "" })
    }
  }

  const handleRemoveCondition = (index: number) => {
    const updatedConditions = conditions.filter((_, i) => i !== index)
    setConditions(updatedConditions)
    updateUserProfile({ conditions: updatedConditions })
  }

  const handleAddFamilyHistory = () => {
    if (newFamilyHistory.relation.trim() && newFamilyHistory.condition.trim()) {
      const updatedFamilyHistory = [...familyHistory, { ...newFamilyHistory }]
      setFamilyHistory(updatedFamilyHistory)
      updateUserProfile({ familyHistory: updatedFamilyHistory })
      setNewFamilyHistory({ relation: "", condition: "" })
    }
  }

  const handleRemoveFamilyHistory = (index: number) => {
    const updatedFamilyHistory = familyHistory.filter((_, i) => i !== index)
    setFamilyHistory(updatedFamilyHistory)
    updateUserProfile({ familyHistory: updatedFamilyHistory })
  }

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    // Update user profile
    updateUserProfile({
      firstName,
      lastName,
      email,
      phone,
      dob,
      gender,
      address,
      city,
      state,
      zip,
    })

    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      })
    }, 1500)
  }

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)
      toast({
        title: "Password updated",
        description: "Your password has been changed successfully.",
      })
    }, 1500)
  }

  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)
      toast({
        title: "Notification preferences updated",
        description: "Your notification settings have been saved.",
      })
    }, 1500)
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
          <p className="text-gray-500 mt-2">Manage your account settings and preferences</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="md:col-span-1">
            <CardContent className="p-6">
              <div className="flex flex-col items-center">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="/placeholder.svg?height=96&width=96" alt="Ms. Shruthi" />
                  <AvatarFallback>MS</AvatarFallback>
                </Avatar>
                <h2 className="mt-4 text-xl font-semibold">
                  {firstName} {lastName}
                </h2>
                <p className="text-sm text-muted-foreground">{email}</p>
                <Button variant="outline" className="mt-4 w-full">
                  Change Photo
                </Button>
              </div>

              <div className="mt-6 space-y-1">
                <h3 className="text-sm font-medium text-muted-foreground">Account Type</h3>
                <p className="text-sm">Patient</p>
              </div>

              <div className="mt-4 space-y-1">
                <h3 className="text-sm font-medium text-muted-foreground">Member Since</h3>
                <p className="text-sm">January 15, 2023</p>
              </div>

              <div className="mt-6 pt-6 border-t">
                <Button variant="outline" className="w-full text-healthcare-red hover:bg-red-50">
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="md:col-span-3">
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="personal">Personal Information</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="medical">Medical History</TabsTrigger>
                <TabsTrigger value="records">My Records</TabsTrigger>
              </TabsList>

              <TabsContent value="personal">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your personal details and contact information</CardDescription>
                  </CardHeader>
                  <form onSubmit={handleSaveProfile}>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="first-name">First name</Label>
                          <Input id="first-name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="last-name">Last name</Label>
                          <Input id="last-name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone number</Label>
                        <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="dob">Date of Birth</Label>
                          <Input id="dob" type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="gender">Gender</Label>
                          <select
                            id="gender"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                          >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                            <option value="prefer-not-to-say">Prefer not to say</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="city">City</Label>
                          <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="state">State</Label>
                          <Input id="state" value={state} onChange={(e) => setState(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="zip">ZIP Code</Label>
                          <Input id="zip" value={zip} onChange={(e) => setZip(e.target.value)} />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        type="submit"
                        disabled={isSaving}
                        className="bg-healthcare-blue hover:bg-healthcare-blue/90"
                      >
                        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isSaving ? "Saving..." : "Save Changes"}
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              </TabsContent>

              <TabsContent value="security">
                <Card>
                  <CardHeader>
                    <CardTitle>Security</CardTitle>
                    <CardDescription>Update your password and security settings</CardDescription>
                  </CardHeader>
                  <form onSubmit={handleSavePassword}>
                    <CardContent className="space-y-4">
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

                      <div className="pt-4 border-t">
                        <h3 className="text-lg font-medium mb-4">Two-Factor Authentication</h3>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Enable Two-Factor Authentication</p>
                            <p className="text-sm text-muted-foreground">
                              Add an extra layer of security to your account
                            </p>
                          </div>
                          <Switch />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        type="submit"
                        disabled={isSaving}
                        className="bg-healthcare-blue hover:bg-healthcare-blue/90"
                      >
                        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isSaving ? "Saving..." : "Update Password"}
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              </TabsContent>

              <TabsContent value="notifications">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>Manage how you receive notifications and updates</CardDescription>
                  </CardHeader>
                  <form onSubmit={handleSaveNotifications}>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Email Notifications</h3>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Appointment Reminders</p>
                            <p className="text-sm text-muted-foreground">
                              Receive reminders about upcoming appointments
                            </p>
                          </div>
                          <Switch defaultChecked />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Prescription Refills</p>
                            <p className="text-sm text-muted-foreground">
                              Get notified when your prescriptions are ready for refill
                            </p>
                          </div>
                          <Switch defaultChecked />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Lab Results</p>
                            <p className="text-sm text-muted-foreground">
                              Receive notifications when new lab results are available
                            </p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                      </div>

                      <div className="space-y-4 pt-4 border-t">
                        <h3 className="text-lg font-medium">SMS Notifications</h3>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Appointment Reminders</p>
                            <p className="text-sm text-muted-foreground">
                              Receive SMS reminders about upcoming appointments
                            </p>
                          </div>
                          <Switch defaultChecked />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Order Updates</p>
                            <p className="text-sm text-muted-foreground">Get SMS updates about your medicine orders</p>
                          </div>
                          <Switch />
                        </div>
                      </div>

                      <div className="space-y-4 pt-4 border-t">
                        <h3 className="text-lg font-medium">Marketing Communications</h3>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Health Tips & Articles</p>
                            <p className="text-sm text-muted-foreground">
                              Receive health tips and new article notifications
                            </p>
                          </div>
                          <Switch />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Promotions & Offers</p>
                            <p className="text-sm text-muted-foreground">
                              Get notified about special offers and discounts
                            </p>
                          </div>
                          <Switch />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        type="submit"
                        disabled={isSaving}
                        className="bg-healthcare-blue hover:bg-healthcare-blue/90"
                      >
                        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isSaving ? "Saving..." : "Save Preferences"}
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              </TabsContent>

              <TabsContent value="medical">
                <Card>
                  <CardHeader>
                    <CardTitle>Medical History</CardTitle>
                    <CardDescription>View and update your medical information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Allergies</h3>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add allergy"
                          value={newAllergy}
                          onChange={(e) => setNewAllergy(e.target.value)}
                          className="flex-1"
                        />
                        <Button type="button" onClick={handleAddAllergy} size="sm">
                          <Plus className="h-4 w-4 mr-1" /> Add
                        </Button>
                      </div>
                      <div className="bg-muted p-4 rounded-md">
                        {allergies.length > 0 ? (
                          allergies.map((allergy, index) => (
                            <div key={index} className="flex items-center justify-between mb-2">
                              <p className="text-sm">{allergy}</p>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveAllergy(index)}
                                className="h-6 w-6 p-0"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">No allergies recorded</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t">
                      <h3 className="text-lg font-medium">Current Medications</h3>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Medication name"
                          value={newMedication.name}
                          onChange={(e) => setNewMedication({ ...newMedication, name: e.target.value })}
                          className="flex-1"
                        />
                        <Input
                          placeholder="Dosage"
                          value={newMedication.dosage}
                          onChange={(e) => setNewMedication({ ...newMedication, dosage: e.target.value })}
                          className="flex-1"
                        />
                        <Button type="button" onClick={handleAddMedication} size="sm">
                          <Plus className="h-4 w-4 mr-1" /> Add
                        </Button>
                      </div>
                      <div className="bg-muted p-4 rounded-md">
                        {medications.length > 0 ? (
                          medications.map((medication, index) => (
                            <div key={index} className="mb-3 flex items-center justify-between">
                              <div>
                                <p className="font-medium">{medication.name}</p>
                                <p className="text-sm text-muted-foreground">{medication.dosage}</p>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveMedication(index)}
                                className="h-6 w-6 p-0"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">No medications recorded</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t">
                      <h3 className="text-lg font-medium">Medical Conditions</h3>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Condition name"
                          value={newCondition.name}
                          onChange={(e) => setNewCondition({ ...newCondition, name: e.target.value })}
                          className="flex-1"
                        />
                        <Input
                          placeholder="Year diagnosed"
                          value={newCondition.diagnosedYear}
                          onChange={(e) => setNewCondition({ ...newCondition, diagnosedYear: e.target.value })}
                          className="w-32"
                        />
                        <Button type="button" onClick={handleAddCondition} size="sm">
                          <Plus className="h-4 w-4 mr-1" /> Add
                        </Button>
                      </div>
                      <div className="bg-muted p-4 rounded-md">
                        {conditions.length > 0 ? (
                          conditions.map((condition, index) => (
                            <div key={index} className="mb-2 flex items-center justify-between">
                              <p className="text-sm">
                                {condition.name}
                                {condition.diagnosedYear && ` (diagnosed ${condition.diagnosedYear})`}
                              </p>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveCondition(index)}
                                className="h-6 w-6 p-0"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">No conditions recorded</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t">
                      <h3 className="text-lg font-medium">Family Medical History</h3>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Relation (e.g., Father)"
                          value={newFamilyHistory.relation}
                          onChange={(e) => setNewFamilyHistory({ ...newFamilyHistory, relation: e.target.value })}
                          className="flex-1"
                        />
                        <Input
                          placeholder="Condition"
                          value={newFamilyHistory.condition}
                          onChange={(e) => setNewFamilyHistory({ ...newFamilyHistory, condition: e.target.value })}
                          className="flex-1"
                        />
                        <Button type="button" onClick={handleAddFamilyHistory} size="sm">
                          <Plus className="h-4 w-4 mr-1" /> Add
                        </Button>
                      </div>
                      <div className="bg-muted p-4 rounded-md">
                        {familyHistory.length > 0 ? (
                          familyHistory.map((history, index) => (
                            <div key={index} className="mb-2 flex items-center justify-between">
                              <p className="text-sm">
                                {history.relation}: {history.condition}
                              </p>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveFamilyHistory(index)}
                                className="h-6 w-6 p-0"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">No family history recorded</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="records">
                <PatientRecordsStorage />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
