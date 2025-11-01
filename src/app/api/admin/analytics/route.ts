import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import { Booking } from '@/models/Booking';
import { Car } from '@/models/Car';
import { requireAuth } from '@/lib/auth/requireAuth';

export async function GET(request: NextRequest) {
  try {
    // Require admin, manager, or employee role
    await requireAuth(request, ['admin', 'manager', 'employee']);
    
    await dbConnect();

    // Calculate date ranges
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twelveWeeksAgo = new Date(now.getTime() - 12 * 7 * 24 * 60 * 60 * 1000);
    const sixMonthsAgo = new Date(now.getTime() - 6 * 30 * 24 * 60 * 60 * 1000);
    const twelveMonthsAgo = new Date(now.getTime() - 12 * 30 * 24 * 60 * 60 * 1000);
    const fiveYearsAgo = new Date(now.getTime() - 5 * 365 * 24 * 60 * 60 * 1000);

    // Calculate KPIs
    const [
      totalRevenuePaidNotCancelled,
      totalRevenueAllTime,
      activeRentals,
      newBookings,
      availableCars
    ] = await Promise.all([
      // Total Revenue (all paid bookings excluding cancelled)
      Booking.aggregate([
        {
          $match: {
            paymentStatus: 'paid',
            status: { $ne: 'cancelled' }
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$totalAmount' }
          }
        }
      ]).then(result => result[0]?.total || 0),

      // Total Revenue (all paid bookings)
      Booking.aggregate([
        {
          $match: {
            paymentStatus: 'paid'
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$totalAmount' }
          }
        }
      ]).then(result => result[0]?.total || 0),

      // Active Rentals
      Booking.countDocuments({ status: 'active' }),

      // New Bookings (last 7 days)
      Booking.countDocuments({ 
        createdAt: { $gte: sevenDaysAgo } 
      }),

      // Available Cars
      Car.countDocuments({ status: 'available' })
    ]);

    // Calculate Weekly Earnings (last 12 weeks)
    const earningsWeekly = await Booking.aggregate([
      {
        $match: {
          status: 'completed',
          paymentStatus: 'paid',
          createdAt: { $gte: twelveWeeksAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            week: { $week: '$createdAt' }
          },
          revenue: { $sum: '$totalAmount' }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.week': 1 }
      },
      {
        $limit: 12
      }
    ]).then(result => 
      (result || []).map((item, index) => ({
        week: `W${index + 1}`,
        revenue: Math.round((item.revenue || 0) / 1000) // Convert to thousands
      }))
    ).catch(err => {
      console.error('Error calculating weekly earnings:', err);
      return [];
    });

    // Calculate Rent Status Distribution
    const rentStatus = await Booking.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]).then(result => {
      const statusMap = {
        active: 0,
        pending: 0,
        completed: 0,
        cancelled: 0
      };
      
      if (result && Array.isArray(result)) {
        result.forEach(item => {
          if (item._id in statusMap) {
            statusMap[item._id as keyof typeof statusMap] = item.count;
          }
        });
      }
      
      return statusMap;
    }).catch(err => {
      console.error('Error calculating rent status:', err);
      return { active: 0, pending: 0, completed: 0, cancelled: 0 };
    });

    // Calculate Monthly Bookings (last 6 months)
    const bookingsMonthly = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      },
      {
        $limit: 6
      }
    ]).then(result => 
      (result || []).map(item => ({
        month: new Date(item._id.year, item._id.month - 1).toLocaleDateString('en-US', { month: 'short' }),
        count: item.count || 0
      }))
    ).catch(err => {
      console.error('Error calculating monthly bookings:', err);
      return [];
    });

    // Calculate Car Types Distribution
    const carTypes = await Car.aggregate([
      {
        $lookup: {
          from: 'categories',
          localField: 'categoryId',
          foreignField: '_id',
          as: 'category'
        }
      },
      {
        $unwind: '$category'
      },
      {
        $group: {
          _id: '$category.name',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 4
      }
    ]).then(result => {
      if (!result || !Array.isArray(result)) {
        return [];
      }
      const totalCars = result.reduce((sum, item) => sum + (item.count || 0), 0);
      return result.map(item => ({
        name: item._id || 'Unknown',
        count: item.count || 0,
        percentage: totalCars > 0 ? Math.round((item.count || 0) / totalCars * 100) : 0
      }));
    }).catch(err => {
      console.error('Error calculating car types:', err);
      return [];
    });

    // Calculate Monthly Earnings (last 12 months)
    const earningsMonthly = await Booking.aggregate([
      {
        $match: {
          status: 'completed',
          paymentStatus: 'paid',
          createdAt: { $gte: twelveMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          revenue: { $sum: '$totalAmount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 12 }
    ]).then(result =>
      (result || []).map(item => ({
        month: new Date(item._id.year, item._id.month - 1).toLocaleDateString('en-US', { month: 'short' }),
        revenue: Math.round((item.revenue || 0) / 1000) // thousands
      }))
    ).catch(err => {
      console.error('Error calculating monthly earnings:', err);
      return [];
    });

    // Calculate Yearly Earnings (last 5 years)
    const earningsYearly = await Booking.aggregate([
      {
        $match: {
          status: 'completed',
          paymentStatus: 'paid',
          createdAt: { $gte: fiveYearsAgo }
        }
      },
      {
        $group: {
          _id: { year: { $year: '$createdAt' } },
          revenue: { $sum: '$totalAmount' }
        }
      },
      { $sort: { '_id.year': 1 } },
      { $limit: 5 }
    ]).then(result =>
      (result || []).map(item => ({
        year: String(item._id.year),
        revenue: Math.round((item.revenue || 0) / 1000) // thousands
      }))
    ).catch(err => {
      console.error('Error calculating yearly earnings:', err);
      return [];
    });

    const analytics = {
      kpis: {
        totalRevenue: Math.round(totalRevenuePaidNotCancelled || 0),
        totalRevenueAllTime: Math.round(totalRevenueAllTime || 0),
        activeRentals: activeRentals || 0,
        newBookings: newBookings || 0,
        availableCars: availableCars || 0
      },
      earningsWeekly: earningsWeekly || [],
      earningsMonthly: earningsMonthly || [],
      earningsYearly: earningsYearly || [],
      rentStatus: rentStatus || { active: 0, pending: 0, completed: 0, cancelled: 0 },
      bookingsMonthly: bookingsMonthly || [],
      carTypes: carTypes || []
    };

    return NextResponse.json({
      success: true,
      data: analytics
    });

  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch analytics data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
