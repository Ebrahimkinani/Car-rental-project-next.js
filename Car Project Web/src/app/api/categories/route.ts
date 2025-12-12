import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import { Category } from '@/models/Category';

export async function GET() {
  try {
    await dbConnect();
    
    // Handle both old (isActive) and new (status) field names for backward compatibility
    const categories = await Category.find({
      $or: [
        { status: "Active" },
        { isActive: true }
      ]
    }).sort({ sortOrder: 1, name: 1 }).lean();
    
    // Transform MongoDB documents to match frontend interface
    const transformedCategories = categories.map((category: any) => ({
      id: category._id.toString(),
      name: category.name,
      code: category.code,
      slug: category.slug,
      description: category.description,
      status: category.status || (category.isActive ? "Active" : "Hidden"),
      sortOrder: category.sortOrder || 0,
      defaultDailyRate: category.defaultDailyRate,
      seats: category.seats,
      imageUrl: category.imageUrl,
      country: category.country,
      founded: category.founded,
      capacity: category.capacity,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt
    }));
    
    return NextResponse.json({
      success: true,
      data: transformedCategories
    });
  } catch (error) {
    console.error('Error fetching categories from MongoDB:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories from database' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.slug || !body.code) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: name, slug, code' },
        { status: 400 }
      );
    }
    
    // Check for duplicate slug
    const existingSlug = await Category.findOne({ slug: body.slug });
    if (existingSlug) {
      return NextResponse.json(
        { success: false, error: 'Category with this slug already exists' },
        { status: 400 }
      );
    }
    
    // Check for duplicate code
    const existingCode = await Category.findOne({ code: body.code });
    if (existingCode) {
      return NextResponse.json(
        { success: false, error: 'Category with this code already exists' },
        { status: 400 }
      );
    }
    
    const categoryData = {
      ...body,
      status: body.status || "Active",
      sortOrder: body.sortOrder || 0
    };
    
    const category = new Category(categoryData);
    const savedCategory = await category.save();
    
    // Transform the saved category to match frontend interface
    const transformedCategory = {
      id: (savedCategory as any)._id.toString(),
      name: savedCategory.name,
      code: savedCategory.code,
      slug: savedCategory.slug,
      description: savedCategory.description,
      status: savedCategory.status,
      sortOrder: savedCategory.sortOrder,
      defaultDailyRate: savedCategory.defaultDailyRate,
      seats: savedCategory.seats,
      imageUrl: savedCategory.imageUrl,
      country: savedCategory.country,
      founded: savedCategory.founded,
      capacity: savedCategory.capacity,
      createdAt: savedCategory.createdAt,
      updatedAt: savedCategory.updatedAt
    };
    
    return NextResponse.json({
      success: true,
      data: transformedCategory
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create category' },
      { status: 500 }
    );
  }
}
