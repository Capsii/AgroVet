'use client';

import React from "react"
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Upload, X, Loader, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { useDiagnosis } from '@/contexts/diagnosis-context';
import { useLanguage } from '@/contexts/language-context';
import { getTranslation } from '@/lib/translations';
import type { Animal } from '@/lib/supabase';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function ImageDiagnosisPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { language } = useLanguage();
  const { selectedAnimalId, setSelectedAnimalId, selectedImage, setSelectedImage } = useDiagnosis();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [error, setError] = useState('');
  const [loadingAnimals, setLoadingAnimals] = useState(true);
  const [selectedLocalImage, setSelectedLocalImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

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

  const handleDragActive = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragInactive = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedImage(event.target?.result as string);
      setError('');
    };
    reader.readAsDataURL(file);
    setSelectedLocalImage(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedAnimalId) {
      setError(getTranslation(language, 'symptoms.selectAnimal') || 'Please select an animal');
      return;
    }

    if (!selectedLocalImage) return;

    // Find selected animal to determine type
    const animal = animals.find(a => a.id === selectedAnimalId);
    const breed = animal?.breed || '';

    // Determine model type
    let modelType = 'other';
    const breedLower = breed.toLowerCase();

    if (breedLower.includes('pig') || breedLower.includes('yorkshire') || breedLower.includes('landrace') || breedLower.includes('duroc') || breedLower.includes('hampshire')) {
      modelType = 'pig';
    } else if (breedLower.includes('sheep') || (breedLower.includes('marwari') && !breedLower.includes('horse')) || breedLower.includes('merino') || breedLower.includes('rambouillet') || breedLower.includes('patanwadi')) {
      modelType = 'sheep';
    } else if (breedLower.includes('cow') || breedLower.includes('cattle') || breedLower.includes('holstein') || breedLower.includes('jersey') || breedLower.includes('gir') || breedLower.includes('sahiwal') || breedLower.includes('kankrej')) {
      modelType = 'cow';
    } else if (breedLower.includes('buffalo') || breedLower.includes('murrah') || breedLower.includes('surti') || breedLower.includes('jaffarabadi') || breedLower.includes('mehsana')) {
      modelType = 'buffalo';
    } else if (breedLower.includes('goat') || breedLower.includes('jamnapari') || breedLower.includes('beetal') || breedLower.includes('sirohi') || breedLower.includes('barbari') || breedLower.includes('boer')) {
      modelType = 'goat';
    } else if (breedLower.includes('horse') || breedLower.includes('kathiawari') || breedLower.includes('thoroughbred')) {
      modelType = 'horse';
    } else if (breedLower.includes('hen') || breedLower.includes('chicken') || breedLower.includes('poultry') || breedLower.includes('kadaknath') || breedLower.includes('broiler') || breedLower.includes('layer') || breedLower.includes('rhode island')) {
      modelType = 'hen';
    } else if (breedLower.includes('dog') || breedLower.includes('hound') || breedLower.includes('retriever') || breedLower.includes('shepherd') || breedLower.includes('rajapalayam') || breedLower.includes('chippiparai')) {
      modelType = 'dog';
    } else if (breedLower.includes('donkey') || breedLower.includes('jackstock')) {
      modelType = 'donkey';
    } else if (breedLower.includes('yak')) {
      modelType = 'yak';
    } else if (breedLower.includes('camel')) {
      modelType = 'camel';
    } else if (breedLower.includes('pony')) {
      modelType = 'pony';
    } else if (breedLower.includes('cat') || breedLower.includes('billi') || breedLower.includes('coon')) {
      modelType = 'cat';
    } else if (breedLower.includes('bison') || breedLower.includes('bull')) {
      modelType = 'bull-bison';
    }

    console.log('Detected model type:', modelType, 'for breed:', breed);

    if (modelType === 'other') {
      setError(`Diagnosis not supported for this breed: ${breed}`);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // Create an image element for TF.js to read
      const img = document.createElement('img');
      img.src = URL.createObjectURL(selectedLocalImage);
      await new Promise(resolve => img.onload = resolve);

      // Import ML dynamically
      const { analyzeImage } = await import('@/lib/ml');
      const result = await analyzeImage(img, modelType as Parameters<typeof analyzeImage>[1]);

      // Store result in diagnosis context logic would go here if we were passing it, 
      // but we are relying on result page to re-run (or avoiding it by just passing image).
      // Ideally we should pass the ML result to the next page to avoid re-running.
      // But for now, we just proceed.

      router.push('/diagnosis/result');
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Failed to process diagnosis');
      setLoading(false);
    }
  };

  return (
    <div>
      <main className="flex-1 py-8 bg-transparent">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-8">
            <ArrowLeft size={20} />
            {getTranslation(language, 'image.back')}
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
              {getTranslation(language, 'image.title')}
            </h1>
            <p className="text-lg text-muted-foreground">
              {getTranslation(language, 'image.subtitle')}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 flex gap-3">
              <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {!selectedImage ? (
            <div className="space-y-6">
              <Card className="p-6 border border-border bg-card">
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
              </Card>
              <Card
                className={`p-12 border-2 border-dashed transition-colors cursor-pointer ${dragActive
                  ? 'border-primary bg-primary/5'
                  : 'border-border bg-card'
                  }`}
                onDragEnter={handleDragActive}
                onDragLeave={handleDragInactive}
                onDragOver={handleDragActive}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileInput}
                  className="hidden"
                />

                <div className="flex flex-col items-center justify-center">
                  <div className="p-4 rounded-lg bg-primary/10 text-primary mb-4">
                    <Upload size={32} />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {getTranslation(language, 'image.dropFile')}
                  </h3>
                  <p className="text-muted-foreground text-center mb-4">
                    {getTranslation(language, 'image.formats')}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {getTranslation(language, 'image.uploadDesc')}
                  </p>
                </div>
              </Card>
            </div>
          ) : (
            <Card className="p-8 border border-border bg-card">
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex-1">
                  <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                    <Image
                      src={selectedImage && selectedImage.length > 0 ? selectedImage : "/placeholder.svg"}
                      alt="Selected image"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-4">
                      {getTranslation(language, 'image.selected')}
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Your image has been selected and is ready for analysis. Click the button below to get AI-powered diagnosis.
                    </p>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <span className="text-foreground">{getTranslation(language, 'image.req2')}</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <span className="text-foreground">{getTranslation(language, 'image.req3')}</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <span className="text-foreground">{getTranslation(language, 'image.req4')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 flex-col sm:flex-row">
                    <Button
                      onClick={handleAnalyze}
                      className="flex-1 h-10"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader size={18} className="animate-spin mr-2" />
                          {getTranslation(language, 'symptoms.analyzing')}
                        </>
                      ) : (
                        getTranslation(language, 'image.analyze')
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 h-10 bg-transparent"
                      onClick={() => setSelectedImage(null)}
                      disabled={loading}
                    >
                      <X size={18} className="mr-2" />
                      {getTranslation(language, 'image.remove')}
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Info Section */}
          <Card className="mt-8 p-6 border border-border bg-card">
            <h3 className="font-semibold text-foreground mb-4">{getTranslation(language, 'image.requirements')}</h3>
            <ul className="space-y-2 text-muted-foreground text-sm">
              <li>{getTranslation(language, 'image.req1')}</li>
              <li>{getTranslation(language, 'image.req2')}</li>
              <li>{getTranslation(language, 'image.req3')}</li>
              <li>{getTranslation(language, 'image.req4')}</li>
              <li>{getTranslation(language, 'image.req5')}</li>
            </ul>
          </Card>
        </div>
      </main>
    </div>
  );
}
