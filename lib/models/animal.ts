import mongoose, { Schema, Document } from 'mongoose';

export interface IAnimal {
  _id: string;
  user_id: string;
  name: string;
  breed?: string;
  age_months?: number;
  gender?: string;
  weight?: number;
  color?: string;
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

const AnimalSchema = new Schema<IAnimal>(
  {
    _id: { type: String, required: true },
    user_id: { type: String, required: true, index: true },
    name: { type: String, required: true },
    breed: { type: String, default: null },
    age_months: { type: Number, default: null },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Unknown'],
      default: null,
    },
    weight: { type: Number, default: null },
    color: { type: String, default: null },
    notes: { type: String, default: null },
  },
  {
    timestamps: true,
    collection: 'animals',
  }
);

AnimalSchema.index({ user_id: 1 });

export const Animal = mongoose.models.Animal || mongoose.model<IAnimal>('Animal', AnimalSchema);
