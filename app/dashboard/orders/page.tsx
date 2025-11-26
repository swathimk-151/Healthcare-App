"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"
import { Search, Filter, Package, Truck, Check, Clock, X, ChevronRight } from "lucide-react"
import { OrderTrackingModal } from "@/components/order-tracking-modal"

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

// Sample orders data
const initialOrders = [
  {
    id: "ORD-12345",
    date: "2023-05-10",
    items: ["Paracetamol 500mg", "Vitamin D3 1000 IU"],
    itemDetails: [
      { name: "Paracetamol 500mg", quantity: 2, price: 5.99 },
      { name: "Vitamin D3 1000 IU", quantity: 1, price: 8.99 },
    ],
    status: "Processing",
    total: 14.98,
    trackingNumber: "TRK123456789",
    estimatedDelivery: "2023-05-15",
    trackingHistory: [
      {
        status: "Order Placed",
        date: "2023-05-10",
        time: "09:30 AM",
        description: "Your order has been received and is being processed.",
      },
    ],
  },
  {
    id: "ORD-12346",
    date: "2023-05-08",
    items: ["Amoxicillin 250mg", "Ibuprofen 200mg"],
    itemDetails: [
      { name: "Amoxicillin 250mg", quantity: 1, price: 12.5 },
      { name: "Ibuprofen 200mg", quantity: 1, price: 6.49 },
    ],
    status: "Packed",
    total: 18.99,
    trackingNumber: "TRK987654321",
    estimatedDelivery: "2023-05-13",
    trackingHistory: [
      {
        status: "Order Placed",
        date: "2023-05-08",
        time: "11:45 AM",
        description: "Your order has been received and is being processed.",
      },
      {
        status: "Packed",
        date: "2023-05-09",
        time: "02:15 PM",
        location: "Central Warehouse",
        description: "Your order has been packed and is ready for shipping.",
      },
    ],
  },
  {
    id: "ORD-12347",
    date: "2023-05-05",
    items: ["Aspirin 81mg", "Loratadine 10mg"],
    itemDetails: [
      { name: "Aspirin 81mg", quantity: 1, price: 4.99 },
      { name: "Loratadine 10mg", quantity: 1, price: 9.99 },
    ],
    status: "Shipped",
    total: 14.98,
    trackingNumber: "TRK456789123",
    estimatedDelivery: "2023-05-11",
    trackingHistory: [
      {
        status: "Order Placed",
        date: "2023-05-05",
        time: "03:20 PM",
        description: "Your order has been received and is being processed.",
      },
      {
        status: "Packed",
        date: "2023-05-06",
        time: "10:30 AM",
        location: "Central Warehouse",
        description: "Your order has been packed and is ready for shipping.",
      },
      {
        status: "Shipped",
        date: "2023-05-07",
        time: "09:45 AM",
        location: "Distribution Center",
        description: "Your order has been shipped and is on its way to you.",
      },
    ],
  },
  {
    id: "ORD-12348",
    date: "2023-05-01",
    items: ["Vitamin B12 500mcg", "Zinc 50mg"],
    itemDetails: [
      { name: "Vitamin B12 500mcg", quantity: 1, price: 12.5 },
      { name: "Zinc 50mg", quantity: 1, price: 10.0 },
    ],
    status: "Delivered",
    total: 22.5,
    trackingNumber: "TRK789123456",
    estimatedDelivery: "2023-05-07",
    trackingHistory: [
      {
        status: "Order Placed",
        date: "2023-05-01",
        time: "01:15 PM",
        description: "Your order has been received and is being processed.",
      },
      {
        status: "Packed",
        date: "2023-05-02",
        time: "11:30 AM",
        location: "Central Warehouse",
        description: "Your order has been packed and is ready for shipping.",
      },
      {
        status: "Shipped",
        date: "2023-05-03",
        time: "02:45 PM",
        location: "Distribution Center",
        description: "Your order has been shipped and is on its way to you.",
      },
      {
        status: "Out for Delivery",
        date: "2023-05-06",
        time: "08:30 AM",
        location: "Local Delivery Center",
        description: "Your order is out for delivery and will arrive today.",
      },
      {
        status: "Delivered",
        date: "2023-05-06",
        time: "02:15 PM",
        location: "Delivery Address",
        description: "Your order has been delivered successfully.",
      },
    ],
  },
  {
    id: "ORD-12349",
    date: "2023-04-28",
    items: ["Multivitamin", "Calcium 500mg"],
    status: "Delivered",
    total: 19.75,
    trackingNumber: "TRK321654987",
    trackingHistory: [
      {
        status: "Order Placed",
        date: "2023-04-28",
        time: "10:20 AM",
        description: "Your order has been received and is being processed.",
      },
      {
        status: "Packed",
        date: "2023-04-29",
        time: "09:45 AM",
        location: "Central Warehouse",
        description: "Your order has been packed and is ready for shipping.",
      },
      {
        status: "Shipped",
        date: "2023-04-30",
        time: "11:30 AM",
        location: "Distribution Center",
        description: "Your order has been shipped and is on its way to you.",
      },
      {
        status: "Delivered",
        date: "2023-05-03",
        time: "03:45 PM",
        location: "Delivery Address",
        description: "Your order has been delivered successfully.",
      },
    ],
  },
  {
    id: "ORD-12350",
    date: "2023-04-25",
    items: ["Vitamin C 1000mg", "Zinc Lozenges"],
    status: "Cancelled",
    total: 12.99,
    trackingHistory: [
      {
        status: "Order Placed",
        date: "2023-04-25",
        time: "04:15 PM",
        description: "Your order has been received and is being processed.",
      },
      {
        status: "Cancelled",
        date: "2023-04-26",
        time: "09:30 AM",
        description: "Your order has been cancelled as requested.",
      },
    ],
  },
]

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(initialOrders)
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(initialOrders)
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false)

  useEffect(() => {
    filterOrders(activeTab, searchTerm)
  }, [activeTab, searchTerm, orders])

  const filterOrders = (tab: string, search: string) => {
    let filtered = [...orders]

    // Filter by tab
    if (tab !== "all") {
      filtered = filtered.filter((order) => order.status.toLowerCase() === tab.toLowerCase())
    }

    // Filter by search
    if (search) {
      filtered = filtered.filter(
        (order) =>
          order.id.toLowerCase().includes(search.toLowerCase()) ||
          order.items.some((item) => item.toLowerCase().includes(search.toLowerCase())),
      )
    }

    setFilteredOrders(filtered)
  }

  const refreshOrders = () => {
    setRefreshing(true)

    // Simulate network request
    setTimeout(() => {
      // Randomly update an order status
      const updatedOrders = [...orders]
      const processingOrders = updatedOrders.filter(
        (order) => order.status === "Processing" || order.status === "Packed" || order.status === "Shipped",
      )

      if (processingOrders.length > 0) {
        const randomIndex = Math.floor(Math.random() * processingOrders.length)
        const orderToUpdate = processingOrders[randomIndex]
        const orderIndex = updatedOrders.findIndex((o) => o.id === orderToUpdate.id)

        // Determine next status
        let newStatus: OrderStatus = orderToUpdate.status
        let statusDescription = ""
        let statusLocation = ""

        if (orderToUpdate.status === "Processing") {
          newStatus = "Packed"
          statusDescription = "Your order has been packed and is ready for shipping."
          statusLocation = "Central Warehouse"
        } else if (orderToUpdate.status === "Packed") {
          newStatus = "Shipped"
          statusDescription = "Your order has been shipped and is on its way to you."
          statusLocation = "Distribution Center"
        } else if (orderToUpdate.status === "Shipped") {
          newStatus = "Delivered"
          statusDescription = "Your order has been delivered successfully."
          statusLocation = "Delivery Address"
        }

        // Update order status
        updatedOrders[orderIndex].status = newStatus

        // Add tracking history entry
        const now = new Date()
        const newHistoryEntry = {
          status: newStatus,
          date: now.toISOString().split("T")[0],
          time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          location: statusLocation,
          description: statusDescription,
        }

        if (!updatedOrders[orderIndex].trackingHistory) {
          updatedOrders[orderIndex].trackingHistory = []
        }

        updatedOrders[orderIndex].trackingHistory?.push(newHistoryEntry)

        setOrders(updatedOrders)

        toast({
          title: "Order Status Updated",
          description: `Order ${orderToUpdate.id} is now ${newStatus}!`,
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
      const updatedOrders = orders.map((order) => {
        if (order.id === orderId) {
          // Add cancellation to tracking history
          const now = new Date()
          const newHistoryEntry = {
            status: "Cancelled",
            date: now.toISOString().split("T")[0],
            time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            description: "Your order has been cancelled as requested.",
          }

          if (!order.trackingHistory) {
            order.trackingHistory = []
          }

          return {
            ...order,
            status: "Cancelled" as OrderStatus,
            trackingHistory: [...order.trackingHistory, newHistoryEntry],
          }
        }
        return order
      })

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
      case "Packed":
        return <Package className="h-4 w-4" />
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
      case "Packed":
        return "bg-healthcare-lightblue/50 text-healthcare-blue border-healthcare-blue/30"
      case "Shipped":
        return "bg-healthcare-lightpurple/50 text-healthcare-purple border-healthcare-purple/30"
      case "Delivered":
        return "bg-healthcare-lightgreen/50 text-healthcare-green border-healthcare-green/30"
      case "Cancelled":
        return "bg-healthcare-lightred/50 text-healthcare-red border-healthcare-red/30"
      default:
        return ""
    }
  }

  const openTrackingModal = (order: Order) => {
    setSelectedOrder(order)
    setIsTrackingModalOpen(true)
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Orders</h1>
          <p className="text-gray-500 mt-2">Track and manage your medicine orders</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search orders..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 ml-auto">
            <Button variant="outline" size="sm" onClick={refreshOrders} disabled={refreshing} className="relative">
              {refreshing ? "Updating..." : "Refresh Orders"}
              {refreshing && (
                <span className="absolute top-0 right-0">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-healthcare-blue opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-healthcare-blue"></span>
                  </span>
                </span>
              )}
            </Button>
            <Button variant="outline" size="sm" className="flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Orders</TabsTrigger>
            <TabsTrigger value="processing">Processing</TabsTrigger>
            <TabsTrigger value="packed">Packed</TabsTrigger>
            <TabsTrigger value="shipped">Shipped</TabsTrigger>
            <TabsTrigger value="delivered">Delivered</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <OrdersTable
              orders={filteredOrders}
              cancelOrder={cancelOrder}
              loading={loading}
              getStatusIcon={getStatusIcon}
              getStatusColor={getStatusColor}
              onTrackOrder={openTrackingModal}
            />
          </TabsContent>

          <TabsContent value="processing" className="space-y-4">
            <OrdersTable
              orders={filteredOrders}
              cancelOrder={cancelOrder}
              loading={loading}
              getStatusIcon={getStatusIcon}
              getStatusColor={getStatusColor}
              onTrackOrder={openTrackingModal}
            />
          </TabsContent>

          <TabsContent value="packed" className="space-y-4">
            <OrdersTable
              orders={filteredOrders}
              cancelOrder={cancelOrder}
              loading={loading}
              getStatusIcon={getStatusIcon}
              getStatusColor={getStatusColor}
              onTrackOrder={openTrackingModal}
            />
          </TabsContent>

          <TabsContent value="shipped" className="space-y-4">
            <OrdersTable
              orders={filteredOrders}
              cancelOrder={cancelOrder}
              loading={loading}
              getStatusIcon={getStatusIcon}
              getStatusColor={getStatusColor}
              onTrackOrder={openTrackingModal}
            />
          </TabsContent>

          <TabsContent value="delivered" className="space-y-4">
            <OrdersTable
              orders={filteredOrders}
              cancelOrder={cancelOrder}
              loading={loading}
              getStatusIcon={getStatusIcon}
              getStatusColor={getStatusColor}
              onTrackOrder={openTrackingModal}
            />
          </TabsContent>

          <TabsContent value="cancelled" className="space-y-4">
            <OrdersTable
              orders={filteredOrders}
              cancelOrder={cancelOrder}
              loading={loading}
              getStatusIcon={getStatusIcon}
              getStatusColor={getStatusColor}
              onTrackOrder={openTrackingModal}
            />
          </TabsContent>
        </Tabs>
      </div>

      {selectedOrder && (
        <OrderTrackingModal
          order={selectedOrder}
          open={isTrackingModalOpen}
          onClose={() => setIsTrackingModalOpen(false)}
          getStatusColor={getStatusColor}
        />
      )}
    </DashboardLayout>
  )
}

interface OrdersTableProps {
  orders: Order[]
  cancelOrder: (id: string) => void
  loading: boolean
  getStatusIcon: (status: OrderStatus) => JSX.Element
  getStatusColor: (status: OrderStatus) => string
  onTrackOrder: (order: Order) => void
}

function OrdersTable({ orders, cancelOrder, loading, getStatusIcon, getStatusColor, onTrackOrder }: OrdersTableProps) {
  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <Package className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No orders found</h3>
          <p className="text-muted-foreground mt-1">You don't have any orders matching the current filters.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-0">
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
                  <Button variant="outline" size="sm" className="ml-2" onClick={() => onTrackOrder(order)}>
                    Track Order
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
