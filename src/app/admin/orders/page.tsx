'use client'

import { useState } from 'react'
import { useOrders, useUpdateOrder, useDeleteOrder } from '@/queries/orders'
import { formatCurrency } from '@/lib/utils'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'

export default function OrdersPage() {
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined)
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDetailsSheetOpen, setIsDetailsSheetOpen] = useState(false)

  const {
    data: orders,
    isLoading,
    error
  } = useOrders({
    status: statusFilter,
    startDate: startDate || undefined,
    endDate: endDate || undefined
  })

  const updateOrder = useUpdateOrder()
  const deleteOrder = useDeleteOrder()

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await updateOrder.mutateAsync({
        id: orderId,
        order: { status: newStatus as any }
      })
      toast.success('Order status updated successfully')
    } catch (error) {
      console.error('Error updating order status:', error)
      toast.error('Failed to update order status')
    }
  }

  const handleDeleteOrder = async () => {
    if (!selectedOrderId) return

    try {
      await deleteOrder.mutateAsync(selectedOrderId)
      setIsDeleteDialogOpen(false)
      setSelectedOrderId(null)
      toast.success('Order deleted successfully')
    } catch (error) {
      console.error('Error deleting order:', error)
      toast.error('Failed to delete order')
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'processing':
        return 'bg-blue-100 text-blue-800'
      case 'shipped':
        return 'bg-purple-100 text-purple-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const selectedOrder = selectedOrderId ? orders?.find((order) => order._id?.toString() === selectedOrderId) : null

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='mb-8 text-3xl font-bold'>Order Management</h1>

      <div className='mb-6 grid grid-cols-1 gap-4 md:grid-cols-4'>
        <div>
          <Select value={statusFilter || ''} onValueChange={(value) => setStatusFilter(value || undefined)}>
            <SelectTrigger>
              <SelectValue placeholder='Filter by status' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=''>All Statuses</SelectItem>
              <SelectItem value='pending'>Pending</SelectItem>
              <SelectItem value='processing'>Processing</SelectItem>
              <SelectItem value='shipped'>Shipped</SelectItem>
              <SelectItem value='delivered'>Delivered</SelectItem>
              <SelectItem value='cancelled'>Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Input type='date' placeholder='Start Date' value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </div>

        <div>
          <Input type='date' placeholder='End Date' value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>

        <div>
          <Button
            variant='outline'
            onClick={() => {
              setStatusFilter(undefined)
              setStartDate('')
              setEndDate('')
            }}
          >
            Clear Filters
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className='rounded-lg border bg-white p-8 text-center'>Loading orders...</div>
      ) : error ? (
        <div className='rounded-lg border border-red-200 bg-red-50 p-4 text-red-800'>Error loading orders. Please try again later.</div>
      ) : orders?.length === 0 ? (
        <div className='rounded-lg border bg-white p-8 text-center text-gray-500'>No orders found.</div>
      ) : (
        <div className='overflow-hidden rounded-lg border bg-white shadow'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total</TableHead>
                <TableHead className='text-right'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders?.map((order) => (
                <TableRow key={order._id?.toString()}>
                  <TableCell className='font-medium'>{order._id?.toString().substring(0, 8)}...</TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell>{format(new Date(order.createdAt), 'MMM dd, yyyy')}</TableCell>
                  <TableCell>
                    <Select value={order.status} onValueChange={(value) => handleStatusChange(order._id!.toString(), value)}>
                      <SelectTrigger className={`w-[130px] ${getStatusBadgeColor(order.status)}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='pending'>Pending</SelectItem>
                        <SelectItem value='processing'>Processing</SelectItem>
                        <SelectItem value='shipped'>Shipped</SelectItem>
                        <SelectItem value='delivered'>Delivered</SelectItem>
                        <SelectItem value='cancelled'>Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>{formatCurrency(order.totalAmount)}</TableCell>
                  <TableCell className='text-right'>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => {
                        setSelectedOrderId(order._id!.toString())
                        setIsDetailsSheetOpen(true)
                      }}
                    >
                      View
                    </Button>
                    <Button
                      variant='ghost'
                      size='sm'
                      className='text-red-500 hover:text-red-700'
                      onClick={() => {
                        setSelectedOrderId(order._id!.toString())
                        setIsDeleteDialogOpen(true)
                      }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone. This will permanently delete the order.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className='bg-red-600 hover:bg-red-700' onClick={handleDeleteOrder}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Order Details Sheet */}
      <Sheet open={isDetailsSheetOpen} onOpenChange={setIsDetailsSheetOpen}>
        <SheetContent className='w-full sm:max-w-lg'>
          <SheetHeader>
            <SheetTitle>Order Details</SheetTitle>
            <SheetDescription>Order ID: {selectedOrder?._id?.toString()}</SheetDescription>
          </SheetHeader>

          {selectedOrder && (
            <div className='mt-6 space-y-6'>
              <div>
                <h3 className='mb-2 text-sm font-medium text-gray-500'>Customer Information</h3>
                <div className='rounded-lg border bg-gray-50 p-4'>
                  <p>
                    <strong>Name:</strong> {selectedOrder.customerName}
                  </p>
                  <p>
                    <strong>Email:</strong> {selectedOrder.customerEmail}
                  </p>
                  <p>
                    <strong>Phone:</strong> {selectedOrder.customerPhone}
                  </p>
                  <p>
                    <strong>Address:</strong> {selectedOrder.customerAddress}
                  </p>
                  <p>
                    <strong>IP Address:</strong> {selectedOrder.ipAddress}
                  </p>
                </div>
              </div>

              <div>
                <h3 className='mb-2 text-sm font-medium text-gray-500'>Order Items</h3>
                <div className='rounded-lg border bg-gray-50 p-4'>
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className='mb-2 flex justify-between border-b pb-2 last:border-0 last:pb-0'>
                      <div>
                        <p className='font-medium'>{item.name}</p>
                        <p className='text-sm text-gray-500'>Quantity: {item.quantity}</p>
                      </div>
                      <p>{formatCurrency(item.price * item.quantity)}</p>
                    </div>
                  ))}
                  <div className='mt-4 flex justify-between border-t pt-2'>
                    <p className='font-bold'>Total</p>
                    <p className='font-bold'>{formatCurrency(selectedOrder.totalAmount)}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className='mb-2 text-sm font-medium text-gray-500'>Order Status</h3>
                <Select value={selectedOrder.status} onValueChange={(value) => handleStatusChange(selectedOrder._id!.toString(), value)}>
                  <SelectTrigger className={getStatusBadgeColor(selectedOrder.status)}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='pending'>Pending</SelectItem>
                    <SelectItem value='processing'>Processing</SelectItem>
                    <SelectItem value='shipped'>Shipped</SelectItem>
                    <SelectItem value='delivered'>Delivered</SelectItem>
                    <SelectItem value='cancelled'>Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <h3 className='mb-2 text-sm font-medium text-gray-500'>Order Dates</h3>
                <div className='rounded-lg border bg-gray-50 p-4'>
                  <p>
                    <strong>Created:</strong> {format(new Date(selectedOrder.createdAt), 'PPpp')}
                  </p>
                  <p>
                    <strong>Updated:</strong> {format(new Date(selectedOrder.updatedAt), 'PPpp')}
                  </p>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
