'use client'

import CartItem from '@/components/cart-item'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { useCart } from '@/hooks/useCart'
import { AnimatePresence, motion } from 'framer-motion'
import { ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import { memo, useMemo } from 'react'

interface CartDrawerProps {
  open: boolean
  onClose: () => void
}

const CartDrawer = ({ open, onClose }: CartDrawerProps) => {
  const { cartItems, total } = useCart()

  const subtotal = useMemo(() => total.toFixed(2), [total])
  const finalTotal = useMemo(() => total.toFixed(2), [total])

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className='flex w-full flex-col p-0 sm:max-w-lg'>
        <SheetHeader className='border-b px-6 py-6'>
          <div className='flex items-center justify-between'>
            <SheetTitle className='flex items-center gap-2 text-xl'>
              <ShoppingBag className='h-6 w-6 text-primary' />
              Your Cart ({cartItems.length})
            </SheetTitle>
          </div>
        </SheetHeader>

        {cartItems.length === 0 ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className='flex flex-1 flex-col items-center justify-center gap-6 p-8 text-center'>
            <ShoppingBag className='h-20 w-20 text-muted-foreground/50' />
            <div className='space-y-2'>
              <h3 className='text-2xl font-medium'>Your cart is empty</h3>
              <p className='text-muted-foreground'>Looks like you haven't added anything to your cart yet.</p>
            </div>
            <Button onClick={onClose} className='mt-4 bg-primary hover:bg-primary/90'>
              Start Shopping
            </Button>
          </motion.div>
        ) : (
          <>
            <ScrollArea className='flex-1 px-6 py-4'>
              <motion.div layout className='flex flex-col gap-4'>
                <AnimatePresence mode='popLayout'>
                  {cartItems.map((item) => (
                    <CartItem key={item.id} item={item} />
                  ))}
                </AnimatePresence>
              </motion.div>
            </ScrollArea>

            <motion.div layout className='border-t p-6'>
              <div className='space-y-4'>
                <div className='flex justify-between text-sm'>
                  <span className='text-muted-foreground'>Subtotal</span>
                  <span className='font-medium'>${subtotal}</span>
                </div>
                <div className='flex justify-between text-sm'>
                  <span className='text-muted-foreground'>Shipping</span>
                  <span className='font-medium'>Free</span>
                </div>
                <Separator />
                <div className='flex justify-between text-lg font-medium'>
                  <span>Total</span>
                  <span className='text-primary'>${finalTotal}</span>
                </div>
              </div>
              <SheetFooter className='mt-8 flex-col gap-3 sm:flex-col'>
                <Button asChild className='w-full bg-primary hover:bg-primary/90'>
                  <Link href='/checkout' onClick={onClose}>
                    Proceed to Checkout
                  </Link>
                </Button>
                <Button variant='outline' className='w-full hover:bg-accent/5' onClick={onClose}>
                  Continue Shopping
                </Button>
              </SheetFooter>
            </motion.div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}

export default memo(CartDrawer)
