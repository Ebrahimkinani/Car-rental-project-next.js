import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db/mongo';

// Branch document interface
interface BranchDoc {
  _id?: string;
  name: string;
  city?: string;
  country?: string;
}

export async function GET() {
  try {
    const db = await getDb();
    const branches = db.collection<BranchDoc>('branches');

    // Check if branches exist, if not seed default branches
    const count = await branches.countDocuments();
    if (count === 0) {
      // TODO: Create 'branches' collection with name and location fields
      // For now, we'll use hardcoded values
      const defaultBranches = [
        { name: 'Doha', city: 'Doha', country: 'Qatar' },
        { name: 'Al Wakrah', city: 'Al Wakrah', country: 'Qatar' },
        { name: 'Al Khor', city: 'Al Khor', country: 'Qatar' }
      ];
      await branches.insertMany(defaultBranches);
      // Default branches seeded
    }

    const allBranches = await branches.find({}).toArray();

    return NextResponse.json({ branches: allBranches });

  } catch (error) {
    console.error('Error fetching branches:', error);
    return NextResponse.json(
      { error: 'Failed to fetch branches' },
      { status: 500 }
    );
  }
}

