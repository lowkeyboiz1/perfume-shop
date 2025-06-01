'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

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

export default function NewProductPage() {
  const router = useRouter()
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

  async function onSubmit(data: ProductFormValues) {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create product')
      }

      toast.success('Product created successfully')
      router.push('/admin/products')
    } catch (error) {
      console.error('Error creating product:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to create product')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='mb-8'>
        <Button variant='ghost' asChild className='mb-4'>
          <Link href='/admin/products'>
            <ArrowLeft className='mr-2 h-4 w-4' /> Back to Products
          </Link>
        </Button>
        <h1 className='text-3xl font-bold'>Add New Product</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Information</CardTitle>
          <CardDescription>Enter the details of the new product</CardDescription>
        </CardHeader>
        <CardContent>
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

              <div className='flex justify-end space-x-4'>
                <Button variant='outline' type='button' asChild>
                  <Link href='/admin/products'>Cancel</Link>
                </Button>
                <Button type='submit' disabled={isSubmitting}>
                  {isSubmitting ? 'Creating...' : 'Create Product'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
