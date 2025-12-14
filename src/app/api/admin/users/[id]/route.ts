import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db/mongo';
import { ObjectId } from 'mongodb';

interface AdminUserDoc {
  _id?: ObjectId;
  name: string;
  email: string;
  password?: string;
  role: "Admin" | "Manager" | "Employee" | "Viewer";
  branch: string;
  status: "Active" | "Suspended" | "Inactive";
  permissions?: PermissionSet[];
  createdAt: Date;
  updatedAt: Date;
}

type PermissionSet = {
  module: string;
  view?: boolean;
  create?: boolean;
  edit?: boolean;
  delete?: boolean;
  export?: boolean;
  manage?: boolean;
};

// PATCH /api/admin/users/[id] - Update user info (role, branch, status)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = await getDb();
    const users = db.collection<AdminUserDoc>('adminUsers');

    const { id } = await params;
    const body = await request.json();
    const { role, branch, status } = body;

    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid user ID' },
        { status: 400 }
      );
    }

    // Build update object
    const update: any = { updatedAt: new Date() };
    if (role) update.role = role;
    if (branch) update.branch = branch;
    if (status) update.status = status;

    const result = await users.updateOne(
      { _id: new ObjectId(id) },
      { $set: update }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'User updated successfully'
    });

  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/users/[id] - Delete user (soft delete by default)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = await getDb();
    const users = db.collection<AdminUserDoc>('adminUsers');

    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const hard = searchParams.get('hard') === 'true';

    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid user ID' },
        { status: 400 }
      );
    }

    if (hard) {
      // Permanent delete
      const result = await users.deleteOne({ _id: new ObjectId(id) });
      if (result.deletedCount === 0) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({
        success: true,
        message: 'User permanently deleted'
      });
    } else {
      // Soft delete (set status to Inactive)
      const result = await users.updateOne(
        { _id: new ObjectId(id) },
        { $set: { status: 'Inactive', updatedAt: new Date() } }
      );
      if (result.matchedCount === 0) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({
        success: true,
        message: 'User deactivated'
      });
    }

  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}

