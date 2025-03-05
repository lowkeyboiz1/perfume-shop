"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/cart-context"
import { useToast } from "@/components/ui/use-toast"
import { Heart, ShoppingCart } from "lucide-react"
import type { Product } from "@/types"

export function EnhancedProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart()
  const { toast } = useToast()
  const [isHovered, setIsHovered] = useState(false)
  const [isLiked, setIsLiked] = useState(false)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addToCart(product)
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsLiked(!isLiked)
    toast({
      title: isLiked ? "Removed from wishlist" : "Added to wishlist",
      description: `${product.name} has been ${isLiked ? "removed from" : "added to"} your wishlist.`,
    })
  }

  return (
    <motion.div
      className="group relative rounded-xl bg-background"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden rounded-xl">
          <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
          <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />

          <motion.div className="absolute right-4 top-4" initial={false} animate={{ scale: isLiked ? 1.2 : 1 }} whileTap={{ scale: 0.9 }}>
            <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm" onClick={handleLike}>
              <Heart className={`h-4 w-4 transition-colors ${isLiked ? "fill-red-500 text-red-500" : "text-muted-foreground"}`} />
            </Button>
          </motion.div>

          <motion.div className="absolute inset-x-0 bottom-0 p-4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}>
            <Button className="w-full bg-background/80 text-foreground   hover:text-white backdrop-blur-sm" onClick={handleAddToCart}>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
          </motion.div>
        </div>

        <div className="p-4">
          <motion.div layout>
            <h3 className="font-medium">{product.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{product.category}</p>
            <div className="mt-2 flex items-center justify-between">
              <p className="text-lg font-semibold">${product.price.toFixed(2)}</p>
              {product.price > 100 && <span className="text-xs font-medium text-primary-foreground bg-primary px-2 py-1 rounded-full">Premium</span>}
            </div>
          </motion.div>
        </div>
      </Link>
    </motion.div>
  )
}
