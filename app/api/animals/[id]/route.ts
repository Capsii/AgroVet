import { connectDB } from '@/lib/mongodb';
import { Animal } from '@/lib/models/animal';
import { NextRequest, NextResponse } from 'next/server';

function getAuthHeader(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader) {
    return null;
  }
  const token = authHeader.replace('Bearer ', '');
  return token;
}

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    const userId = getAuthHeader(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const animal = await Animal.findOne({
      _id: params.id,
      user_id: userId
    });

    if (!animal) {
      return NextResponse.json({ error: 'Animal not found' }, { status: 404 });
    }

    return NextResponse.json({
      animal: {
        id: animal._id,
        name: animal.name,
        breed: animal.breed,
        // ... include other fields if needed, but breed is what we need
      }
    });
  } catch (error) {
    console.error('Get animal error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
