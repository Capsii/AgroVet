import { connectDB } from '@/lib/mongodb';
import { Diagnosis } from '@/lib/models/diagnosis';
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

        if (!params.id) {
            return NextResponse.json({ error: 'Diagnosis ID required' }, { status: 400 });
        }

        await connectDB();

        const diagnosis = await Diagnosis.findOne({
            _id: params.id,
            user_id: userId
        });

        if (!diagnosis) {
            return NextResponse.json({ error: 'Diagnosis not found' }, { status: 404 });
        }

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
                causes: diagnosis.causes,
                treatment_recommendations: diagnosis.treatment_recommendations,
                prevention_tips: diagnosis.prevention_tips,
                status: diagnosis.status,
                created_at: diagnosis.created_at ? diagnosis.created_at.toISOString() : new Date().toISOString(),
                updated_at: diagnosis.updated_at ? diagnosis.updated_at.toISOString() : new Date().toISOString(),
            }
        });
    } catch (error) {
        console.error('[v0] Get diagnosis error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal server error' },
            { status: 500 }
        );
    }
}
