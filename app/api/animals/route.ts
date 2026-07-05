import { connectDB } from '@/lib/mongodb';
import { Animal } from '@/lib/models/animal';
import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import { Profile } from '@/lib/models/profile';

function getAuthHeader(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader) {
    return null;
  }
  const token = authHeader.replace('Bearer ', '');
  return token;
}

export async function GET(req: NextRequest) {
  try {
    const userId = getAuthHeader(req);
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const animals = await Animal.find({ user_id: userId }).sort({ created_at: -1 });

    return NextResponse.json({
      animals: animals.map(animal => ({
        id: animal._id,
        user_id: animal.user_id,
        name: animal.name,
        breed: animal.breed,
        age_months: animal.age_months,
        gender: animal.gender,
        weight: animal.weight,
        color: animal.color,
        notes: animal.notes,
        created_at: animal.created_at ? animal.created_at.toISOString() : new Date().toISOString(),
        updated_at: animal.updated_at ? animal.updated_at.toISOString() : new Date().toISOString(),
      }))
    });
  } catch (error) {
    console.error('[v0] Get animals error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = getAuthHeader(req);
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const body = await req.json();
    await connectDB();

    const user = await Profile.findById(userId);
    console.log("User ID:", userId);
    console.log("Mongo user:", user);
    console.log("symptomDiagnosisUsed:", user?.symptomDiagnosisUsed);

    if (!user) {
        return NextResponse.json(
            { error: "User not found." },
            { status: 404 }
        );
}
    // Use mongoose ObjectId for robust ID generation
    const animalId = new mongoose.Types.ObjectId().toString();

    const animal = await Animal.create({
      _id: animalId,
      user_id: userId,
      ...body,
    });

    return NextResponse.json({
      animal: {
        id: animal._id,
        user_id: animal.user_id,
        name: animal.name,
        breed: animal.breed,
        age_months: animal.age_months,
        gender: animal.gender,
        weight: animal.weight,
        color: animal.color,
        notes: animal.notes,
        created_at: animal.created_at ? animal.created_at.toISOString() : new Date().toISOString(),
        updated_at: animal.updated_at ? animal.updated_at.toISOString() : new Date().toISOString(),
      }
    });
  } catch (error) {
    console.error('[v0] Add animal error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
