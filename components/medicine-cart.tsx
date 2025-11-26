"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingCart, X } from "lucide-react"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"

export interface MedicineItem {
  id: number
  name: string
  price: number
  quantity: number
  image?: string
}

interface MedicineCartProps {
  items: MedicineItem[]
  onUpdateCart: (items: MedicineItem[]) => void
}

export function MedicineCart({ items, onUpdateCart }: MedicineCartProps) {
  const [isOpen, setIsOpen] = useState(false)

  const totalItems = items?.reduce((total, item) => total + item.quantity, 0) || 0
  const subtotal = items?.reduce((total, item) => total + item.price * item.quantity, 0) || 0

  const updateQuantity = (id: number, newQuantity: number) => {
    if (!items) return

    if (newQuantity < 1) {
      removeItem(id)
      return
    }

    const updatedItems = items.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item))

    onUpdateCart(updatedItems)
  }

  const removeItem = (id: number) => {
    if (!items) return

    const updatedItems = items.filter((item) => item.id !== id)
    onUpdateCart(updatedItems)

    toast({
      title: "Item removed",
      description: "The item has been removed from your cart",
    })
  }

  const handleCheckout = () => {
    toast({
      title: "Checkout initiated",
      description: "Your order is being processed",
    })

    // Simulate order processing
    setTimeout(() => {
      onUpdateCart([])
      setIsOpen(false)

      toast({
        title: "Order placed successfully",
        description: "Thank you for your order!",
      })
    }, 1500)
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2 relative">
          <ShoppingCart className="h-4 w-4" />
          <span>Cart</span>
          {totalItems > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center">
              {totalItems}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Your Cart</SheetTitle>
        </SheetHeader>

        <div className="py-6 space-y-6">
          {items.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Your cart is empty</p>
              <SheetClose asChild>
                <Button variant="outline" className="mt-4">
                  Continue Shopping
                </Button>
              </SheetClose>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between border-b pb-4">
                    <div className="flex items-center space-x-4">
                      <div className="bg-muted/50 rounded p-2">
                        <img
                          src={item.image || "/placeholder.svg?height=50&width=50"}
                          alt={item.name}
                          className="w-12 h-12 object-contain"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          ${item.price.toFixed(2)} × {item.quantity}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center border rounded-md">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-r-none"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          -
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-l-none"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-healthcare-red"
                        onClick={() => removeItem(item.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-medium">$5.00</span>
                </div>
                <div className="flex justify-between border-t pt-4">
                  <span className="font-bold">Total</span>
                  <span className="font-bold">${(subtotal + 5).toFixed(2)}</span>
                </div>
              </div>
            </>
          )}
        </div>

        <SheetFooter>
          <Button
            onClick={handleCheckout}
            disabled={items.length === 0}
            className="w-full bg-healthcare-green hover:bg-healthcare-blue"
          >
            Checkout
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
