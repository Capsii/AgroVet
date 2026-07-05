import mongoose, { Schema } from 'mongoose';


export interface IProfile {
  _id: string;
  email: string;
  password_hash: string;

  full_name?: string;
  phone?: string;
  location?: string;
  farm_name?: string;

  symptomDiagnosisUsed?: boolean;
  imageDiagnosisUsed?: boolean;

  created_at: Date;
  updated_at: Date;
}

const ProfileSchema = new Schema<IProfile>(
  {
    _id: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password_hash: { type: String, required: true },
    full_name: { type: String, default: null },
    phone: { type: String, default: null },
    location: { type: String, default: null },
    farm_name: { type: String, default: null },

    symptomDiagnosisUsed: {
      type: Boolean,
      default: false,
    },

    imageDiagnosisUsed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    collection: 'profiles',
  }
);

export const Profile =
  mongoose.models.Profile ||
  mongoose.model<IProfile>('Profile', ProfileSchema);