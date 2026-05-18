import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import { Car } from '@/models/Car';
import { Category } from '@/models/Category';
import { USE_MOCK_DATA } from '@/lib/data-source';
import { getStoreCars, getStoreCategories } from '@/lib/mock-store';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const carType = searchParams.get('carType');
    const branch = searchParams.get('branch');
    const date = searchParams.get('date');
    const time = searchParams.get('time');

    if (USE_MOCK_DATA) {
      let cars = getStoreCars().filter((c) => c.status === 'available' && c.available);

      if (branch && branch !== '') {
        cars = cars.filter((c) => c.branch === branch);
      }

      if (carType && carType !== '') {
        const category = getStoreCategories().find((c) => c.name === carType);
        if (category) {
          cars = cars.filter((c) => c.categoryId === category.id);
        }
      }

      return NextResponse.json({
        success: true,
        data: {
          availableCount: cars.length,
          filters: {
            carType: carType || null,
            branch: branch || null,
            date: date || null,
            time: time || null,
          },
        },
      });
    }

    await dbConnect();

    const query: Record<string, unknown> = {
      status: 'available',
      available: true,
    };

    if (branch && branch !== '') {
      query.branch = branch;
    }

    if (carType && carType !== '') {
      const category = await Category.findOne({ name: carType });
      if (category) {
        query.categoryId = category._id;
      }
    }

    const availableCars = await Car.find(query).countDocuments();

    return NextResponse.json({
      success: true,
      data: {
        availableCount: availableCars,
        filters: {
          carType: carType || null,
          branch: branch || null,
          date: date || null,
          time: time || null,
        },
      },
    });
  } catch (error) {
    console.error('Error checking car availability:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to check car availability',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
