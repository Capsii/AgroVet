'use client';

// Force dynamic rendering to avoid static generation issues with context
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Check, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import { getTranslation } from '@/lib/translations';
import { useAuth } from '@/contexts/auth-context';
import { useDiagnosis } from '@/contexts/diagnosis-context';
import type { Animal } from '@/lib/supabase';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function SymptomDiagnosisPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const { user } = useAuth();
  const { selectedAnimalId, setSelectedAnimalId, selectedSymptoms, setSelectedSymptoms } = useDiagnosis();
  const [loading, setLoading] = useState(false);
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [error, setError] = useState('');
  const [loadingAnimals, setLoadingAnimals] = useState(true);


  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchAnimals = async () => {
      try {
        setLoadingAnimals(true);
        const response = await fetch('/api/animals', {
          headers: {
            Authorization: `Bearer ${user.id}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setAnimals(data.animals || []);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch animals');
      } finally {
        setLoadingAnimals(false);
      }
    };

    fetchAnimals();
  }, [user, router]);

  const symptoms = [
    'Limping or lameness',
    'Reduced milk production',
    'Fever or high temperature',
    'Loss of appetite',
    'Nasal discharge',
    'Excessive drooling',
    'Skin lesions or wounds',
    'Swelling on legs or body',
    'Diarrhea',
    'Coughing',
    'Lethargy or weakness',
    'Eye discharge',
  ];

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms(
      selectedSymptoms.includes(symptom)
        ? selectedSymptoms.filter(s => s !== symptom)
        : [...selectedSymptoms, symptom]
    );
  };

  const handleSubmit = async () => {
    if (!selectedAnimalId) {
      setError(getTranslation(language, 'symptoms.selectAnimal') || 'Please select an animal');
      return;
    }

    if (selectedSymptoms.length === 0) {
      setError(getTranslation(language, 'symptoms.select'));
      return;
    }

    setLoading(true);
    try {
      router.push('/diagnosis/result');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process diagnosis');
      setLoading(false);
    }
  };

  return (
    <div>
      <main className="py-8 bg-transparent">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-8">
            <ArrowLeft size={20} />
            {getTranslation(language, 'symptoms.back')}
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
              {getTranslation(language, 'symptoms.title')}
            </h1>
            <p className="text-lg text-muted-foreground">
              {getTranslation(language, 'symptoms.subtitle')}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 flex gap-3">
              <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <Card className="p-8 border border-border bg-card mb-8">
            <div className="mb-8">
              <label className="text-foreground font-semibold mb-3 block">
                {getTranslation(language, 'symptoms.selectAnimal')}
              </label>
              {loadingAnimals ? (
                <p className="text-muted-foreground">{getTranslation(language, 'common.loading')}</p>
              ) : animals.length > 0 ? (
                <Select value={selectedAnimalId || ''} onValueChange={setSelectedAnimalId}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={getTranslation(language, 'symptoms.chooseAnimal')} />
                  </SelectTrigger>
                  <SelectContent>
                    {animals.map(animal => (
                      <SelectItem key={animal.id} value={animal.id}>
                        {animal.name} ({animal.breed || getTranslation(language, 'symptoms.unknownBreed')})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="text-center p-4">
                  <p className="text-muted-foreground text-sm mb-2">{getTranslation(language, 'animals.noAnimals')}</p>
                  <Link href="/animals">
                    <Button variant="outline" size="sm">{getTranslation(language, 'animals.addFirst')}</Button>
                  </Link>
                </div>
              )}
            </div>

            <div className="mb-8">
              <p className="text-foreground font-semibold mb-6">
                {getTranslation(language, 'symptoms.select')}
              </p>

              <div className="space-y-6">
                {/* General Symptoms */}
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">{getTranslation(language, 'symptoms.category.general')}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {['Fever or high temperature', 'Loss of appetite', 'Lethargy or weakness', 'Sudden weight loss', 'Shivering or trembling', 'Dehydration signs', 'Swollen lymph nodes'].map(symptom => (
                      <div key={symptom} className="flex items-center gap-3">
                        <Checkbox
                          id={symptom}
                          checked={selectedSymptoms.includes(symptom)}
                          onCheckedChange={() => toggleSymptom(symptom)}
                        />
                        <Label htmlFor={symptom} className="cursor-pointer">{symptom}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Respiratory */}
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">{getTranslation(language, 'symptoms.category.respiratory')}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {['Coughing', 'Nasal discharge', 'Difficulty breathing', 'Sneezing', 'Abnormal lung sounds'].map(symptom => (
                      <div key={symptom} className="flex items-center gap-3">
                        <Checkbox
                          id={symptom}
                          checked={selectedSymptoms.includes(symptom)}
                          onCheckedChange={() => toggleSymptom(symptom)}
                        />
                        <Label htmlFor={symptom} className="cursor-pointer">{symptom}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Digestive */}
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">{getTranslation(language, 'symptoms.category.digestive')}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {['Diarrhea', 'Bloating', 'Vomiting or regurgitation', 'Excessive drooling', 'Constipation', 'Difficulty swallowing'].map(symptom => (
                      <div key={symptom} className="flex items-center gap-3">
                        <Checkbox
                          id={symptom}
                          checked={selectedSymptoms.includes(symptom)}
                          onCheckedChange={() => toggleSymptom(symptom)}
                        />
                        <Label htmlFor={symptom} className="cursor-pointer">{symptom}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Skin & Limbs */}
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">{getTranslation(language, 'symptoms.category.skin')}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {['Limping or lameness', 'Skin lesions or wounds', 'Hair loss (Alopecia)', 'Swelling on legs or body', 'Hoof abnormalities', 'Itching or rubbing', 'Crusty or scaly skin'].map(symptom => (
                      <div key={symptom} className="flex items-center gap-3">
                        <Checkbox
                          id={symptom}
                          checked={selectedSymptoms.includes(symptom)}
                          onCheckedChange={() => toggleSymptom(symptom)}
                        />
                        <Label htmlFor={symptom} className="cursor-pointer">{symptom}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Other/Production */}
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">{getTranslation(language, 'symptoms.category.reproductive')}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {['Reduced milk production', 'Abortion or stillbirth', 'Udder swelling/Mastitis signs', 'Eye discharge', 'Cloudy or red eyes'].map(symptom => (
                      <div key={symptom} className="flex items-center gap-3">
                        <Checkbox
                          id={symptom}
                          checked={selectedSymptoms.includes(symptom)}
                          onCheckedChange={() => toggleSymptom(symptom)}
                        />
                        <Label htmlFor={symptom} className="cursor-pointer">{symptom}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Free Text Input */}
              <div className="mt-8 pt-6 border-t border-border">
                <Label htmlFor="other-symptoms" className="text-base font-semibold mb-2 block">
                  {getTranslation(language, 'symptoms.other')}
                </Label>
                <p className="text-sm text-muted-foreground mb-3">
                  {getTranslation(language, 'symptoms.describeOther')}
                </p>
                <textarea
                  id="other-symptoms"
                  className="w-full px-3 py-2 border border-border rounded-md bg-transparent min-h-[80px]"
                  placeholder={getTranslation(language, 'symptoms.placeholderOther')}
                  data-other-symptoms="true"
                />
              </div>
            </div>

            <div className="mb-8 p-4 rounded-lg bg-primary/10 border border-border">
              <p className="text-sm font-medium text-foreground">
                {selectedSymptoms.length} {getTranslation(language, 'symptoms.selected')}
              </p>
            </div>

            <div className="flex gap-4 flex-col sm:flex-row">
              <Button
                onClick={() => {
                  const textArea = document.querySelector('textarea[data-other-symptoms="true"]') as HTMLTextAreaElement;
                  const otherText = textArea?.value?.trim();

                  if (otherText) {
                    const cleanSymptoms = selectedSymptoms.filter(s => !s.startsWith('Note: '));
                    setSelectedSymptoms([...cleanSymptoms, `Note: ${otherText}`]);
                    setTimeout(handleSubmit, 50);
                  } else {
                    handleSubmit();
                  }
                }}
                className="flex-1 sm:flex-none h-10"
                disabled={loading || (selectedSymptoms.length === 0 && !document.querySelector('textarea')?.value) || !selectedAnimalId}
              >
                {loading ? getTranslation(language, 'symptoms.analyzing') : getTranslation(language, 'symptoms.analyze')}
              </Button>
              <Link href="/dashboard" className="flex-1 sm:flex-none">
                <Button
                  variant="outline"
                  className="w-full h-10 bg-transparent"
                >
                  {getTranslation(language, 'symptoms.cancel')}
                </Button>
              </Link>
            </div>
          </Card>

          <Card className="mt-8 p-6 border border-border bg-card">
            <h3 className="font-semibold text-foreground mb-4">{getTranslation(language, 'symptoms.tips')}</h3>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex gap-3">
                <Check size={20} className="text-primary flex-shrink-0 mt-0.5" />
                <span>{getTranslation(language, 'symptoms.tip1')}</span>
              </li>
              <li className="flex gap-3">
                <Check size={20} className="text-primary flex-shrink-0 mt-0.5" />
                <span>{getTranslation(language, 'symptoms.tip2')}</span>
              </li>
              <li className="flex gap-3">
                <Check size={20} className="text-primary flex-shrink-0 mt-0.5" />
                <span>{getTranslation(language, 'symptoms.tip3')}</span>
              </li>
            </ul>
          </Card>
        </div>
      </main>
    </div>
  );
}
