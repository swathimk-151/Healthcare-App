import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, FileText } from "lucide-react"

export default function LabTestsPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Lab Tests</h1>
          <p className="text-gray-500 mt-2">Browse and book lab tests</p>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Tests</TabsTrigger>
            <TabsTrigger value="popular">Popular</TabsTrigger>
            <TabsTrigger value="packages">Health Packages</TabsTrigger>
            <TabsTrigger value="booked">My Bookings</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <LabTestCard
                name="Complete Blood Count (CBC)"
                description="Measures different components of your blood"
                price="$25.99"
                duration="1 day"
                sampleType="Blood"
              />
              <LabTestCard
                name="Lipid Profile"
                description="Measures cholesterol and triglycerides"
                price="$35.50"
                duration="1 day"
                sampleType="Blood"
              />
              <LabTestCard
                name="Thyroid Function Test"
                description="Measures thyroid hormone levels"
                price="$45.00"
                duration="2 days"
                sampleType="Blood"
              />
              <LabTestCard
                name="Liver Function Test"
                description="Assesses liver function and detects liver damage"
                price="$40.00"
                duration="1 day"
                sampleType="Blood"
              />
              <LabTestCard
                name="Kidney Function Test"
                description="Evaluates how well your kidneys are working"
                price="$38.50"
                duration="1 day"
                sampleType="Blood, Urine"
              />
              <LabTestCard
                name="Vitamin D Test"
                description="Measures vitamin D levels in your blood"
                price="$30.00"
                duration="2 days"
                sampleType="Blood"
              />
            </div>
          </TabsContent>

          <TabsContent value="popular">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <LabTestCard
                name="Complete Blood Count (CBC)"
                description="Measures different components of your blood"
                price="$25.99"
                duration="1 day"
                sampleType="Blood"
              />
              <LabTestCard
                name="Lipid Profile"
                description="Measures cholesterol and triglycerides"
                price="$35.50"
                duration="1 day"
                sampleType="Blood"
              />
              <LabTestCard
                name="Thyroid Function Test"
                description="Measures thyroid hormone levels"
                price="$45.00"
                duration="2 days"
                sampleType="Blood"
              />
            </div>
          </TabsContent>

          <TabsContent value="packages">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <HealthPackageCard
                name="Basic Health Checkup"
                description="Essential tests to assess your overall health"
                price="$99.99"
                tests={["Complete Blood Count", "Lipid Profile", "Blood Glucose", "Liver Function"]}
              />
              <HealthPackageCard
                name="Comprehensive Health Checkup"
                description="Thorough assessment of your health status"
                price="$199.99"
                tests={[
                  "Complete Blood Count",
                  "Lipid Profile",
                  "Thyroid Function",
                  "Liver Function",
                  "Kidney Function",
                  "Vitamin D",
                  "Vitamin B12",
                ]}
              />
              <HealthPackageCard
                name="Diabetes Checkup"
                description="Tests focused on diabetes detection and monitoring"
                price="$89.99"
                tests={["Fasting Blood Glucose", "HbA1c", "Lipid Profile", "Kidney Function"]}
              />
            </div>
          </TabsContent>

          <TabsContent value="booked">
            <div className="space-y-4">
              <BookedTestCard
                name="Complete Blood Count (CBC)"
                bookingDate="May 10, 2023"
                status="Completed"
                result="Available"
              />
              <BookedTestCard name="Lipid Profile" bookingDate="May 15, 2023" status="Scheduled" result="Pending" />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

function LabTestCard({
  name,
  description,
  price,
  duration,
  sampleType,
}: {
  name: string
  description: string
  price: string
  duration: string
  sampleType: string
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between text-sm">
          <div className="flex items-center">
            <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
            <span>Results in: {duration}</span>
          </div>
          <div>
            <Badge variant="outline">{sampleType}</Badge>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between bg-muted/50 p-4">
        <div className="font-bold">{price}</div>
        <Button>Book Now</Button>
      </CardFooter>
    </Card>
  )
}

function HealthPackageCard({
  name,
  description,
  price,
  tests,
}: {
  name: string
  description: string
  price: string
  tests: string[]
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <h4 className="font-medium mb-2">Includes:</h4>
        <ul className="list-disc pl-5 space-y-1">
          {tests.map((test, index) => (
            <li key={index} className="text-sm">
              {test}
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="flex justify-between bg-muted/50 p-4">
        <div className="font-bold">{price}</div>
        <Button>Book Package</Button>
      </CardFooter>
    </Card>
  )
}

function BookedTestCard({
  name,
  bookingDate,
  status,
  result,
}: {
  name: string
  bookingDate: string
  status: "Scheduled" | "Completed" | "Cancelled"
  result: "Available" | "Pending" | "N/A"
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="font-medium text-lg">{name}</h3>
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <Calendar className="mr-1 h-4 w-4" />
              <span>Booked on: {bookingDate}</span>
            </div>
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-2 mt-4 md:mt-0">
            <Badge variant={status === "Completed" ? "default" : status === "Scheduled" ? "secondary" : "destructive"}>
              {status}
            </Badge>
            {result === "Available" ? (
              <Button size="sm" className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                View Results
              </Button>
            ) : (
              <Badge variant="outline">{result}</Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
