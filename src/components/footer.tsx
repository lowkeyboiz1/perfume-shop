import Link from 'next/link'

export function Footer() {
  return (
    <footer className='border-t bg-background'>
      <div className='container mx-auto px-4 py-8 md:py-12'>
        <div className='grid grid-cols-2 gap-8 md:grid-cols-4'>
          <div>
            <h3 className='mb-4 text-lg font-semibold'>Shop</h3>
            <ul className='space-y-2'>
              <li>
                <Link href='/products' className='text-muted-foreground hover:text-foreground'>
                  All Products
                </Link>
              </li>
              <li>
                <Link href='/categories' className='text-muted-foreground hover:text-foreground'>
                  Categories
                </Link>
              </li>
              <li>
                <Link href='/deals' className='text-muted-foreground hover:text-foreground'>
                  Deals
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className='mb-4 text-lg font-semibold'>Account</h3>
            <ul className='space-y-2'>
              <li>
                <Link href='/profile' className='text-muted-foreground hover:text-foreground'>
                  Profile
                </Link>
              </li>
              <li>
                <Link href='/orders' className='text-muted-foreground hover:text-foreground'>
                  Orders
                </Link>
              </li>
              <li>
                <Link href='/wishlist' className='text-muted-foreground hover:text-foreground'>
                  Wishlist
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className='mb-4 text-lg font-semibold'>Company</h3>
            <ul className='space-y-2'>
              <li>
                <Link href='/about' className='text-muted-foreground hover:text-foreground'>
                  About Us
                </Link>
              </li>
              <li>
                <Link href='/contact' className='text-muted-foreground hover:text-foreground'>
                  Contact
                </Link>
              </li>
              <li>
                <Link href='/careers' className='text-muted-foreground hover:text-foreground'>
                  Careers
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className='mb-4 text-lg font-semibold'>Legal</h3>
            <ul className='space-y-2'>
              <li>
                <Link href='/privacy' className='text-muted-foreground hover:text-foreground'>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href='/terms' className='text-muted-foreground hover:text-foreground'>
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href='/shipping' className='text-muted-foreground hover:text-foreground'>
                  Shipping Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className='mt-8 border-t pt-8 text-center text-muted-foreground'>
          <p>&copy; {new Date().getFullYear()} Your Store. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
