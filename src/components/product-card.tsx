'use client'

import { Button } from '@/components/ui/button'
import { useCart } from '@/hooks/useCart'
import type { IProduct } from '@/types'
import { motion } from 'framer-motion'
import { Heart, Plus } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import type React from 'react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { AddToCartButton } from '@/components/add-to-cart-button'

export function ProductCard({ product }: { product: IProduct }) {
  const { addToCart } = useCart()
  const [isHovered, setIsHovered] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [animPosition, setAnimPosition] = useState({ top: 0, left: 0 })
  const [cartButtonPosition, setCartButtonPosition] = useState({ top: 0, left: 0 })

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()

    // Get button position for animation
    const buttonRect = e.currentTarget.getBoundingClientRect()

    setAnimPosition({
      top: buttonRect.top + buttonRect.height / 2,
      left: buttonRect.left + buttonRect.width / 2
    })

    // Start animation
    setIsAnimating(true)

    // Add to cart after animation
    setTimeout(() => {
      setIsAnimating(false)
      addToCart(product)
      toast.success('Added to cart', {
        description: `${product.name} has been added to your cart.`
      })
    }, 1000)
  }

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault()

    // Check if a similar toast is already active
    const toastId = `wishlist-${product.id}`
    const existingToast = document.querySelector(`[data-toast-id="${toastId}"]`)
    if (!existingToast) {
      setIsLiked(!isLiked)
      toast.success(isLiked ? 'Removed from wishlist' : 'Added to wishlist', {
        id: toastId,
        description: `${product.name} has been ${isLiked ? 'removed from' : 'added to'} your wishlist.`,
        duration: 2000
      })
    }
  }

  return (
    <motion.div
      className='group relative rounded-xl bg-background'
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Link href={`/products/${product.category}/${product.id}`} className='block'>
        <div className='relative aspect-square overflow-hidden rounded-xl'>
          <Image src={product.image || '/placeholder.svg'} alt={product.name} fill className='object-cover transition-transform duration-300 group-hover:scale-105' />
          <div className='absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10' />

          <motion.div className='absolute right-4 top-4' initial={false} animate={{ scale: isLiked ? 1.2 : 1 }} whileTap={{ scale: 0.9 }}>
            <Button size='icon' variant='secondary' className='h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm' onClick={handleLike}>
              <Heart className={`h-4 w-4 transition-colors ${isLiked ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} />
            </Button>
          </motion.div>

          <motion.div className='absolute inset-x-0 bottom-0 p-4' initial={{ opacity: 0, y: 10 }} animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}>
            <AddToCartButton product={product} className='w-full bg-background/80 text-foreground backdrop-blur-sm hover:text-white' />
          </motion.div>
        </div>

        <div className='p-4'>
          <motion.div layout>
            <h3 className='font-medium'>{product.name}</h3>
            <p className='mt-1 text-sm text-muted-foreground'>{product.category}</p>
            <div className='mt-2 flex items-center justify-between'>
              <p className='text-lg font-semibold'>${product.price.toFixed(2)}</p>
              <AddToCartButton product={product} className='bg-primary text-primary-foreground lg:hidden' />
            </div>
          </motion.div>
        </div>
      </Link>
    </motion.div>
  )
}
