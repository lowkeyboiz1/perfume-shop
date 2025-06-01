'use client'

import { useState, useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet'
import { useProduct, useUpdateProduct } from '@/queries/products'
import { Loader2 } from 'lucide-react'

const productSchema = z.object({
  name: z.string().min(2, {
    message: 'Product name must be at least 2 characters.'
  }),
  description: z.string().min(10, {
    message: 'Description must be at least 10 characters.'
  }),
  price: z.coerce.number().positive({
    message: 'Price must be a positive number.'
  }),
  discountedPrice: z.coerce.number().positive().optional(),
  imageUrl: z
    .string()
    .url({
      message: 'Please provide a valid URL for the image.'
    })
    .optional(),
  category: z.string().optional(),
  stock: z.coerce.number().int().nonnegative({
    message: 'Stock must be a non-negative integer.'
  })
})

type ProductFormValues = z.infer<typeof productSchema>

interface ProductEditDrawerProps {
  open: boolean
  onClose: () => void
  productId: string | null
}

export default function ProductEditDrawer({ open, onClose, productId }: ProductEditDrawerProps) {
  const { data: product, isLoading: isLoadingProduct } = useProduct(productId || '', {
    enabled: !!productId && open
  })
  const updateProduct = useUpdateProduct()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      stock: 0,
      category: '',
      imageUrl: ''
    }
  })

  useEffect(() => {
    if (product) {
      form.reset({
        name: product.name,
        description: product.description,
        price: product.price,
        discountedPrice: product.discountedPrice,
        imageUrl: product.imageUrl || '',
        category: product.category || '',
        stock: product.stock
      })
    }
  }, [product, form])

  async function onSubmit(data: ProductFormValues) {
    if (!productId) return

    setIsSubmitting(true)
    try {
      await updateProduct.mutateAsync({ id: productId, product: data })
      toast.success('Product updated successfully')
      onClose()
    } catch (error) {
      console.error('Error updating product:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to update product')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side='left' className='w-full max-w-3xl p-6'>
        <SheetHeader className='mb-5'>
          <SheetTitle>Edit Product</SheetTitle>
        </SheetHeader>

        {isLoadingProduct ? (
          <div className='flex justify-center py-12'>
            <Loader2 className='h-8 w-8 animate-spin text-primary' />
          </div>
        ) : (
          <div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                  <FormField
                    control={form.control}
                    name='name'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Name*</FormLabel>
                        <FormControl>
                          <Input placeholder='Enter product name' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='category'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                          <Input placeholder='Enter product category' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='price'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price*</FormLabel>
                        <FormControl>
                          <Input type='number' placeholder='0.00' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='discountedPrice'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Discounted Price</FormLabel>
                        <FormControl>
                          <Input type='number' placeholder='0.00' {...field} />
                        </FormControl>
                        <FormDescription>Leave empty if no discount</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='stock'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stock*</FormLabel>
                        <FormControl>
                          <Input type='number' placeholder='0' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='imageUrl'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Image URL</FormLabel>
                        <FormControl>
                          <Input placeholder='https://example.com/image.jpg' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name='description'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description*</FormLabel>
                      <FormControl>
                        <Textarea placeholder='Enter product description' className='min-h-32' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <SheetFooter>
                  <div className='flex w-full justify-end space-x-4'>
                    <Button variant='outline' type='button' onClick={onClose}>
                      Cancel
                    </Button>
                    <Button type='submit' disabled={isSubmitting || isLoadingProduct}>
                      {isSubmitting ? 'Updating...' : 'Update Product'}
                    </Button>
                  </div>
                </SheetFooter>
              </form>
            </Form>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
