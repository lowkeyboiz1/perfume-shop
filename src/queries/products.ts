import { useMutation, useQuery, useQueryClient, QueryClient, UseQueryOptions } from '@tanstack/react-query'
import { getProducts, getProduct, createProduct, updateProduct, deleteProduct } from '@/api/products'
import { Product, ProductInput, ProductUpdate } from '@/types/product'

// Query keys
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: { category?: string }) => [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const
}

// Queries
export const useProducts = (category?: string) => {
  return useQuery({
    queryKey: productKeys.list({ category }),
    queryFn: () => getProducts(category)
  })
}

export const useProduct = (id: string, options?: Omit<UseQueryOptions<Product, Error, Product, ReturnType<typeof productKeys.detail>>, 'queryKey' | 'queryFn'>) => {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => getProduct(id),
    enabled: !!id,
    ...options
  })
}

// Mutations
export const useCreateProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (product: ProductInput) => createProduct(product),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() })
    }
  })
}

export const useUpdateProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, product }: { id: string; product: ProductUpdate }) => updateProduct(id, product),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: productKeys.detail(variables.id) })
      queryClient.invalidateQueries({ queryKey: productKeys.lists() })
    }
  })
}

export const useDeleteProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() })
    }
  })
}
