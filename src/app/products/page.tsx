'use client'

import { useState } from 'react'
import { useProducts } from '@/queries/products'
import { ProductCard } from '@/components/ui/product-card'
import { Skeleton } from '@/components/ui/skeleton'

export default function ProductsPage() {
  const [category, setCategory] = useState<string | undefined>(undefined)
  const { data: products, isLoading, error } = useProducts(category)

  const categories = [
    { label: 'All', value: undefined },
    { label: 'Men', value: 'men' },
    { label: 'Women', value: 'women' },
    { label: 'Unisex', value: 'unisex' }
  ]

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='mb-8 text-3xl font-bold'>Our Perfumes</h1>

      <div className='mb-8 flex flex-wrap gap-2'>
        {categories.map((cat) => (
          <button
            key={cat.label}
            className={`rounded-full px-4 py-2 text-sm font-medium ${cat.value === category ? 'bg-primary text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
            onClick={() => setCategory(cat.value)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className='flex flex-col rounded-lg border bg-white shadow-sm'>
              <Skeleton className='aspect-square w-full rounded-t-lg' />
              <div className='p-4'>
                <Skeleton className='mb-2 h-4 w-3/4' />
                <Skeleton className='mb-4 h-3 w-full' />
                <Skeleton className='h-4 w-1/3' />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className='rounded-lg border border-red-200 bg-red-50 p-4 text-red-800'>Error loading products. Please try again later.</div>
      ) : products?.length === 0 ? (
        <div className='rounded-lg border border-gray-200 bg-gray-50 p-8 text-center text-gray-500'>No products found.</div>
      ) : (
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>{products?.map((product) => <ProductCard key={product._id?.toString()} product={product} />)}</div>
      )}
    </div>
  )
}
