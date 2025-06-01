import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getOrders, getOrder, createOrder, updateOrder, deleteOrder, getOrderStats } from '@/api/orders'
import { OrderInput, OrderUpdate } from '@/types/order'

// Query keys
export const orderKeys = {
  all: ['orders'] as const,
  lists: () => [...orderKeys.all, 'list'] as const,
  list: (filters: { status?: string; startDate?: string; endDate?: string }) => [...orderKeys.lists(), filters] as const,
  details: () => [...orderKeys.all, 'detail'] as const,
  detail: (id: string) => [...orderKeys.details(), id] as const,
  stats: () => [...orderKeys.all, 'stats'] as const,
  statsByPeriod: (params: { period?: 'day' | 'week' | 'month'; startDate?: string; endDate?: string }) => [...orderKeys.stats(), params] as const
}

// Queries
export const useOrders = (filters?: { status?: string; startDate?: string; endDate?: string }) => {
  return useQuery({
    queryKey: orderKeys.list(filters || {}),
    queryFn: () => getOrders(filters)
  })
}

export const useOrder = (id: string) => {
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: () => getOrder(id),
    enabled: !!id
  })
}

export const useOrderStats = (params?: { period?: 'day' | 'week' | 'month'; startDate?: string; endDate?: string }) => {
  return useQuery({
    queryKey: orderKeys.statsByPeriod(params || {}),
    queryFn: () => getOrderStats(params)
  })
}

// Mutations
export const useCreateOrder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (order: OrderInput) => createOrder(order),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() })
      queryClient.invalidateQueries({ queryKey: orderKeys.stats() })
    }
  })
}

export const useUpdateOrder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, order }: { id: string; order: OrderUpdate }) => updateOrder(id, order),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(variables.id) })
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() })
      queryClient.invalidateQueries({ queryKey: orderKeys.stats() })
    }
  })
}

export const useDeleteOrder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() })
      queryClient.invalidateQueries({ queryKey: orderKeys.stats() })
    }
  })
}
