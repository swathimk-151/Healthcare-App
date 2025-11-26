"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"
import { Check, Clock, Package, Truck, X } from "lucide-react"

// Sample orders data
const initialOrders = [
  {
    id: "ORD-12345",
    date: "2023-05-10",
    items: ["Paracetamol 500mg", "Vitamin D3 1000 IU"],
    status: "Processing",
    total: 14.98,
  },
  {
    id: "ORD-12346",
    date: "2023-05-08",
    items: ["Amoxicillin 250mg", "Ibuprofen 200mg"],
    status: "Shipped",
    total: 18.99,
  },
  {
    id: "ORD-12347",
    date: "2023-05-05",
    items: ["Aspirin 81mg", "Loratadine 10mg"],
    status: "Delivered",
    total: 14.98,
  },
  {
    id: "ORD-12348",
    date: "2023-05-01",
    items: ["Vitamin B12 500mcg", "Zinc 50mg"],
    status: "Delivered",
    total: 22.5,
  },
]

type OrderStatus = "Processing" | "Shipped" | "Delivered" | "Cancelled"

interface Order {
  id: string
  date: string
  items: string[]
  status: OrderStatus
  total: number
}

export function MedicineOrderTable() {
  const [orders, setOrders] = useState<Order[]>(initialOrders)
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  const refreshOrders = () => {
    setRefreshing(true)

    // Simulate network request
    setTimeout(() => {
      // Randomly update an order status
      const updatedOrders = [...orders]
      const randomIndex = Math.floor(Math.random() * updatedOrders.length)
      const currentStatus = updatedOrders[randomIndex].status

      let newStatus: OrderStatus = currentStatus
      if (currentStatus === "Processing") {
        newStatus = "Shipped"
      } else if (currentStatus === "Shipped") {
        newStatus = "Delivered"
      }

      // Only update if the status changed
      if (newStatus !== currentStatus) {
        updatedOrders[randomIndex].status = newStatus
        setOrders(updatedOrders)

        toast({
          title: "Order Status Updated",
          description: `Order ${updatedOrders[randomIndex].id} is now ${newStatus}`,
        })
      }

      setRefreshing(false)
    }, 1200)
  }

  useEffect(() => {
    // Automatically refresh orders every 30 seconds
    const interval = setInterval(refreshOrders, 30000)
    return () => clearInterval(interval)
  }, [orders])

  const cancelOrder = (orderId: string) => {
    setLoading(true)

    // Simulate network request
    setTimeout(() => {
      const updatedOrders = orders.map((order) =>
        order.id === orderId ? { ...order, status: "Cancelled" as OrderStatus } : order,
      )

      setOrders(updatedOrders)

      toast({
        title: "Order Cancelled",
        description: `Order ${orderId} has been cancelled.`,
      })

      setLoading(false)
    }, 1000)
  }

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case "Processing":
        return <Clock className="h-4 w-4" />
      case "Shipped":
        return <Truck className="h-4 w-4" />
      case "Delivered":
        return <Check className="h-4 w-4" />
      case "Cancelled":
        return <X className="h-4 w-4" />
      default:
        return <Package className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "Processing":
        return "bg-healthcare-lightyellow/50 text-healthcare-yellow border-healthcare-yellow/30"
      case "Shipped":
        return "bg-healthcare-lightblue/50 text-healthcare-blue border-healthcare-blue/30"
      case "Delivered":
        return "bg-healthcare-lightgreen/50 text-healthcare-green border-healthcare-green/30"
      case "Cancelled":
        return "bg-healthcare-lightred/50 text-healthcare-red border-healthcare-red/30"
      default:
        return ""
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Medicine Orders</CardTitle>
        <Button variant="outline" size="sm" onClick={refreshOrders} disabled={refreshing} className="relative">
          {refreshing ? "Updating..." : "Refresh"}
          {refreshing && (
            <span className="absolute top-0 right-0">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-healthcare-blue opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-healthcare-blue"></span>
              </span>
            </span>
          )}
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="max-w-[200px] truncate">{order.items.join(", ")}</div>
                </TableCell>
                <TableCell>
                  <Badge className={`flex gap-1 items-center ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell>${order.total.toFixed(2)}</TableCell>
                <TableCell className="text-right">
                  {order.status === "Processing" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => cancelOrder(order.id)}
                      disabled={loading}
                      className="text-healthcare-red border-healthcare-red/30 hover:bg-healthcare-red/10"
                    >
                      Cancel
                    </Button>
                  )}
                  {order.status !== "Processing" && (
                    <Button variant="outline" size="sm">
                      Details
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

// Create a wrapper component
export function MedicineOrderTableWrapper() {
  return <MedicineOrderTable />
}
