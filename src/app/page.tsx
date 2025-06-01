'use client'

import { useProducts } from '@/queries/products'
import { ProductCard } from '@/components/ui/product-card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'

export default function HomePage() {
  // Fetch a limited number of products for the homepage
  const { data: products, isLoading } = useProducts()

  const featuredProducts = products?.slice(0, 4) || []

  return (
    <div className='container mx-auto px-4'>
      {/* Hero Section */}
      <section className='py-16 md:py-24'>
        <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
          <div className='flex flex-col justify-center'>
            <h1 className='mb-4 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl'>
              Discover Your <span className='text-primary'>Signature Scent</span>
            </h1>
            <p className='mb-8 text-lg text-gray-600'>
              Explore our collection of premium perfumes crafted with the finest ingredients. Find the perfect fragrance that expresses your unique personality.
            </p>
            <div className='flex flex-wrap gap-4'>
              <Button size='lg' asChild>
                <Link href='/products'>Shop Now</Link>
              </Button>
              <Button size='lg' variant='outline' asChild>
                <Link href='/products'>Explore Collection</Link>
              </Button>
            </div>
          </div>
          <div className='relative hidden overflow-hidden rounded-lg bg-gray-100 md:block'>
            <div className='aspect-[4/3] bg-gradient-to-r from-primary/20 to-primary/5' />
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className='py-12'>
        <div className='mb-8 flex items-center justify-between'>
          <h2 className='text-2xl font-bold md:text-3xl'>Featured Perfumes</h2>
          <Button variant='ghost' asChild>
            <Link href='/products'>View All</Link>
          </Button>
        </div>

        {isLoading ? (
          <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4'>
            {Array.from({ length: 4 }).map((_, i) => (
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
        ) : (
          <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4'>
            {featuredProducts.map((product) => (
              <ProductCard key={product._id?.toString()} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Benefits */}
      <section className='py-12'>
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3'>
          <div className='rounded-lg border bg-white p-6 shadow-sm'>
            <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                className='lucide lucide-truck'
              >
                <path d='M5 18H3c-.6 0-1-.4-1-1V7c0-.6.4-1 1-1h10c.6 0 1 .4 1 1v11' />
                <path d='M14 9h4l4 4v4c0 .6-.4 1-1 1h-2' />
                <circle cx='7' cy='18' r='2' />
                <circle cx='17' cy='18' r='2' />
              </svg>
            </div>
            <h3 className='mb-2 text-lg font-medium'>Free Shipping</h3>
            <p className='text-gray-600'>Free shipping on all orders over 1,000,000₫</p>
          </div>

          <div className='rounded-lg border bg-white p-6 shadow-sm'>
            <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                className='lucide lucide-shield-check'
              >
                <path d='M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10' />
                <path d='m9 12 2 2 4-4' />
              </svg>
            </div>
            <h3 className='mb-2 text-lg font-medium'>Authentic Products</h3>
            <p className='text-gray-600'>100% authentic products, directly from manufacturers</p>
          </div>

          <div className='rounded-lg border bg-white p-6 shadow-sm'>
            <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                className='lucide lucide-rotate-ccw'
              >
                <path d='M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8' />
                <path d='M3 3v5h5' />
              </svg>
            </div>
            <h3 className='mb-2 text-lg font-medium'>Easy Returns</h3>
            <p className='text-gray-600'>30-day return policy for all products</p>
          </div>
        </div>
      </section>
    </div>
  )
}
