'use client'

import CartDrawer from '@/components/cart-drawer'
import ThemeToggle from '@/components/theme-toggle'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { useAuth } from '@/hooks/useAuth'
import { useCart } from '@/hooks/useCart'
import { AnimatePresence, motion } from 'framer-motion'
import { Heart, Menu, Search, ShoppingCart, User } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { memo, useCallback, useEffect, useState } from 'react'

// Memoized components for better performance

const NavLink = memo(({ link, pathname }: { link: { name: string; href: string }; pathname: string }) => (
  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
    <Link href={link.href} className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${pathname === link.href ? 'text-primary' : 'text-muted-foreground'}`}>
      {link.name}
    </Link>
  </motion.div>
))
NavLink.displayName = 'NavLink'

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const pathname = usePathname()
  const { cartItems } = useCart()
  const { user, signIn, signOut } = useAuth()

  const isAdmin = user?.role === 'admin'

  // Optimized scroll handler with useCallback
  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY
    requestAnimationFrame(() => {
      setIsScrolled(currentScrollY > 60)
    })
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  // Memoized navigation links
  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Teddy Bears', href: '/products/teddy-bears' },
    { name: 'Perfumes', href: '/products/perfumes' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' }
  ]

  // Sample search results for demonstration
  const searchResults = [
    { name: 'Teddy Bear Classic', category: 'Teddy Bears', href: '/products/teddy-bears/classic' },
    { name: 'Rose Perfume', category: 'Perfumes', href: '/products/perfumes/rose' },
    { name: 'Lavender Scent', category: 'Perfumes', href: '/products/perfumes/lavender' },
    { name: 'Panda Bear', category: 'Teddy Bears', href: '/products/teddy-bears/panda' }
  ]

  // Handlers
  const toggleSearch = useCallback(() => setIsSearchOpen((prev) => !prev), [])
  const toggleCart = useCallback(() => setIsCartOpen((prev) => !prev), [])
  const closeCart = useCallback(() => setIsCartOpen(false), [])

  return (
    <motion.header
      initial={{ y: -40 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${isScrolled ? 'bg-background/95 shadow-lg backdrop-blur-lg' : 'bg-background/50'}`}
    >
      <div className='container mx-auto flex h-16 items-center justify-between px-4'>
        {/* Logo */}
        <Link href='/' className='flex items-center gap-2'>
          <motion.span className='bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-xl font-bold text-transparent' whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            Teddy & Scents
          </motion.span>
        </Link>

        {/* Desktop Navigation */}
        <nav className='hidden md:flex md:items-center md:gap-8'>
          {navLinks.map((link) => (
            <NavLink key={link.href} link={link} pathname={pathname} />
          ))}
        </nav>

        {/* Actions */}
        <div className='flex items-center gap-3'>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button variant='ghost' size='icon' className='hover:bg-primary/10' onClick={toggleSearch}>
              <Search className='h-5 w-5' />
              <span className='sr-only'>Search</span>
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button variant='ghost' size='icon' className='relative hover:bg-primary/10' onClick={toggleCart} id='cart-button'>
              <ShoppingCart className='h-5 w-5' />
              {cartItems.length > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className='absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground'
                >
                  {cartItems.length}
                </motion.span>
              )}
              <span className='sr-only'>Cart</span>
            </Button>
          </motion.div>

          <ThemeToggle />

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant='ghost' size='icon' className='rounded-full hover:bg-primary/10'>
                    <Avatar className='h-8 w-8 ring-2 ring-primary/20'>
                      <AvatarImage src={user.image || ''} alt={user.name || 'User'} />
                      <AvatarFallback className='bg-primary/5'>{user.name?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                  </Button>
                </motion.div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end' className='w-56'>
                <div className='px-2 py-1.5'>
                  <p className='text-sm font-medium'>{user.name}</p>
                  <p className='text-xs text-muted-foreground'>{user.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href='/profile' className='flex items-center'>
                    <User className='mr-2 h-4 w-4' />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href='/favorites' className='flex items-center'>
                    <Heart className='mr-2 h-4 w-4' />
                    Favorites
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href='/orders' className='flex items-center'>
                    <ShoppingCart className='mr-2 h-4 w-4' />
                    Orders
                  </Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href='/admin' className='flex items-center'>
                        Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()} className='text-red-500 focus:text-red-500'>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant='default' size='sm' onClick={() => signIn()} className='font-semibold'>
                Sign In
              </Button>
            </motion.div>
          )}

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant='ghost' size='icon' className='hover:bg-primary/10 md:hidden'>
                  <Menu className='h-5 w-5' />
                  <span className='sr-only'>Menu</span>
                </Button>
              </motion.div>
            </SheetTrigger>
            <SheetContent side='right' className='w-[300px] sm:w-[400px]'>
              <SheetTitle className='hidden'>Mobile Menu</SheetTitle>

              <div className='flex flex-col gap-6 py-4'>
                <div className='flex items-center justify-between'>
                  <Link href='/' className='bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-xl font-bold text-transparent'>
                    Teddy & Scents
                  </Link>
                </div>
                <div className='relative'>
                  <Search className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
                  <Input placeholder='Search...' className='pl-9' onClick={toggleSearch} />
                </div>
                <nav className='flex flex-col gap-4'>
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={`flex items-center gap-3 text-sm font-medium transition-colors hover:text-primary ${pathname === link.href ? 'text-primary' : 'text-muted-foreground'}`}
                    >
                      {link.name}
                    </Link>
                  ))}
                </nav>
                <div className='mt-auto flex flex-col gap-2'>
                  {user ? (
                    <>
                      <div className='flex items-center gap-3 rounded-lg border p-3'>
                        <Avatar className='h-10 w-10 ring-2 ring-primary/20'>
                          <AvatarImage src={user.image || ''} alt={user.name || 'User'} />
                          <AvatarFallback>{user.name?.charAt(0) || 'U'}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className='font-medium'>{user.name}</p>
                          <p className='text-sm text-muted-foreground'>{user.email}</p>
                        </div>
                      </div>
                      <Button variant='outline' className='w-full justify-start' asChild>
                        <Link href='/profile'>
                          <User className='mr-2 h-4 w-4' />
                          Profile
                        </Link>
                      </Button>
                      <Button variant='outline' className='w-full justify-start' asChild>
                        <Link href='/favorites'>
                          <Heart className='mr-2 h-4 w-4' />
                          Favorites
                        </Link>
                      </Button>
                      {isAdmin && (
                        <Button variant='outline' className='w-full justify-start' asChild>
                          <Link href='/admin'>Admin Dashboard</Link>
                        </Button>
                      )}
                      <Button variant='destructive' className='mt-2 w-full' onClick={() => signOut()}>
                        Log out
                      </Button>
                    </>
                  ) : (
                    <Button className='w-full bg-primary' onClick={() => signIn()}>
                      Sign In with Google
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <CartDrawer open={isCartOpen} onClose={closeCart} />

      {/* Search Dialog */}
      <CommandDialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <Command className='rounded-lg border shadow-md'>
          <CommandInput placeholder='Search products...' />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading='Products'>
              {searchResults.map((item) => (
                <CommandItem
                  key={item.href}
                  onSelect={() => {
                    window.location.href = item.href
                    setIsSearchOpen(false)
                  }}
                >
                  <div className='flex flex-col'>
                    <span>{item.name}</span>
                    <span className='text-xs text-muted-foreground'>{item.category}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </motion.header>
  )
}
