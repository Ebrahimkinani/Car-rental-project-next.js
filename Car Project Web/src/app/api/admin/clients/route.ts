import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import mongoose from 'mongoose';
// import { getSessionFromRequest } from '@/lib/auth';
import { UserDoc } from '@/lib/types/db';

// Types for the API response
export interface ClientRow {
  id: string;
  name: string;
  email: string;
  phone: string;
  branch: string;
  tier: string;
  status: string;
  bookings: number;
  totalSpent: number;
  joined: string; // ISO date string
}

export interface ClientsResponse {
  data: ClientRow[];
  total: number;
  page: number;
  pageCount: number;
}

// Admin role check
// TODO: Uncomment when implementing proper admin authentication
// function isAdminRole(role: string): boolean {
//   return ['admin', 'manager', 'operations'].includes(role);
// }

// GET /api/admin/clients - Get all clients with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    // TODO: Add proper admin authentication
    // For now, we'll allow access without authentication to match other admin routes
    // In production, you should implement proper admin role checking:
    // const session = await getSessionFromRequest(request);
    // if (!session) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }
    // const user = await User.findById(session.userId);
    // if (!isAdminRole(user.role)) {
    //   return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    // }

    await dbConnect();

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const branch = searchParams.get('branch') || 'All';
    const tier = searchParams.get('tier') || 'All';
    const status = searchParams.get('status') || 'All';
    const from = searchParams.get('from') || '';
    const to = searchParams.get('to') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const sortBy = searchParams.get('sortBy') || 'name';
    const sortOrder = searchParams.get('sortOrder') || 'asc';

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Build MongoDB aggregation pipeline
    const pipeline: any[] = [];

    // Match stage for filtering
    const matchStage: any = {};

    // Search filter (name, email, phone)
    if (search.trim()) {
      matchStage.$or = [
        { displayName: { $regex: search.trim(), $options: 'i' } },
        { email: { $regex: search.trim(), $options: 'i' } },
        { phone: { $regex: search.trim(), $options: 'i' } }
      ];
    }

    // Branch filter - using meta field or default
    // Note: branch field doesn't exist in UserDoc schema, filtering happens in projection
    if (branch !== 'All') {
      // Will be handled in aggregation with default value
    }

    // Tier filter - using meta field or default  
    // Note: tier field doesn't exist in UserDoc schema, filtering happens in projection
    if (tier !== 'All') {
      // Will be handled in aggregation with default value
    }

    // Status filter - map Client status to UserDoc status
    if (status !== 'All') {
      // Map client status to user status
      const statusMap: Record<string, string> = {
        'Active': 'active',
        'Inactive': 'banned',
        'Suspended': 'deleted'
      };
      matchStage.status = statusMap[status] || status.toLowerCase();
    }

    // Date range filter
    if (from || to) {
      matchStage.createdAt = {};
      if (from) {
        matchStage.createdAt.$gte = new Date(from);
      }
      if (to) {
        matchStage.createdAt.$lte = new Date(to);
      }
    }

    if (Object.keys(matchStage).length > 0) {
      pipeline.push({ $match: matchStage });
    }

    // Lookup bookings to calculate bookings count and total spent
    // Note: Both uid and userId are strings, so the lookup should work
    pipeline.push({
      $lookup: {
        from: 'bookings',
        localField: 'uid', // Firebase UID (string)
        foreignField: 'userId', // Booking userId is also string
        as: 'bookings'
      }
    });

    // Add computed fields and defaults for missing fields
    pipeline.push({
      $addFields: {
        bookingsCount: { $size: '$bookings' },
        totalSpent: {
          $ifNull: [
            {
              $sum: {
                $map: {
                  input: {
                    $filter: {
                      input: '$bookings',
                      cond: { $eq: ['$$this.status', 'completed'] }
                    }
                  },
                  as: 'booking',
                  in: '$$booking.totalAmount'
                }
              }
            },
            0
          ]
        },
        // Add default values for fields that don't exist in UserDoc
        branch: { $ifNull: ['$branch', { $ifNull: ['$meta.branch', 'Doha'] }] },
        tier: { $ifNull: ['$tier', { $ifNull: ['$meta.tier', 'Regular'] }] },
        clientStatus: {
          $switch: {
            branches: [
              { case: { $eq: ['$status', 'active'] }, then: 'Active' },
              { case: { $eq: ['$status', 'banned'] }, then: 'Inactive' },
              { case: { $eq: ['$status', 'deleted'] }, then: 'Suspended' }
            ],
            default: 'Active'
          }
        }
      }
    });

    // Add filters for branch and tier if specified (after adding computed fields)
    const computedMatchStage: any = {};
    if (branch !== 'All') {
      computedMatchStage.branch = branch;
    }
    if (tier !== 'All') {
      computedMatchStage.tier = tier;
    }
    if (Object.keys(computedMatchStage).length > 0) {
      pipeline.push({ $match: computedMatchStage });
    }

    // Sort stage
    const sortStage: any = {};
    sortStage[sortBy] = sortOrder === 'asc' ? 1 : -1;
    pipeline.push({ $sort: sortStage });

    // Get total count for pagination (before skip/limit)
    const countPipeline = [...pipeline];
    countPipeline.push({ $count: 'total' });
    
    // Use mongoose connection for consistency
    if (!mongoose.connection.db) {
      throw new Error('Database not connected');
    }
    const db = mongoose.connection.db;
    const users = db.collection<UserDoc>('users');
    const countResult = await users.aggregate(countPipeline).toArray();
    const total = countResult.length > 0 ? countResult[0].total : 0;

    // Add pagination
    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: limit });

    // Project final fields
    pipeline.push({
      $project: {
        id: '$_id',
        name: '$displayName',
        email: '$email',
        phone: { $ifNull: ['$phone', 'N/A'] },
        branch: '$branch',
        tier: '$tier',
        status: '$clientStatus',
        bookings: '$bookingsCount',
        totalSpent: '$totalSpent',
        joined: '$createdAt'
      }
    });

    // Execute aggregation
    const clients = await users.aggregate(pipeline).toArray();

    // Transform data to match ClientRow interface
    const data: ClientRow[] = clients.map((client: any) => ({
      id: client.id.toString(),
      name: client.name || 'N/A',
      email: client.email || 'N/A',
      phone: client.phone || 'N/A',
      branch: client.branch || 'N/A',
      tier: client.tier || 'Regular',
      status: client.status || 'Active',
      bookings: client.bookings || 0,
      totalSpent: client.totalSpent || 0,
      joined: client.joined ? new Date(client.joined).toISOString() : new Date().toISOString()
    }));

    const pageCount = Math.ceil(total / limit);

    return NextResponse.json({
      data,
      total,
      page,
      pageCount
    });

  } catch (error) {
    console.error('Error fetching clients:', error);
    return NextResponse.json(
      { error: 'Failed to fetch clients' },
      { status: 500 }
    );
  }
}

