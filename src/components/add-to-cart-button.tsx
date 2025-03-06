'use client'

import { Button } from '@/components/ui/button'
import { useCart } from '@/hooks/useCart'
import type { IProduct } from '@/types'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { useState, useEffect, memo, useCallback } from 'react'

interface AddToCartButtonProps {
  product: IProduct
  className?: string
  showIcon?: boolean
}

export const AddToCartButton = memo(({ product, className, showIcon = true }: AddToCartButtonProps) => {
  const { addToCart } = useCart()
  const [isAnimating, setIsAnimating] = useState(false)
  const [animPosition, setAnimPosition] = useState({ top: 0, left: 0 })
  const [cartButtonPosition, setCartButtonPosition] = useState({ top: 0, left: 0 })

  const handleAddToCart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()

      // Check if a similar toast is already active
      const toastId = `cart-${product.id}`
      const existingToast = document.querySelector(`[data-toast-id="${toastId}"]`)
      if (!existingToast) {
        // Get button position for animation
        const buttonRect = e.currentTarget.getBoundingClientRect()
        setAnimPosition({
          top: buttonRect.top + buttonRect.height / 2,
          left: buttonRect.left + buttonRect.width / 2
        })

        // Get cart button position at the moment of click
        const cartButton = document.getElementById('cart-button')
        if (cartButton) {
          const rect = cartButton.getBoundingClientRect()
          setCartButtonPosition({
            top: rect.top - 40,
            left: rect.left - 40
          })
        }

        // Start animation
        setIsAnimating(true)

        // Add to cart after animation
        setTimeout(() => {
          setIsAnimating(false)
          addToCart(product)
          toast.success('Added to cart', {
            id: toastId,
            description: `${product.name} has been added to your cart.`,
            duration: 2000
          })
        }, 1000)
      }
    },
    [product]
  )

  return (
    <>
      <Button className={className} onClick={handleAddToCart}>
        {showIcon && <Plus className='mr-2 h-4 w-4' />}
        Add to Cart
      </Button>

      {/* Flying item animation */}
      {isAnimating && (
        <div
          className='fixed z-50 flex size-40 items-center justify-center rounded-full bg-primary'
          style={{
            top: `${animPosition.top}px`,
            left: `${animPosition.left}px`,
            animation: 'flyToCart 1s forwards'
          }}
        >
          <img src={product.image || '/placeholder.svg'} alt={product.name} className='h-full w-full object-cover' />
        </div>
      )}

      {/* CSS for the animation */}
      <style jsx>{`
        @keyframes flyToCart {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          80% {
            transform: scale(0.3);
            opacity: 0.7;
          }
          85% {
            transform: scale(0.3);
            opacity: 0.7;
          }
          100% {
            opacity: 0;
            transform: scale(0.1);
            top: ${cartButtonPosition.top}px;
            left: ${cartButtonPosition.left}px;
          }
        }
      `}</style>
    </>
  )
})
