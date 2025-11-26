"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { FileText, Upload, Download, Trash2, Search, Plus, FileUp, Filter } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface MedicalRecord {
  id: string
  name: string
  type: "Prescription" | "Lab Report" | "Imaging" | "Discharge Summary" | "Other"
  date: string
  provider: string
  fileSize: string
  tags: string[]
  url?: string
}

export function PatientRecordsStorage() {
  const [records, setRecords] = useState<MedicalRecord[]>([])
  const [filteredRecords, setFilteredRecords] = useState<MedicalRecord[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [isUploading, setIsUploading] = useState(false)
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [newRecord, setNewRecord] = useState<Partial<MedicalRecord>>({
    name: "",
    type: "Prescription",
    date: new Date().toISOString().split("T")[0],
    provider: "",
    tags: [],
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching records
    const fetchRecords = async () => {
      setIsLoading(true)

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mock data
      const mockRecords: MedicalRecord[] = [
        {
          id: "REC-1001",
          name: "Hypertension Prescription",
          type: "Prescription",
          date: "2023-04-15",
          provider: "Dr. Sarah Johnson",
          fileSize: "245 KB",
          tags: ["Hypertension", "Medication"],
        },
        {
          id: "REC-1002",
          name: "Complete Blood Count Results",
          type: "Lab Report",
          date: "2023-03-22",
          provider: "City Medical Lab",
          fileSize: "1.2 MB",
          tags: ["Blood Test", "Routine"],
        },
        {
          id: "REC-1003",
          name: "Chest X-Ray",
          type: "Imaging",
          date: "2023-02-10",
          provider: "Radiology Center",
          fileSize: "3.5 MB",
          tags: ["X-Ray", "Chest", "Respiratory"],
        },
        {
          id: "REC-1004",
          name: "Hospital Discharge Summary",
          type: "Discharge Summary",
          date: "2023-01-05",
          provider: "General Hospital",
          fileSize: "450 KB",
          tags: ["Surgery", "Recovery"],
        },
        {
          id: "REC-1005",
          name: "Allergy Test Results",
          type: "Lab Report",
          date: "2022-12-12",
          provider: "Allergy Specialists",
          fileSize: "890 KB",
          tags: ["Allergies", "Immunology"],
        },
      ]

      setRecords(mockRecords)
      setFilteredRecords(mockRecords)
      setIsLoading(false)
    }

    fetchRecords()
  }, [])

  useEffect(() => {
    filterRecords(activeTab, searchTerm)
  }, [activeTab, searchTerm, records])

  const filterRecords = (tab: string, search: string) => {
    let filtered = [...records]

    // Filter by tab
    if (tab !== "all") {
      filtered = filtered.filter((record) => record.type.toLowerCase() === tab.toLowerCase())
    }

    // Filter by search
    if (search) {
      filtered = filtered.filter(
        (record) =>
          record.name.toLowerCase().includes(search.toLowerCase()) ||
          record.provider.toLowerCase().includes(search.toLowerCase()) ||
          record.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase())),
      )
    }

    setFilteredRecords(filtered)
  }

  const handleUpload = () => {
    setIsUploading(true)

    // Simulate upload process
    setTimeout(() => {
      const id = `REC-${1006 + records.length}`
      const newMedicalRecord: MedicalRecord = {
        id,
        name: newRecord.name || "Untitled Document",
        type: (newRecord.type as any) || "Other",
        date: newRecord.date || new Date().toISOString().split("T")[0],
        provider: newRecord.provider || "Unknown Provider",
        fileSize: "1.1 MB",
        tags: newRecord.tags || [],
      }

      setRecords((prev) => [newMedicalRecord, ...prev])

      toast({
        title: "Record Uploaded",
        description: `${newMedicalRecord.name} has been added to your records.`,
      })

      setIsUploading(false)
      setIsUploadDialogOpen(false)
      setNewRecord({
        name: "",
        type: "Prescription",
        date: new Date().toISOString().split("T")[0],
        provider: "",
        tags: [],
      })
    }, 2000)
  }

  const handleDeleteRecord = (id: string) => {
    setRecords((prev) => prev.filter((record) => record.id !== id))

    toast({
      title: "Record Deleted",
      description: "The medical record has been removed from your storage.",
    })
  }

  const handleDownloadRecord = (id: string, name: string) => {
    toast({
      title: "Downloading Record",
      description: `${name} is being prepared for download.`,
    })

    // Simulate download completion
    setTimeout(() => {
      toast({
        title: "Download Complete",
        description: "Your medical record has been downloaded.",
      })
    }, 2000)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>My Medical Records</CardTitle>
            <CardDescription>Securely store and access your health documents</CardDescription>
          </div>
          <Button onClick={() => setIsUploadDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Upload Record
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 items-center mb-6">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search records..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm" className="flex items-center ml-auto">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>

        <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Records</TabsTrigger>
            <TabsTrigger value="prescription">Prescriptions</TabsTrigger>
            <TabsTrigger value="lab report">Lab Reports</TabsTrigger>
            <TabsTrigger value="imaging">Imaging</TabsTrigger>
            <TabsTrigger value="discharge summary">Discharge Summaries</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-24 bg-muted animate-pulse rounded-md" />
                ))}
              </div>
            ) : filteredRecords.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No records found</h3>
                <p className="text-muted-foreground mt-1">Upload a new record or try a different search term.</p>
                <Button className="mt-4" onClick={() => setIsUploadDialogOpen(true)}>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Record
                </Button>
              </div>
            ) : (
              filteredRecords.map((record) => (
                <RecordCard
                  key={record.id}
                  record={record}
                  onDelete={handleDeleteRecord}
                  onDownload={handleDownloadRecord}
                />
              ))
            )}
          </TabsContent>

          {["prescription", "lab report", "imaging", "discharge summary"].map((tab) => (
            <TabsContent key={tab} value={tab} className="space-y-4">
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="h-24 bg-muted animate-pulse rounded-md" />
                  ))}
                </div>
              ) : filteredRecords.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No {tab}s found</h3>
                  <p className="text-muted-foreground mt-1">Upload a new record or try a different search term.</p>
                  <Button className="mt-4" onClick={() => setIsUploadDialogOpen(true)}>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Record
                  </Button>
                </div>
              ) : (
                filteredRecords.map((record) => (
                  <RecordCard
                    key={record.id}
                    record={record}
                    onDelete={handleDeleteRecord}
                    onDownload={handleDownloadRecord}
                  />
                ))
              )}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>

      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Medical Record</DialogTitle>
            <DialogDescription>Add a new medical record to your secure storage.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="record-name">Record Name</Label>
              <Input
                id="record-name"
                placeholder="e.g., Blood Test Results"
                value={newRecord.name}
                onChange={(e) => setNewRecord({ ...newRecord, name: e.target.value })}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="record-type">Record Type</Label>
              <Select
                value={newRecord.type}
                onValueChange={(value) => setNewRecord({ ...newRecord, type: value as any })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select record type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Prescription">Prescription</SelectItem>
                  <SelectItem value="Lab Report">Lab Report</SelectItem>
                  <SelectItem value="Imaging">Imaging</SelectItem>
                  <SelectItem value="Discharge Summary">Discharge Summary</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="record-date">Date</Label>
              <Input
                id="record-date"
                type="date"
                value={newRecord.date}
                onChange={(e) => setNewRecord({ ...newRecord, date: e.target.value })}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="record-provider">Healthcare Provider</Label>
              <Input
                id="record-provider"
                placeholder="e.g., Dr. Smith, City Hospital"
                value={newRecord.provider}
                onChange={(e) => setNewRecord({ ...newRecord, provider: e.target.value })}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="record-file">File</Label>
              <div className="border-2 border-dashed rounded-md p-6 text-center">
                <FileUp className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-2">Drag and drop your file here, or click to browse</p>
                <Button variant="outline" size="sm">
                  Select File
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpload} disabled={isUploading || !newRecord.name}>
              {isUploading ? "Uploading..." : "Upload Record"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

interface RecordCardProps {
  record: MedicalRecord
  onDelete: (id: string) => void
  onDownload: (id: string, name: string) => void
}

function RecordCard({ record, onDelete, onDownload }: RecordCardProps) {
  const getTypeColor = (type: string) => {
    switch (type) {
      case "Prescription":
        return "bg-healthcare-lightblue/50 text-healthcare-blue border-healthcare-blue/30"
      case "Lab Report":
        return "bg-healthcare-lightpurple/50 text-healthcare-purple border-healthcare-purple/30"
      case "Imaging":
        return "bg-healthcare-lightyellow/50 text-healthcare-yellow border-healthcare-yellow/30"
      case "Discharge Summary":
        return "bg-healthcare-lightgreen/50 text-healthcare-green border-healthcare-green/30"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="border rounded-lg p-4">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-muted-foreground" />
            <h3 className="font-medium">{record.name}</h3>
            <Badge className={getTypeColor(record.type)}>{record.type}</Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {record.provider} • {new Date(record.date).toLocaleDateString()}
          </p>
          <div className="flex flex-wrap gap-1 mt-2">
            {record.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-healthcare-red"
            onClick={() => onDelete(record.id)}
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-healthcare-blue"
            onClick={() => onDownload(record.id, record.name)}
          >
            <Download className="h-4 w-4" />
            <span className="sr-only">Download</span>
          </Button>
        </div>
      </div>
      <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
        <span>ID: {record.id}</span>
        <span>{record.fileSize}</span>
      </div>
    </div>
  )
}
