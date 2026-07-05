'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Loader, Search, Calendar, FileText, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/auth-context';
import { useLanguage } from '@/contexts/language-context';
import { getTranslation } from '@/lib/translations';
import type { Diagnosis } from '@/lib/supabase';

export default function DiagnosisHistoryPage() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const { language } = useLanguage();
    const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
            return;
        }

        if (user) {
            fetchDiagnoses();
        }
    }, [user, authLoading, router]);

    const fetchDiagnoses = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/diagnoses', {
                headers: { Authorization: `Bearer ${user?.id}` },
                cache: 'no-store'
            });

            if (response.ok) {
                const data = await response.json();
                setDiagnoses(data.diagnoses || []);
            }
        } catch (err) {
            console.error('Failed to fetch diagnoses:', err);
        } finally {
            setLoading(false);
        }
    };

    const filteredDiagnoses = diagnoses.filter(d =>
        (d.disease_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (d.status?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    if (loading || authLoading) {
        return (
            <main className="flex-1 py-12 bg-transparent flex flex-col items-center justify-center min-h-[50vh]">
                <Loader className="w-12 h-12 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">{getTranslation(language, 'common.loading')}</p>
            </main>
        );
    }

    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-1 py-8 bg-transparent">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link href="/dashboard" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-8">
                        <ArrowLeft size={20} />
                        {getTranslation(language, 'common.backToDashboard')}
                    </Link>

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-foreground mb-2">{getTranslation(language, 'history.title')}</h1>
                            <p className="text-muted-foreground">{getTranslation(language, 'history.subtitle')}</p>
                        </div>

                        <Link href="/diagnosis/symptoms">
                            <Button className="gap-2">
                                <Plus size={18} />
                                {getTranslation(language, 'dashboard.newDiagnosis')}
                            </Button>
                        </Link>
                    </div>

                    <Card className="border border-border bg-card overflow-hidden">
                        <div className="p-4 border-b border-border bg-muted/20">
                            <div className="relative max-w-sm">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                <Input
                                    placeholder={getTranslation(language, 'history.searchPlaceholder')}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-9 bg-background"
                                />
                            </div>
                        </div>

                        {filteredDiagnoses.length === 0 ? (
                            <div className="text-center py-16 px-4">
                                <div className="bg-muted/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FileText className="w-8 h-8 text-muted-foreground/50" />
                                </div>
                                <h3 className="text-lg font-medium text-foreground mb-2">{getTranslation(language, 'history.noReports')}</h3>
                                <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                                    {searchTerm ? getTranslation(language, 'history.noMatch') : getTranslation(language, 'history.noData')}
                                </p>
                                {!searchTerm && (
                                    <div className="flex gap-3 justify-center">
                                        <Link href="/diagnosis/symptoms">
                                            <Button>{getTranslation(language, 'history.startDiagnosis')}</Button>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-muted/50 border-b border-border">
                                            <th className="text-left py-3 px-6 font-medium text-muted-foreground text-sm">{getTranslation(language, 'dashboard.date')}</th>
                                            <th className="text-left py-3 px-6 font-medium text-muted-foreground text-sm">{getTranslation(language, 'dashboard.disease')}</th>
                                            <th className="text-left py-3 px-6 font-medium text-muted-foreground text-sm">{getTranslation(language, 'dashboard.severity')}</th>
                                            <th className="text-left py-3 px-6 font-medium text-muted-foreground text-sm">{getTranslation(language, 'dashboard.status')}</th>
                                            <th className="text-right py-3 px-6 font-medium text-muted-foreground text-sm">{getTranslation(language, 'dashboard.action')}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {filteredDiagnoses.map((diagnosis) => {
                                            const severityColor = {
                                                High: 'bg-red-100 text-red-800 border-red-200',
                                                Medium: 'bg-orange-100 text-orange-800 border-orange-200',
                                                Low: 'bg-green-100 text-green-800 border-green-200',
                                            }[diagnosis.severity || 'Low'] || '';

                                            const statusColor = {
                                                pending: 'bg-blue-100 text-blue-800',
                                                diagnosed: 'bg-purple-100 text-purple-800',
                                                treated: 'bg-emerald-100 text-emerald-800',
                                                resolved: 'bg-gray-100 text-gray-800',
                                            }[diagnosis.status] || '';

                                            return (
                                                <tr key={diagnosis.id} className="hover:bg-muted/30 transition-colors">
                                                    <td className="py-4 px-6 text-sm text-foreground">
                                                        <div className="flex items-center gap-2">
                                                            <Calendar size={14} className="text-muted-foreground" />
                                                            {new Date(diagnosis.created_at).toLocaleDateString()}
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-6">
                                                        <span className="font-medium text-foreground">{diagnosis.disease_name || 'Unknown'}</span>
                                                    </td>
                                                    <td className="py-4 px-6">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${severityColor}`}>
                                                            {diagnosis.severity || 'N/A'}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-6">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor}`}>
                                                            {diagnosis.status.charAt(0).toUpperCase() + diagnosis.status.slice(1)}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-6 text-right">
                                                        <Link href={`/diagnosis/${diagnosis.id}`}>
                                                            <Button variant="ghost" size="sm" className="hover:bg-primary/5 hover:text-primary">
                                                                {getTranslation(language, 'history.viewReport')}
                                                            </Button>
                                                        </Link>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </Card>
                </div>
            </main>
        </div>
    );
}
