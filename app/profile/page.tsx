'use client';

import React from "react"
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Edit2,
  Save,
  X,
  LogOut,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { useLanguage } from '@/contexts/language-context';
import { getTranslation } from '@/lib/translations';

export default function ProfilePage() {
  const router = useRouter();
  const { user, profile, signOut, updateProfile, loading } = useAuth();
  const { language } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [editData, setEditData] = useState({
    full_name: '',
    phone: '',
    location: '',
    farm_name: '',
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (profile) {
      setEditData({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        location: profile.location || '',
        farm_name: profile.farm_name || '',
      });
    }
  }, [profile, user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setError('');
    setIsSaving(true);
    try {
      await updateProfile(editData);
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditData({
      full_name: profile?.full_name || '',
      phone: profile?.phone || '',
      location: profile?.location || '',
      farm_name: profile?.farm_name || '',
    });
    setIsEditing(false);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/login');
    } catch (err) {
      setError('Failed to sign out');
    }
  };

  if (loading) {
    return (
      <main className="py-8 bg-transparent">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-muted-foreground">{getTranslation(language, 'common.loading')}</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="py-8 bg-transparent">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-8">
          <ArrowLeft size={20} />
          {getTranslation(language, 'common.backToDashboard')}
        </Link>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 flex gap-3">
            <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
              {getTranslation(language, 'profile.title')}
            </h1>
            <p className="text-lg text-muted-foreground">
              {getTranslation(language, 'profile.subtitle')}
            </p>
          </div>
          {!isEditing && (
            <Button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2"
            >
              <Edit2 size={18} />
              {getTranslation(language, 'profile.edit')}
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <Card className="lg:col-span-1 p-6 border border-border bg-card">
            <div className="text-center">
              <div className="w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <User size={64} className="text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-1">
                {profile?.full_name || 'User'}
              </h2>
              <p className="text-muted-foreground mb-4">{profile?.farm_name || 'Not set'}</p>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p className="flex items-center justify-center gap-2">
                  <MapPin size={16} />
                  {profile?.location || 'Not set'}
                </p>
              </div>
            </div>
          </Card>

          <Card className="lg:col-span-2 p-6 border border-border bg-card">
            <h3 className="text-xl font-semibold text-foreground mb-6">
              {getTranslation(language, 'profile.contactInfo')}
            </h3>

            {!isEditing ? (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <User size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{getTranslation(language, 'profile.labels.fullName')}</p>
                    <p className="text-lg font-medium text-foreground">
                      {profile?.full_name || 'Not set'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Mail size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{getTranslation(language, 'profile.labels.email')}</p>
                    <p className="text-lg font-medium text-foreground">
                      {user?.email || 'Not available'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Phone size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{getTranslation(language, 'profile.labels.phone')}</p>
                    <p className="text-lg font-medium text-foreground">
                      {profile?.phone || 'Not set'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <MapPin size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{getTranslation(language, 'profile.labels.location')}</p>
                    <p className="text-lg font-medium text-foreground">
                      {profile?.location || 'Not set'}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="full_name">{getTranslation(language, 'profile.labels.fullName')}</Label>
                  <Input
                    id="full_name"
                    name="full_name"
                    value={editData.full_name}
                    onChange={handleInputChange}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="email">{getTranslation(language, 'profile.labels.email')}</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="mt-2 bg-muted"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">{getTranslation(language, 'profile.labels.phone')}</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={editData.phone}
                    onChange={handleInputChange}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="location">{getTranslation(language, 'profile.labels.location')}</Label>
                  <Input
                    id="location"
                    name="location"
                    value={editData.location}
                    onChange={handleInputChange}
                    className="mt-2"
                  />
                </div>
              </div>
            )}
          </Card>
        </div>

        <Card className="p-6 border border-border bg-card mb-8">
          <h3 className="text-xl font-semibold text-foreground mb-6">
            {getTranslation(language, 'profile.farmInfo')}
          </h3>

          {!isEditing ? (
            <div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <Briefcase size={20} className="text-secondary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{getTranslation(language, 'profile.labels.farmName')}</p>
                  <p className="text-lg font-medium text-foreground">
                    {profile?.farm_name || 'Not set'}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <Label htmlFor="farm_name">{getTranslation(language, 'profile.labels.farmName')}</Label>
              <Input
                id="farm_name"
                name="farm_name"
                value={editData.farm_name}
                onChange={handleInputChange}
                className="mt-2"
              />
            </div>
          )}
        </Card>

        {isEditing && (
          <div className="flex gap-4 justify-end mb-8">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="flex items-center gap-2 bg-transparent"
              disabled={isSaving}
            >
              <X size={18} />
              {getTranslation(language, 'common.cancel')}
            </Button>
            <Button
              onClick={handleSave}
              className="flex items-center gap-2"
              disabled={isSaving}
            >
              <Save size={18} />
              {isSaving ? getTranslation(language, 'common.saving') : getTranslation(language, 'common.save')}
            </Button>
          </div>
        )}

        <Card className="p-6 border border-border bg-card">
          <h3 className="text-xl font-semibold text-foreground mb-6">
            {getTranslation(language, 'profile.accountSettings')}
          </h3>
          <Button
            variant="outline"
            onClick={handleSignOut}
            className="w-full justify-start bg-transparent text-destructive hover:text-destructive"
          >
            <LogOut size={18} className="mr-2" />
            {getTranslation(language, 'profile.logout')}
          </Button>
        </Card>
      </div>
    </main>
  );
}
