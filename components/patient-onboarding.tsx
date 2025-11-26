"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useUserProfile } from "@/contexts/user-profile-context"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Loader2, Plus, X } from "lucide-react"

export function PatientOnboarding() {
  const router = useRouter()
  const { userProfile, updateUserProfile, completeOnboarding } = useUserProfile()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

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

  const handleAddAllergy = () => {
    if (newAllergy.trim()) {
      setAllergies([...allergies, newAllergy.trim()])
      setNewAllergy("")
    }
  }

  const handleRemoveAllergy = (index: number) => {
    setAllergies(allergies.filter((_, i) => i !== index))
  }

  const handleAddMedication = () => {
    if (newMedication.name.trim() && newMedication.dosage.trim()) {
      setMedications([...medications, { ...newMedication }])
      setNewMedication({ name: "", dosage: "" })
    }
  }

  const handleRemoveMedication = (index: number) => {
    setMedications(medications.filter((_, i) => i !== index))
  }

  const handleAddCondition = () => {
    if (newCondition.name.trim()) {
      setConditions([...conditions, { ...newCondition }])
      setNewCondition({ name: "", diagnosedYear: "" })
    }
  }

  const handleRemoveCondition = (index: number) => {
    setConditions(conditions.filter((_, i) => i !== index))
  }

  const handleAddFamilyHistory = () => {
    if (newFamilyHistory.relation.trim() && newFamilyHistory.condition.trim()) {
      setFamilyHistory([...familyHistory, { ...newFamilyHistory }])
      setNewFamilyHistory({ relation: "", condition: "" })
    }
  }

  const handleRemoveFamilyHistory = (index: number) => {
    setFamilyHistory(familyHistory.filter((_, i) => i !== index))
  }

  const handleNextStep = () => {
    if (currentStep === 1) {
      // Validate personal information
      if (!firstName || !lastName || !email || !phone || !dob || !gender) {
        toast({
          title: "Missing information",
          description: "Please fill in all required fields.",
          variant: "destructive",
        })
        return
      }
    }

    setCurrentStep(currentStep + 1)
  }

  const handlePreviousStep = () => {
    setCurrentStep(currentStep - 1)
  }

  const handleSubmit = () => {
    setIsLoading(true)

    // Update user profile with all collected information
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
      allergies,
      medications,
      conditions,
      familyHistory,
    })

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      completeOnboarding()

      toast({
        title: "Profile setup complete",
        description: "Your profile has been successfully set up.",
      })

      // Redirect to dashboard
      router.push("/dashboard")
    }, 1500)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-healthcare-lightblue/30 to-white p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader className="bg-gradient-to-r from-healthcare-lightblue/30 to-healthcare-blue/10">
          <CardTitle className="text-2xl">Welcome to HealthCare</CardTitle>
          <CardDescription>
            Let's set up your profile to provide you with the best healthcare experience
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    currentStep >= step ? "bg-healthcare-blue text-white" : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {step}
                </div>
              ))}
            </div>
            <div className="relative h-2 bg-gray-200 rounded-full">
              <div
                className="absolute top-0 left-0 h-2 bg-healthcare-blue rounded-full transition-all duration-300"
                style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
              ></div>
            </div>
          </div>

          {currentStep === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first-name">First Name*</Label>
                  <Input id="first-name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last-name">Last Name*</Label>
                  <Input id="last-name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email*</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number*</Label>
                <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth*</Label>
                  <Input id="dob" type="date" value={dob} onChange={(e) => setDob(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender*</Label>
                  <Select value={gender} onValueChange={setGender}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
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
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Medical Information</h2>

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
                <div className="flex flex-wrap gap-2">
                  {allergies.map((allergy, index) => (
                    <div key={index} className="flex items-center bg-muted px-3 py-1 rounded-full">
                      <span className="mr-1">{allergy}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveAllergy(index)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
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
                <div className="space-y-2">
                  {medications.map((medication, index) => (
                    <div key={index} className="flex justify-between items-center bg-muted p-2 rounded">
                      <div>
                        <p className="font-medium">{medication.name}</p>
                        <p className="text-sm text-muted-foreground">{medication.dosage}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveMedication(index)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Medical History</h2>

              <div className="space-y-4">
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
                <div className="space-y-2">
                  {conditions.map((condition, index) => (
                    <div key={index} className="flex justify-between items-center bg-muted p-2 rounded">
                      <div>
                        <p className="font-medium">{condition.name}</p>
                        {condition.diagnosedYear && (
                          <p className="text-sm text-muted-foreground">Diagnosed: {condition.diagnosedYear}</p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveCondition(index)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
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
                <div className="space-y-2">
                  {familyHistory.map((history, index) => (
                    <div key={index} className="flex justify-between items-center bg-muted p-2 rounded">
                      <div>
                        <p className="font-medium">{history.relation}</p>
                        <p className="text-sm text-muted-foreground">{history.condition}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveFamilyHistory(index)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between bg-gradient-to-r from-healthcare-lightblue/30 to-healthcare-blue/10">
          {currentStep > 1 ? (
            <Button variant="outline" onClick={handlePreviousStep}>
              Previous
            </Button>
          ) : (
            <div></div>
          )}

          {currentStep < 3 ? (
            <Button onClick={handleNextStep}>Next</Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="bg-healthcare-blue hover:bg-healthcare-blue/90"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Saving..." : "Complete Setup"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
