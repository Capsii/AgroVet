'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  ArrowLeft,
  Plus,
  Trash2,
  AlertCircle,
  Loader,
} from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { useLanguage } from '@/contexts/language-context';
import { getTranslation } from '@/lib/translations';
import type { Animal } from '@/lib/supabase';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export default function AnimalsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { language } = useLanguage();
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAddingAnimal, setIsAddingAnimal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    breed: '',
    age_months: '',
    gender: 'Male',
    weight: '',
    color: '',
    notes: '',
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchAnimals();
    }
  }, [user]);

  const fetchAnimals = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/animals', {
        headers: {
          Authorization: `Bearer ${user?.id}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAnimals(data.animals || []);
      } else {
        const errorText = await response.text();
        console.error('[v0] Failed to fetch animals:', response.status, errorText);
        setError(`${getTranslation(language, 'animals.error.fetchFailed')}: ${response.status} ${response.statusText}`);
      }
    } catch (err) {
      console.error('[v0] Fetch animals error:', err);
      setError(err instanceof Error ? err.message : getTranslation(language, 'animals.error.fetchFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddAnimal = async () => {
    try {
      setError('');
      if (!formData.name) {
        setError(getTranslation(language, 'animals.error.nameRequired'));
        return;
      }

      const response = await fetch('/api/animals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.id}`,
        },
        body: JSON.stringify({
          ...formData,
          age_months: formData.age_months ? parseInt(formData.age_months) : null,
          weight: formData.weight ? parseFloat(formData.weight) : null,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setAnimals([...animals, data.animal]);
        setFormData({
          name: '',
          breed: '',
          age_months: '',
          gender: 'Male',
          weight: '',
          color: '',
          notes: '',
        });
        setIsAddingAnimal(false);
      } else {
        let errorMessage = `${getTranslation(language, 'animals.error.addFailed')}: ${response.status} ${response.statusText}`;
        try {
          const errorData = await response.json();
          if (errorData.error) {
            errorMessage = errorData.error;
          }
        } catch (e) {
          console.error('Failed to parse error response', e);
        }
        console.error('[v0] Failed to add animal:', response.status, errorMessage);
        setError(errorMessage);
      }
    } catch (err) {
      console.error('[v0] Add animal error:', err);
      setError(err instanceof Error ? err.message : getTranslation(language, 'animals.error.addFailed'));
    }
  };

  const handleDeleteAnimal = async (id: string) => {
    if (!confirm(getTranslation(language, 'common.confirmDelete'))) return;

    try {
      const response = await fetch(`/api/animals/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user?.id}`,
        },
      });

      if (response.ok) {
        setAnimals(animals.filter(a => a.id !== id));
      } else {
        setError(getTranslation(language, 'animals.error.deleteFailed'));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : getTranslation(language, 'animals.error.deleteFailed'));
    }
  };

  if (authLoading || loading) {
    return (
      <main className="py-8 bg-transparent">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <Loader className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">{getTranslation(language, 'common.loading')}</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="py-8 bg-transparent">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-8">
          <ArrowLeft size={20} />
          {getTranslation(language, 'common.backToDashboard')}
        </Link>

        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
              {getTranslation(language, 'animals.title')}
            </h1>
            <p className="text-lg text-muted-foreground">
              {getTranslation(language, 'animals.subtitle')}
            </p>
          </div>
          <Dialog open={isAddingAnimal} onOpenChange={setIsAddingAnimal}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus size={18} />
                {getTranslation(language, 'animals.add')}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{getTranslation(language, 'animals.addNew')}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {error && (
                  <div className="p-4 rounded-lg bg-red-50 border border-red-200 flex gap-3">
                    <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                )}
                <div>
                  <Label htmlFor="name">{getTranslation(language, 'animals.form.name')} *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="breed">{getTranslation(language, 'animals.form.breed')}</Label>
                  <select
                    id="breed"
                    name="breed"
                    value={formData.breed}
                    onChange={handleInputChange}
                    className="mt-2 w-full px-3 py-2 border border-border rounded-md bg-transparent text-foreground"
                  >
                    <option value="">{getTranslation(language, 'animals.form.selectBreed')}</option>
                    <optgroup label="Indigenous (Desi)">
                      <option value="Gir">Gir</option>
                      <option value="Sahiwal">Sahiwal</option>
                      <option value="Red Sindhi">Red Sindhi</option>
                      <option value="Tharparkar">Tharparkar</option>
                      <option value="Rathi">Rathi</option>
                      <option value="Kankrej">Kankrej</option>
                      <option value="Ongole">Ongole</option>
                      <option value="Hariana">Hariana</option>
                      <option value="Deoni">Deoni</option>
                    </optgroup>
                    <optgroup label="Cow / Cattle">
                      <option value="Gir">Gir</option>
                      <option value="Sahiwal">Sahiwal</option>
                      <option value="Holstein Friesian">Holstein Friesian</option>
                      <option value="Jersey">Jersey</option>
                      <option value="Kankrej">Kankrej</option>
                      <option value="Red Sindhi">Red Sindhi</option>
                    </optgroup>
                    <optgroup label="Buffalo">
                      <option value="Murrah">Murrah</option>
                      <option value="Surti">Surti</option>
                      <option value="Jaffarabadi">Jaffarabadi</option>
                      <option value="Mehsana">Mehsana</option>
                    </optgroup>
                    <optgroup label="Goat">
                      <option value="Jamnapari">Jamnapari</option>
                      <option value="Beetal">Beetal</option>
                      <option value="Sirohi">Sirohi</option>
                      <option value="Barbari">Barbari</option>
                      <option value="Boer">Boer</option>
                    </optgroup>
                    <optgroup label="Sheep">
                      <option value="Marwari">Marwari</option>
                      <option value="Patanwadi">Patanwadi</option>
                      <option value="Merino">Merino</option>
                      <option value="Rambouillet">Rambouillet</option>
                    </optgroup>
                    <optgroup label="Pig">
                      <option value="Yorkshire">Yorkshire</option>
                      <option value="Landrace">Landrace</option>
                      <option value="Duroc">Duroc</option>
                      <option value="Hampshire">Hampshire</option>
                    </optgroup>
                    <optgroup label="Horse">
                      <option value="Marwari Horse">Marwari</option>
                      <option value="Kathiawari">Kathiawari</option>
                      <option value="Thoroughbred">Thoroughbred</option>
                    </optgroup>
                    <optgroup label="Poultry / Hen">
                      <option value="Kadaknath">Kadaknath</option>
                      <option value="Rhode Island Red">Rhode Island Red</option>
                      <option value="Broiler">Broiler</option>
                      <option value="Layer">Layer</option>
                    </optgroup>
                    <optgroup label="Dog">
                      <option value="Indian Pariah Dog">Indian Pariah Dog</option>
                      <option value="Rajapalayam">Rajapalayam</option>
                      <option value="Mudhol Hound">Mudhol Hound</option>
                      <option value="Chippiparai">Chippiparai</option>
                      <option value="Labrador Retriever">Labrador Retriever</option>
                      <option value="German Shepherd">German Shepherd</option>
                      <option value="Golden Retriever">Golden Retriever</option>
                    </optgroup>
                    <optgroup label="Bull / Bison">
                      <option value="American Bison">American Bison</option>
                      <option value="European Bison">European Bison</option>
                      <option value="Gir Bull">Gir Bull</option>
                      <option value="Sahiwal Bull">Sahiwal Bull</option>
                      <option value="Kankrej Bull">Kankrej Bull</option>
                    </optgroup>
                    <optgroup label="Cat">
                      <option value="Indian Billi">Indian Billi</option>
                      <option value="Himalayan Cat">Himalayan Cat</option>
                      <option value="Persian Cat">Persian Cat</option>
                      <option value="Siamese Cat">Siamese Cat</option>
                      <option value="Maine Coon">Maine Coon</option>
                      <option value="Bengal Cat">Bengal Cat</option>
                    </optgroup>
                    <optgroup label="Camel">
                      <option value="Bikaneri Camel">Bikaneri Camel</option>
                      <option value="Kutchi Camel">Kutchi Camel</option>
                      <option value="Jaisalmeri Camel">Jaisalmeri Camel</option>
                      <option value="Arabian Camel">Arabian Camel</option>
                      <option value="Somali Camel">Somali Camel</option>
                      <option value="Bactrian Camel">Bactrian Camel</option>
                    </optgroup>
                    <optgroup label="Yak">
                      <option value="Arunachali Yak">Arunachali Yak</option>
                      <option value="Ladakhi Yak">Ladakhi Yak</option>
                      <option value="Sikkimi Yak">Sikkimi Yak</option>
                      <option value="Tibetan Yak">Tibetan Yak</option>
                      <option value="Wild Yak">Wild Yak</option>
                    </optgroup>
                    <optgroup label="Donkey">
                      <option value="Halari Donkey">Halari Donkey</option>
                      <option value="Spiti Donkey">Spiti Donkey</option>
                      <option value="Kachchhi Donkey">Kachchhi Donkey</option>
                      <option value="Andalusian Donkey">Andalusian Donkey</option>
                      <option value="American Mammoth Jackstock">American Mammoth Jackstock</option>
                      <option value="Miniature Donkey">Miniature Donkey</option>
                    </optgroup>
                    <optgroup label="Pony">
                      <option value="Manipuri Pony">Manipuri Pony</option>
                      <option value="Zanskari Pony">Zanskari Pony</option>
                      <option value="Bhutia Pony">Bhutia Pony</option>
                      <option value="Shetland Pony">Shetland Pony</option>
                      <option value="Welsh Pony">Welsh Pony</option>
                      <option value="Mongolian Pony">Mongolian Pony</option>
                    </optgroup>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="gender">{getTranslation(language, 'animals.form.gender')}</Label>
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="mt-2 w-full px-3 py-2 border border-border rounded-md bg-transparent text-foreground"
                    >
                      <option value="Male">{getTranslation(language, 'animals.form.male')}</option>
                      <option value="Female">{getTranslation(language, 'animals.form.female')}</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="age_months">{getTranslation(language, 'animals.form.age')}</Label>
                    <Input
                      id="age_months"
                      name="age_months"
                      type="number"
                      value={formData.age_months}
                      onChange={handleInputChange}
                      className="mt-2"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="weight">{getTranslation(language, 'animals.form.weight')}</Label>
                    <Input
                      id="weight"
                      name="weight"
                      type="number"
                      step="0.1"
                      value={formData.weight}
                      onChange={handleInputChange}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="color">{getTranslation(language, 'animals.form.color')}</Label>
                    <select
                      id="color"
                      name="color"
                      value={formData.color}
                      onChange={handleInputChange}
                      className="mt-2 w-full px-3 py-2 border border-border rounded-md bg-transparent text-foreground"
                    >
                      <option value="">{getTranslation(language, 'animals.form.selectColor')}</option>
                      <option value="Black">Black</option>
                      <option value="White">White</option>
                      <option value="Brown">Brown</option>
                      <option value="Red">Red</option>
                      <option value="Grey">Grey</option>
                      <option value="Mixed">Mixed</option>
                    </select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="notes">{getTranslation(language, 'animals.form.notes')}</Label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    className="mt-2 w-full px-3 py-2 border border-border rounded-md bg-transparent text-foreground"
                    rows={3}
                  />
                </div>
                <Button onClick={handleAddAnimal} className="w-full">
                  {getTranslation(language, 'animals.add')}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {error && !isAddingAnimal && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 flex gap-3">
            <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {animals.length === 0 ? (
          <Card className="p-12 border border-border bg-card text-center">
            <p className="text-muted-foreground mb-4">{getTranslation(language, 'animals.noAnimals')}</p>
            <Button onClick={() => setIsAddingAnimal(true)} className="flex items-center gap-2 mx-auto">
              <Plus size={18} />
              {getTranslation(language, 'animals.addFirst')}
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {animals.map(animal => (
              <Card key={animal.id} className="p-6 border border-border bg-card">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-foreground">{animal.name}</h3>
                    <p className="text-sm text-muted-foreground">{animal.breed || 'Unknown breed'}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteAnimal(animal.id)}
                    className="text-destructive"
                  >
                    <Trash2 size={18} />
                  </Button>
                </div>

                <div className="space-y-3 text-sm">
                  {animal.gender && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{getTranslation(language, 'animals.form.gender')}:</span>
                      <span className="font-medium text-foreground">{animal.gender}</span>
                    </div>
                  )}
                  {animal.age_months && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{getTranslation(language, 'animals.form.age')}:</span>
                      <span className="font-medium text-foreground">{animal.age_months} months</span>
                    </div>
                  )}
                  {animal.weight && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{getTranslation(language, 'animals.form.weight')}:</span>
                      <span className="font-medium text-foreground">{animal.weight} kg</span>
                    </div>
                  )}
                  {animal.color && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{getTranslation(language, 'animals.form.color')}:</span>
                      <span className="font-medium text-foreground">{animal.color}</span>
                    </div>
                  )}
                  {animal.notes && (
                    <div className="pt-2 border-t border-border">
                      <p className="text-muted-foreground text-xs">{getTranslation(language, 'animals.form.notes')}:</p>
                      <p className="text-foreground text-sm mt-1">{animal.notes}</p>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
