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
import { toast } from "@/components/ui/use-toast"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

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

    // Simulate API call
    setTimeout(() => {
      // For demo purposes, we'll use a simple check
      // In a real app, this would be an API call to verify credentials
      if (email.includes("@") && password.length >= 6) {
        // Create a user profile with basic info
        const nameParts = email.split("@")[0].split(".")
        const firstName = nameParts[0] ? nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1) : ""
        const lastName = nameParts[1] ? nameParts[1].charAt(0).toUpperCase() + nameParts[1].slice(1) : ""

        const userProfile = {
          id: "P" + Math.floor(1000 + Math.random() * 9000),
          firstName: firstName,
          lastName: lastName,
          email: email,
          phone: "",
          dob: "",
          gender: "",
          address: "",
          city: "",
          state: "",
          zip: "",
          allergies: [],
          medications: [],
          conditions: [],
          familyHistory: [],
          hasCompletedOnboarding: false,
        }

        // Store in localStorage
        localStorage.setItem("userProfile", JSON.stringify(userProfile))

        toast({
          title: "Login Successful",
          description: "Welcome back, " + firstName,
        })

        // Check if onboarding is needed
        if (!userProfile.hasCompletedOnboarding) {
          router.push("/onboarding")
        } else {
          router.push("/dashboard")
        }
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid email or password",
          variant: "destructive",
        })
      }
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
          <CardDescription className="text-center">Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/forgot-password" className="text-sm text-blue-500 hover:underline">
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
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
            <div className="mt-4 text-center text-sm">
              Don't have an account?{" "}
              <Link href="/register" className="text-blue-500 hover:underline">
                Sign up
              </Link>
            </div>
            <div className="mt-2 text-center text-sm">
              Are you a doctor?{" "}
              <Link href="/doctor/login" className="text-healthcare-green hover:underline">
                Doctor Login
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
