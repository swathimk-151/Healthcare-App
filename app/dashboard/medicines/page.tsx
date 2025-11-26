"use client"

import { useState } from "react"
import { Search, ShoppingCart, Filter } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MedicineCart } from "@/components/medicine-cart"
import { MedicineLookup } from "@/components/medicine-lookup"
import { MedicineMiniChatbot } from "@/components/medicine-mini-chatbot"
import { medicines } from "@/data/medicines"

export default function MedicinesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [cart, setCart] = useState<any[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isLookupOpen, setIsLookupOpen] = useState(false)
  const [selectedMedicine, setSelectedMedicine] = useState<any>(null)

  // Filter medicines based on search term and category
  const filteredMedicines = medicines.filter((medicine) => {
    const matchesSearch =
      medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (medicine.description && medicine.description.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = categoryFilter === "all" || medicine.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const categories = Array.from(new Set(medicines.map((medicine) => medicine.category)))

  const addToCart = (medicine: any) => {
    const existingItem = cart.find((item) => item.id === medicine.id)
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === medicine.id
            ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * (item.price || 0) }
            : item,
        ),
      )
    } else {
      setCart([...cart, { ...medicine, quantity: 1, total: medicine.price || 0 }])
    }
  }

  const handleViewDetails = (medicine: any) => {
    setSelectedMedicine(medicine)
    setIsLookupOpen(true)
  }

  // Helper function to format price
  const formatPrice = (price: number | undefined) => {
    return price !== undefined ? `₹${price.toFixed(2)}` : "Price not available"
  }

  return (
    <DashboardLayout>
      <div className="page-container">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="page-title">Medicines</h1>
            <p className="page-subtitle">Browse and order medicines</p>
          </div>
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <Button variant="outline" onClick={() => setIsCartOpen(true)}>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Cart ({cart.reduce((acc, item) => acc + item.quantity, 0)})
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search medicines..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="all" className="mb-6">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Medicines</TabsTrigger>
            <TabsTrigger value="prescription">Prescription</TabsTrigger>
            <TabsTrigger value="otc">Over the Counter</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMedicines.map((medicine) => (
                <Card key={medicine.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{medicine.name}</CardTitle>
                      <Badge variant="outline">{medicine.category}</Badge>
                    </div>
                    <CardDescription>
                      {medicine.description
                        ? medicine.description.substring(0, 100) + "..."
                        : "No description available"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <p className="font-semibold text-lg">{formatPrice(medicine.price)}</p>
                      <Badge variant={medicine.prescription ? "destructive" : "default"}>
                        {medicine.prescription ? "Prescription Required" : "OTC"}
                      </Badge>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-2">
                    <Button variant="outline" onClick={() => handleViewDetails(medicine)}>
                      Details
                    </Button>
                    <Button onClick={() => addToCart(medicine)}>Add to Cart</Button>
                  </CardFooter>
                </Card>
              ))}
              {filteredMedicines.length === 0 && (
                <div className="col-span-full text-center py-10 text-muted-foreground">
                  No medicines found matching your search criteria
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="prescription">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMedicines
                .filter((medicine) => medicine.prescription)
                .map((medicine) => (
                  <Card key={medicine.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{medicine.name}</CardTitle>
                        <Badge variant="outline">{medicine.category}</Badge>
                      </div>
                      <CardDescription>
                        {medicine.description
                          ? medicine.description.substring(0, 100) + "..."
                          : "No description available"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <p className="font-semibold text-lg">{formatPrice(medicine.price)}</p>
                        <Badge variant="destructive">Prescription Required</Badge>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between pt-2">
                      <Button variant="outline" onClick={() => handleViewDetails(medicine)}>
                        Details
                      </Button>
                      <Button onClick={() => addToCart(medicine)}>Add to Cart</Button>
                    </CardFooter>
                  </Card>
                ))}
              {filteredMedicines.filter((medicine) => medicine.prescription).length === 0 && (
                <div className="col-span-full text-center py-10 text-muted-foreground">
                  No prescription medicines found matching your search criteria
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="otc">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMedicines
                .filter((medicine) => !medicine.prescription)
                .map((medicine) => (
                  <Card key={medicine.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{medicine.name}</CardTitle>
                        <Badge variant="outline">{medicine.category}</Badge>
                      </div>
                      <CardDescription>
                        {medicine.description
                          ? medicine.description.substring(0, 100) + "..."
                          : "No description available"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <p className="font-semibold text-lg">{formatPrice(medicine.price)}</p>
                        <Badge variant="default">OTC</Badge>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between pt-2">
                      <Button variant="outline" onClick={() => handleViewDetails(medicine)}>
                        Details
                      </Button>
                      <Button onClick={() => addToCart(medicine)}>Add to Cart</Button>
                    </CardFooter>
                  </Card>
                ))}
              {filteredMedicines.filter((medicine) => !medicine.prescription).length === 0 && (
                <div className="col-span-full text-center py-10 text-muted-foreground">
                  No OTC medicines found matching your search criteria
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Medicine Cart */}
        <MedicineCart items={cart || []} onUpdateCart={setCart} />

        {/* Medicine Lookup */}
        <MedicineLookup
          medicine={selectedMedicine}
          isOpen={isLookupOpen}
          setIsOpen={setIsLookupOpen}
          addToCart={addToCart}
        />

        {/* Medicine Mini Chatbot */}
        <MedicineMiniChatbot />
      </div>
    </DashboardLayout>
  )
}
