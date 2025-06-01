'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCreateOrder } from '@/queries/orders'
import { formatCurrency } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

// Mock cart data (in a real app, this would come from a cart context/state)
const mockCartItems = [
  {
    productId: '1',
    name: 'Chanel No. 5',
    price: 2500000,
    quantity: 1
  },
  {
    productId: '2',
    name: 'Dior Sauvage',
    price: 1800000,
    quantity: 1
  }
]

export default function CheckoutPage() {
  const router = useRouter()
  const createOrder = useCreateOrder()

  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerAddress: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const totalAmount = mockCartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await createOrder.mutateAsync({
        ...formData,
        items: mockCartItems,
        totalAmount,
        status: 'pending',
        ipAddress: '' // This will be set by the server
      })

      toast.success('Order placed successfully!')
      router.push('/checkout/success')
    } catch (error) {
      console.error('Error placing order:', error)
      toast.error('Failed to place order. Please try again.')
    }
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='mb-8 text-3xl font-bold'>Checkout</h1>

      <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
        <div className='col-span-2'>
          <div className='rounded-lg border bg-white p-6 shadow-sm'>
            <h2 className='mb-6 text-xl font-semibold'>Shipping Information</h2>

            <form onSubmit={handleSubmit} className='space-y-4'>
              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                <div className='space-y-2'>
                  <Label htmlFor='customerName'>Full Name *</Label>
                  <Input id='customerName' name='customerName' value={formData.customerName} onChange={handleChange} required />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='customerEmail'>Email Address *</Label>
                  <Input id='customerEmail' name='customerEmail' type='email' value={formData.customerEmail} onChange={handleChange} required />
                </div>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='customerPhone'>Phone Number *</Label>
                <Input id='customerPhone' name='customerPhone' value={formData.customerPhone} onChange={handleChange} required />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='customerAddress'>Shipping Address *</Label>
                <Textarea id='customerAddress' name='customerAddress' value={formData.customerAddress} onChange={handleChange} rows={3} required />
              </div>

              <Button type='submit' className='mt-6 w-full' size='lg' disabled={createOrder.isPending}>
                {createOrder.isPending ? 'Processing...' : 'Place Order'}
              </Button>
            </form>
          </div>
        </div>

        <div>
          <div className='rounded-lg border bg-white p-6 shadow-sm'>
            <h2 className='mb-6 text-xl font-semibold'>Order Summary</h2>

            <div className='space-y-4'>
              {mockCartItems.map((item) => (
                <div key={item.productId} className='flex justify-between'>
                  <div>
                    <p className='font-medium'>{item.name}</p>
                    <p className='text-sm text-gray-500'>Quantity: {item.quantity}</p>
                  </div>
                  <p className='font-medium'>{formatCurrency(item.price * item.quantity)}</p>
                </div>
              ))}

              <div className='border-t pt-4'>
                <div className='flex justify-between font-medium'>
                  <p>Total</p>
                  <p>{formatCurrency(totalAmount)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
