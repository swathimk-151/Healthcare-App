"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface RealTimeStatsProps {
  title: string
  initialValue: number
  interval?: number
  trend?: "up" | "down" | "stable"
  format?: (value: number) => string
}

export function RealTimeStats({
  title,
  initialValue,
  interval = 5000,
  trend = "up",
  format = (value) => value.toString(),
}: RealTimeStatsProps) {
  const [value, setValue] = useState(initialValue)
  const [loading, setLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setLoading(true)

      // Simulate a network request
      setTimeout(() => {
        const change = Math.random() * 5
        if (trend === "up") {
          setValue((prev) => Math.round((prev + change) * 10) / 10)
        } else if (trend === "down") {
          setValue((prev) => Math.max(0, Math.round((prev - change) * 10) / 10))
        } else {
          const fluctuation = (Math.random() - 0.5) * 5
          setValue((prev) => Math.round((prev + fluctuation) * 10) / 10)
        }
        setLoading(false)
        setLastUpdated(new Date())
      }, 800)
    }, interval)

    return () => clearInterval(timer)
  }, [interval, trend])

  return (
    <Card className="transition-all duration-300 hover:shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <div className={`text-2xl font-bold ${loading ? "opacity-40" : "opacity-100"} transition-opacity`}>
            {format(value)}
          </div>
          {loading && (
            <div className="absolute top-1 -right-1">
              <div className="h-2 w-2 bg-healthcare-blue rounded-full animate-pulse"></div>
            </div>
          )}
          <div className="flex items-center justify-between mt-2">
            <Badge variant="outline" className="text-xs bg-gray-50">
              Live
            </Badge>
            <span className="text-xs text-muted-foreground">Updated {formatTimeAgo(lastUpdated)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Create a wrapper component for the stats grid
export function RealTimeStatsWrapper() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <RealTimeStats
        title="Heart Rate"
        initialValue={72}
        interval={3000}
        trend="stable"
        format={(value) => `${value} bpm`}
      />
      <RealTimeStats
        title="Blood Pressure"
        initialValue={120}
        interval={4500}
        trend="stable"
        format={(value) => `${value}/80 mmHg`}
      />
      <RealTimeStats
        title="Blood Glucose"
        initialValue={95}
        interval={4000}
        trend="up"
        format={(value) => `${value} mg/dL`}
      />
      <RealTimeStats
        title="Body Temperature"
        initialValue={98.6}
        interval={5000}
        trend="stable"
        format={(value) => `${value}°F`}
      />
    </div>
  )
}

function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 5) return "just now"
  if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`

  return date.toLocaleTimeString()
}
