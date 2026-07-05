import { connectDB } from '@/lib/mongodb';
import { Profile } from '@/lib/models/profile';
import { hashPassword, generateUserId } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { email, password, full_name } = await req.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if user already exists
    const existingUser = await Profile.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const password_hash = await hashPassword(password);

    // Create user profile
    const userId = generateUserId();
    const newUser = await Profile.create({
      _id: userId,
      email: email.toLowerCase(),
      password_hash,
      full_name: full_name || null,
    });

    return NextResponse.json({
      user: {
        id: newUser._id,
        email: newUser.email,
        full_name: newUser.full_name,
      },
      message: 'User created successfully',
    });
  } catch (error) {
    console.error('[v0] Sign up error:', error);
    
    // Check for MongoDB connection issues
    if (error instanceof Error) {
      if (error.message.includes('MONGODB_URI')) {
        return NextResponse.json(
          { error: 'Database not configured. Please add MONGODB_URI to environment variables.' },
          { status: 503 }
        );
      }
      if (error.message.includes('authentication failed') || error.message.includes('connect')) {
        return NextResponse.json(
          { error: 'Database connection failed. Please check your MONGODB_URI.' },
          { status: 503 }
        );
      }
    }
    
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
