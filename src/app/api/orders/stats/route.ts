import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db('perfume-shop')

    const searchParams = request.nextUrl.searchParams
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const period = searchParams.get('period') || 'day' // day, week, month

    let matchStage: any = {}

    // Date filtering
    if (startDate && endDate) {
      matchStage.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    } else if (startDate) {
      matchStage.createdAt = { $gte: new Date(startDate) }
    } else if (endDate) {
      matchStage.createdAt = { $lte: new Date(endDate) }
    }

    // Group by time period
    let groupId: any = {}

    if (period === 'day') {
      groupId = {
        year: { $year: '$createdAt' },
        month: { $month: '$createdAt' },
        day: { $dayOfMonth: '$createdAt' }
      }
    } else if (period === 'week') {
      groupId = {
        year: { $year: '$createdAt' },
        week: { $week: '$createdAt' }
      }
    } else if (period === 'month') {
      groupId = {
        year: { $year: '$createdAt' },
        month: { $month: '$createdAt' }
      }
    }

    // Aggregate pipeline
    const pipeline = [
      { $match: matchStage },
      {
        $group: {
          _id: groupId,
          date: { $first: '$createdAt' },
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$totalAmount' }
        }
      },
      {
        $project: {
          _id: 0,
          date: 1,
          totalOrders: 1,
          totalRevenue: 1,
          averageOrderValue: { $divide: ['$totalRevenue', '$totalOrders'] }
        }
      },
      { $sort: { date: 1 } }
    ]

    const stats = await db.collection('orders').aggregate(pipeline).toArray()

    // Get overall statistics
    const overallStats = await db
      .collection('orders')
      .aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: null,
            totalOrders: { $sum: 1 },
            totalRevenue: { $sum: '$totalAmount' }
          }
        },
        {
          $project: {
            _id: 0,
            totalOrders: 1,
            totalRevenue: 1,
            averageOrderValue: { $divide: ['$totalRevenue', '$totalOrders'] }
          }
        }
      ])
      .toArray()

    return NextResponse.json({
      periodStats: stats,
      overallStats: overallStats[0] || { totalOrders: 0, totalRevenue: 0, averageOrderValue: 0 }
    })
  } catch (error) {
    console.error('Error fetching order statistics:', error)
    return NextResponse.json({ error: 'Failed to fetch order statistics' }, { status: 500 })
  }
}
