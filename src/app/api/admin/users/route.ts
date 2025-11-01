import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db/mongo';
import { ObjectId } from 'mongodb';
import { createUser, findUserByEmail } from '@/lib/db/users';

// TODO: Implement checkUserRole(req, allowedRoles) middleware for security
// Only Admin users can access this page or modify permissions
// Manager users can only create Employee and Viewer accounts
// Employee and Viewer have no access to this module

interface AdminUserDoc {
  _id?: ObjectId;
  name: string;
  email: string;
  password?: string; // TODO: Auto-generate temporary password and handle onboarding email
  role: "Admin" | "Manager" | "Employee" | "Viewer";
  branch: string; // Reference to branches collection name field
  status: "Active" | "Suspended" | "Inactive";
  permissions?: PermissionSet[];
  createdAt: Date;
  updatedAt: Date;
  firebaseUid?: string; // DEPRECATED: Legacy Firebase UID (no longer used with MongoDB auth)
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

// GET /api/admin/users - Get all users with search support
export async function GET(request: NextRequest) {
  try {
    const db = await getDb();
    const users = db.collection<AdminUserDoc>('adminUsers');

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';

    // Build query
    const query: any = {};
    if (search.trim()) {
      query.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { email: { $regex: search.trim(), $options: 'i' } }
      ];
    }

    // Fetch users from database
    const allUsers = await users.find(query).toArray();

    // Transform to API response format
    const data = allUsers.map(user => ({
      id: user._id?.toString() || '',
      name: user.name,
      email: user.email,
      role: user.role,
      branch: user.branch,
      status: user.status,
      joined: user.createdAt?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
      permissions: user.permissions || []
    }));

    return NextResponse.json({ users: data, total: data.length });

  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// POST /api/admin/users - Create a new user
export async function POST(request: NextRequest) {
  try {
    const db = await getDb();
    const users = db.collection<AdminUserDoc>('adminUsers');

    const body = await request.json();
    const { name, email, password, role, branch, status } = body;

    // Validate required fields
    if (!name || !email || !password || !role || !branch || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user already exists (both in adminUsers and main users collection)
    const existingAdminUser = await users.findOne({ email });
    if (existingAdminUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Check in main users collection
    const existingUserInMain = await findUserByEmail(email);
    if (existingUserInMain) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }
    
    // Validate password length
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Create default permissions (all false)
    const defaultPermissions: PermissionSet[] = [
      { module: "dashboard", view: false },
      { module: "bookings", view: false, create: false, edit: false, delete: false, export: false },
      { module: "units", view: false, create: false, edit: false, delete: false, export: false },
      { module: "clients", view: false, create: false, edit: false, delete: false, export: false },
      { module: "financials_income", view: false, export: false },
      { module: "financials_expenses", view: false, export: false },
      { module: "calendar", view: false, create: false, edit: false, delete: false },
      { module: "messages", view: false, create: false, delete: false },
      { module: "settings", view: false, edit: false },
      { module: "permissions", view: false }
    ];

    // Split name into firstName and lastName
    const nameParts = name.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    // Create user in main users collection (with hashed password)
    // This is necessary for authentication in the main app
    await createUser({
      email,
      plainPassword: password,
      role: role.toLowerCase() as 'customer' | 'employee' | 'manager' | 'admin',
      firstName,
      lastName,
    });

    const now = new Date();
    const newUser: AdminUserDoc = {
      name,
      email,
      password, // TODO: This is stored plain for admin reference - remove if not needed
      role,
      branch,
      status,
      permissions: defaultPermissions,
      createdAt: now,
      updatedAt: now,
      firebaseUid: undefined, // Not needed with MongoDB auth
    };

    const result = await users.insertOne(newUser);

    return NextResponse.json({
      success: true,
      user: {
        id: result.insertedId.toString(),
        name,
        email,
        role,
        branch,
        status,
        joined: now.toISOString().split('T')[0]
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}

