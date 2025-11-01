import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import { Category } from '@/models/Category';
import { transformCategoryForAPI } from '@/lib/transformers';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await dbConnect();
    const { slug } = await params;
    
    const category = await Category.findOne({ slug }).lean();
    
    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }
    
    // Transform database category to API format
    const transformedCategory = transformCategoryForAPI(category);
    
    return NextResponse.json({
      success: true,
      data: transformedCategory
    });
  } catch (error) {
    console.error('Error fetching category by slug:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch category' },
      { status: 500 }
    );
  }
}
