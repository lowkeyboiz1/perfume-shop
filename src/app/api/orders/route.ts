import { NextRequest, NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'
import clientPromise from '@/lib/mongodb'
import { Order, OrderInput } from '@/types/order'

export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db('perfume-shop')

    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    let query: any = {}

    if (status) {
      query.status = status
    }

    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    } else if (startDate) {
      query.createdAt = { $gte: new Date(startDate) }
    } else if (endDate) {
      query.createdAt = { $lte: new Date(endDate) }
    }

    const orders = await db.collection('orders').find(query).sort({ createdAt: -1 }).toArray()

    return NextResponse.json(orders)
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db('perfume-shop')

    const body = await request.json()

    // Validate required fields
    if (!body.customerName || !body.customerEmail || !body.items || body.items.length === 0) {
      return NextResponse.json({ error: 'Customer name, email, and at least one item are required' }, { status: 400 })
    }

    // Calculate total amount
    const totalAmount = body.items.reduce((sum: number, item: { price: number; quantity: number }) => sum + item.price * item.quantity, 0)

    // Get client IP address
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '0.0.0.0'

    const orderData: Order = {
      ...body,
      totalAmount,
      ipAddress: ipAddress.split(',')[0].trim(),
      status: body.status || 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const result = await db.collection('orders').insertOne(orderData)

    const insertedOrder = await db.collection('orders').findOne({ _id: result.insertedId })

    return NextResponse.json(insertedOrder, { status: 201 })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}
