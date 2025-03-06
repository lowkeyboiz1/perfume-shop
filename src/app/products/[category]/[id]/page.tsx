import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronRight, Heart, Star } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { AddToCartButton } from '@/components/add-to-cart-button'
// Mock function to get product data
async function getProduct(id: string) {
  // In a real app, this would fetch from an API or database
  const products = {
    '1': {
      id: '1',
      name: 'Classic Brown Teddy Bear',
      description:
        'A soft and cuddly companion for all ages. Made with premium materials for durability and softness. This classic teddy bear features embroidered eyes and nose for safety, and is stuffed with hypoallergenic filling. Perfect for gifts, cuddles, and creating lasting memories.',
      price: 29.99,
      category: 'teddy-bears',
      images: ['/placeholder.svg?height=600&width=600', '/placeholder.svg?height=600&width=600', '/placeholder.svg?height=600&width=600', '/placeholder.svg?height=600&width=600'],
      inStock: true,
      features: ['Super soft plush material', 'Hypoallergenic filling', 'Embroidered features for safety', 'Suitable for all ages', 'Height: 12 inches (30cm)'],
      reviews: {
        average: 4.8,
        count: 124
      }
    },
    '2': {
      id: '2',
      name: 'Vanilla Dreams Perfume',
      description:
        'A sweet and warm fragrance for everyday wear. This delightful perfume combines notes of vanilla, jasmine, and sandalwood for a comforting yet sophisticated scent that lasts all day. Perfect for both casual and formal occasions.',
      price: 59.99,
      category: 'perfumes',
      images: ['/placeholder.svg?height=600&width=600', '/placeholder.svg?height=600&width=600', '/placeholder.svg?height=600&width=600'],
      inStock: true,
      features: ['Top notes: Vanilla, Bergamot', 'Middle notes: Jasmine, Lily of the Valley', 'Base notes: Sandalwood, Musk', 'Long-lasting formula', '50ml glass bottle'],
      reviews: {
        average: 4.6,
        count: 87
      }
    }
  }

  if (!products[id as keyof typeof products]) {
    return null
  }

  return products[id as keyof typeof products]
}

export default async function ProductPage(props: { params: Promise<{ category: string; id: string }> }) {
  const params = await props.params
  const product = await getProduct(params.id)

  if (!product) {
    notFound()
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      {/* Breadcrumbs */}
      <nav className='mb-6 flex items-center gap-1 text-sm text-muted-foreground'>
        <Link href='/' className='hover:text-primary'>
          Home
        </Link>
        <ChevronRight className='h-4 w-4' />
        <Link href={`/products/${params.category}`} className='capitalize hover:text-primary'>
          {params.category.replace('-', ' ')}
        </Link>
        <ChevronRight className='h-4 w-4' />
        <span className='truncate'>{product.name}</span>
      </nav>

      <div className='grid gap-8 md:grid-cols-2'>
        {/* Product Images */}
        <div className='flex flex-col gap-4'>
          <div className='relative aspect-square overflow-hidden rounded-lg border'>
            <Image src={product.images[0] || '/placeholder.svg'} alt={product.name} fill className='object-cover' priority />
          </div>
          <div className='grid grid-cols-4 gap-2'>
            {product.images.map((image, index) => (
              <div key={index} className='relative aspect-square cursor-pointer overflow-hidden rounded-md border hover:border-primary'>
                <Image src={image || '/placeholder.svg'} alt={`${product.name} - Image ${index + 1}`} fill className='object-cover' />
              </div>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className='flex flex-col gap-6'>
          <div>
            <h1 className='mb-2 text-3xl font-bold'>{product.name}</h1>
            <div className='mb-4 flex items-center gap-2'>
              <div className='flex items-center'>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className={`h-5 w-5 ${star <= Math.round(product.reviews.average) ? 'fill-primary text-primary' : 'fill-muted text-muted-foreground'}`} />
                ))}
              </div>
              <span className='text-sm text-muted-foreground'>
                {product.reviews.average} ({product.reviews.count} reviews)
              </span>
            </div>
            <p className='text-3xl font-bold'>${product.price.toFixed(2)}</p>
          </div>

          <div className='rounded-lg bg-muted/50 p-4'>
            <div className='mb-2 flex items-center gap-2'>
              <Badge variant={product.inStock ? 'outline' : 'destructive'}>{product.inStock ? 'In Stock' : 'Out of Stock'}</Badge>
              {product.inStock && <span className='text-sm text-muted-foreground'>Ships within 1-2 business days</span>}
            </div>
            <p className='text-sm text-muted-foreground'>Free shipping on orders over $50</p>
          </div>

          <div className='flex flex-col gap-4'>
            <h3 className='font-medium'>Description</h3>
            <p className='text-muted-foreground'>{product.description}</p>
          </div>

          <div className='flex flex-col gap-4'>
            <h3 className='font-medium'>Features</h3>
            <ul className='grid gap-2'>
              {product.features.map((feature, index) => (
                <li key={index} className='flex items-center gap-2 text-muted-foreground'>
                  <div className='h-1.5 w-1.5 rounded-full bg-primary' />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div className='mt-4 flex flex-col gap-4 sm:flex-row'>
            <AddToCartButton product={product} />
          </div>
        </div>
      </div>
    </div>
  )
}
