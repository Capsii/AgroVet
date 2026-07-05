'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/contexts/language-context';
import { getTranslation } from '@/lib/translations';
import { useAuth } from '@/contexts/auth-context';
import { useCart } from '@/contexts/cart-context';
import type { Animal, Diagnosis } from '@/lib/supabase';
import {
  AlertCircle,
  FileText,
  ImageIcon,
  Leaf,
  MapPin,
  Plus,
  TrendingUp,
  AlertTriangle,
  Loader,
  ShoppingCart,
  Pill,
  CheckCircle,
  Package,
  Clock,
} from 'lucide-react';

export default function DashboardPage() {
  const { language } = useLanguage();
  const router = useRouter();
  const { user, profile, loading: authLoading } = useAuth();
  const { orders, cancelOrder } = useCart();
  const [confirmCancel, setConfirmCancel] = useState<string | null>(null);
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [animalsRes, diagnosesRes] = await Promise.all([
        fetch('/api/animals', {
          headers: { Authorization: `Bearer ${user?.id}` },
          cache: 'no-store',
        }),
        fetch('/api/diagnoses', {
          headers: { Authorization: `Bearer ${user?.id}` },
          cache: 'no-store',
        }),
      ]);

      if (animalsRes.ok) {
        const data = await animalsRes.json();
        setAnimals(data.animals || []);
      }

      if (diagnosesRes.ok) {
        const data = await diagnosesRes.json();
        setDiagnoses(data.diagnoses || []);
      }
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      icon: TrendingUp,
      labelKey: 'dashboard.totalDiagnoses',
      value: diagnoses.length.toString(),
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      icon: AlertTriangle,
      labelKey: 'dashboard.recentAlerts',
      value: diagnoses.filter(d => d.severity === 'High').length.toString(),
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      icon: FileText,
      labelKey: 'dashboard.savedReports',
      value: animals.length.toString(),
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
    },
    {
      icon: ShoppingCart,
      labelKey: 'dashboard.medicineOrders',
      value: orders.length.toString(),
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
  ];

  const recentDiagnoses = diagnoses.slice(0, 5);

  if (authLoading || loading) {
    return (
      <main className="flex-1 py-8 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <Loader className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <div>
      <main className="flex-1 py-8 bg-transparent page-enter">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 animate-fade-up">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
              Welcome{profile?.full_name ? `, ${profile.full_name}` : ''}!
            </h1>
            <p className="text-muted-foreground">
              {getTranslation(language, 'dashboard.monitor')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              const delays = ['delay-100','delay-200','delay-300','delay-400'];
              return (
                <Card key={index} className={`p-6 border border-border bg-card hover-lift animate-scale-pop ${delays[index]}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{getTranslation(language, stat.labelKey)}</p>
                      <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                      <Icon className={stat.color} size={24} />
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          <div className="mb-8 animate-fade-up delay-200">
            <h2 className="text-2xl font-bold text-foreground mb-4">{getTranslation(language, 'dashboard.quickActions')}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              <Link href="/diagnosis/symptoms">
                <Button
                  className="w-full h-auto py-6 flex flex-col items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg"
                >
                  <AlertCircle size={24} />
                  <span>{getTranslation(language, 'dashboard.enterSymptoms')}</span>
                </Button>
              </Link>
              <Link href="/diagnosis/image">
                <Button
                  variant="outline"
                  className="w-full h-auto py-6 flex flex-col items-center justify-center gap-2 border-accent text-accent hover:bg-accent/10 bg-background/60 backdrop-blur-sm shadow-sm"
                >
                  <ImageIcon size={24} />
                  <span>{getTranslation(language, 'dashboard.uploadImage')}</span>
                </Button>
              </Link>
              <Link href="/hospitals">
                <Button
                  variant="outline"
                  className="w-full h-auto py-6 flex flex-col items-center justify-center gap-2 border-accent text-accent hover:bg-accent/10 bg-background/60 backdrop-blur-sm shadow-sm"
                >
                  <MapPin size={24} />
                  <span>{getTranslation(language, 'dashboard.findHospital')}</span>
                </Button>
              </Link>
              <Link href="/medicines">
                 <Button
                    variant="outline"
                    className="w-full h-auto py-6 flex flex-col items-center justify-center gap-2 border-primary text-primary hover:bg-primary/10 bg-background/60 backdrop-blur-sm shadow-sm"
                 >
                    <ShoppingCart size={24} />
                    <span>Medicine Store</span>
                 </Button>
              </Link>
              <Link href="/diagnosis/history">
                <Button
                  variant="outline"
                  className="w-full h-auto py-6 flex flex-col items-center justify-center gap-2 border-accent text-accent hover:bg-accent/10 bg-background/60 backdrop-blur-sm shadow-sm"
                >
                  <FileText size={24} />
                  <span>{getTranslation(language, 'dashboard.viewReports')}</span>
                </Button>
              </Link>
              <Link href="/animals">
                <Button
                  variant="outline"
                  className="w-full h-auto py-6 flex flex-col items-center justify-center gap-2 border-accent text-accent hover:bg-accent/10 bg-background/60 backdrop-blur-sm shadow-sm"
                >
                  <Plus size={24} />
                  <span>Add Animal</span>
                </Button>
              </Link>
            </div>
          </div>

          <Card className="border border-border bg-background/80 backdrop-blur-sm p-6 shadow-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">{getTranslation(language, 'dashboard.recentDiagnoses')}</h2>
              <Link href="/diagnosis/symptoms">
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  <Plus size={16} />
                  {getTranslation(language, 'dashboard.newDiagnosis')}
                </Button>
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold text-foreground">{getTranslation(language, 'dashboard.date')}</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">{getTranslation(language, 'dashboard.disease')}</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">{getTranslation(language, 'dashboard.severity')}</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">{getTranslation(language, 'dashboard.status')}</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">{getTranslation(language, 'dashboard.action')}</th>
                  </tr>
                </thead>
                <tbody>
                  {recentDiagnoses.map(diagnosis => {
                    const severityColor = {
                      High: 'bg-red-100 text-red-800',
                      Medium: 'bg-orange-100 text-orange-800',
                      Low: 'bg-green-100 text-green-800',
                    }[diagnosis.severity || 'Low'] || '';

                    const statusColor = {
                      pending: 'bg-blue-100 text-blue-800',
                      diagnosed: 'bg-purple-100 text-purple-800',
                      treated: 'bg-green-100 text-green-800',
                      resolved: 'bg-green-100 text-green-800',
                    }[diagnosis.status] || '';

                    return (
                      <tr key={diagnosis.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                        <td className="py-4 px-4 text-muted-foreground">
                          {new Date(diagnosis.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-4 font-medium text-foreground">
                          {diagnosis.disease_name || 'Pending Analysis'}
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${severityColor}`}>
                            {diagnosis.severity || 'N/A'}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor}`}>
                            {diagnosis.status}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <Link href={`/diagnosis/${diagnosis.id}`}>
                            <Button variant="outline" size="sm">
                              {getTranslation(language, 'dashboard.view')}
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {recentDiagnoses.length === 0 && (
              <div className="text-center py-12">
                <Leaf size={48} className="mx-auto text-muted-foreground mb-4 opacity-50" />
                <p className="text-muted-foreground mb-4">{getTranslation(language, 'dashboard.noDiagnoses')}</p>
                <div className="flex gap-3 justify-center flex-wrap">
                  <Link href="/diagnosis/symptoms">
                    <Button size="sm">Start Symptoms Diagnosis</Button>
                  </Link>
                  <Link href="/diagnosis/image">
                    <Button size="sm" variant="outline" className="bg-transparent">Upload Image</Button>
                  </Link>
                </div>
              </div>
            )}
          </Card>

          {/* ── My Medicine Orders ───────────────────────────────────────── */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <Pill size={24} className="text-primary" />
                My Medicine Orders
              </h2>
              <Link href="/medicines">
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  <ShoppingCart size={16} />
                  Medicine Store
                </Button>
              </Link>
            </div>

            {orders.length === 0 ? (
              <Card className="p-8 border border-border bg-card text-center">
                <Package size={40} className="mx-auto text-muted-foreground/30 mb-3" />
                <p className="text-muted-foreground mb-4">No medicine orders yet.</p>
                <Link href="/medicines">
                  <Button className="gap-2">
                    <ShoppingCart size={18} />
                    Browse Medicine Store
                  </Button>
                </Link>
              </Card>
            ) : (
              <div className="space-y-4">
                {orders.map(order => (
                  <Card key={order.orderId} className="p-6 border border-border bg-card">
                    {/* Order header */}
                    <div className="flex items-start justify-between mb-4 flex-wrap gap-2">
                      <div>
                        <p className="font-bold text-foreground">{order.orderId}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                          <Clock size={13} />
                          {new Date(order.placedAt).toLocaleDateString('en-IN', {
                            day: '2-digit', month: 'short', year: 'numeric',
                            hour: '2-digit', minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-xl font-bold font-mono text-foreground">
                          ₹{order.totalPrice.toLocaleString()}
                        </span>
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                          <CheckCircle size={12} />
                          {order.status}
                        </span>
                        {confirmCancel === order.orderId ? (
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="destructive"
                              className="h-7 px-3 text-xs"
                              onClick={() => { cancelOrder(order.orderId); setConfirmCancel(null); }}
                            >
                              Confirm Cancel
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 px-3 text-xs bg-transparent"
                              onClick={() => setConfirmCancel(null)}
                            >
                              Keep
                            </Button>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 px-3 text-xs text-destructive border-destructive/40 hover:bg-destructive/10 bg-transparent"
                            onClick={() => setConfirmCancel(order.orderId)}
                          >
                            Cancel Order
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Order items */}
                    <div className="flex flex-wrap gap-2">
                      {order.items.map(item => (
                        <div
                          key={item.id}
                          className="flex items-center gap-2 px-3 py-1.5 bg-primary/5 border border-primary/10 rounded-lg"
                        >
                          <Pill size={13} className="text-primary shrink-0" />
                          <span className="text-sm font-medium text-foreground">{item.name}</span>
                          <span className="text-xs text-muted-foreground">×{item.quantity}</span>
                          <span className="text-xs font-mono text-muted-foreground">₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* ── Your Animals ──────────────────────────────────────────────── */}
          <div className="mt-8 mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">Your Animals</h2>
            {animals.length === 0 ? (
              <Card className="p-8 border border-border bg-card text-center">
                <p className="text-muted-foreground mb-4">No animals registered yet.</p>
                <Link href="/animals">
                  <Button className="gap-2">
                    <Plus size={18} />
                    Add Your First Animal
                  </Button>
                </Link>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {animals.map(animal => (
                  <Card key={animal.id} className="p-4 border border-border bg-card">
                    <h3 className="font-bold text-lg text-foreground">{animal.name}</h3>
                    <p className="text-sm text-muted-foreground">{animal.breed || 'Unknown breed'}</p>
                    {animal.gender && (
                      <p className="text-xs text-muted-foreground mt-2">Gender: {animal.gender}</p>
                    )}
                  </Card>
                ))}
              </div>
            )}
            <div className="mt-4 flex justify-end">
              <Link href="/animals">
                <Button variant="outline" className="bg-transparent gap-2">
                  <Plus size={16} />
                  Manage All Animals
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
