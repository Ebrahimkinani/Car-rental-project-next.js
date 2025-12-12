import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import mongoose from 'mongoose';
import { Category as CategoryModel } from '@/models/Category';

// GET /api/admin/categories/trend - Daily new categories counts for the last N days
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const daysParam = parseInt(searchParams.get('days') || '30', 10);

    const now = new Date();
    const startDate = new Date(now);
    startDate.setDate(now.getDate() - Math.max(1, daysParam) + 1);
    startDate.setHours(0, 0, 0, 0);

    if (!mongoose.connection.db) {
      throw new Error('Database not connected');
    }

    // Group by day on createdAt
    const pipeline = [
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: {
            y: { $year: '$createdAt' },
            m: { $month: '$createdAt' },
            d: { $dayOfMonth: '$createdAt' },
          },
          total: { $count: {} },
        },
      },
      {
        $project: {
          _id: 0,
          date: {
            $dateFromParts: {
              year: '$_id.y',
              month: '$_id.m',
              day: '$_id.d',
            },
          },
          total: 1,
        },
      },
      { $sort: { date: 1 } },
    ];

    const raw = await (CategoryModel as any).aggregate(pipeline).exec();

    const points: { date: string; total: number }[] = [];
    const map = new Map<string, number>();
    raw.forEach((r: any) => {
      const key = new Date(r.date).toISOString().slice(0, 10);
      map.set(key, r.total || 0);
    });

    const cursor = new Date(startDate);
    while (cursor <= now) {
      const key = cursor.toISOString().slice(0, 10);
      points.push({ date: key, total: map.get(key) || 0 });
      cursor.setDate(cursor.getDate() + 1);
    }

    return NextResponse.json({ points });
  } catch (error) {
    console.error('Error fetching categories trend:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories trend' },
      { status: 500 }
    );
  }
}


