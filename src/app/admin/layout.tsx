'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Package, ShoppingBag, BarChart2, Settings } from 'lucide-react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const navigation = [
    {
      name: 'Products',
      href: '/admin/products',
      icon: Package,
      current: pathname === '/admin/products'
    },
    {
      name: 'Orders',
      href: '/admin/orders',
      icon: ShoppingBag,
      current: pathname === '/admin/orders'
    },
    {
      name: 'Statistics',
      href: '/admin/stats',
      icon: BarChart2,
      current: pathname === '/admin/stats'
    },
    {
      name: 'Settings',
      href: '/admin/settings',
      icon: Settings,
      current: pathname === '/admin/settings'
    }
  ]

  return (
    <div className='flex min-h-screen flex-col'>
      <header className='border-b bg-white'>
        <div className='container mx-auto flex h-16 items-center justify-between px-4'>
          <div className='flex items-center'>
            <Link href='/admin' className='text-xl font-bold text-primary'>
              Admin Dashboard
            </Link>
          </div>
          <div className='flex items-center gap-4'>
            <Link href='/' className='text-sm text-gray-600 hover:text-gray-900'>
              View Store
            </Link>
          </div>
        </div>
      </header>

      <div className='flex flex-1'>
        <aside className='w-64 border-r bg-white'>
          <nav className='flex flex-col p-4'>
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`mb-1 flex items-center rounded-md px-3 py-2 text-sm font-medium ${item.current ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
              >
                <item.icon className='mr-3 h-5 w-5' />
                {item.name}
              </Link>
            ))}
          </nav>
        </aside>

        <main className='flex-1 bg-gray-50'>{children}</main>
      </div>
    </div>
  )
}
