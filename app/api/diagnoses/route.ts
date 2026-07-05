import { connectDB } from '@/lib/mongodb';
import { Diagnosis } from '@/lib/models/diagnosis';
import { generateUserId } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { Profile } from '@/lib/models/profile';

export const dynamic = 'force-dynamic';

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
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const diagnoses = await Diagnosis.find({ user_id: userId }).sort({ created_at: -1 });

    return NextResponse.json({
      diagnoses: diagnoses.map(d => ({
        id: d._id,
        user_id: d.user_id,
        animal_id: d.animal_id,
        diagnosis_type: d.diagnosis_type,
        symptoms: d.symptoms,
        image_url: d.image_url,
        disease_name: d.disease_name,
        confidence_score: d.confidence_score,
        severity: d.severity,
        causes: d.causes,
        treatment_recommendations: d.treatment_recommendations,
        prevention_tips: d.prevention_tips,
        status: d.status,
        created_at: d.created_at ? d.created_at.toISOString() : new Date().toISOString(),
        updated_at: d.updated_at ? d.updated_at.toISOString() : new Date().toISOString(),
      }))
    });
  } catch (error) {
    console.error('[v0] Get diagnoses error:', error);
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
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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


    const diagnosisId = generateUserId();

    const diagnosis = await Diagnosis.create({
      _id: diagnosisId,
      user_id: userId,
      ...body,
      status: body.status || 'diagnosed',
    });

    return NextResponse.json({
      diagnosis: {
        id: diagnosis._id,
        user_id: diagnosis.user_id,
        animal_id: diagnosis.animal_id,
        diagnosis_type: diagnosis.diagnosis_type,
        symptoms: diagnosis.symptoms,
        image_url: diagnosis.image_url,
        disease_name: diagnosis.disease_name,
        confidence_score: diagnosis.confidence_score,
        severity: diagnosis.severity,
        treatment_recommendations: diagnosis.treatment_recommendations,
        prevention_tips: diagnosis.prevention_tips,
        status: diagnosis.status,
        created_at: diagnosis.created_at ? diagnosis.created_at.toISOString() : new Date().toISOString(),
        updated_at: diagnosis.updated_at ? diagnosis.updated_at.toISOString() : new Date().toISOString(),
      }
    });
  } catch (error) {
    console.error('[v0] Add diagnosis error:', error);
    try {
      const fs = require('fs');
      const path = require('path');
      const logMsg = `[${new Date().toISOString()}] Error in POST /api/diagnoses: ${error instanceof Error ? error.message : String(error)}\nStack: ${error instanceof Error ? error.stack : 'N/A'}\n`;
      fs.appendFileSync(path.join(process.cwd(), 'debug_error.log'), logMsg);
    } catch (e) {
      console.error('Failed to write to debug log', e);
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
