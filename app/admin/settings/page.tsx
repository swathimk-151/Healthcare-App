"use client"

import type React from "react"

import { useState } from "react"
import { AdminLayout } from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Loader2, Save } from "lucide-react"

export default function AdminSettingsPage() {
  const [isSaving, setIsSaving] = useState(false)

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)
      toast({
        title: "Settings saved",
        description: "General settings have been updated successfully.",
      })
    }, 1500)
  }

  const handleSaveAppearance = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)
      toast({
        title: "Settings saved",
        description: "Appearance settings have been updated successfully.",
      })
    }, 1500)
  }

  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)
      toast({
        title: "Settings saved",
        description: "Notification settings have been updated successfully.",
      })
    }, 1500)
  }

  const handleSaveSecurity = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)
      toast({
        title: "Settings saved",
        description: "Security settings have been updated successfully.",
      })
    }, 1500)
  }

  const handleSaveIntegrations = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)
      toast({
        title: "Settings saved",
        description: "Integration settings have been updated successfully.",
      })
    }, 1500)
  }

  return (
    <AdminLayout>
      <div className="page-container">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="page-title gradient-text-purple">System Settings</h1>
            <p className="page-subtitle">Configure and manage platform settings</p>
          </div>
          <Button
            className="bg-healthcare-purple hover:bg-healthcare-purple/90 mt-4 md:mt-0"
            onClick={() => {
              toast({
                title: "Settings saved",
                description: "All settings have been updated successfully.",
              })
            }}
          >
            <Save className="mr-2 h-4 w-4" />
            Save All Settings
          </Button>
        </div>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Configure basic platform settings</CardDescription>
              </CardHeader>
              <form onSubmit={handleSaveGeneral}>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Platform Information</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="platform-name">Platform Name</Label>
                        <Input id="platform-name" defaultValue="HealthCare" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="platform-url">Platform URL</Label>
                        <Input id="platform-url" defaultValue="https://healthcare.example.com" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="platform-description">Platform Description</Label>
                      <Textarea
                        id="platform-description"
                        defaultValue="A comprehensive healthcare web application for managing appointments, medicines, and health information."
                      />
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="text-lg font-medium">Contact Information</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="contact-email">Contact Email</Label>
                        <Input id="contact-email" defaultValue="contact@healthcare.example.com" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="support-email">Support Email</Label>
                        <Input id="support-email" defaultValue="support@healthcare.example.com" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone-number">Phone Number</Label>
                        <Input id="phone-number" defaultValue="+1 (555) 123-4567" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input id="address" defaultValue="123 Healthcare St, Medical City, MC 12345" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="text-lg font-medium">Regional Settings</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="timezone">Default Timezone</Label>
                        <Select defaultValue="America/New_York">
                          <SelectTrigger id="timezone">
                            <SelectValue placeholder="Select timezone" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                            <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                            <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                            <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                            <SelectItem value="Europe/London">Greenwich Mean Time (GMT)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="date-format">Date Format</Label>
                        <Select defaultValue="MM/DD/YYYY">
                          <SelectTrigger id="date-format">
                            <SelectValue placeholder="Select date format" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                            <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                            <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="currency">Default Currency</Label>
                        <Select defaultValue="USD">
                          <SelectTrigger id="currency">
                            <SelectValue placeholder="Select currency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="USD">US Dollar (USD)</SelectItem>
                            <SelectItem value="EUR">Euro (EUR)</SelectItem>
                            <SelectItem value="GBP">British Pound (GBP)</SelectItem>
                            <SelectItem value="CAD">Canadian Dollar (CAD)</SelectItem>
                            <SelectItem value="AUD">Australian Dollar (AUD)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="language">Default Language</Label>
                        <Select defaultValue="en-US">
                          <SelectTrigger id="language">
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en-US">English (US)</SelectItem>
                            <SelectItem value="en-GB">English (UK)</SelectItem>
                            <SelectItem value="es">Spanish</SelectItem>
                            <SelectItem value="fr">French</SelectItem>
                            <SelectItem value="de">German</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    type="submit"
                    disabled={isSaving}
                    className="bg-healthcare-purple hover:bg-healthcare-purple/90"
                  >
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isSaving ? "Saving..." : "Save General Settings"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
                <CardDescription>Customize the look and feel of the platform</CardDescription>
              </CardHeader>
              <form onSubmit={handleSaveAppearance}>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Branding</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="logo-url">Logo URL</Label>
                        <Input id="logo-url" defaultValue="/logo.png" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="favicon-url">Favicon URL</Label>
                        <Input id="favicon-url" defaultValue="/favicon.ico" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="text-lg font-medium">Theme Colors</h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="primary-color">Primary Color</Label>
                        <div className="flex">
                          <Input id="primary-color" defaultValue="#5B8DEF" />
                          <div className="w-10 h-10 ml-2 rounded border" style={{ backgroundColor: "#5B8DEF" }}></div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="secondary-color">Secondary Color</Label>
                        <div className="flex">
                          <Input id="secondary-color" defaultValue="#8256C0" />
                          <div className="w-10 h-10 ml-2 rounded border" style={{ backgroundColor: "#8256C0" }}></div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="accent-color">Accent Color</Label>
                        <div className="flex">
                          <Input id="accent-color" defaultValue="#4FB06F" />
                          <div className="w-10 h-10 ml-2 rounded border" style={{ backgroundColor: "#4FB06F" }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="text-lg font-medium">Layout Options</h3>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Enable Dark Mode</p>
                        <p className="text-sm text-muted-foreground">
                          Allow users to switch between light and dark mode
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Compact Layout</p>
                        <p className="text-sm text-muted-foreground">Use a more compact layout with less whitespace</p>
                      </div>
                      <Switch />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Show Footer</p>
                        <p className="text-sm text-muted-foreground">Display the footer section on all pages</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    type="submit"
                    disabled={isSaving}
                    className="bg-healthcare-purple hover:bg-healthcare-purple/90"
                  >
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isSaving ? "Saving..." : "Save Appearance Settings"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Configure email and system notifications</CardDescription>
              </CardHeader>
              <form onSubmit={handleSaveNotifications}>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Email Notifications</h3>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">New User Registration</p>
                        <p className="text-sm text-muted-foreground">Send email when a new user registers</p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Appointment Reminders</p>
                        <p className="text-sm text-muted-foreground">Send email reminders for upcoming appointments</p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Order Status Updates</p>
                        <p className="text-sm text-muted-foreground">Send email when order status changes</p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Lab Test Results</p>
                        <p className="text-sm text-muted-foreground">Send email when lab test results are available</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="text-lg font-medium">Admin Notifications</h3>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">New User Registrations</p>
                        <p className="text-sm text-muted-foreground">Notify admins when new users register</p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">New Orders</p>
                        <p className="text-sm text-muted-foreground">Notify admins when new orders are placed</p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Low Stock Alerts</p>
                        <p className="text-sm text-muted-foreground">Notify admins when medicine stock is low</p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">System Errors</p>
                        <p className="text-sm text-muted-foreground">Notify admins when system errors occur</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="text-lg font-medium">Email Configuration</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="smtp-host">SMTP Host</Label>
                        <Input id="smtp-host" defaultValue="smtp.example.com" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="smtp-port">SMTP Port</Label>
                        <Input id="smtp-port" defaultValue="587" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="smtp-username">SMTP Username</Label>
                        <Input id="smtp-username" defaultValue="notifications@healthcare.example.com" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="smtp-password">SMTP Password</Label>
                        <Input id="smtp-password" type="password" defaultValue="••••••••••••" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="from-email">From Email</Label>
                      <Input id="from-email" defaultValue="no-reply@healthcare.example.com" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    type="submit"
                    disabled={isSaving}
                    className="bg-healthcare-purple hover:bg-healthcare-purple/90"
                  >
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isSaving ? "Saving..." : "Save Notification Settings"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Configure security and privacy settings</CardDescription>
              </CardHeader>
              <form onSubmit={handleSaveSecurity}>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Authentication</h3>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Two-Factor Authentication</p>
                        <p className="text-sm text-muted-foreground">
                          Require two-factor authentication for all admin users
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Email Verification</p>
                        <p className="text-sm text-muted-foreground">
                          Require email verification for new user accounts
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password-policy">Password Policy</Label>
                      <Select defaultValue="strong">
                        <SelectTrigger id="password-policy">
                          <SelectValue placeholder="Select password policy" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="basic">Basic (8+ characters)</SelectItem>
                          <SelectItem value="medium">Medium (8+ chars, letters & numbers)</SelectItem>
                          <SelectItem value="strong">Strong (8+ chars, uppercase, lowercase, numbers)</SelectItem>
                          <SelectItem value="very-strong">
                            Very Strong (12+ chars, uppercase, lowercase, numbers, symbols)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                      <Input id="session-timeout" type="number" defaultValue="30" />
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="text-lg font-medium">Privacy</h3>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Cookie Consent</p>
                        <p className="text-sm text-muted-foreground">Show cookie consent banner to users</p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Data Anonymization</p>
                        <p className="text-sm text-muted-foreground">Anonymize user data in reports and analytics</p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="privacy-policy">Privacy Policy URL</Label>
                      <Input id="privacy-policy" defaultValue="/privacy-policy" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="terms-of-service">Terms of Service URL</Label>
                      <Input id="terms-of-service" defaultValue="/terms-of-service" />
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="text-lg font-medium">Security Measures</h3>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">HTTPS Only</p>
                        <p className="text-sm text-muted-foreground">Force all connections to use HTTPS</p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Rate Limiting</p>
                        <p className="text-sm text-muted-foreground">
                          Limit login attempts to prevent brute force attacks
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">IP Whitelisting</p>
                        <p className="text-sm text-muted-foreground">Restrict admin access to specific IP addresses</p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    type="submit"
                    disabled={isSaving}
                    className="bg-healthcare-purple hover:bg-healthcare-purple/90"
                  >
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isSaving ? "Saving..." : "Save Security Settings"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="integrations">
            <Card>
              <CardHeader>
                <CardTitle>Integration Settings</CardTitle>
                <CardDescription>Configure third-party service integrations</CardDescription>
              </CardHeader>
              <form onSubmit={handleSaveIntegrations}>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Payment Gateways</h3>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Stripe</p>
                          <p className="text-sm text-muted-foreground">Process payments using Stripe</p>
                        </div>
                        <Switch defaultChecked />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6">
                        <div className="space-y-2">
                          <Label htmlFor="stripe-public-key">Stripe Public Key</Label>
                          <Input id="stripe-public-key" defaultValue="pk_test_..." />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="stripe-secret-key">Stripe Secret Key</Label>
                          <Input id="stripe-secret-key" type="password" defaultValue="sk_test_..." />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">PayPal</p>
                          <p className="text-sm text-muted-foreground">Process payments using PayPal</p>
                        </div>
                        <Switch />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6">
                        <div className="space-y-2">
                          <Label htmlFor="paypal-client-id">PayPal Client ID</Label>
                          <Input id="paypal-client-id" defaultValue="" disabled />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="paypal-secret">PayPal Secret</Label>
                          <Input id="paypal-secret" type="password" defaultValue="" disabled />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="text-lg font-medium">Analytics</h3>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Google Analytics</p>
                          <p className="text-sm text-muted-foreground">Track website usage with Google Analytics</p>
                        </div>
                        <Switch defaultChecked />
                      </div>

                      <div className="space-y-2 pl-6">
                        <Label htmlFor="ga-tracking-id">Tracking ID</Label>
                        <Input id="ga-tracking-id" defaultValue="G-XXXXXXXXXX" />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Hotjar</p>
                          <p className="text-sm text-muted-foreground">Analyze user behavior with Hotjar</p>
                        </div>
                        <Switch />
                      </div>

                      <div className="space-y-2 pl-6">
                        <Label htmlFor="hotjar-site-id">Site ID</Label>
                        <Input id="hotjar-site-id" defaultValue="" disabled />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="text-lg font-medium">Communication</h3>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Twilio SMS</p>
                          <p className="text-sm text-muted-foreground">Send SMS notifications via Twilio</p>
                        </div>
                        <Switch defaultChecked />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6">
                        <div className="space-y-2">
                          <Label htmlFor="twilio-account-sid">Account SID</Label>
                          <Input id="twilio-account-sid" defaultValue="AC..." />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="twilio-auth-token">Auth Token</Label>
                          <Input id="twilio-auth-token" type="password" defaultValue="..." />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="twilio-phone-number">Phone Number</Label>
                          <Input id="twilio-phone-number" defaultValue="+1..." />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Mailchimp</p>
                          <p className="text-sm text-muted-foreground">Manage email marketing campaigns</p>
                        </div>
                        <Switch />
                      </div>

                      <div className="space-y-2 pl-6">
                        <Label htmlFor="mailchimp-api-key">API Key</Label>
                        <Input id="mailchimp-api-key" defaultValue="" disabled />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    type="submit"
                    disabled={isSaving}
                    className="bg-healthcare-purple hover:bg-healthcare-purple/90"
                  >
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isSaving ? "Saving..." : "Save Integration Settings"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}
