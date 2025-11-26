"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, FileText, Activity, Pill, Microscope, Heart, User, ChevronRight } from "lucide-react"
import { useUserProfile } from "@/contexts/user-profile-context"
import { useAppointments } from "@/contexts/appointments-context"
import { PastTreatmentSection } from "@/components/past-treatment-section"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export default function DashboardPage() {
  const router = useRouter()
  const { userProfile, isFirstLogin, isLoading } = useUserProfile()
  const { appointments } = useAppointments()
  const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([])
  const [healthScore, setHealthScore] = useState(78)
  const [recentActivities, setRecentActivities] = useState<any[]>([])

  useEffect(() => {
    if (!isLoading) {
      if (isFirstLogin) {
        router.push("/onboarding")
      } else {
        // Filter appointments for the current user
        const userAppointments = appointments.filter(
          (appointment) =>
            appointment.patientId === userProfile.id ||
            appointment.patientName === `${userProfile.firstName} ${userProfile.lastName}`,
        )

        // Get upcoming appointments
        const today = new Date().toISOString().split("T")[0]
        const upcoming = userAppointments
          .filter(
            (appointment) =>
              appointment.date >= today && (appointment.status === "Scheduled" || appointment.status === "Confirmed"),
          )
          .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))

        setUpcomingAppointments(upcoming.slice(0, 3))

        // Set sample recent activities
        setRecentActivities([
          {
            id: 1,
            type: "appointment",
            title: "Appointment Confirmed",
            description: "Your appointment with Dr. Anand Subramanian has been confirmed",
            date: "2023-04-15",
            time: "10:00 AM",
            icon: <Calendar className="h-4 w-4 text-blue-500" />,
          },
          {
            id: 2,
            type: "medication",
            title: "Medication Reminder",
            description: "Remember to take your blood pressure medication",
            date: "2023-04-15",
            time: "08:00 AM",
            icon: <Pill className="h-4 w-4 text-orange-500" />,
          },
          {
            id: 3,
            type: "lab",
            title: "Lab Results Available",
            description: "Your recent blood test results are now available",
            date: "2023-04-14",
            time: "03:30 PM",
            icon: <Microscope className="h-4 w-4 text-purple-500" />,
          },
          {
            id: 4,
            type: "article",
            title: "New Health Article",
            description: "Read our latest article on managing diabetes",
            date: "2023-04-14",
            time: "11:45 AM",
            icon: <FileText className="h-4 w-4 text-green-500" />,
          },
        ])
      }
    }
  }, [isLoading, isFirstLogin, router, appointments, userProfile])

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  const firstName = userProfile.firstName || "User"
  const fullName = `${userProfile.firstName || ""} ${userProfile.lastName || ""}`.trim() || "User"

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Welcome, {firstName}</h1>
            <p className="text-gray-500 mt-2">Here's an overview of your health</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-4">
            <Button variant="outline" onClick={() => router.push("/dashboard/profile")}>
              <User className="mr-2 h-4 w-4" />
              View Profile
            </Button>
            <Button onClick={() => router.push("/dashboard/appointments")}>
              <Calendar className="mr-2 h-4 w-4" />
              Book Appointment
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle>Health Overview</CardTitle>
              <CardDescription>Your current health status and metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Health Score</h3>
                    <span className="text-lg font-bold text-healthcare-hospital-blue">{healthScore}/100</span>
                  </div>
                  <Progress value={healthScore} className="h-2" />
                  <div className="grid grid-cols-3 gap-2 text-center text-sm">
                    <div className="p-2 bg-gray-50 rounded-md">
                      <p className="text-muted-foreground">Poor</p>
                      <div className="h-1 w-full bg-gray-200 mt-1">
                        <div className={`h-full bg-red-500 ${healthScore < 40 ? "w-full" : "w-0"}`}></div>
                      </div>
                    </div>
                    <div className="p-2 bg-gray-50 rounded-md">
                      <p className="text-muted-foreground">Good</p>
                      <div className="h-1 w-full bg-gray-200 mt-1">
                        <div
                          className={`h-full bg-yellow-500 ${healthScore >= 40 && healthScore < 70 ? "w-full" : "w-0"}`}
                        ></div>
                      </div>
                    </div>
                    <div className="p-2 bg-gray-50 rounded-md">
                      <p className="text-muted-foreground">Excellent</p>
                      <div className="h-1 w-full bg-gray-200 mt-1">
                        <div className={`h-full bg-green-500 ${healthScore >= 70 ? "w-full" : "w-0"}`}></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-muted-foreground">Blood Pressure</p>
                      <Activity className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <h3 className="text-2xl font-bold mt-2">120/80</h3>
                    <p className="text-xs text-muted-foreground">Last updated: 2 weeks ago</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-muted-foreground">Heart Rate</p>
                      <Heart className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <h3 className="text-2xl font-bold mt-2">72 bpm</h3>
                    <p className="text-xs text-muted-foreground">Last updated: 2 weeks ago</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-muted-foreground">Blood Glucose</p>
                      <Activity className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <h3 className="text-2xl font-bold mt-2">98 mg/dL</h3>
                    <p className="text-xs text-muted-foreground">Last updated: 2 weeks ago</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-muted-foreground">BMI</p>
                      <User className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <h3 className="text-2xl font-bold mt-2">23.5</h3>
                    <p className="text-xs text-muted-foreground">Last updated: 1 month ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="link" className="p-0" onClick={() => router.push("/dashboard/vitals")}>
                View all health metrics
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Your Profile</CardTitle>
              <CardDescription>Personal information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src="/placeholder.svg?height=64&width=64" alt={fullName} />
                  <AvatarFallback>{firstName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{fullName}</h3>
                  <p className="text-sm text-muted-foreground">{userProfile.email || "No email provided"}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Age</span>
                  <span>{userProfile.age || "Not specified"}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Gender</span>
                  <span>{userProfile.gender || "Not specified"}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Blood Type</span>
                  <span>{userProfile.bloodType || "Not specified"}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Phone</span>
                  <span>{userProfile.phone || "Not specified"}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => router.push("/dashboard/profile")}>
                Update Profile
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Upcoming Appointments</CardTitle>
              <CardDescription>Your scheduled doctor appointments</CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingAppointments.length > 0 ? (
                <div className="space-y-4">
                  {upcomingAppointments.map((appointment, index) => (
                    <div key={index} className="flex items-start justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage
                            src={appointment.image || "/placeholder.svg?height=40&width=40"}
                            alt={appointment.doctorName}
                          />
                          <AvatarFallback>{appointment.doctorName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{appointment.doctorName}</h4>
                          <p className="text-sm text-muted-foreground">{appointment.doctorSpecialty}</p>
                          <div className="flex items-center mt-2 text-sm">
                            <Calendar className="mr-1 h-4 w-4 text-muted-foreground" />
                            <span>{new Date(appointment.date).toLocaleDateString()}</span>
                            <Clock className="ml-3 mr-1 h-4 w-4 text-muted-foreground" />
                            <span>{appointment.time}</span>
                          </div>
                        </div>
                      </div>
                      <Badge
                        className={
                          appointment.status === "Confirmed"
                            ? "bg-healthcare-green/20 text-healthcare-green"
                            : "bg-healthcare-yellow/20 text-healthcare-yellow"
                        }
                      >
                        {appointment.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground mb-4">You don't have any upcoming appointments</p>
                  <Button onClick={() => router.push("/dashboard/doctors")}>Book an Appointment</Button>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="link" className="p-0" onClick={() => router.push("/dashboard/appointments")}>
                View all appointments
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
              <CardDescription>Your latest health activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                    <div className="p-2 bg-gray-100 rounded-full">{activity.icon}</div>
                    <div>
                      <h4 className="font-medium">{activity.title}</h4>
                      <p className="text-sm text-muted-foreground">{activity.description}</p>
                      <div className="flex items-center mt-1 text-xs text-muted-foreground">
                        <Clock className="mr-1 h-3 w-3" />
                        <span>
                          {activity.date} at {activity.time}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="link" className="p-0">
                View all activities
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>

        <Tabs defaultValue="vitals" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="vitals">Vitals</TabsTrigger>
            <TabsTrigger value="medications">Medications</TabsTrigger>
            <TabsTrigger value="treatments">Past Treatments</TabsTrigger>
          </TabsList>

          <TabsContent value="vitals">
            <Card>
              <CardHeader>
                <CardTitle>Your Vitals</CardTitle>
                <CardDescription>Track your health metrics over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-muted-foreground">Blood Pressure</p>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <h3 className="text-2xl font-bold mt-2">120/80</h3>
                      <p className="text-xs text-muted-foreground">Last updated: 2 weeks ago</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-muted-foreground">Heart Rate</p>
                        <Heart className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <h3 className="text-2xl font-bold mt-2">72 bpm</h3>
                      <p className="text-xs text-muted-foreground">Last updated: 2 weeks ago</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-muted-foreground">Blood Glucose</p>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <h3 className="text-2xl font-bold mt-2">98 mg/dL</h3>
                      <p className="text-xs text-muted-foreground">Last updated: 2 weeks ago</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <Button variant="outline" onClick={() => router.push("/dashboard/vitals")}>
                      View all vitals
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="medications">
            <Card>
              <CardHeader>
                <CardTitle>Your Medications</CardTitle>
                <CardDescription>Current prescriptions and medications</CardDescription>
              </CardHeader>
              <CardContent>
                {userProfile.medications && userProfile.medications.length > 0 ? (
                  <div className="space-y-4">
                    {userProfile.medications.map((medication, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <h4 className="font-medium">{medication.name}</h4>
                        <p className="text-sm text-muted-foreground">{medication.dosage}</p>
                      </div>
                    ))}
                    <div className="text-center">
                      <Button variant="outline" onClick={() => router.push("/dashboard/medicines")}>
                        View all medications
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground mb-4">No medications found</p>
                    <Button onClick={() => router.push("/dashboard/medicines")}>Browse Medicines</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="treatments">
            <PastTreatmentSection />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
