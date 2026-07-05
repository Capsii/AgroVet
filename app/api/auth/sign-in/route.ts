import { connectDB } from '@/lib/mongodb';
import { Profile } from '@/lib/models/profile';
import { verifyPassword } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Find user by email
    const user = await Profile.findOne({ email: email.toLowerCase() });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password_hash);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      user: {
        id: user._id,
        email: user.email,
        full_name: user.full_name,
        phone: user.phone,
        location: user.location,
        farm_name: user.farm_name,
      },
      profile: {
        id: user._id,
        email: user.email,
        full_name: user.full_name,
        phone: user.phone,
        location: user.location,
        farm_name: user.farm_name,
        created_at: user.created_at ? user.created_at.toISOString() : new Date().toISOString(),
        updated_at: user.updated_at ? user.updated_at.toISOString() : new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('[v0] Sign in error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
