/**
 * Create Employee API Route
 * POST /api/admin/create-employee
 * 
 * Creates a MongoDB user record with hashed password.
 * 
 * Required fields:
 * - fullName: string (split into firstName, lastName)
 * - email: string
 * - role: 'employee' | 'manager' | 'admin'
 * - permissions: string[]
 * - status: 'active' | 'suspended'
 * 
 * Returns:
 * - success: boolean
 * - userId: string (MongoDB ObjectId)
 * - tempPassword: string (to show in UI once, then user should change it)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createUser, findUserByEmail } from '@/lib/db/users';

/**
 * Generate a secure temporary password
 */
function generateTemporaryPassword(): string {
  // Generate a random 16-character password with mixed case, numbers, and symbols
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  
  // Ensure at least one of each type
  password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)]; // uppercase
  password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)]; // lowercase
  password += '0123456789'[Math.floor(Math.random() * 10)]; // number
  password += '!@#$%^&*'[Math.floor(Math.random() * 8)]; // symbol
  
  // Fill the rest randomly
  for (let i = password.length; i < 16; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  // Shuffle
  return password.split('').sort(() => Math.random() - 0.5).join('');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullName, email, role, permissions = [], status = 'active' } = body;
    
    // Validate input
    if (!fullName || !email || !role) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: fullName, email, role' },
        { status: 400 }
      );
    }
    
    // Validate role
    const validRoles = ['employee', 'manager', 'admin'];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { success: false, error: `Invalid role. Must be one of: ${validRoles.join(', ')}` },
        { status: 400 }
      );
    }
    
    // Validate email format
    if (!email.includes('@') || !email.includes('.')) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }
    
    // Check if user already exists in MongoDB
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'User with this email already exists' },
        { status: 409 }
      );
    }
    
    // Split fullName into firstName and lastName
    const nameParts = fullName.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    
    // Generate temporary password
    const tempPassword = generateTemporaryPassword();
    
    // Create MongoDB user record with hashed password
    const newUser = await createUser({
      email,
      plainPassword: tempPassword,
      role: role as 'employee' | 'manager' | 'admin',
      firstName,
      lastName,
      // status is set to 'active' by default in createUser
    });
    
    console.log(`✅ Created employee: ${fullName} (${email}) with role: ${role}`);
    
    return NextResponse.json({
      success: true,
      userId: newUser._id?.toString(),
      tempPassword,
      message: `Employee ${fullName} created successfully`,
    });
    
  } catch (error: any) {
    console.error('Error in create-employee:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
