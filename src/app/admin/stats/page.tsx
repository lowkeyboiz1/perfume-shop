'use client'

import { useState } from 'react'
import { useOrderStats } from '@/queries/orders'
import { formatCurrency } from '@/lib/utils'
import { format, subDays, subMonths } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'

export default function StatsPage() {
  const [period, setPeriod] = useState<'day' | 'week' | 'month'>('day')
  const [startDate, setStartDate] = useState<string>(() => {
    const date = subDays(new Date(), 30)
    return format(date, 'yyyy-MM-dd')
  })
  const [endDate, setEndDate] = useState<string>(() => {
    const date = new Date()
    return format(date, 'yyyy-MM-dd')
  })
  const [timeRange, setTimeRange] = useState<string>('30days')

  const {
    data: stats,
    isLoading,
    error
  } = useOrderStats({
    period,
    startDate,
    endDate
  })

  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value)
    const endDate = new Date()
    let startDate: Date

    switch (value) {
      case '7days':
        startDate = subDays(endDate, 7)
        break
      case '30days':
        startDate = subDays(endDate, 30)
        break
      case '90days':
        startDate = subDays(endDate, 90)
        break
      case '6months':
        startDate = subMonths(endDate, 6)
        break
      case '1year':
        startDate = subMonths(endDate, 12)
        break
      default:
        startDate = subDays(endDate, 30)
    }

    setStartDate(format(startDate, 'yyyy-MM-dd'))
    setEndDate(format(endDate, 'yyyy-MM-dd'))
  }

  const formatChartData = () => {
    if (!stats?.periodStats) return []

    return stats.periodStats.map((stat) => ({
      date: format(new Date(stat.date), period === 'day' ? 'MMM dd' : period === 'week' ? 'MMM dd' : 'MMM yyyy'),
      revenue: stat.totalRevenue,
      orders: stat.totalOrders,
      average: stat.averageOrderValue
    }))
  }

  const chartData = formatChartData()

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='mb-8 text-3xl font-bold'>Revenue Statistics</h1>

      <div className='mb-8 grid grid-cols-1 gap-4 md:grid-cols-3'>
        <Card>
          <CardHeader className='pb-2'>
            <CardDescription>Total Revenue</CardDescription>
            <CardTitle className='text-3xl text-primary'>{isLoading ? 'Loading...' : stats ? formatCurrency(stats.overallStats.totalRevenue) : 'N/A'}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-sm text-gray-500'>For the selected period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='pb-2'>
            <CardDescription>Total Orders</CardDescription>
            <CardTitle className='text-3xl'>{isLoading ? 'Loading...' : stats ? stats.overallStats.totalOrders : 'N/A'}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-sm text-gray-500'>For the selected period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='pb-2'>
            <CardDescription>Average Order Value</CardDescription>
            <CardTitle className='text-3xl'>{isLoading ? 'Loading...' : stats ? formatCurrency(stats.overallStats.averageOrderValue) : 'N/A'}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-sm text-gray-500'>For the selected period</p>
          </CardContent>
        </Card>
      </div>

      <div className='mb-6 grid grid-cols-1 gap-4 md:grid-cols-4'>
        <div>
          <Select value={period} onValueChange={(value: any) => setPeriod(value)}>
            <SelectTrigger>
              <SelectValue placeholder='Group by' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='day'>Daily</SelectItem>
              <SelectItem value='week'>Weekly</SelectItem>
              <SelectItem value='month'>Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Select value={timeRange} onValueChange={handleTimeRangeChange}>
            <SelectTrigger>
              <SelectValue placeholder='Time range' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='7days'>Last 7 days</SelectItem>
              <SelectItem value='30days'>Last 30 days</SelectItem>
              <SelectItem value='90days'>Last 90 days</SelectItem>
              <SelectItem value='6months'>Last 6 months</SelectItem>
              <SelectItem value='1year'>Last year</SelectItem>
              <SelectItem value='custom'>Custom range</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Input
            type='date'
            placeholder='Start Date'
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value)
              setTimeRange('custom')
            }}
          />
        </div>

        <div>
          <Input
            type='date'
            placeholder='End Date'
            value={endDate}
            onChange={(e) => {
              setEndDate(e.target.value)
              setTimeRange('custom')
            }}
          />
        </div>
      </div>

      {isLoading ? (
        <div className='rounded-lg border bg-white p-8 text-center'>Loading statistics...</div>
      ) : error ? (
        <div className='rounded-lg border border-red-200 bg-red-50 p-4 text-red-800'>Error loading statistics. Please try again later.</div>
      ) : (
        <div className='rounded-lg border bg-white p-6 shadow-sm'>
          <Tabs defaultValue='revenue'>
            <TabsList className='mb-6'>
              <TabsTrigger value='revenue'>Revenue</TabsTrigger>
              <TabsTrigger value='orders'>Orders</TabsTrigger>
              <TabsTrigger value='average'>Average Order Value</TabsTrigger>
            </TabsList>

            <TabsContent value='revenue'>
              <div className='h-[400px]'>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='date' angle={-45} textAnchor='end' height={70} />
                    <YAxis tickFormatter={(value) => formatCurrency(value).replace('₫', '')} />
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    <Bar dataKey='revenue' name='Revenue' fill='#3b82f6' />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>

            <TabsContent value='orders'>
              <div className='h-[400px]'>
                <ResponsiveContainer width='100%' height='100%'>
                  <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='date' angle={-45} textAnchor='end' height={70} />
                    <YAxis />
                    <Tooltip />
                    <Line type='monotone' dataKey='orders' name='Orders' stroke='#8b5cf6' strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>

            <TabsContent value='average'>
              <div className='h-[400px]'>
                <ResponsiveContainer width='100%' height='100%'>
                  <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='date' angle={-45} textAnchor='end' height={70} />
                    <YAxis tickFormatter={(value) => formatCurrency(value).replace('₫', '')} />
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    <Line type='monotone' dataKey='average' name='Average Order Value' stroke='#10b981' strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  )
}
