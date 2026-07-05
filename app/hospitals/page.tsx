'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, MapPin, Phone, Clock, Star, Navigation } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import { getTranslation } from '@/lib/translations';

export default function HospitalsPage() {
  const { language } = useLanguage();
  const hospitals = [
    {
      id: 1,
      name: 'Ahmedabad Veterinary Hospital',
      distance: 2.3,
      rating: 4.8,
      phone: '+91 79 1234 5678',
      address: 'Ahmedabad, Gujarat',
      hours: '24/7 Emergency',
      type: 'Hospital',
      specialties: ['General Care', 'Surgery', 'Emergency'],
    },
    {
      id: 2,
      name: 'Green Valley Cattle Clinic',
      distance: 4.1,
      rating: 4.6,
      phone: '+91 79 9876 5432',
      address: 'Vastrapur, Ahmedabad',
      hours: '8:00 AM - 8:00 PM',
      type: 'Clinic',
      specialties: ['General Care', 'Vaccination', 'Diagnostics'],
    },
    {
      id: 3,
      name: 'Dairy Health Center',
      distance: 5.8,
      rating: 4.7,
      phone: '+91 79 5555 5555',
      address: 'Isanpur, Ahmedabad',
      hours: '7:00 AM - 7:00 PM',
      type: 'Clinic',
      specialties: ['Dairy Care', 'Nutrition', 'Herd Management'],
    },
    {
      id: 4,
      name: 'Pradesh Veterinary Services',
      distance: 7.2,
      rating: 4.9,
      phone: '+91 79 1111 1111',
      address: 'Satellite, Ahmedabad',
      hours: '8:00 AM - 9:00 PM',
      type: 'Hospital',
      specialties: ['Surgery', 'Emergency', 'Rehabilitation'],
    },
  ];

  const medicalShops = [
    {
      id: 1,
      name: 'Veterinary Medicine Shop',
      distance: 1.2,
      phone: '+91 79 2222 2222',
      address: 'Ahmedabad, Gujarat',
      hours: '9:00 AM - 9:00 PM',
    },
    {
      id: 2,
      name: 'Cattle Care Pharmacy',
      distance: 3.5,
      phone: '+91 79 3333 3333',
      address: 'Thaltej, Ahmedabad',
      hours: '8:00 AM - 10:00 PM',
    },
  ];

  return (
    <div className="py-8 bg-transparent">

      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-8">
            <ArrowLeft size={20} />
            {getTranslation(language, 'common.backToDashboard')}
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
              {getTranslation(language, 'hospitals.title')}
            </h1>
            <p className="text-lg text-muted-foreground">
              {getTranslation(language, 'hospitals.subtitle')}
            </p>
          </div>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">{getTranslation(language, 'hospitals.hospitalSection')}</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {hospitals.map(hospital => (
                <Card key={hospital.id} className="p-6 border border-border bg-card hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-foreground mb-1">
                        {hospital.name}
                      </h3>
                      <div className="flex items-center gap-2 mb-3">
                        <MapPin size={16} className="text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          {hospital.distance} km away • {getTranslation(language, hospital.type === 'Hospital' ? 'hospitals.hospital' : 'hospitals.clinic')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                      <Star size={16} fill="currentColor" />
                      <span className="font-semibold text-sm">{hospital.rating}</span>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4">{hospital.address}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-3">
                      <Phone size={16} className="text-primary" />
                      <a href={`tel:${hospital.phone}`} className="text-primary hover:underline font-medium">
                        {hospital.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock size={16} className="text-primary" />
                      <span className="text-foreground font-medium">{hospital.hours}</span>
                    </div>
                  </div>

                  <div className="mb-4 flex flex-wrap gap-2">
                    {hospital.specialties.map(spec => (
                      <span key={spec} className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">
                        {spec}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <Button className="flex-1 gap-2" size="sm">
                      <Phone size={16} />
                      {getTranslation(language, 'hospitals.call')}
                    </Button>
                    <Button variant="outline" className="flex-1 gap-2 bg-transparent" size="sm">
                      <Navigation size={16} />
                      {getTranslation(language, 'hospitals.directions')}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-6">{getTranslation(language, 'hospitals.shopSection')}</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {medicalShops.map(shop => (
                <Card key={shop.id} className="p-6 border border-border bg-card hover:shadow-lg transition-shadow">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-foreground mb-1">
                      {shop.name}
                    </h3>
                    <div className="flex items-center gap-2 mb-3">
                      <MapPin size={16} className="text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        {shop.distance} km away
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4">{shop.address}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-3">
                      <Phone size={16} className="text-secondary" />
                      <a href={`tel:${shop.phone}`} className="text-secondary hover:underline font-medium">
                        {shop.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock size={16} className="text-secondary" />
                      <span className="text-foreground font-medium">{shop.hours}</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button className="flex-1 gap-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground" size="sm">
                      <Phone size={16} />
                      {getTranslation(language, 'hospitals.call')}
                    </Button>
                    <Button variant="outline" className="flex-1 gap-2 bg-transparent" size="sm">
                      <Navigation size={16} />
                      {getTranslation(language, 'hospitals.directions')}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          <Card className="mt-12 p-8 border border-border bg-card">
            <h3 className="text-xl font-bold text-foreground mb-4">{getTranslation(language, 'hospitals.mapTitle')}</h3>
            <div className="w-full h-96 rounded-lg bg-muted flex items-center justify-center border border-border">
              <div className="text-center">
                <MapPin size={48} className="text-muted-foreground mx-auto mb-2 opacity-50" />
                <p className="text-muted-foreground">
                  {getTranslation(language, 'hospitals.mapPlaceholder')}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
