import { NextRequest, NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'
import clientPromise from '@/lib/mongodb'
import { OrderUpdate } from '@/types/order'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise
    const db = client.db('perfume-shop')

    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: 'Invalid order ID' }, { status: 400 })
    }

    const order = await db.collection('orders').findOne({
      _id: new ObjectId(params.id)
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error('Error fetching order:', error)
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise
    const db = client.db('perfume-shop')

    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: 'Invalid order ID' }, { status: 400 })
    }

    const body = await request.json()
    const updateData: OrderUpdate & { updatedAt: Date } = {
      ...body,
      updatedAt: new Date()
    }

    // Recalculate total if items are updated
    if (body.items) {
      updateData.totalAmount = body.items.reduce((sum: number, item: { price: number; quantity: number }) => sum + item.price * item.quantity, 0)
    }

    const result = await db.collection('orders').updateOne({ _id: new ObjectId(params.id) }, { $set: updateData })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    const updatedOrder = await db.collection('orders').findOne({
      _id: new ObjectId(params.id)
    })

    return NextResponse.json(updatedOrder)
  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise
    const db = client.db('perfume-shop')

    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: 'Invalid order ID' }, { status: 400 })
    }

    const result = await db.collection('orders').deleteOne({
      _id: new ObjectId(params.id)
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Order deleted successfully' }, { status: 200 })
  } catch (error) {
    console.error('Error deleting order:', error)
    return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 })
  }
}
