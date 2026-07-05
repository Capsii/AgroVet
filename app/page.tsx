'use client';

import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/contexts/language-context';
import { getTranslation } from '@/lib/translations';
import {
  Activity,
  ImageIcon,
  MapPin,
  Stethoscope,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';

export default function Home() {
  const { language } = useLanguage();

  const features = [
    {
      icon: Activity,
      titleKey: 'features.diagnosis',
      descKey: 'features.diagnosisDesc',
    },
    {
      icon: ImageIcon,
      titleKey: 'features.image',
      descKey: 'features.imageDesc',
    },
    {
      icon: Stethoscope,
      titleKey: 'features.treatment',
      descKey: 'features.treatmentDesc',
    },
    {
      icon: MapPin,
      titleKey: 'features.hospital',
      descKey: 'features.hospitalDesc',
    },
  ];

  const testimonials = [
    {
      name: 'Rajesh Patel',
      role: 'Dairy Farmer, Ahmedabad',
      text: 'AgroVet helped me diagnose a skin disease in my cattle early. The treatment suggestions were simple and easy to follow. Highly recommended!',
      avatar: '👨‍🌾',
    },
    {
      name: 'Priya Desai',
      role: 'Cattle Breeder, Vadodara',
      text: 'The image analysis feature is amazing. I got accurate results just by uploading a photo. Saved me a trip to the vet!',
      avatar: '👩‍🌾',
    },
    {
      name: 'Amit Singh',
      role: 'Farmer, Surat',
      text: 'Finding nearby hospitals through AgroVet is so convenient. The interface is farmer-friendly and easy to use.',
      avatar: '👨‍🌾',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-transparent page-enter">
      <Header />

      {/* Hero Section */}
      <section className="py-16 sm:py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <div className="inline-block mb-4 px-4 py-2 rounded-full bg-accent/20 text-primary animate-bounce-in">
                <span className="text-sm font-medium flex items-center gap-2">
                  <Zap size={16} />
                  {getTranslation(language, 'hero.badge')}
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-balance leading-tight mb-6 text-foreground animate-fade-up delay-100">
                {getTranslation(language, 'hero.title')}
              </h1>
              <p className="text-lg text-muted-foreground mb-8 text-balance animate-fade-up delay-200">
                {getTranslation(language, 'hero.description')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 animate-fade-up delay-300">
                <Link href="/register">
                  <Button size="lg" className="w-full sm:w-auto hover-scale animate-pulse-glow">
                    {getTranslation(language, 'hero.checkHealth')}
                  </Button>
                </Link>
                <Link href="/diagnosis/image">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent hover-scale">
                    {getTranslation(language, 'hero.uploadImage')}
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex flex-col gap-4 animate-slide-right delay-200">
              <div className="rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 p-8 flex items-center justify-center aspect-square hover-lift">
                <div className="text-center">
                  <Stethoscope size={64} className="text-primary mx-auto mb-4 animate-float" />
                  <p className="text-lg font-semibold text-foreground">Cattle Health Analysis</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-24 bg-card border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-up">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              {getTranslation(language, 'features.title')}
            </h2>
            <p className="text-lg text-muted-foreground">
              {getTranslation(language, 'features.subtitle')}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const delays = ['delay-100','delay-200','delay-300','delay-400'];
              return (
                <Card
                  key={index}
                  className={`p-6 hover:shadow-lg transition-shadow border border-border bg-transparent hover-lift animate-scale-pop ${delays[index]}`}
                >
                  <div className="p-3 rounded-lg bg-primary/10 text-primary w-fit mb-4 hover-scale">
                    <Icon size={24} />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {getTranslation(language, feature.titleKey)}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {getTranslation(language, feature.descKey)}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-12 text-center animate-fade-up">
            {getTranslation(language, 'howItWorks.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '1', titleKey: 'howItWorks.step1', descKey: 'howItWorks.step1Desc' },
              { step: '2', titleKey: 'howItWorks.step2', descKey: 'howItWorks.step2Desc' },
              { step: '3', titleKey: 'howItWorks.step3', descKey: 'howItWorks.step3Desc' },
            ].map((item, index) => (
              <div key={index} className={`relative animate-fade-up delay-${(index+1)*200}`}>
                <div className="bg-card rounded-2xl p-8 border border-border text-center hover-lift">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold text-lg mb-4 mx-auto animate-bounce-in">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {getTranslation(language, item.titleKey)}
                  </h3>
                  <p className="text-muted-foreground">
                    {getTranslation(language, item.descKey)}
                  </p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <div className="w-8 h-1 bg-primary rounded-full animate-shimmer" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 sm:py-24 bg-card border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-up">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              {getTranslation(language, 'testimonials.title')}
            </h2>
            <p className="text-lg text-muted-foreground">
              {getTranslation(language, 'testimonials.subtitle')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className={`p-6 border border-border bg-transparent hover:shadow-lg transition-shadow hover-lift animate-scale-pop delay-${(index+1)*200}`}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-4xl animate-float" style={{animationDelay:`${index*0.3}s`}}>{testimonial.avatar}</div>
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-muted-foreground italic">"{testimonial.text}"</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center px-4 animate-fade-up">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            {getTranslation(language, 'cta.title')}
          </h2>
          <p className="text-lg mb-8 opacity-90">
            {getTranslation(language, 'cta.description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto font-semibold hover-scale animate-bounce-in delay-100">
                {getTranslation(language, 'cta.getStarted')}
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 bg-transparent hover-scale animate-bounce-in delay-200">
                {getTranslation(language, 'cta.alreadyMember')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}


