import { ObjectId } from 'mongodb'

export interface OrderItem {
  productId: string
  name: string
  price: number
  quantity: number
}

export interface Order {
  _id?: ObjectId
  customerName: string
  customerEmail: string
  customerPhone: string
  customerAddress: string
  items: OrderItem[]
  totalAmount: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  ipAddress: string
  createdAt: Date
  updatedAt: Date
}

export type OrderInput = Omit<Order, '_id' | 'createdAt' | 'updatedAt'>
export type OrderUpdate = Partial<Omit<Order, '_id' | 'createdAt' | 'updatedAt' | 'ipAddress'>>

export interface OrderStats {
  totalOrders: number
  totalRevenue: number
  averageOrderValue: number
}
