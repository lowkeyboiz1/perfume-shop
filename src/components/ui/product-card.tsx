'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@/types/product'
import { formatCurrency } from '@/lib/utils'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const hasDiscount = product.discountedPrice !== undefined && product.discountedPrice < product.price

  return (
    <Link href={`/products/${product._id}`} className='group relative flex flex-col overflow-hidden rounded-lg border bg-white shadow-sm transition-all hover:shadow-md'>
      <div className='aspect-square overflow-hidden bg-gray-100'>
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} className='h-full w-full object-cover transition-transform group-hover:scale-105' />
        ) : (
          <div className='flex h-full w-full items-center justify-center bg-gray-100 text-gray-400'>No image</div>
        )}
      </div>

      {hasDiscount && (
        <div className='absolute right-2 top-2 rounded-full bg-red-500 px-2 py-1 text-xs font-semibold text-white'>
          {Math.round(((product.price - (product.discountedPrice || 0)) / product.price) * 100)}% OFF
        </div>
      )}

      <div className='flex flex-1 flex-col p-4'>
        <h3 className='text-sm font-medium text-gray-900'>{product.name}</h3>
        <p className='mt-1 line-clamp-2 text-xs text-gray-500'>{product.description}</p>
        <div className='mt-auto pt-4'>
          {hasDiscount ? (
            <div className='flex items-center gap-2'>
              <span className='text-sm font-medium text-gray-900'>{formatCurrency(product.discountedPrice || 0)}</span>
              <span className='text-xs text-gray-500 line-through'>{formatCurrency(product.price)}</span>
            </div>
          ) : (
            <span className='text-sm font-medium text-gray-900'>{formatCurrency(product.price)}</span>
          )}
        </div>
      </div>
    </Link>
  )
}
