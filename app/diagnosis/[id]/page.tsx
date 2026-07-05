'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, AlertTriangle, Download, MapPin, CheckCircle, Zap, Loader } from 'lucide-react';
import Footer from '@/components/footer';
import { useAuth } from '@/contexts/auth-context';
import { useLanguage } from '@/contexts/language-context';
import { getTranslation } from '@/lib/translations';

export default function DiagnosisViewPage() {
    const router = useRouter();
    const params = useParams();
    const { user } = useAuth();
    const { language } = useLanguage();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [diagnosis, setDiagnosis] = useState<any>(null);

    useEffect(() => {
        if (!user) {
            // Wait for auth to initialize
            return;
        }
        if (params?.id) {
            fetchDiagnosis(params.id as string);
        }
    }, [user, params?.id]);

    const fetchDiagnosis = async (id: string) => {
        try {
            setLoading(true);
            const response = await fetch(`/api/diagnoses/${id}`, {
                headers: {
                    Authorization: `Bearer ${user?.id}`,
                }
            });

            if (!response.ok) {
                let errorMessage = `Failed to fetch diagnosis (${response.status})`;
                try {
                    const errorData = await response.json();
                    if (errorData.error) errorMessage = errorData.error;
                } catch (e) {
                    // ignore json parse error
                }
                throw new Error(errorMessage);
            }

            const data = await response.json();
            setDiagnosis(data.diagnosis);
        } catch (err) {
            console.error('Fetch error:', err);
            setError(err instanceof Error ? err.message : 'Could not load diagnosis report.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <main className="flex-1 py-12 bg-background flex flex-col items-center justify-center min-h-[50vh]">
                <Loader className="w-12 h-12 animate-spin text-primary mb-4" />
                <h2 className="text-xl font-semibold">{getTranslation(language, 'common.loading')}</h2>
            </main>
        );
    }

    if (error) {
        return (
            <main className="py-8 bg-background">
                <div className="max-w-4xl mx-auto px-4">
                    <Card className="p-8 border-red-200 bg-red-50 text-center">
                        <AlertTriangle className="w-12 h-12 text-red-600 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-red-800 mb-2">{error}</h2>
                        <Button onClick={() => router.push('/dashboard')}>{getTranslation(language, 'common.backToDashboard')}</Button>
                    </Card>
                </div>
            </main>
        );
    }

    if (!diagnosis) return null;

    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-1 py-8 bg-background">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link href="/dashboard" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-8">
                        <ArrowLeft size={20} />
                        {getTranslation(language, 'common.backToDashboard')}
                    </Link>

                    {/* Header Card */}
                    <Card className="mb-8 p-8 border border-border bg-card">
                        <div className="flex flex-col sm:flex-row gap-6 mb-6">
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <div className={`inline-block mb-4 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${diagnosis.severity === 'High' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'
                                        }`}>
                                        <AlertTriangle size={16} />
                                        {diagnosis.severity} {getTranslation(language, 'diagnosis.severity')}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        {new Date(diagnosis.created_at).toLocaleDateString()}
                                    </div>
                                </div>

                                <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                                    {diagnosis.disease_name}
                                </h1>
                                <p className="text-muted-foreground mb-6">
                                    {getTranslation(language, 'dashboard.status')}: <span className="capitalize font-medium text-foreground">{diagnosis.status}</span>
                                </p>
                            </div>
                            <div className="flex flex-col items-center justify-center bg-primary/10 rounded-2xl p-8 min-w-[180px]">
                                <p className="text-4xl font-bold text-primary mb-2">{diagnosis.confidence_score}%</p>
                                <p className="text-sm text-muted-foreground text-center">{getTranslation(language, 'diagnosis.confidence')}</p>
                            </div>
                        </div>

                        <div className="flex gap-3 flex-wrap">
                            <Link href="/hospitals">
                                <Button className="gap-2">
                                    <MapPin size={18} />
                                    {getTranslation(language, 'diagnosis.findHospital')}
                                </Button>
                            </Link>
                            <Button variant="outline" className="gap-2 bg-transparent" onClick={() => window.print()}>
                                <Download size={18} />
                                {getTranslation(language, 'diagnosis.download')}
                            </Button>
                        </div>
                    </Card>

                    {/* Causes */}
                    {diagnosis.causes && diagnosis.causes.length > 0 && (
                        <Card className="mb-8 p-8 border border-border bg-card">
                            <h2 className="text-2xl font-bold text-foreground mb-6">{getTranslation(language, 'diagnosis.causes')}</h2>
                            <div className="grid grid-cols-1 gap-4">
                                {diagnosis.causes.map((cause: string, index: number) => (
                                    <div key={index} className="flex gap-4">
                                        <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center flex-shrink-0 text-sm font-semibold">
                                            •
                                        </div>
                                        <p className="text-foreground pt-0.5">{cause}</p>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    )}

                    {/* Prevention */}
                    {diagnosis.prevention_tips && diagnosis.prevention_tips.length > 0 && (
                        <Card className="mb-8 p-8 border border-border bg-card">
                            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                                <CheckCircle size={28} className="text-primary" />
                                {getTranslation(language, 'diagnosis.prevention')}
                            </h2>
                            <div className="space-y-3">
                                {diagnosis.prevention_tips.map((item: string, index: number) => (
                                    <div key={index} className="flex gap-4 p-4 bg-primary/5 rounded-lg border border-primary/10">
                                        <span className="text-sm font-semibold text-primary flex-shrink-0 mt-0.5">
                                            {index + 1}.
                                        </span>
                                        <p className="text-foreground">{item}</p>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    )}

                    {/* Treatment */}
                    {diagnosis.treatment_recommendations && diagnosis.treatment_recommendations.length > 0 && (
                        <Card className="mb-8 p-8 border border-border bg-card">
                            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                                <Zap size={28} className="text-orange-600" />
                                {getTranslation(language, 'diagnosis.treatment')}
                            </h2>
                            <div className="space-y-3">
                                {diagnosis.treatment_recommendations.map((item: string, index: number) => (
                                    <div key={index} className="flex gap-4 p-4 bg-accent/5 rounded-lg border border-accent/10">
                                        <span className="text-sm font-semibold text-accent flex-shrink-0 mt-0.5">
                                            {index + 1}.
                                        </span>
                                        <p className="text-foreground">{item}</p>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    )}

                </div>
            </main>
            <Footer />
        </div>
    );
}
