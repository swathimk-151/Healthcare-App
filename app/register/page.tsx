"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoIcon } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [idNumber, setIdNumber] = useState("")
  const [accountType, setAccountType] = useState("patient")

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)

    // Validate passwords match
    if (password !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Please ensure both passwords match.",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    // Simulate registration process
    setTimeout(() => {
      setIsLoading(false)

      // Store user data in localStorage to simulate database
      const newUser = {
        id: Date.now(),
        name,
        email,
        phone,
        role: accountType === "patient" ? "Patient" : "Doctor",
        status: "Pending",
        joinDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        idNumber,
      }

      // Get existing users or initialize empty array
      const existingUsers = JSON.parse(localStorage.getItem("pendingUsers") || "[]")

      // Add new user
      existingUsers.push(newUser)

      // Save back to localStorage
      localStorage.setItem("pendingUsers", JSON.stringify(existingUsers))

      toast({
        title: "Registration successful",
        description: "Your account is pending approval. You will be notified once approved.",
      })

      // Redirect to login page
      router.push("/login")
    }, 1500)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-healthcare-lightblue/30 to-white p-4">
      <div className="absolute inset-0 bg-[url('/placeholder.svg?height=600&width=1200')] opacity-5 bg-center bg-cover"></div>
      <div className="w-full max-w-md relative">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold gradient-text-blue">
            HealthCare
          </Link>
          <h1 className="text-3xl font-bold mt-6 gradient-text-green">Create Account</h1>
          <p className="text-gray-600 mt-2">Sign up to access healthcare services</p>
        </div>

        <Card className="border-2 border-healthcare-blue/30 shadow-lg overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-healthcare-lightblue/30 to-healthcare-blue/10">
            <CardTitle>Register</CardTitle>
            <CardDescription>Fill in your details to create an account</CardDescription>
          </CardHeader>
          <form onSubmit={handleRegister}>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <Label htmlFor="account-type">Account Type</Label>
                <Select value={accountType} onValueChange={setAccountType}>
                  <SelectTrigger className="border-healthcare-blue/30 focus:border-healthcare-blue">
                    <SelectValue placeholder="Select account type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="patient">Patient</SelectItem>
                    <SelectItem value="doctor">Doctor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="border-healthcare-blue/30 focus:border-healthcare-blue"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border-healthcare-blue/30 focus:border-healthcare-blue"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="border-healthcare-blue/30 focus:border-healthcare-blue"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="id-number">ID Number</Label>
                <Input
                  id="id-number"
                  placeholder="Enter your ID number"
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                  required
                  className="border-healthcare-blue/30 focus:border-healthcare-blue"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border-healthcare-blue/30 focus:border-healthcare-blue"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="border-healthcare-blue/30 focus:border-healthcare-blue"
                />
              </div>
              <Alert className="bg-healthcare-lightyellow/20 border-healthcare-yellow/20">
                <InfoIcon className="h-4 w-4 text-healthcare-yellow" />
                <AlertTitle>Account Approval Required</AlertTitle>
                <AlertDescription>
                  Your account will need to be approved by an administrator before you can log in.
                </AlertDescription>
              </Alert>
            </CardContent>
            <CardFooter className="flex flex-col bg-gradient-to-r from-healthcare-lightblue/30 to-healthcare-blue/10">
              <Button
                type="submit"
                className="w-full bg-healthcare-blue hover:bg-healthcare-blue/90"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
              <p className="mt-4 text-center text-sm text-gray-600">
                Already have an account?{" "}
                <Link href="/login" className="text-healthcare-blue hover:underline">
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
