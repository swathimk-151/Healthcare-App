"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, User, FileText, Pill } from "lucide-react"

// Sample past treatment data with Indian Tamil names
const pastTreatments = [
  {
    id: 1,
    doctor: "Dr. Anand Subramanian",
    specialty: "Cardiologist",
    date: "May 10, 2023",
    time: "10:30 AM",
    diagnosis: "Hypertension",
    medications: [
      { name: "Amlodipine", dosage: "5mg", frequency: "Once daily" },
      { name: "Losartan", dosage: "50mg", frequency: "Once daily" },
    ],
    notes:
      "Blood pressure slightly elevated. Recommended lifestyle changes including reduced salt intake and regular exercise.",
    followUp: "3 months",
  },
  {
    id: 2,
    doctor: "Dr. Lakshmi Narayanan",
    specialty: "Endocrinologist",
    date: "April 5, 2023",
    time: "2:00 PM",
    diagnosis: "Type 2 Diabetes",
    medications: [{ name: "Metformin", dosage: "500mg", frequency: "Twice daily" }],
    notes: "HbA1c levels at 7.2%. Discussed diet modifications and importance of regular glucose monitoring.",
    followUp: "2 months",
  },
  {
    id: 3,
    doctor: "Dr. Senthil Murugan",
    specialty: "Orthopedic Surgeon",
    date: "March 15, 2023",
    time: "11:00 AM",
    diagnosis: "Lumbar Strain",
    medications: [
      { name: "Diclofenac", dosage: "50mg", frequency: "Twice daily as needed" },
      { name: "Methocarbamol", dosage: "750mg", frequency: "Three times daily" },
    ],
    notes: "Lower back pain due to improper lifting technique. Recommended physical therapy and proper ergonomics.",
    followUp: "1 month",
  },
]

export function PastTreatmentSection() {
  const [selectedTab, setSelectedTab] = useState("consultations")

  return (
    <Card>
      <CardHeader>
        <CardTitle>Past Treatment History</CardTitle>
        <CardDescription>Your previous consultations, diagnoses, and treatments</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="consultations" onValueChange={setSelectedTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="consultations">Consultations</TabsTrigger>
            <TabsTrigger value="diagnoses">Diagnoses</TabsTrigger>
            <TabsTrigger value="medications">Medications</TabsTrigger>
          </TabsList>

          <TabsContent value="consultations">
            <div className="space-y-4">
              {pastTreatments.map((treatment) => (
                <div key={treatment.id} className="border rounded-lg p-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                    <div className="flex items-center">
                      <User className="h-5 w-5 text-healthcare-blue mr-2" />
                      <h3 className="font-medium">{treatment.doctor}</h3>
                      <Badge className="ml-2 bg-healthcare-lightblue/30 text-healthcare-blue border-healthcare-blue/30">
                        {treatment.specialty}
                      </Badge>
                    </div>
                    <div className="flex items-center mt-2 md:mt-0">
                      <Calendar className="h-4 w-4 text-gray-500 mr-1" />
                      <span className="text-sm text-gray-500 mr-3">{treatment.date}</span>
                      <Clock className="h-4 w-4 text-gray-500 mr-1" />
                      <span className="text-sm text-gray-500">{treatment.time}</span>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="flex items-start">
                      <FileText className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                      <div>
                        <p className="font-medium">Diagnosis: {treatment.diagnosis}</p>
                        <p className="text-sm text-gray-600 mt-1">{treatment.notes}</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="flex items-start">
                      <Pill className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                      <div>
                        <p className="font-medium">Medications:</p>
                        <ul className="list-disc list-inside text-sm text-gray-600 mt-1">
                          {treatment.medications.map((med, index) => (
                            <li key={index}>
                              {med.name} {med.dosage} - {med.frequency}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 text-sm text-gray-600">Follow-up in {treatment.followUp}</div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="diagnoses">
            <div className="space-y-4">
              {pastTreatments.map((treatment) => (
                <div key={treatment.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="font-medium">{treatment.diagnosis}</h3>
                      <p className="text-sm text-gray-500">Diagnosed on {treatment.date}</p>
                    </div>
                    <Badge className="bg-healthcare-lightblue/30 text-healthcare-blue border-healthcare-blue/30">
                      {treatment.specialty}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">{treatment.notes}</p>
                  <div className="mt-3 text-sm">
                    <span className="font-medium">Treating Doctor:</span> {treatment.doctor}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="medications">
            <div className="space-y-4">
              {pastTreatments.flatMap((treatment) =>
                treatment.medications.map((med, index) => (
                  <div key={`${treatment.id}-${index}`} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">
                          {med.name} {med.dosage}
                        </h3>
                        <p className="text-sm text-gray-500">{med.frequency}</p>
                      </div>
                      <Badge className="bg-healthcare-lightgreen/30 text-healthcare-green border-healthcare-green/30">
                        Active
                      </Badge>
                    </div>
                    <div className="mt-3 text-sm">
                      <p>
                        <span className="font-medium">Prescribed for:</span> {treatment.diagnosis}
                      </p>
                      <p>
                        <span className="font-medium">Prescribed by:</span> {treatment.doctor}
                      </p>
                      <p>
                        <span className="font-medium">Prescribed on:</span> {treatment.date}
                      </p>
                    </div>
                  </div>
                )),
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
