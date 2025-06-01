'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CheckCircle } from 'lucide-react'

export default function OrderSuccessPage() {
  return (
    <div className='container mx-auto flex flex-col items-center justify-center px-4 py-16 text-center'>
      <div className='mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-100'>
        <CheckCircle className='h-12 w-12 text-green-600' />
      </div>

      <h1 className='mb-4 text-3xl font-bold'>Order Placed Successfully!</h1>

      <p className='mb-8 max-w-md text-gray-600'>
        Thank you for your purchase. We've received your order and will process it as soon as possible. A confirmation email has been sent to your email address.
      </p>

      <div className='flex flex-wrap justify-center gap-4'>
        <Button asChild>
          <Link href='/products'>Continue Shopping</Link>
        </Button>

        <Button variant='outline' asChild>
          <Link href='/'>Back to Home</Link>
        </Button>
      </div>
    </div>
  )
}
