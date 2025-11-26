"use client"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import type { Medicine } from "@/data/medicines"

interface MedicineLookupProps {
  medicine: Medicine | null
  onClose: () => void
  open: boolean
}

export function MedicineLookup({ medicine, onClose, open }: MedicineLookupProps) {
  if (!medicine) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              Medicine Information
              <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 rounded-full">
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          <div className="py-6 text-center text-red-500">
            Medicine information not found. Please try another medicine.
          </div>
          <DialogFooter>
            <Button onClick={onClose}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            {medicine.name}
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 rounded-full">
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-sm text-gray-500">Generic Name</h3>
              <p>{medicine.genericName}</p>
            </div>
            <div>
              <h3 className="font-medium text-sm text-gray-500">Category</h3>
              <p>{medicine.category}</p>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-sm text-gray-500">Description</h3>
            <p>{medicine.description}</p>
          </div>

          <div>
            <h3 className="font-medium text-sm text-gray-500">Dosage</h3>
            <p>{medicine.dosage}</p>
          </div>

          <div>
            <h3 className="font-medium text-sm text-gray-500">Side Effects</h3>
            <div className="flex flex-wrap gap-2 mt-1">
              {medicine.sideEffects.map((effect, index) => (
                <Badge key={index} variant="outline">
                  {effect}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium text-sm text-gray-500">Contraindications</h3>
            <div className="flex flex-wrap gap-2 mt-1">
              {medicine.contraindications.map((item, index) => (
                <Badge key={index} variant="outline" className="bg-red-50">
                  {item}
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-sm text-gray-500">Manufacturer</h3>
              <p>{medicine.manufacturer}</p>
            </div>
            <div>
              <h3 className="font-medium text-sm text-gray-500">Price</h3>
              <p>₹{medicine.price}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-sm text-gray-500">In Stock</h3>
              <Badge variant={medicine.inStock ? "success" : "destructive"}>
                {medicine.inStock ? "Available" : "Out of Stock"}
              </Badge>
            </div>
            <div>
              <h3 className="font-medium text-sm text-gray-500">Prescription Required</h3>
              <Badge variant={medicine.prescription ? "default" : "outline"}>
                {medicine.prescription ? "Yes" : "No"}
              </Badge>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
