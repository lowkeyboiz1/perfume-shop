'use client'

import { useAtom } from 'jotai'
import { useEffect } from 'react'
import type { IProduct } from '@/types'
import { cartAtom } from '@/atoms/cartAtom'

// Hook to manage cart logic
export function useCart() {
  const [cartItems, setCartItems] = useAtom(cartAtom)

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      setCartItems(JSON.parse(savedCart))
    }
  }, [setCartItems])

  // Save cart to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems))
  }, [cartItems])

  // Add product to cart
  const addToCart = (product: IProduct) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === product.id)
      if (existingItem) {
        // Check if adding would exceed max quantity of 10
        if (existingItem.quantity >= 10) {
          return prev
        }
        return prev.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  // Remove product from cart
  const removeFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId))
  }

  // Update quantity of a product in cart
  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity > 10) return // Prevent quantities over 10
    setCartItems((prev) => prev.map((item) => (item.id === productId ? { ...item, quantity } : item)))
  }

  // Clear cart
  const clearCart = () => {
    setCartItems([])
  }

  // Calculate total price
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    total
  }
}
