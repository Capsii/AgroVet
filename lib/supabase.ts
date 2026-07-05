// MongoDB types for client-side usage

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  location: string | null;
  farm_name: string | null;
  created_at: string;
  updated_at: string;
};

export type Animal = {
  id: string;
  user_id: string;
  name: string;
  breed: string | null;
  age_months: number | null;
  gender: string | null;
  weight: number | null;
  color: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type Diagnosis = {
  id: string;
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
  created_at: string;
  updated_at: string;
};
