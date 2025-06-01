'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useProducts } from '@/queries/products'
import { formatCurrency } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Plus, Search } from 'lucide-react'
import ProductEditDrawer from '@/components/admin/product-edit-drawer'

export default function AdminProductsPage() {
  const { data: products, isLoading } = useProducts()
  const [searchQuery, setSearchQuery] = useState('')
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null)

  const filteredProducts = products?.filter((product) => product.name.toLowerCase().includes(searchQuery.toLowerCase()) || product.category?.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleEditProduct = (productId: string) => {
    setSelectedProductId(productId)
    setIsDrawerOpen(true)
  }

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false)
    setSelectedProductId(null)
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='mb-8 flex items-center justify-between'>
        <h1 className='text-3xl font-bold'>Products</h1>
        <Button asChild>
          <Link href='/admin/products/new'>
            <Plus className='mr-2 h-4 w-4' /> Add Product
          </Link>
        </Button>
      </div>

      <div className='mb-6'>
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500' />
          <Input placeholder='Search products...' className='pl-10' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
      </div>

      {isLoading ? (
        <div className='flex justify-center py-8'>
          <p>Loading products...</p>
        </div>
      ) : (
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {filteredProducts?.map((product) => (
            <Card key={product._id?.toString()} className='overflow-hidden'>
              {product.imageUrl && (
                <div className='aspect-[4/3] w-full overflow-hidden'>
                  <img src={product.imageUrl} alt={product.name} className='h-full w-full object-cover' />
                </div>
              )}
              <CardHeader>
                <CardTitle className='flex items-center justify-between'>
                  <span>{product.name}</span>
                  <span className='text-lg font-medium text-primary'>{formatCurrency(product.price)}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className='mb-2 line-clamp-2 text-sm text-gray-600'>{product.description}</p>
                <div className='mb-4 flex justify-between text-sm'>
                  <span>Stock: {product.stock}</span>
                  <span>Category: {product.category || 'Uncategorized'}</span>
                </div>
                <Button variant='outline' className='w-full' onClick={() => handleEditProduct(product._id?.toString() || '')}>
                  Edit Product
                </Button>
              </CardContent>
            </Card>
          ))}

          {filteredProducts?.length === 0 && (
            <div className='col-span-full py-8 text-center'>
              <p className='text-gray-500'>No products found</p>
            </div>
          )}
        </div>
      )}

      <ProductEditDrawer open={isDrawerOpen} onClose={handleCloseDrawer} productId={selectedProductId} />
    </div>
  )
}
