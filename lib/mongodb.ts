import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || '';

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!MONGODB_URI) {
    throw new Error(
      'MONGODB_URI is not set. Please add MONGODB_URI to your environment variables in the Vercel Vars section.'
    );
  }

  if (!cached.promise) {
    try {
      cached.promise = mongoose
        .connect(MONGODB_URI, {
          bufferCommands: false,
          serverSelectionTimeoutMS: 5000,
          socketTimeoutMS: 45000,
        })
        .then((mongoose) => {
          return mongoose;
        })
        .catch((error) => {
          throw error;
        });
    } catch (error) {
      cached.promise = null;
      throw error;
    }
  }
  
  cached.conn = await cached.promise;
  return cached.conn;
}

// TypeScript types for MongoDB documents
export type ProfileDocument = {
  _id: string;
  email: string;
  password_hash: string;
  full_name: string | null;
  phone: string | null;
  location: string | null;
  farm_name: string | null;
  created_at: Date;
  updated_at: Date;
};

export type AnimalDocument = {
  _id: string;
  user_id: string;
  name: string;
  breed: string | null;
  age_months: number | null;
  gender: string | null;
  weight: number | null;
  color: string | null;
  notes: string | null;
  created_at: Date;
  updated_at: Date;
};

export type DiagnosisDocument = {
  _id: string;
  user_id: string;
  animal_id: string;
  diagnosis_type: 'symptoms' | 'image';
  symptoms: string[];
  image_url: string | null;
  disease_name: string | null;
  confidence_score: number | null;
  severity: 'Low' | 'Medium' | 'High' | null;
  treatment_recommendations: string | null;
  prevention_tips: string | null;
  status: 'pending' | 'diagnosed' | 'treated' | 'resolved';
  created_at: Date;
  updated_at: Date;
};
