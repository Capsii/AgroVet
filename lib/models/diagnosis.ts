import mongoose, { Schema, Document } from 'mongoose';

export interface IDiagnosis extends Omit<Document, '_id'> {
  _id: string;
  user_id: string;
  animal_id: string;
  diagnosis_type: 'symptoms' | 'image';
  symptoms: string[];
  image_url?: string;
  disease_name?: string;
  confidence_score?: number;
  severity?: 'Low' | 'Medium' | 'High';
  causes?: string[];
  treatment_recommendations?: string[];
  prevention_tips?: string[];
  status: 'pending' | 'diagnosed' | 'treated' | 'resolved';
  created_at: Date;
  updated_at: Date;
}

const DiagnosisSchema = new Schema<IDiagnosis>(
  {
    _id: { type: String, required: true },
    user_id: { type: String, required: true, index: true },
    animal_id: { type: String, required: true, index: true },
    diagnosis_type: {
      type: String,
      enum: ['symptoms', 'image'],
      required: true,
    },
    symptoms: { type: [String], default: [] },
    image_url: { type: String, default: null },
    disease_name: { type: String, default: null },
    confidence_score: { type: Number, default: null },
    severity: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Moderate'],
      default: null,
    },
    causes: { type: [String], default: [] },
    treatment_recommendations: { type: [String], default: [] },
    prevention_tips: { type: [String], default: [] },
    status: {
      type: String,
      enum: ['pending', 'diagnosed', 'treated', 'resolved'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
    collection: 'diagnoses',
  }
);

DiagnosisSchema.index({ user_id: 1 });
DiagnosisSchema.index({ animal_id: 1 });

// Force delete the model if it exists to ensure schema updates are applied in development
if (mongoose.models.Diagnosis) {
  delete mongoose.models.Diagnosis;
}

export const Diagnosis =
  mongoose.models.Diagnosis || mongoose.model<IDiagnosis>('Diagnosis', DiagnosisSchema);
