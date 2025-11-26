"use client"

import { useState, useEffect } from "react"
import { AdminLayout } from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  Search,
  Filter,
  Download,
  MoreHorizontal,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
} from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { JSX } from "react"

type OrderStatus = "Processing" | "Shipped" | "Delivered" | "Cancelled" | "Refunded"

interface OrderItem {
  name: string
  quantity: number
  price: number
}

interface Order {
  id: string
  customerName: string
  customerEmail: string
  date: string
  items: OrderItem[]
  total: number
  status: OrderStatus
  address?: string
  paymentMethod?: string
  trackingNumber?: string
  notes?: string
}

// Sample orders data
const initialOrders = [
  {
    id: "ORD-12345",
    customerName: "John Doe",
    customerEmail: "john.doe@example.com",
    date: "2023-05-10",
    items: [
      { name: "Paracetamol 500mg", quantity: 2, price: 5.99 },
      { name: "Vitamin D3 1000 IU", quantity: 1, price: 8.99 },
    ],
    total: 20.97,
    status: "Processing",
    address: "123 Main St, New York, NY 10001",
    paymentMethod: "Credit Card",
  },
  {
    id: "ORD-12346",
    customerName: "Jane Smith",
    customerEmail: "jane.smith@example.com",
    date: "2023-05-08",
    items: [
      { name: "Amoxicillin 250mg", quantity: 1, price: 12.5 },
      { name: "Ibuprofen 200mg", quantity: 1, price: 6.49 },
    ],
    total: 18.99,
    status: "Shipped",
    address: "456 Oak Ave, Los Angeles, CA 90001",
    paymentMethod: "PayPal",
    trackingNumber: "TRK123456789",
  },
  {
    id: "ORD-12347",
    customerName: "Robert Brown",
    customerEmail: "robert.brown@example.com",
    date: "2023-05-05",
    items: [
      { name: "Aspirin 81mg", quantity: 1, price: 4.99 },
      { name: "Loratadine 10mg", quantity: 2, price: 9.99 },
    ],
    total: 24.97,
    status: "Delivered",
    address: "789 Pine St, Chicago, IL 60007",
    paymentMethod: "Credit Card",
    trackingNumber: "TRK987654321",
  },
  {
    id: "ORD-12348",
    customerName: "Sarah Williams",
    customerEmail: "sarah.w@example.com",
    date: "2023-05-01",
    items: [
      { name: "Vitamin B12 500mcg", quantity: 1, price: 22.5 },
      { name: "Zinc 50mg", quantity: 1, price: 15.75 },
    ],
    total: 38.25,
    status: "Delivered",
    address: "321 Maple Dr, Houston, TX 77001",
    paymentMethod: "Credit Card",
    trackingNumber: "TRK456789123",
  },
  {
    id: "ORD-12349",
    customerName: "Michael Johnson",
    customerEmail: "michael.j@example.com",
    date: "2023-04-28",
    items: [
      { name: "Multivitamin", quantity: 1, price: 19.75 },
      { name: "Calcium 500mg", quantity: 1, price: 12.99 },
    ],
    total: 32.74,
    status: "Cancelled",
    address: "654 Elm St, Miami, FL 33101",
    paymentMethod: "PayPal",
    notes: "Customer requested cancellation due to ordering mistake.",
  },
  {
    id: "ORD-12350",
    customerName: "Emily Clark",
    customerEmail: "emily.c@example.com",
    date: "2023-04-25",
    items: [
      { name: "Vitamin C 1000mg", quantity: 2, price: 7.99 },
      { name: "Zinc Lozenges", quantity: 1, price: 8.49 },
    ],
    total: 24.47,
    status: "Refunded",
    address: "987 Cedar Ln, Seattle, WA 98101",
    paymentMethod: "Credit Card",
    notes: "Product damaged during shipping. Full refund issued.",
  },
] as Order[]

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>(initialOrders)
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(initialOrders)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [isUpdateStatusDialogOpen, setIsUpdateStatusDialogOpen] = useState(false)
  const [newStatus, setNewStatus] = useState<OrderStatus>("Processing")
  const [trackingNumber, setTrackingNumber] = useState("")
  const [notes, setNotes] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

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
          order.customerName.toLowerCase().includes(search.toLowerCase()) ||
          order.customerEmail.toLowerCase().includes(search.toLowerCase()) ||
          order.items.some((item) => item.name.toLowerCase().includes(search.toLowerCase())),
      )
    }

    setFilteredOrders(filtered)
  }

  const refreshOrders = () => {
    setIsRefreshing(true)

    // Simulate network request
    setTimeout(() => {
      // Randomly update an order status
      const updatedOrders = [...orders]
      const processingOrders = updatedOrders.filter((order) => order.status === "Processing")

      if (processingOrders.length > 0) {
        const randomIndex = Math.floor(Math.random() * processingOrders.length)
        const orderToUpdate = processingOrders[randomIndex]
        const orderIndex = updatedOrders.findIndex((o) => o.id === orderToUpdate.id)

        updatedOrders[orderIndex].status = "Shipped"
        updatedOrders[orderIndex].trackingNumber = `TRK${Math.floor(Math.random() * 1000000000)}`

        setOrders(updatedOrders)

        toast({
          title: "Orders Updated",
          description: `Order ${orderToUpdate.id} has been shipped with tracking number ${updatedOrders[orderIndex].trackingNumber}.`,
        })
      }

      setIsRefreshing(false)
    }, 1500)
  }

  const handleUpdateStatus = () => {
    if (!selectedOrder) return

    setIsLoading(true)

    // Simulate network request
    setTimeout(() => {
      const updatedOrders = orders.map((order) => {
        if (order.id === selectedOrder.id) {
          const updatedOrder = {
            ...order,
            status: newStatus,
            notes: notes || order.notes,
          }

          if (newStatus === "Shipped" && trackingNumber) {
            updatedOrder.trackingNumber = trackingNumber
          }

          return updatedOrder
        }
        return order
      })

      setOrders(updatedOrders)

      toast({
        title: "Order Status Updated",
        description: `Order ${selectedOrder.id} status changed to ${newStatus}.`,
      })

      setIsLoading(false)
      setIsUpdateStatusDialogOpen(false)
      setSelectedOrder(null)
    }, 1000)
  }

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case "Processing":
        return <Clock className="h-4 w-4" />
      case "Shipped":
        return <Truck className="h-4 w-4" />
      case "Delivered":
        return <CheckCircle className="h-4 w-4" />
      case "Cancelled":
        return <XCircle className="h-4 w-4" />
      case "Refunded":
        return <RefreshCw className="h-4 w-4" />
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
      case "Refunded":
        return "bg-healthcare-lightpurple/50 text-healthcare-purple border-healthcare-purple/30"
      default:
        return ""
    }
  }

  return (
    <AdminLayout>
      <div className="page-container">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="page-title gradient-text-green">Order Management</h1>
            <p className="page-subtitle">Manage and track all medicine orders</p>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <Button variant="outline" className="flex items-center" onClick={refreshOrders} disabled={isRefreshing}>
              <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
              {isRefreshing ? "Refreshing..." : "Refresh"}
            </Button>
          </div>
        </div>

        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search orders by ID, customer, or product..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex items-center">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
                <Button variant="outline" className="flex items-center">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Orders</TabsTrigger>
            <TabsTrigger value="processing">Processing</TabsTrigger>
            <TabsTrigger value="shipped">Shipped</TabsTrigger>
            <TabsTrigger value="delivered">Delivered</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
            <TabsTrigger value="refunded">Refunded</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <OrdersTable
              orders={filteredOrders}
              getStatusColor={getStatusColor}
              getStatusIcon={getStatusIcon}
              onViewDetails={(order) => {
                setSelectedOrder(order)
                setIsDetailsDialogOpen(true)
                setNotes(order.notes || "")
              }}
              onUpdateStatus={(order) => {
                setSelectedOrder(order)
                setNewStatus(order.status)
                setTrackingNumber(order.trackingNumber || "")
                setNotes(order.notes || "")
                setIsUpdateStatusDialogOpen(true)
              }}
            />
          </TabsContent>

          <TabsContent value="processing">
            <OrdersTable
              orders={filteredOrders}
              getStatusColor={getStatusColor}
              getStatusIcon={getStatusIcon}
              onViewDetails={(order) => {
                setSelectedOrder(order)
                setIsDetailsDialogOpen(true)
                setNotes(order.notes || "")
              }}
              onUpdateStatus={(order) => {
                setSelectedOrder(order)
                setNewStatus(order.status)
                setTrackingNumber(order.trackingNumber || "")
                setNotes(order.notes || "")
                setIsUpdateStatusDialogOpen(true)
              }}
            />
          </TabsContent>

          <TabsContent value="shipped">
            <OrdersTable
              orders={filteredOrders}
              getStatusColor={getStatusColor}
              getStatusIcon={getStatusIcon}
              onViewDetails={(order) => {
                setSelectedOrder(order)
                setIsDetailsDialogOpen(true)
                setNotes(order.notes || "")
              }}
              onUpdateStatus={(order) => {
                setSelectedOrder(order)
                setNewStatus(order.status)
                setTrackingNumber(order.trackingNumber || "")
                setNotes(order.notes || "")
                setIsUpdateStatusDialogOpen(true)
              }}
            />
          </TabsContent>

          <TabsContent value="delivered">
            <OrdersTable
              orders={filteredOrders}
              getStatusColor={getStatusColor}
              getStatusIcon={getStatusIcon}
              onViewDetails={(order) => {
                setSelectedOrder(order)
                setIsDetailsDialogOpen(true)
                setNotes(order.notes || "")
              }}
              onUpdateStatus={(order) => {
                setSelectedOrder(order)
                setNewStatus(order.status)
                setTrackingNumber(order.trackingNumber || "")
                setNotes(order.notes || "")
                setIsUpdateStatusDialogOpen(true)
              }}
            />
          </TabsContent>

          <TabsContent value="cancelled">
            <OrdersTable
              orders={filteredOrders}
              getStatusColor={getStatusColor}
              getStatusIcon={getStatusIcon}
              onViewDetails={(order) => {
                setSelectedOrder(order)
                setIsDetailsDialogOpen(true)
                setNotes(order.notes || "")
              }}
              onUpdateStatus={(order) => {
                setSelectedOrder(order)
                setNewStatus(order.status)
                setTrackingNumber(order.trackingNumber || "")
                setNotes(order.notes || "")
                setIsUpdateStatusDialogOpen(true)
              }}
            />
          </TabsContent>

          <TabsContent value="refunded">
            <OrdersTable
              orders={filteredOrders}
              getStatusColor={getStatusColor}
              getStatusIcon={getStatusIcon}
              onViewDetails={(order) => {
                setSelectedOrder(order)
                setIsDetailsDialogOpen(true)
                setNotes(order.notes || "")
              }}
              onUpdateStatus={(order) => {
                setSelectedOrder(order)
                setNewStatus(order.status)
                setTrackingNumber(order.trackingNumber || "")
                setNotes(order.notes || "")
                setIsUpdateStatusDialogOpen(true)
              }}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Order Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>View detailed information about this order</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Order ID</h3>
                <p>{selectedOrder?.id}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Status</h3>
                <Badge className={getStatusColor(selectedOrder?.status || "Processing")}>
                  {getStatusIcon(selectedOrder?.status || "Processing")}
                  <span className="ml-1">{selectedOrder?.status}</span>
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Order Date</h3>
                <p>{selectedOrder?.date ? new Date(selectedOrder.date).toLocaleDateString() : ""}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Total Amount</h3>
                <p>${selectedOrder?.total.toFixed(2)}</p>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Customer Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-medium">{selectedOrder?.customerName}</p>
                  <p className="text-sm text-muted-foreground">{selectedOrder?.customerEmail}</p>
                </div>
                <div>
                  <p className="text-sm">{selectedOrder?.address}</p>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Payment Method</h3>
              <p>{selectedOrder?.paymentMethod}</p>
            </div>

            {selectedOrder?.trackingNumber && (
              <div className="border-t pt-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Tracking Number</h3>
                <p>{selectedOrder.trackingNumber}</p>
              </div>
            )}

            <div className="border-t pt-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Order Items</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Subtotal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedOrder?.items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                      <TableCell className="text-right">${(item.quantity * item.price).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Notes</h3>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="No notes available"
                readOnly
                className="min-h-[80px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailsDialogOpen(false)}>
              Close
            </Button>
            <Button
              onClick={() => {
                setIsDetailsDialogOpen(false)
                setIsUpdateStatusDialogOpen(true)
              }}
              className="bg-healthcare-green hover:bg-healthcare-blue"
            >
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog open={isUpdateStatusDialogOpen} onOpenChange={setIsUpdateStatusDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Update Order Status</DialogTitle>
            <DialogDescription>Change the status for order {selectedOrder?.id}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select value={newStatus} onValueChange={(value) => setNewStatus(value as OrderStatus)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Processing">Processing</SelectItem>
                  <SelectItem value="Shipped">Shipped</SelectItem>
                  <SelectItem value="Delivered">Delivered</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                  <SelectItem value="Refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {newStatus === "Shipped" && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="tracking" className="text-right">
                  Tracking #
                </Label>
                <Input
                  id="tracking"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Enter tracking number"
                  className="col-span-3"
                />
              </div>
            )}

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes" className="text-right">
                Notes
              </Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes about this order"
                className="col-span-3 min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUpdateStatusDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleUpdateStatus}
              disabled={isLoading}
              className="bg-healthcare-green hover:bg-healthcare-blue"
            >
              {isLoading ? "Updating..." : "Update Status"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  )
}

interface OrdersTableProps {
  orders: Order[]
  getStatusColor: (status: OrderStatus) => string
  getStatusIcon: (status: OrderStatus) => JSX.Element
  onViewDetails: (order: Order) => void
  onUpdateStatus: (order: Order) => void
}

function OrdersTable({ orders, getStatusColor, getStatusIcon, onViewDetails, onUpdateStatus }: OrdersTableProps) {
  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <Package className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No orders found</h3>
          <p className="text-muted-foreground mt-1">There are no orders matching the current filters.</p>
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
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.customerName}</TableCell>
                <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="max-w-[200px] truncate">
                    {order.items.map((item) => `${item.name} (${item.quantity})`).join(", ")}
                  </div>
                </TableCell>
                <TableCell>${order.total.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge className={`flex gap-1 items-center ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    <span className="ml-1">{order.status}</span>
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onViewDetails(order)}>View Details</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onUpdateStatus(order)}>Update Status</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
