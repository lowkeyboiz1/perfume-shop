'use client'

import { useParams, useRouter } from 'next/navigation'
import { useProduct } from '@/queries/products'
import Image from 'next/image'
import { formatCurrency } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { ShoppingCart } from 'lucide-react'

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const { data: product, isLoading, error } = useProduct(params.id)

  const hasDiscount = product?.discountedPrice !== undefined && product.discountedPrice < product.price

  if (isLoading) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
          <Skeleton className='aspect-square w-full rounded-lg' />
          <div>
            <Skeleton className='mb-4 h-8 w-3/4' />
            <Skeleton className='mb-6 h-4 w-full' />
            <Skeleton className='mb-2 h-6 w-1/3' />
            <Skeleton className='mb-8 h-4 w-full' />
            <Skeleton className='h-12 w-full' />
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='rounded-lg border border-red-200 bg-red-50 p-4 text-red-800'>Product not found or error loading product. Please try again later.</div>
        <Button variant='outline' className='mt-4' onClick={() => router.push('/products')}>
          Back to Products
        </Button>
      </div>
    )
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
        <div className='relative aspect-square overflow-hidden rounded-lg bg-gray-100'>
          {product.imageUrl ? (
            <Image src={product.imageUrl} alt={product.name} fill className='object-cover' />
          ) : (
            <div className='flex h-full w-full items-center justify-center text-gray-400'>No image available</div>
          )}

          {hasDiscount && (
            <div className='absolute right-4 top-4 rounded-full bg-red-500 px-3 py-1.5 text-sm font-semibold text-white'>
              {Math.round(((product.price - (product.discountedPrice || 0)) / product.price) * 100)}% OFF
            </div>
          )}
        </div>

        <div>
          <h1 className='mb-2 text-3xl font-bold'>{product.name}</h1>
          <div className='mb-4'>
            {hasDiscount ? (
              <div className='flex items-center gap-2'>
                <span className='text-2xl font-bold text-primary'>{formatCurrency(product.discountedPrice || 0)}</span>
                <span className='text-lg text-gray-500 line-through'>{formatCurrency(product.price)}</span>
              </div>
            ) : (
              <span className='text-2xl font-bold text-primary'>{formatCurrency(product.price)}</span>
            )}
          </div>

          <p className='mb-6 text-gray-600'>{product.description}</p>

          <div className='mb-6'>
            <div className='mb-2 flex items-center justify-between'>
              <span className='text-sm text-gray-500'>Category:</span>
              <span className='rounded-full bg-gray-100 px-3 py-1 text-sm'>{product.category || 'Uncategorized'}</span>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-sm text-gray-500'>Availability:</span>
              <span className={`rounded-full px-3 py-1 text-sm ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
              </span>
            </div>
          </div>

          <Button size='lg' className='w-full' disabled={product.stock <= 0}>
            <ShoppingCart className='mr-2 h-5 w-5' />
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  )
}
