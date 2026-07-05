import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { connectDB } from "@/lib/mongodb";
import { Profile } from "@/lib/models/profile";

// Initialize Gemini
// Note: This relies on GEMINI_API_KEY being present in .env.local
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

function getAuthHeader(req: NextRequest) {
  const authHeader = req.headers.get('authorization');

  if (!authHeader) {
    return null;
  }

  return authHeader.replace('Bearer ', '');
}

export async function POST(req: NextRequest) {
    try {
        // Check for API Key
        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json(
                { error: 'Gemini API Key is missing on the server.' },
                { status: 500 }
            );
        }

        const userId = getAuthHeader(req);

        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await req.json();

        const {
            symptoms,
            image,
            animal_details,
            local_prediction
        } = body;

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

        const animalType = animal_details?.breed || animal_details?.type || 'animal';
        const age = animal_details?.age || 'unknown age';

        // Configure Model
        const model = genAI.getGenerativeModel({
            model: 'gemini-2.5-flash'
        });

        let result;

        if (image) {
            // Check demo usage
            if (user.imageDiagnosisUsed) {
                return NextResponse.json(
                    { error: "Image diagnosis demo already used." },
                    { status: 403 }
                );
            }

            // Image is expected as:
            // data:image/jpeg;base64,...
            const base64Data = image.split(',')[1];
            const mimeType = image.split(',')[0].split(':')[1].split(';')[0];

            let prompt = `
Act as an expert veterinarian.

Analyze this image of a ${animalType} (Age: ${age}).

Identify any visible skin conditions, wounds, infections, parasites, or other health issues.
`;

            if (local_prediction) {
                prompt += `

A local AI model predicted:
Disease: ${local_prediction.disease}
Confidence: ${Math.round(local_prediction.confidence * 100)}%

Please verify whether this prediction appears correct.
`;
            }

            prompt += `

Return ONLY valid JSON.

{
  "disease": "Disease name",
  "confidence": 90,
  "severity": "High",
  "causes": [
    "Cause 1",
    "Cause 2"
  ],
  "treatment": [
    "Treatment 1",
    "Treatment 2"
  ],
  "prevention": [
    "Tip 1",
    "Tip 2"
  ]
}
`;

            const imagePart = {
                inlineData: {
                    data: base64Data,
                    mimeType
                }
            };

            result = await model.generateContent([
                prompt,
                imagePart
            ]);
        } else {
            // Symptom diagnosis flow
            if (user.symptomDiagnosisUsed) {
                return NextResponse.json(
                    { error: "Symptom diagnosis demo already used." },
                    { status: 403 }
                );
            }

            if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
                return NextResponse.json(
                    { error: 'No symptoms provided.' },
                    { status: 400 }
                );
            }

            const prompt = `
Act as an expert veterinarian.

I have a ${animalType} (Age: ${age}) showing these symptoms:

${symptoms.join(', ')}

Return ONLY valid JSON.

{
  "disease": "Disease name",
  "confidence": 85,
  "severity": "High",
  "causes": [
    "Cause 1",
    "Cause 2"
  ],
  "treatment": [
    "Treatment 1",
    "Treatment 2"
  ],
  "prevention": [
    "Tip 1",
    "Tip 2"
  ]
}
`;

            result = await model.generateContent(prompt);
        }

        const response = await result.response;
        console.log("Gemini responded");
        const text = response.text();

        // Remove markdown fences if Gemini adds them
        const cleanText = text
    
            .replace(/```json/g, '')
            .replace(/```/g, '')
            .trim();
        

        console.log(cleanText);

        try {
            const diagnosisData = JSON.parse(cleanText);

            if (image) {
                user.imageDiagnosisUsed = true;
            } else {
                user.symptomDiagnosisUsed = true;
            }

            await user.save();
            const verify = await Profile.findById(userId);

            console.log("After save:");
            console.log(verify);
            console.log("Saved successfully!");
            console.log("symptomDiagnosisUsed:", user.symptomDiagnosisUsed);
            console.log("imageDiagnosisUsed:", user.imageDiagnosisUsed);

            return NextResponse.json(diagnosisData);
        } catch (e) {
            console.error('Failed to parse Gemini response:', text);

            return NextResponse.json(
                { error: 'Failed to interpret AI diagnosis result.' },
                { status: 500 }
            );
        }

    } catch (error: any) {
        console.error('Gemini Diagnosis Error:', error);

        let errorMessage = 'Failed to process diagnosis.';

        if (error.message) {
            if (error.message.includes('User location is not supported')) {
                errorMessage =
                    'Google Gemini API is not available in your location. Using local fallback.';
            } else {
                errorMessage = error.message;
            }
        }

        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}