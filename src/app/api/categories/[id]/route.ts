import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import { Category } from '@/models/Category';
import { transformCategoryForAPI, transformCategoryFromAPI } from '@/lib/transformers';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const category = await Category.findById(id).lean();
    
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
    console.error('Error fetching category:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch category' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const body = await request.json();
    const { id } = await params;
    
    // Check if category exists
    const existingCategory = await Category.findById(id);
    
    if (!existingCategory) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }
    
    // Check for duplicate slug (excluding current category)
    if (body.slug) {
      const existingSlug = await Category.findOne({ 
        slug: body.slug,
        _id: { $ne: id }
      });
      if (existingSlug) {
        return NextResponse.json(
          { success: false, error: 'Category with this slug already exists' },
          { status: 400 }
        );
      }
    }
    
    // Check for duplicate code (excluding current category)
    if (body.code) {
      const existingCode = await Category.findOne({ 
        code: body.code,
        _id: { $ne: id }
      });
      if (existingCode) {
        return NextResponse.json(
          { success: false, error: 'Category with this code already exists' },
          { status: 400 }
        );
      }
    }
    
    // Transform API data to database format
    const updateData = transformCategoryFromAPI(body);
    
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedCategory) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }
    
    // Transform response to API format
    const transformedCategory = transformCategoryForAPI(updatedCategory.toObject());
    
    return NextResponse.json({
      success: true,
      data: transformedCategory
    });
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update category' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    
    // Check if category exists
    const existingCategory = await Category.findById(id);
    
    if (!existingCategory) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }
    
    // Check if any cars are using this category
    const { Car } = await import('@/models/Car');
    const carsUsingCategory = await Car.countDocuments({ 
      categoryId: id 
    });
    
    if (carsUsingCategory > 0) {
      return NextResponse.json(
        { success: false, error: `Cannot delete category. ${carsUsingCategory} car(s) are using this category.` },
        { status: 400 }
      );
    }
    
    const result = await Category.findByIdAndDelete(id);
    
    if (!result) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete category' },
      { status: 500 }
    );
  }
}
