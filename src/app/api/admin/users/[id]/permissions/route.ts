import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db/mongo';
import { ObjectId } from 'mongodb';

type PermissionSet = {
  module: string;
  view?: boolean;
  create?: boolean;
  edit?: boolean;
  delete?: boolean;
  export?: boolean;
  manage?: boolean;
};

interface AdminUserDoc {
  _id?: ObjectId;
  name: string;
  email: string;
  role: "Admin" | "Manager" | "Employee" | "Viewer";
  branch: string;
  status: "Active" | "Suspended" | "Inactive";
  permissions?: PermissionSet[];
  createdAt: Date;
  updatedAt: Date;
}

// PATCH /api/admin/users/[id]/permissions - Update user permissions
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = await getDb();
    const users = db.collection<AdminUserDoc>('adminUsers');

    const { id } = await params;
    const body = await request.json();
    const { permissions } = body;

    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid user ID' },
        { status: 400 }
      );
    }

    // Validate permissions structure
    if (!Array.isArray(permissions)) {
      return NextResponse.json(
        { error: 'Permissions must be an array' },
        { status: 400 }
      );
    }

    // TODO: Validate module names against allowed modules
    // For now, accept any module names
    
    // Update user permissions
    const result = await users.updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          permissions,
          updatedAt: new Date()
        } 
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Permissions updated successfully'
    });

  } catch (error) {
    console.error('Error updating permissions:', error);
    return NextResponse.json(
      { error: 'Failed to update permissions' },
      { status: 500 }
    );
  }
}

