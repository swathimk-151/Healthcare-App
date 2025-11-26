import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { UserProfileProvider } from "@/contexts/user-profile-context"
import { AppointmentsProvider } from "@/contexts/appointments-context"
import { DoctorDataProvider } from "@/contexts/doctor-data-context"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Healthcare Web Application",
  description: "A comprehensive healthcare web application for patients, doctors, and administrators",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <UserProfileProvider>
            <AppointmentsProvider>
              <DoctorDataProvider>
                {children}
                <Toaster />
              </DoctorDataProvider>
            </AppointmentsProvider>
          </UserProfileProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
