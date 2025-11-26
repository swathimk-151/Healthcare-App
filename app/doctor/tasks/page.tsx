"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, Filter, Plus, CheckCircle2, Clock, AlertCircle, Calendar, User } from "lucide-react"
import { DoctorLayout } from "@/components/doctor-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useDoctorData } from "@/contexts/doctor-data-context"
import { toast } from "@/components/ui/use-toast"

export default function DoctorTasksPage() {
  const router = useRouter()
  const [doctor, setDoctor] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("pending")

  const { tasks, patients, completeTask, addTask } = useDoctorData()

  const [newTask, setNewTask] = useState({
    task: "",
    priority: "medium",
    due: "Today",
    patientId: "",
  })

  useEffect(() => {
    // Check if doctor is logged in
    const doctorData = localStorage.getItem("doctorUser")

    if (doctorData) {
      setDoctor(JSON.parse(doctorData))
    } else {
      router.push("/login")
    }

    setLoading(false)
  }, [router])

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!doctor) {
    return null // Router will redirect
  }

  // Filter tasks based on search term, priority, and active tab
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.task.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter
    const matchesTab =
      (activeTab === "pending" && !task.completed) ||
      (activeTab === "completed" && task.completed) ||
      activeTab === "all"

    return matchesSearch && matchesPriority && matchesTab
  })

  const handleCompleteTask = (taskId: number) => {
    completeTask(taskId)
    toast({
      title: "Task Completed",
      description: "The task has been marked as completed",
    })
  }

  const handleCreateTask = () => {
    if (!newTask.task) {
      toast({
        title: "Missing Information",
        description: "Please enter a task description",
        variant: "destructive",
      })
      return
    }

    addTask(newTask)

    toast({
      title: "Task Created",
      description: "New task has been added to your list",
    })

    setIsNewTaskOpen(false)
    // Reset form
    setNewTask({
      task: "",
      priority: "medium",
      due: "Today",
      patientId: "",
    })
  }

  return (
    <DoctorLayout>
      <div className="page-container">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="page-title text-healthcare-scrubs-green">Tasks</h1>
            <p className="page-subtitle">Manage your daily tasks and reminders</p>
          </div>
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <Dialog open={isNewTaskOpen} onOpenChange={setIsNewTaskOpen}>
              <DialogTrigger asChild>
                <Button className="btn-doctor">
                  <Plus className="mr-2 h-4 w-4" />
                  New Task
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Create New Task</DialogTitle>
                  <DialogDescription>Add a new task to your list</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="task" className="text-right">
                      Task
                    </Label>
                    <Input
                      id="task"
                      value={newTask.task}
                      onChange={(e) => setNewTask({ ...newTask, task: e.target.value })}
                      className="col-span-3"
                      placeholder="Enter task description"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="priority" className="text-right">
                      Priority
                    </Label>
                    <Select
                      value={newTask.priority}
                      onValueChange={(value) => setNewTask({ ...newTask, priority: value })}
                    >
                      <SelectTrigger id="priority" className="col-span-3">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="due" className="text-right">
                      Due
                    </Label>
                    <Select value={newTask.due} onValueChange={(value) => setNewTask({ ...newTask, due: value })}>
                      <SelectTrigger id="due" className="col-span-3">
                        <SelectValue placeholder="Select due date" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Today">Today</SelectItem>
                        <SelectItem value="Tomorrow">Tomorrow</SelectItem>
                        <SelectItem value="This week">This week</SelectItem>
                        <SelectItem value="Next week">Next week</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="patient" className="text-right">
                      Related Patient
                    </Label>
                    <Select
                      value={newTask.patientId}
                      onValueChange={(value) => setNewTask({ ...newTask, patientId: value })}
                    >
                      <SelectTrigger id="patient" className="col-span-3">
                        <SelectValue placeholder="Select patient (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {patients.map((patient) => (
                          <SelectItem key={patient.id} value={patient.id}>
                            {patient.name} ({patient.id})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsNewTaskOpen(false)}>
                    Cancel
                  </Button>
                  <Button className="btn-doctor" onClick={handleCreateTask}>
                    Create Task
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[150px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="pending" className="mb-6" onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="pending">Pending Tasks</TabsTrigger>
            <TabsTrigger value="completed">Completed Tasks</TabsTrigger>
            <TabsTrigger value="all">All Tasks</TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle>Pending Tasks</CardTitle>
                <CardDescription>Tasks that require your attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredTasks.map((task) => (
                    <TaskCard key={task.id} task={task} onComplete={handleCompleteTask} patients={patients} />
                  ))}
                  {filteredTasks.length === 0 && (
                    <div className="text-center py-4 text-muted-foreground">No pending tasks found</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="completed">
            <Card>
              <CardHeader>
                <CardTitle>Completed Tasks</CardTitle>
                <CardDescription>Tasks you have already completed</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredTasks.map((task) => (
                    <TaskCard key={task.id} task={task} onComplete={handleCompleteTask} patients={patients} />
                  ))}
                  {filteredTasks.length === 0 && (
                    <div className="text-center py-4 text-muted-foreground">No completed tasks found</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="all">
            <Card>
              <CardHeader>
                <CardTitle>All Tasks</CardTitle>
                <CardDescription>Complete task history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredTasks.map((task) => (
                    <TaskCard key={task.id} task={task} onComplete={handleCompleteTask} patients={patients} />
                  ))}
                  {filteredTasks.length === 0 && (
                    <div className="text-center py-4 text-muted-foreground">No tasks found</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DoctorLayout>
  )
}

function TaskCard({ task, onComplete, patients }: { task: any; onComplete: (id: number) => void; patients: any[] }) {
  const priorityIcons = {
    high: <AlertCircle className="h-5 w-5 text-healthcare-red" />,
    medium: <Clock className="h-5 w-5 text-healthcare-yellow" />,
    low: <CheckCircle2 className="h-5 w-5 text-healthcare-blue" />,
  }

  const priorityColors = {
    high: "bg-healthcare-red/20 text-healthcare-red",
    medium: "bg-healthcare-yellow/20 text-healthcare-yellow",
    low: "bg-healthcare-blue/20 text-healthcare-blue",
  }

  const priorityIcon = priorityIcons[task.priority as keyof typeof priorityIcons]
  const priorityColor = priorityColors[task.priority as keyof typeof priorityColors]

  const relatedPatient = task.patientId ? patients.find((p) => p.id === task.patientId) : null

  return (
    <div className="flex items-center justify-between p-3 border rounded-lg card-hover">
      <div className="flex items-center space-x-3">
        {priorityIcon}
        <div>
          <p className="font-medium">{task.task}</p>
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="mr-1 h-3 w-3" />
            <span>Due: {task.due}</span>
            {relatedPatient && (
              <>
                <span className="mx-1">•</span>
                <User className="mr-1 h-3 w-3" />
                <span>Patient: {relatedPatient.name}</span>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Badge className={priorityColor}>
          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
        </Badge>
        {!task.completed && (
          <Button variant="outline" size="sm" onClick={() => onComplete(task.id)}>
            Complete
          </Button>
        )}
        {task.completed && <Badge className="bg-healthcare-green/20 text-healthcare-green">Completed</Badge>}
      </div>
    </div>
  )
}
