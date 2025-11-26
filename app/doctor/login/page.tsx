"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

export default function DoctorLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [selectedDoctor, setSelectedDoctor] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // Predefined doctor credentials
  const doctorCredentials = {
    email: "doctor@healthcare.com",
    password: "doctor123",
  }

  // Predefined doctors list
  const doctors = [
    {
      id: "D10001",
      name: "Dr. Anand Subramanian",
      specialty: "Cardiologist",
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "D10002",
      name: "Dr. Priya Venkatesh",
      specialty: "Dermatologist",
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "D10003",
      name: "Dr. Karthik Rajan",
      specialty: "Neurologist",
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "D10004",
      name: "Dr. Lakshmi Narayanan",
      specialty: "Orthopedic Surgeon",
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "D10005",
      name: "Dr. Srinivas Rao",
      specialty: "Pediatrician",
      image: "/placeholder.svg?height=100&width=100",
    },
  ]

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simple validation
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please enter both email and password",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Check against predefined credentials
      if (email === doctorCredentials.email && password === doctorCredentials.password) {
        setIsLoggedIn(true)
        toast({
          title: "Login Successful",
          description: "Please select your profile to continue",
        })
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid email or password. Try using the demo credentials.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred during login. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDoctorSelect = () => {
    if (!selectedDoctor) {
      toast({
        title: "Error",
        description: "Please select a doctor profile",
        variant: "destructive",
      })
      return
    }

    try {
      const doctor = doctors.find((doc) => doc.id === selectedDoctor)
      if (doctor) {
        // Store in localStorage
        localStorage.setItem("doctorUser", JSON.stringify(doctor))

        toast({
          title: "Profile Selected",
          description: `Welcome, ${doctor.name}`,
        })

        // Redirect to doctor dashboard
        router.push("/doctor/dashboard")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while selecting your profile. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Doctor Login</CardTitle>
          <CardDescription className="text-center">Enter your credentials to access your account</CardDescription>
        </CardHeader>
        {!isLoggedIn ? (
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="doctor@healthcare.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/doctor/forgot-password" className="text-sm text-blue-500 hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" />
                <Label
                  htmlFor="remember"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Remember me
                </Label>
              </div>
              <div className="bg-yellow-50 p-3 rounded-md border border-yellow-200">
                <p className="text-sm text-yellow-800">
                  <strong>Demo Credentials:</strong> doctor@healthcare.com / doctor123
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col">
              <Button
                type="submit"
                className="w-full bg-healthcare-scrubs-green hover:bg-healthcare-scrubs-green/90"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </Button>
              <div className="mt-4 text-center text-sm">
                <Link href="/" className="text-blue-500 hover:underline">
                  Back to Home
                </Link>
              </div>
            </CardFooter>
          </form>
        ) : (
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="doctor-select">Select Your Profile</Label>
              <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                <SelectTrigger id="doctor-select">
                  <SelectValue placeholder="Select doctor profile" />
                </SelectTrigger>
                <SelectContent>
                  {doctors.map((doctor) => (
                    <SelectItem key={doctor.id} value={doctor.id}>
                      {doctor.name} - {doctor.specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end">
              <Button
                onClick={handleDoctorSelect}
                className="bg-healthcare-scrubs-green hover:bg-healthcare-scrubs-green/90"
              >
                Continue
              </Button>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}
