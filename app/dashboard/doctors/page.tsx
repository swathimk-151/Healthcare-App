"use client"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Calendar, Star } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AppointmentBooking } from "@/components/appointment-booking"

export default function DoctorsPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Find a Doctor</h1>
          <p className="text-gray-500 mt-2">Book appointments with specialists</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input type="search" placeholder="Search doctors by name or specialty..." className="pl-8" />
            </div>
          </div>
          <div className="flex gap-2">
            <Select defaultValue="speciality">
              <SelectTrigger>
                <SelectValue placeholder="Specialty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Specialties</SelectItem>
                <SelectItem value="cardiology">Cardiology</SelectItem>
                <SelectItem value="dermatology">Dermatology</SelectItem>
                <SelectItem value="neurology">Neurology</SelectItem>
                <SelectItem value="orthopedics">Orthopedics</SelectItem>
                <SelectItem value="pediatrics">Pediatrics</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Doctors</TabsTrigger>
            <TabsTrigger value="popular">Popular</TabsTrigger>
            <TabsTrigger value="available">Available Today</TabsTrigger>
            <TabsTrigger value="appointments">My Appointments</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DoctorCard
                name="Dr. Sarah Johnson"
                specialty="Cardiologist"
                experience="15 years"
                rating={4.8}
                reviews={120}
                availability="Available Today"
                image="/placeholder.svg?height=100&width=100"
              />
              <DoctorCard
                name="Dr. Michael Chen"
                specialty="Dermatologist"
                experience="10 years"
                rating={4.6}
                reviews={95}
                availability="Next Available: Tomorrow"
                image="/placeholder.svg?height=100&width=100"
              />
              <DoctorCard
                name="Dr. Emily Williams"
                specialty="Neurologist"
                experience="12 years"
                rating={4.9}
                reviews={150}
                availability="Available Today"
                image="/placeholder.svg?height=100&width=100"
              />
              <DoctorCard
                name="Dr. Robert Brown"
                specialty="Orthopedic Surgeon"
                experience="20 years"
                rating={4.7}
                reviews={200}
                availability="Next Available: May 18"
                image="/placeholder.svg?height=100&width=100"
              />
              <DoctorCard
                name="Dr. Lisa Martinez"
                specialty="Pediatrician"
                experience="8 years"
                rating={4.5}
                reviews={85}
                availability="Available Today"
                image="/placeholder.svg?height=100&width=100"
              />
              <DoctorCard
                name="Dr. James Wilson"
                specialty="General Physician"
                experience="14 years"
                rating={4.4}
                reviews={110}
                availability="Next Available: May 17"
                image="/placeholder.svg?height=100&width=100"
              />
            </div>
          </TabsContent>

          <TabsContent value="popular">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DoctorCard
                name="Dr. Sarah Johnson"
                specialty="Cardiologist"
                experience="15 years"
                rating={4.8}
                reviews={120}
                availability="Available Today"
                image="/placeholder.svg?height=100&width=100"
              />
              <DoctorCard
                name="Dr. Emily Williams"
                specialty="Neurologist"
                experience="12 years"
                rating={4.9}
                reviews={150}
                availability="Available Today"
                image="/placeholder.svg?height=100&width=100"
              />
              <DoctorCard
                name="Dr. Robert Brown"
                specialty="Orthopedic Surgeon"
                experience="20 years"
                rating={4.7}
                reviews={200}
                availability="Next Available: May 18"
                image="/placeholder.svg?height=100&width=100"
              />
            </div>
          </TabsContent>

          <TabsContent value="available">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DoctorCard
                name="Dr. Sarah Johnson"
                specialty="Cardiologist"
                experience="15 years"
                rating={4.8}
                reviews={120}
                availability="Available Today"
                image="/placeholder.svg?height=100&width=100"
              />
              <DoctorCard
                name="Dr. Emily Williams"
                specialty="Neurologist"
                experience="12 years"
                rating={4.9}
                reviews={150}
                availability="Available Today"
                image="/placeholder.svg?height=100&width=100"
              />
              <DoctorCard
                name="Dr. Lisa Martinez"
                specialty="Pediatrician"
                experience="8 years"
                rating={4.5}
                reviews={85}
                availability="Available Today"
                image="/placeholder.svg?height=100&width=100"
              />
            </div>
          </TabsContent>

          <TabsContent value="appointments">
            <div className="space-y-4">
              <AppointmentCard
                doctorName="Dr. Sarah Johnson"
                specialty="Cardiologist"
                date="May 15, 2023"
                time="10:00 AM"
                status="Confirmed"
                image="/placeholder.svg?height=60&width=60"
              />
              <AppointmentCard
                doctorName="Dr. Michael Chen"
                specialty="Dermatologist"
                date="May 22, 2023"
                time="2:30 PM"
                status="Scheduled"
                image="/placeholder.svg?height=60&width=60"
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

function DoctorCard({
  name,
  specialty,
  experience,
  rating,
  reviews,
  availability,
  image,
}: {
  name: string
  specialty: string
  experience: string
  rating: number
  reviews: number
  availability: string
  image: string
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex">
          <div className="mr-4">
            <img src={image || "/placeholder.svg"} alt={name} className="w-24 h-24 rounded-full object-cover" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-lg">{name}</h3>
            <p className="text-sm text-muted-foreground">{specialty}</p>
            <p className="text-sm text-muted-foreground">{experience} experience</p>
            <div className="flex items-center mt-1">
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              <span className="text-sm ml-1">
                {rating} ({reviews} reviews)
              </span>
            </div>
            <div className="mt-2">
              <Badge variant={availability.includes("Available Today") ? "default" : "secondary"}>{availability}</Badge>
            </div>
          </div>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <Button variant="outline" size="sm">
            View Profile
          </Button>
          <AppointmentBooking doctorName={name} doctorSpecialty={specialty} doctorImage={image} />
        </div>
      </CardContent>
    </Card>
  )
}

function AppointmentCard({
  doctorName,
  specialty,
  date,
  time,
  status,
  image,
}: {
  doctorName: string
  specialty: string
  date: string
  time: string
  status: "Confirmed" | "Scheduled" | "Completed" | "Cancelled"
  image: string
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center">
          <div className="mr-4">
            <img src={image || "/placeholder.svg"} alt={doctorName} className="w-16 h-16 rounded-full object-cover" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium">{doctorName}</h3>
            <p className="text-sm text-muted-foreground">{specialty}</p>
            <div className="flex items-center mt-1">
              <Calendar className="h-4 w-4 text-muted-foreground mr-1" />
              <span className="text-sm">
                {date} at {time}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge
              variant={
                status === "Confirmed"
                  ? "default"
                  : status === "Scheduled"
                    ? "secondary"
                    : status === "Completed"
                      ? "outline"
                      : "destructive"
              }
            >
              {status}
            </Badge>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Reschedule
              </Button>
              <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
