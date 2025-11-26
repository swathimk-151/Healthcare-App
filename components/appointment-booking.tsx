"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"
import { CalendarIcon, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useAppointments } from "@/contexts/appointments-context"
import { useUserProfile } from "@/contexts/user-profile-context"

interface AppointmentBookingProps {
  doctorName: string
  doctorSpecialty: string
  doctorImage: string
  doctorId?: string
}

export function AppointmentBooking({
  doctorName,
  doctorSpecialty,
  doctorImage,
  doctorId = "D10001",
}: AppointmentBookingProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [date, setDate] = useState<Date>()
  const [timeSlot, setTimeSlot] = useState<string>("")
  const [appointmentType, setAppointmentType] = useState<string>("consultation")
  const [reason, setReason] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { addAppointment } = useAppointments()
  const { userProfile } = useUserProfile()

  // Available time slots
  const morningSlots = ["09:00 AM", "10:00 AM", "11:00 AM"]
  const afternoonSlots = ["01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"]
  const eveningSlots = ["05:00 PM", "06:00 PM", "07:00 PM"]

  // Available doctors by specialty with South Indian names
  const doctorsBySpecialty = {
    Cardiologist: ["Dr. Anand Subramanian", "Dr. Priya Venkatesh"],
    Dermatologist: ["Dr. Karthik Rajan", "Dr. Lakshmi Narayanan"],
    Neurologist: ["Dr. Srinivas Rao", "Dr. Divya Chandran"],
    "Orthopedic Surgeon": ["Dr. Ramesh Kumar", "Dr. Vijay Prakash"],
    Pediatrician: ["Dr. Suresh Menon", "Dr. Meena Sundaram"],
    "General Physician": ["Dr. Ganesh Iyer", "Dr. Rajesh Kumar"],
  }

  const handleBookAppointment = () => {
    if (!date || !timeSlot || !appointmentType) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // Create the appointment object
    const newAppointment = {
      patientId: userProfile?.id || "P10001",
      patientName: `${userProfile?.firstName || "Ms."} ${userProfile?.lastName || "Shruthi"}`,
      patientEmail: userProfile?.email || "shruthi@example.com",
      doctorName: doctorName,
      doctorId: doctorId,
      doctorSpecialty: doctorSpecialty,
      date: format(date, "yyyy-MM-dd"),
      time: timeSlot,
      type: appointmentType as any,
      status: "Scheduled" as const,
      reason: reason,
      image: doctorImage,
    }

    // Add the appointment to the context
    addAppointment(newAppointment)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsDialogOpen(false)

      toast({
        title: "Appointment Booked",
        description: `Your appointment with ${doctorName} has been scheduled for ${format(date, "PPP")} at ${timeSlot}.`,
      })

      // Reset form
      setDate(undefined)
      setTimeSlot("")
      setAppointmentType("consultation")
      setReason("")
    }, 1500)
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="btn-medical">Book Appointment</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-healthcare-hospital-blue">Book an Appointment</DialogTitle>
          <DialogDescription>
            Schedule an appointment with {doctorName}, {doctorSpecialty}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-4">
            <img
              src={doctorImage || "/placeholder.svg"}
              alt={doctorName}
              className="w-16 h-16 rounded-full object-cover border-2 border-healthcare-hospital-blue/30"
            />
            <div>
              <h3 className="font-medium">{doctorName}</h3>
              <p className="text-sm text-muted-foreground">{doctorSpecialty}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="doctor-select">Select Doctor</Label>
              <Select defaultValue={doctorName}>
                <SelectTrigger id="doctor-select" className="border-healthcare-hospital-blue/30">
                  <SelectValue placeholder="Select doctor" />
                </SelectTrigger>
                <SelectContent>
                  {doctorsBySpecialty[doctorSpecialty as keyof typeof doctorsBySpecialty]?.map((doctor) => (
                    <SelectItem key={doctor} value={doctor}>
                      {doctor}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialty-select">Specialty</Label>
              <Select defaultValue={doctorSpecialty}>
                <SelectTrigger id="specialty-select" className="border-healthcare-hospital-blue/30">
                  <SelectValue placeholder="Select specialty" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(doctorsBySpecialty).map((specialty) => (
                    <SelectItem key={specialty} value={specialty}>
                      {specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Select Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal border-healthcare-hospital-blue/30",
                    !date && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Select date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  disabled={(date) =>
                    date < new Date() || date > new Date(new Date().setMonth(new Date().getMonth() + 2))
                  }
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>Select Time</Label>
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Morning</Label>
                <div className="space-y-1">
                  {morningSlots.map((slot) => (
                    <Button
                      key={slot}
                      type="button"
                      variant={timeSlot === slot ? "default" : "outline"}
                      className={cn(
                        "w-full justify-start text-left text-xs h-8",
                        timeSlot === slot
                          ? "bg-healthcare-hospital-blue text-white"
                          : "border-healthcare-hospital-blue/30",
                      )}
                      onClick={() => setTimeSlot(slot)}
                    >
                      <Clock className="mr-2 h-3 w-3" />
                      {slot}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Afternoon</Label>
                <div className="space-y-1">
                  {afternoonSlots.map((slot) => (
                    <Button
                      key={slot}
                      type="button"
                      variant={timeSlot === slot ? "default" : "outline"}
                      className={cn(
                        "w-full justify-start text-left text-xs h-8",
                        timeSlot === slot
                          ? "bg-healthcare-hospital-blue text-white"
                          : "border-healthcare-hospital-blue/30",
                      )}
                      onClick={() => setTimeSlot(slot)}
                    >
                      <Clock className="mr-2 h-3 w-3" />
                      {slot}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Evening</Label>
                <div className="space-y-1">
                  {eveningSlots.map((slot) => (
                    <Button
                      key={slot}
                      type="button"
                      variant={timeSlot === slot ? "default" : "outline"}
                      className={cn(
                        "w-full justify-start text-left text-xs h-8",
                        timeSlot === slot
                          ? "bg-healthcare-hospital-blue text-white"
                          : "border-healthcare-hospital-blue/30",
                      )}
                      onClick={() => setTimeSlot(slot)}
                    >
                      <Clock className="mr-2 h-3 w-3" />
                      {slot}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Appointment Type</Label>
            <RadioGroup defaultValue="consultation" onValueChange={setAppointmentType}>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="consultation" id="consultation" />
                  <Label htmlFor="consultation">Consultation</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="follow-up" id="follow-up" />
                  <Label htmlFor="follow-up">Follow-up</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="check-up" id="check-up" />
                  <Label htmlFor="check-up">Check-up</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="emergency" id="emergency" />
                  <Label htmlFor="emergency">Emergency</Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Visit</Label>
            <Textarea
              id="reason"
              placeholder="Briefly describe your symptoms or reason for the appointment"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="border-healthcare-hospital-blue/30"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleBookAppointment} className="btn-medical" disabled={isSubmitting}>
            {isSubmitting ? "Booking..." : "Book Appointment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
