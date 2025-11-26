"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Activity,
  Users,
  Calendar,
  FileText,
  ShoppingCart,
  Pill,
  FlaskRoundIcon as Flask,
  BarChart3,
  TrendingUp,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { AdminLayout } from "@/components/admin-layout"
import { useArticles } from "@/contexts/article-context"

export default function AdminDashboard() {
  const router = useRouter()
  const [admin, setAdmin] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { articles } = useArticles()

  // Mock data for dashboard
  const stats = {
    totalUsers: 1248,
    activeUsers: 946,
    newUsers: 87,
    totalDoctors: 42,
    activeDoctors: 38,
    totalAppointments: 3567,
    completedAppointments: 2984,
    pendingAppointments: 583,
    totalOrders: 1892,
    completedOrders: 1756,
    pendingOrders: 136,
    totalRevenue: 128750,
    monthlyRevenue: 24680,
    weeklyRevenue: 6240,
  }

  useEffect(() => {
    // Check if admin is logged in
    const adminData = localStorage.getItem("adminUser")

    if (adminData) {
      setAdmin(JSON.parse(adminData))
    } else {
      router.push("/admin/login")
    }

    setLoading(false)
  }, [router])

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!admin) {
    return null // Router will redirect
  }

  // Calculate percentages
  const userActivityRate = Math.round((stats.activeUsers / stats.totalUsers) * 100)
  const doctorActivityRate = Math.round((stats.activeDoctors / stats.totalDoctors) * 100)
  const appointmentCompletionRate = Math.round((stats.completedAppointments / stats.totalAppointments) * 100)
  const orderCompletionRate = Math.round((stats.completedOrders / stats.totalOrders) * 100)

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-gray-500 mt-2">Welcome back, {admin.name}</p>
          </div>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <Button
              className="bg-healthcare-purple hover:bg-healthcare-purple/90"
              onClick={() => router.push("/admin/reports")}
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              Reports
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                  <h3 className="text-2xl font-bold">{stats.totalUsers}</h3>
                </div>
                <div className="p-2 bg-blue-100 rounded-full">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <Progress value={userActivityRate} className="h-1 mt-4" />
              <p className="text-xs text-muted-foreground mt-2">
                {stats.activeUsers} active users ({userActivityRate}%)
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Appointments</p>
                  <h3 className="text-2xl font-bold">{stats.totalAppointments}</h3>
                </div>
                <div className="p-2 bg-green-100 rounded-full">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <Progress value={appointmentCompletionRate} className="h-1 mt-4" />
              <p className="text-xs text-muted-foreground mt-2">
                {stats.completedAppointments} completed ({appointmentCompletionRate}%)
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Orders</p>
                  <h3 className="text-2xl font-bold">{stats.totalOrders}</h3>
                </div>
                <div className="p-2 bg-purple-100 rounded-full">
                  <ShoppingCart className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <Progress value={orderCompletionRate} className="h-1 mt-4" />
              <p className="text-xs text-muted-foreground mt-2">
                {stats.completedOrders} fulfilled ({orderCompletionRate}%)
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Revenue</p>
                  <h3 className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</h3>
                </div>
                <div className="p-2 bg-yellow-100 rounded-full">
                  <Activity className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-xs text-green-500">${stats.monthlyRevenue.toLocaleString()} this month</span>
                </div>
                <div className="flex items-center">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-xs text-green-500">${stats.weeklyRevenue.toLocaleString()} this week</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Overview of recent platform activity</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="mr-4 p-2 bg-blue-100 rounded-full">
                        <Users className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">New User Registrations</p>
                        <p className="text-xs text-muted-foreground">{stats.newUsers} new users registered this week</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="mr-4 p-2 bg-green-100 rounded-full">
                        <Calendar className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Appointment Bookings</p>
                        <p className="text-xs text-muted-foreground">
                          {stats.pendingAppointments} pending appointments
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="mr-4 p-2 bg-purple-100 rounded-full">
                        <ShoppingCart className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Medicine Orders</p>
                        <p className="text-xs text-muted-foreground">
                          {stats.pendingOrders} orders awaiting fulfillment
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="mr-4 p-2 bg-yellow-100 rounded-full">
                        <FileText className="h-4 w-4 text-yellow-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Content Management</p>
                        <p className="text-xs text-muted-foreground">{articles.length} articles published</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common administrative tasks</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      variant="outline"
                      className="h-auto flex flex-col items-center justify-center p-4"
                      onClick={() => router.push("/admin/users")}
                    >
                      <Users className="h-6 w-6 mb-2" />
                      <span>Manage Users</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-auto flex flex-col items-center justify-center p-4"
                      onClick={() => router.push("/admin/appointments")}
                    >
                      <Calendar className="h-6 w-6 mb-2" />
                      <span>Appointments</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-auto flex flex-col items-center justify-center p-4"
                      onClick={() => router.push("/admin/medicines")}
                    >
                      <Pill className="h-6 w-6 mb-2" />
                      <span>Medicines</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-auto flex flex-col items-center justify-center p-4"
                      onClick={() => router.push("/admin/lab-tests")}
                    >
                      <Flask className="h-6 w-6 mb-2" />
                      <span>Lab Tests</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-auto flex flex-col items-center justify-center p-4"
                      onClick={() => router.push("/admin/orders")}
                    >
                      <ShoppingCart className="h-6 w-6 mb-2" />
                      <span>Orders</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-auto flex flex-col items-center justify-center p-4"
                      onClick={() => router.push("/admin/articles")}
                    >
                      <FileText className="h-6 w-6 mb-2" />
                      <span>Articles</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Analytics Overview</CardTitle>
                <CardDescription>Key performance metrics for the healthcare platform</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground py-10">
                  Analytics dashboard will be available in the next update.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Reports</CardTitle>
                <CardDescription>Generate and download reports</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground py-10">
                  Reports functionality will be available in the next update.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}
