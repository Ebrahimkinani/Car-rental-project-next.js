import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import mongoose from 'mongoose';
import { UserDoc } from '@/lib/types/db';

// GET /api/admin/clients/kpis - Get KPI metrics
export async function GET(_request: NextRequest) {
  try {
    // TODO: Add proper admin authentication
    await dbConnect();

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Use mongoose connection for consistency
    if (!mongoose.connection.db) {
      throw new Error('Database not connected');
    }
    const db = mongoose.connection.db;
    const users = db.collection<UserDoc>('users');

    // Build aggregation pipeline for KPIs
    const kpiPipeline = [
      {
        $facet: {
          total: [{ $count: 'count' }],
          active: [
            { $match: { status: 'active' } },
            { $count: 'count' }
          ],
          newThisMonth: [
            { $match: { createdAt: { $gte: startOfMonth } } },
            { $count: 'count' }
          ],
          suspended: [
            { $match: { status: 'suspended' } },
            { $count: 'count' }
          ]
        }
      }
    ];

    const kpiResult = await users.aggregate(kpiPipeline).toArray();
    const kpis = kpiResult[0];

    return NextResponse.json({
      total: kpis.total[0]?.count || 0,
      active: kpis.active[0]?.count || 0,
      newThisMonth: kpis.newThisMonth[0]?.count || 0,
      suspended: kpis.suspended[0]?.count || 0
    });

  } catch (error) {
    console.error('Error fetching client KPIs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch client KPIs' },
      { status: 500 }
    );
  }
}
