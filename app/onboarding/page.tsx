"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUserProfile } from "@/contexts/user-profile-context"
import { PatientOnboarding } from "@/components/patient-onboarding"

export default function OnboardingPage() {
  const router = useRouter()
  const { isFirstLogin, userProfile } = useUserProfile()

  useEffect(() => {
    // If user has already completed onboarding, redirect to dashboard
    if (!isFirstLogin && userProfile.hasCompletedOnboarding) {
      router.push("/dashboard")
    }
  }, [isFirstLogin, userProfile.hasCompletedOnboarding, router])

  return <PatientOnboarding />
}
