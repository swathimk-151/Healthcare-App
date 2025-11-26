"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type UserProfile = {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  dob: string
  gender: string
  address: string
  city: string
  state: string
  zip: string
  allergies: string[]
  medications: Array<{ name: string; dosage: string }>
  conditions: Array<{ name: string; diagnosedYear: string }>
  familyHistory: Array<{ relation: string; condition: string }>
  hasCompletedOnboarding: boolean
}

const defaultProfile: UserProfile = {
  id: "P1001",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  dob: "",
  gender: "",
  address: "",
  city: "",
  state: "",
  zip: "",
  allergies: [],
  medications: [],
  conditions: [],
  familyHistory: [],
  hasCompletedOnboarding: false,
}

type UserProfileContextType = {
  userProfile: UserProfile
  updateUserProfile: (updates: Partial<UserProfile>) => void
  isFirstLogin: boolean
  setIsFirstLogin: (value: boolean) => void
  completeOnboarding: () => void
  isLoading: boolean
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined)

export function UserProfileProvider({ children }: { children: ReactNode }) {
  const [userProfile, setUserProfile] = useState<UserProfile>(defaultProfile)
  const [isFirstLogin, setIsFirstLogin] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Set isClient to true once the component is mounted
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Load profile from localStorage on initial render (client-side only)
  useEffect(() => {
    if (isClient) {
      const storedProfile = localStorage.getItem("userProfile")
      if (storedProfile) {
        try {
          const parsedProfile = JSON.parse(storedProfile)
          setUserProfile(parsedProfile)
          setIsFirstLogin(!parsedProfile.hasCompletedOnboarding)
        } catch (e) {
          console.error("Failed to parse stored profile:", e)
          // If parsing fails, use default profile
          setUserProfile(defaultProfile)
          setIsFirstLogin(true)
        }
      } else {
        // If no profile exists, this is a first login
        setIsFirstLogin(true)
      }
      setIsLoading(false)
    }
  }, [isClient])

  // Save profile to localStorage whenever it changes (client-side only)
  useEffect(() => {
    if (isClient && !isLoading) {
      localStorage.setItem("userProfile", JSON.stringify(userProfile))
    }
  }, [userProfile, isClient, isLoading])

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...updates }))
  }

  const completeOnboarding = () => {
    updateUserProfile({ hasCompletedOnboarding: true })
    setIsFirstLogin(false)
  }

  return (
    <UserProfileContext.Provider
      value={{
        userProfile,
        updateUserProfile,
        isFirstLogin,
        setIsFirstLogin,
        completeOnboarding,
        isLoading,
      }}
    >
      {children}
    </UserProfileContext.Provider>
  )
}

export function useUserProfile() {
  const context = useContext(UserProfileContext)
  if (context === undefined) {
    throw new Error("useUserProfile must be used within a UserProfileProvider")
  }
  return context
}
