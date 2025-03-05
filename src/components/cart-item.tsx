"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/cart-context"
import { Minus, Plus, X } from "lucide-react"
import type { CartItem as CartItemType } from "@/types"

export function CartItem({ item }: { item: CartItemType }) {
  const { updateQuantity, removeFromCart } = useCart()

  return (
    <div className="flex gap-4">
      <div className="relative aspect-square h-24 w-24 min-w-fit overflow-hidden rounded">
        <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
      </div>
      <div className="flex flex-1 flex-col gap-1">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-sm font-medium leading-none">{item.name}</h3>
            <p className="text-sm text-muted-foreground mt-1">${item.price.toFixed(2)}</p>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeFromCart(item.id)}>
            <X className="h-4 w-4" />
            <span className="sr-only">Remove item</span>
          </Button>
        </div>
        <div className="flex items-center gap-2 mt-auto">
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}>
            <Minus className="h-4 w-4" />
            <span className="sr-only">Decrease quantity</span>
          </Button>
          <span className="text-sm">{item.quantity}</span>
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
            <Plus className="h-4 w-4" />
            <span className="sr-only">Increase quantity</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
