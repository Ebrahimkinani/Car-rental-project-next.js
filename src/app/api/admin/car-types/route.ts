import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import { getSessionFromRequest } from '@/lib/auth';
import { Category } from '@/models/Category';

// GET /api/admin/car-types - Get distinct car types for filter dropdown
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

    // Get all active categories
    const categories = await Category.find({ status: 'Active' })
      .select('name')
      .sort({ name: 1 })
      .lean();

    const carTypes = categories.map(cat => cat.name);

    return NextResponse.json({
      carTypes: ['All', ...carTypes]
    });

  } catch (error) {
    console.error('Error fetching car types:', error);
    return NextResponse.json(
      { error: 'Failed to fetch car types' },
      { status: 500 }
    );
  }
}
