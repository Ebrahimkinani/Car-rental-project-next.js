import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import { Category } from '@/models/Category';
import { USE_MOCK_DATA } from '@/lib/data-source';
import { getStoreCategories } from '@/lib/mock-store';

export async function GET(_request: NextRequest) {
  try {
    if (USE_MOCK_DATA) {
      const carTypes = getStoreCategories()
        .filter((c) => c.status === 'Active' && c.capacity)
        .map((c) => c.name);
      return NextResponse.json({ carTypes: ['All', ...carTypes] });
    }

    await dbConnect();

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
