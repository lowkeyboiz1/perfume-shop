import { NextRequest, NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'
import clientPromise from '@/lib/mongodb'
import { Product, ProductInput } from '@/types/product'

export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db('perfume-shop')

    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')
    const query = category ? { category } : {}

    const products = await db.collection('products').find(query).toArray()

    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db('perfume-shop')

    const body = await request.json()

    // Validate required fields
    if (!body.name || !body.price || body.stock === undefined) {
      return NextResponse.json({ error: 'Name, price, and stock are required' }, { status: 400 })
    }

    const productData: Product = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const result = await db.collection('products').insertOne(productData)

    const insertedProduct = await db.collection('products').findOne({ _id: result.insertedId })

    return NextResponse.json(insertedProduct, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}
