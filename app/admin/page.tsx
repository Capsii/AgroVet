'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Edit,
  Trash2,
  Plus,
  Users,
  Zap,
  FileText,
  CheckCircle,
  Clock,
} from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import { getTranslation } from '@/lib/translations';

export default function AdminPanel() {
  const { language } = useLanguage();

  const diseases = [
    {
      id: 1,
      name: 'Foot and Mouth Disease',
      symptoms: 15,
      treatments: 8,
      lastUpdated: 'Jan 15, 2024',
      verified: true,
    },
    {
      id: 2,
      name: 'Mastitis',
      symptoms: 12,
      treatments: 6,
      lastUpdated: 'Jan 12, 2024',
      verified: true,
    },
    {
      id: 3,
      name: 'Skin Infection',
      symptoms: 10,
      treatments: 7,
      lastUpdated: 'Jan 10, 2024',
      verified: false,
    },
  ];

  const recentDiagnoses = [
    {
      id: 1,
      farmer: 'Rajesh Patel',
      disease: 'Foot and Mouth Disease',
      date: 'Jan 18, 2024',
      verified: true,
    },
    {
      id: 2,
      farmer: 'Priya Desai',
      disease: 'Mastitis',
      date: 'Jan 17, 2024',
      verified: true,
    },
    {
      id: 3,
      farmer: 'Amit Singh',
      disease: 'Skin Infection',
      date: 'Jan 16, 2024',
      verified: false,
    },
  ];

  return (
    <div>
      <main className="py-8 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
              {getTranslation(language, 'admin.title')}
            </h1>
            <p className="text-lg text-muted-foreground">
              {getTranslation(language, 'admin.subtitle')}
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <Card className="p-6 border border-border bg-card hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{getTranslation(language, 'admin.stats.totalDiseases')}</p>
                  <p className="text-3xl font-bold text-foreground">42</p>
                </div>
                <div className="p-3 rounded-lg bg-primary/10">
                  <Zap size={24} className="text-primary" />
                </div>
              </div>
            </Card>

            <Card className="p-6 border border-border bg-card hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{getTranslation(language, 'admin.stats.verifiedDiagnoses')}</p>
                  <p className="text-3xl font-bold text-foreground">156</p>
                </div>
                <div className="p-3 rounded-lg bg-primary/10">
                  <CheckCircle size={24} className="text-primary" />
                </div>
              </div>
            </Card>

            <Card className="p-6 border border-border bg-card hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{getTranslation(language, 'admin.stats.pendingReview')}</p>
                  <p className="text-3xl font-bold text-foreground">8</p>
                </div>
                <div className="p-3 rounded-lg bg-orange-100">
                  <Clock size={24} className="text-orange-600" />
                </div>
              </div>
            </Card>
          </div>

          {/* Manage Diseases */}
          <Card className="mb-8 border border-border bg-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">{getTranslation(language, 'admin.manageDiseases')}</h2>
              <Button className="gap-2">
                <Plus size={18} />
                {getTranslation(language, 'admin.addDisease')}
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold text-foreground">{getTranslation(language, 'admin.table.diseaseName')}</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">{getTranslation(language, 'admin.table.symptoms')}</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">{getTranslation(language, 'admin.table.treatments')}</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">{getTranslation(language, 'admin.table.lastUpdated')}</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">{getTranslation(language, 'admin.table.status')}</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">{getTranslation(language, 'admin.table.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {diseases.map(disease => (
                    <tr key={disease.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                      <td className="py-4 px-4 font-medium text-foreground">{disease.name}</td>
                      <td className="py-4 px-4 text-muted-foreground">{disease.symptoms}</td>
                      <td className="py-4 px-4 text-muted-foreground">{disease.treatments}</td>
                      <td className="py-4 px-4 text-muted-foreground">{disease.lastUpdated}</td>
                      <td className="py-4 px-4">
                        {disease.verified ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium">
                            <CheckCircle size={16} />
                            {getTranslation(language, 'common.verified')}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-sm font-medium">
                            <Clock size={16} />
                            {getTranslation(language, 'common.pending')}
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                            <Edit size={16} />
                            {getTranslation(language, 'common.edit')}
                          </Button>
                          <Button variant="outline" size="sm" className="gap-2 text-red-600 hover:text-red-700 bg-transparent">
                            <Trash2 size={16} />
                            {getTranslation(language, 'common.delete')}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Verify Diagnoses */}
          <Card className="border border-border bg-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">{getTranslation(language, 'admin.verifyDiagnoses')}</h2>
              <Button variant="outline" size="sm">
                {getTranslation(language, 'admin.viewAll')}
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold text-foreground">{getTranslation(language, 'admin.table.farmer')}</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">{getTranslation(language, 'admin.table.diseaseName')}</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">{getTranslation(language, 'dashboard.date')}</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">{getTranslation(language, 'admin.table.status')}</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">{getTranslation(language, 'admin.table.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {recentDiagnoses.map(diag => (
                    <tr key={diag.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                      <td className="py-4 px-4 font-medium text-foreground">{diag.farmer}</td>
                      <td className="py-4 px-4 text-muted-foreground">{diag.disease}</td>
                      <td className="py-4 px-4 text-muted-foreground">{diag.date}</td>
                      <td className="py-4 px-4">
                        {diag.verified ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium">
                            <CheckCircle size={16} />
                            {getTranslation(language, 'common.verified')}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-sm font-medium">
                            <Clock size={16} />
                            {getTranslation(language, 'common.pending')}
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <Button variant="outline" size="sm">
                          {getTranslation(language, 'common.review')}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
