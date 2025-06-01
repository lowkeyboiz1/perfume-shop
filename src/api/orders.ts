import axios from 'axios'
import { Order, OrderInput, OrderUpdate, OrderStats } from '@/types/order'

const API_URL = '/api/orders'

export const getOrders = async (filters?: { status?: string; startDate?: string; endDate?: string }): Promise<Order[]> => {
  let url = API_URL

  if (filters) {
    const params = new URLSearchParams()

    if (filters.status) {
      params.append('status', filters.status)
    }

    if (filters.startDate) {
      params.append('startDate', filters.startDate)
    }

    if (filters.endDate) {
      params.append('endDate', filters.endDate)
    }

    const queryString = params.toString()
    if (queryString) {
      url = `${url}?${queryString}`
    }
  }

  const response = await axios.get<Order[]>(url)
  return response.data
}

export const getOrder = async (id: string): Promise<Order> => {
  const response = await axios.get<Order>(`${API_URL}/${id}`)
  return response.data
}

export const createOrder = async (order: OrderInput): Promise<Order> => {
  const response = await axios.post<Order>(API_URL, order)
  return response.data
}

export const updateOrder = async (id: string, order: OrderUpdate): Promise<Order> => {
  const response = await axios.put<Order>(`${API_URL}/${id}`, order)
  return response.data
}

export const deleteOrder = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`)
}

export const getOrderStats = async (params?: {
  period?: 'day' | 'week' | 'month'
  startDate?: string
  endDate?: string
}): Promise<{
  periodStats: Array<OrderStats & { date: string }>
  overallStats: OrderStats
}> => {
  let url = `${API_URL}/stats`

  if (params) {
    const urlParams = new URLSearchParams()

    if (params.period) {
      urlParams.append('period', params.period)
    }

    if (params.startDate) {
      urlParams.append('startDate', params.startDate)
    }

    if (params.endDate) {
      urlParams.append('endDate', params.endDate)
    }

    const queryString = urlParams.toString()
    if (queryString) {
      url = `${url}?${queryString}`
    }
  }

  const response = await axios.get(url)
  return response.data
}
