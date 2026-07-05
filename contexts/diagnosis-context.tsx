'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface DiagnosisContextType {
  selectedAnimalId: string | null;
  selectedSymptoms: string[];
  selectedImage: string | null;
  setSelectedAnimalId: (id: string | null) => void;
  setSelectedSymptoms: (symptoms: string[]) => void;
  setSelectedImage: (image: string | null) => void;
  clearDiagnosis: () => void;
}

const DiagnosisContext = createContext<DiagnosisContextType | undefined>(undefined);

export function DiagnosisProvider({ children }: { children: ReactNode }) {
  const [selectedAnimalId, setSelectedAnimalId] = useState<string | null>(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const clearDiagnosis = () => {
    setSelectedAnimalId(null);
    setSelectedSymptoms([]);
    setSelectedImage(null);
  };

  return (
    <DiagnosisContext.Provider
      value={{
        selectedAnimalId,
        selectedSymptoms,
        selectedImage,
        setSelectedAnimalId,
        setSelectedSymptoms,
        setSelectedImage,
        clearDiagnosis,
      }}
    >
      {children}
    </DiagnosisContext.Provider>
  );
}

export function useDiagnosis() {
  const context = useContext(DiagnosisContext);
  if (context === undefined) {
    throw new Error('useDiagnosis must be used within DiagnosisProvider');
  }
  return context;
}
