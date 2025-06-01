import { ObjectId } from 'mongodb'

export interface Product {
  _id?: ObjectId
  name: string
  description: string
  price: number
  discountedPrice?: number
  imageUrl?: string
  category?: string
  stock: number
  createdAt: Date
  updatedAt: Date
}

export type ProductInput = Omit<Product, '_id' | 'createdAt' | 'updatedAt'>
export type ProductUpdate = Partial<ProductInput>
