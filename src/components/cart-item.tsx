'use client'

import { Button } from '@/components/ui/button'
import { useCart } from '@/hooks/useCart'
import type { ICartItem } from '@/types'
import { motion } from 'framer-motion'
import { Minus, Plus, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { memo } from 'react'

const CartItem = ({ item }: { item: ICartItem }) => {
  const { removeFromCart, updateQuantity } = useCart()
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: '100%' }}
      transition={{ duration: 0.1 }}
      className='flex gap-4 rounded-lg border p-4 shadow-sm transition-colors hover:bg-accent/5'
    >
      <div className='relative h-24 w-24 overflow-hidden rounded-md border'>
        <Image src={item.image || '/placeholder.svg'} alt={item.name} fill className='object-cover transition-transform hover:scale-110' sizes='(max-width: 96px) 100vw, 96px' priority />
      </div>
      <div className='flex flex-1 flex-col'>
        <div className='flex justify-between'>
          <h4 className='font-medium tracking-tight'>{item.name}</h4>
          <Button variant='ghost' size='icon' className='h-8 w-8 text-muted-foreground hover:text-destructive' onClick={() => removeFromCart(item.id)}>
            <Trash2 className='h-4 w-4' />
            <span className='sr-only'>Remove</span>
          </Button>
        </div>
        <p className='text-sm font-medium text-primary'>${item.price.toFixed(2)}</p>
        <div className='mt-2 flex items-center gap-2'>
          <Button variant='outline' size='icon' className='h-8 w-8 hover:bg-primary/10' onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>
            <Minus className='h-3 w-3' />
            <span className='sr-only'>Decrease quantity</span>
          </Button>
          <span className='w-8 text-center font-medium'>{item.quantity}</span>
          <Button variant='outline' size='icon' className='h-8 w-8 hover:bg-primary/10' onClick={() => updateQuantity(item.id, item.quantity + 1)}>
            <Plus className='h-3 w-3' />
            <span className='sr-only'>Increase quantity</span>
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
export default memo(CartItem)
