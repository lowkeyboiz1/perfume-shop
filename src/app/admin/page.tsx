'use client'

import { useOrders } from '@/queries/orders'
import { useProducts } from '@/queries/products'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowRight, Package, ShoppingBag, DollarSign, TrendingUp } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

export default function AdminDashboardPage() {
  const { data: orders } = useOrders()
  const { data: products } = useProducts()

  // Calculate some basic stats
  const totalProducts = products?.length || 0
  const totalOrders = orders?.length || 0
  const pendingOrders = orders?.filter((order) => order.status === 'pending').length || 0
  const totalRevenue = orders?.reduce((sum, order) => sum + order.totalAmount, 0) || 0

  const stats = [
    {
      name: 'Total Products',
      value: totalProducts,
      description: 'Products in inventory',
      icon: Package,
      href: '/admin/products'
    },
    {
      name: 'Total Orders',
      value: totalOrders,
      description: 'All-time orders',
      icon: ShoppingBag,
      href: '/admin/orders'
    },
    {
      name: 'Pending Orders',
      value: pendingOrders,
      description: 'Orders awaiting processing',
      icon: ShoppingBag,
      href: '/admin/orders'
    },
    {
      name: 'Total Revenue',
      value: formatCurrency(totalRevenue),
      description: 'All-time revenue',
      icon: DollarSign,
      href: '/admin/stats'
    }
  ]

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='mb-8 flex items-center justify-between'>
        <h1 className='text-3xl font-bold'>Dashboard</h1>
        <div className='flex gap-4'>
          <Button asChild>
            <Link href='/admin/products/new'>Add Product</Link>
          </Button>
        </div>
      </div>

      <div className='mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardHeader className='pb-2'>
              <div className='flex items-center justify-between'>
                <CardDescription>{stat.name}</CardDescription>
                <stat.icon className='h-5 w-5 text-gray-400' />
              </div>
              <CardTitle className='text-2xl'>{stat.value}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='flex items-center justify-between'>
                <p className='text-sm text-gray-500'>{stat.description}</p>
                <Button variant='ghost' size='sm' className='h-8 w-8 p-0' asChild>
                  <Link href={stat.href}>
                    <ArrowRight className='h-4 w-4' />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className='grid grid-cols-1 gap-8 lg:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest orders from customers</CardDescription>
          </CardHeader>
          <CardContent>
            {orders?.slice(0, 5).map((order) => (
              <div key={order._id?.toString()} className='mb-4 flex items-center justify-between border-b pb-4 last:mb-0 last:border-0 last:pb-0'>
                <div>
                  <p className='font-medium'>{order.customerName}</p>
                  <p className='text-sm text-gray-500'>
                    {order.items.length} items • {order.status}
                  </p>
                </div>
                <p className='font-medium'>{formatCurrency(order.totalAmount)}</p>
              </div>
            ))}

            <Button variant='outline' className='mt-4 w-full' asChild>
              <Link href='/admin/orders'>View All Orders</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>Summary of sales and revenue</CardDescription>
          </CardHeader>
          <CardContent className='flex flex-col items-center justify-center'>
            <div className='mb-6 flex h-32 w-32 items-center justify-center rounded-full border-8 border-primary/20'>
              <div className='text-center'>
                <TrendingUp className='mx-auto h-8 w-8 text-primary' />
                <p className='mt-2 text-2xl font-bold'>{formatCurrency(totalRevenue)}</p>
              </div>
            </div>
            <Button variant='outline' className='w-full' asChild>
              <Link href='/admin/stats'>View Detailed Stats</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
