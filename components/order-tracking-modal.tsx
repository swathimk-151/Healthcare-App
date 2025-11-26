"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Package, Truck, Check, Clock, X, MapPin, Calendar, DollarSign } from "lucide-react"

type OrderStatus = "Processing" | "Packed" | "Shipped" | "Delivered" | "Cancelled"

interface OrderItem {
  name: string
  quantity: number
  price: number
}

interface Order {
  id: string
  date: string
  items: string[]
  itemDetails?: OrderItem[]
  status: OrderStatus
  total: number
  trackingNumber?: string
  estimatedDelivery?: string
  trackingHistory?: {
    status: string
    date: string
    time: string
    location?: string
    description?: string
  }[]
}

interface OrderTrackingModalProps {
  order: Order
  open: boolean
  onClose: () => void
  getStatusColor: (status: OrderStatus) => string
}

export function OrderTrackingModal({ order, open, onClose, getStatusColor }: OrderTrackingModalProps) {
  const [activeTab, setActiveTab] = useState("tracking")

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Order Placed":
      case "Processing":
        return <Clock className="h-5 w-5" />
      case "Packed":
        return <Package className="h-5 w-5" />
      case "Shipped":
      case "Out for Delivery":
        return <Truck className="h-5 w-5" />
      case "Delivered":
        return <Check className="h-5 w-5" />
      case "Cancelled":
        return <X className="h-5 w-5" />
      default:
        return <Package className="h-5 w-5" />
    }
  }

  const getStatusColorByName = (status: string) => {
    if (status === "Order Placed" || status === "Processing") {
      return "bg-healthcare-lightyellow/50 text-healthcare-yellow border-healthcare-yellow/30"
    } else if (status === "Packed") {
      return "bg-healthcare-lightblue/50 text-healthcare-blue border-healthcare-blue/30"
    } else if (status === "Shipped" || status === "Out for Delivery") {
      return "bg-healthcare-lightpurple/50 text-healthcare-purple border-healthcare-purple/30"
    } else if (status === "Delivered") {
      return "bg-healthcare-lightgreen/50 text-healthcare-green border-healthcare-green/30"
    } else if (status === "Cancelled") {
      return "bg-healthcare-lightred/50 text-healthcare-red border-healthcare-red/30"
    } else {
      return ""
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
          <DialogDescription>Tracking information for order {order.id}</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="tracking" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="tracking">Tracking</TabsTrigger>
            <TabsTrigger value="details">Order Details</TabsTrigger>
          </TabsList>

          <TabsContent value="tracking">
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Order Status</h3>
                  <Badge className={`mt-1 ${getStatusColor(order.status)}`}>{order.status}</Badge>
                </div>
                {order.trackingNumber && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Tracking Number</h3>
                    <p className="font-mono mt-1">{order.trackingNumber}</p>
                  </div>
                )}
                {order.estimatedDelivery && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Estimated Delivery</h3>
                    <p className="mt-1">{new Date(order.estimatedDelivery).toLocaleDateString()}</p>
                  </div>
                )}
              </div>

              <div className="relative">
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-muted-foreground/20" />

                {order.trackingHistory && order.trackingHistory.length > 0 ? (
                  <div className="space-y-8 relative">
                    {order.trackingHistory.map((event, index) => (
                      <div key={index} className="relative pl-14">
                        <div className={`absolute left-0 p-2 rounded-full ${getStatusColorByName(event.status)}`}>
                          {getStatusIcon(event.status)}
                        </div>
                        <div className="bg-muted/30 p-4 rounded-lg">
                          <div className="flex justify-between">
                            <h4 className="font-medium">{event.status}</h4>
                            <span className="text-sm text-muted-foreground">
                              {event.date} at {event.time}
                            </span>
                          </div>
                          {event.location && (
                            <div className="flex items-center mt-2 text-sm">
                              <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                              <span>{event.location}</span>
                            </div>
                          )}
                          {event.description && <p className="mt-2 text-sm">{event.description}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-6">
                      <p className="text-muted-foreground">No tracking information available yet.</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="details">
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Order ID</h3>
                  <p className="font-medium">{order.id}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Order Date</h3>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span>{new Date(order.date).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Items</h3>
                <Card>
                  <CardContent className="p-0">
                    <div className="divide-y">
                      {order.itemDetails
                        ? order.itemDetails.map((item, index) => (
                            <div key={index} className="flex justify-between items-center p-4">
                              <div>
                                <p className="font-medium">{item.name}</p>
                                <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                              </div>
                              <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                          ))
                        : order.items.map((item, index) => (
                            <div key={index} className="flex justify-between items-center p-4">
                              <p>{item}</p>
                            </div>
                          ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex justify-between items-center border-t pt-4">
                <div className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-1 text-healthcare-green" />
                  <span className="font-medium">Total</span>
                </div>
                <p className="font-bold text-lg">${order.total.toFixed(2)}</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
