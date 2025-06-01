import axios from 'axios'
import { Product, ProductInput, ProductUpdate } from '@/types/product'

const API_URL = '/api/products'

export const getProducts = async (category?: string): Promise<Product[]> => {
  const url = category ? `${API_URL}?category=${category}` : API_URL
  const response = await axios.get<Product[]>(url)
  return response.data
}

export const getProduct = async (id: string): Promise<Product> => {
  const response = await axios.get<Product>(`${API_URL}/${id}`)
  return response.data
}

export const createProduct = async (product: ProductInput): Promise<Product> => {
  const response = await axios.post<Product>(API_URL, product)
  return response.data
}

export const updateProduct = async (id: string, product: ProductUpdate): Promise<Product> => {
  const response = await axios.put<Product>(`${API_URL}/${id}`, product)
  return response.data
}

export const deleteProduct = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`)
}
