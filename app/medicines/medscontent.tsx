'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft, Search, ShoppingCart, CheckCircle, Pill,
  Filter, X, Plus, Minus, Trash2, ShoppingBag, Package
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/language-context';
import { getTranslation } from '@/lib/translations';
import { useCart } from '@/contexts/cart-context';

// Medicine catalogue – matches diagnosis result page catalogue
const MEDICINES = [
  // ── Parasitic / Skin ──────────────────────────────────────────────────────
  { id: 'med-1',  name: 'Ivermectin Injection',            price: 450,  tags: ['Ectoparasites', 'Mange', 'Livestock'],  imageType: 'injection', description: 'Broad-spectrum antiparasitic effective against Mange, Ectoparasites, and internal worms in all livestock.' },
  { id: 'med-2',  name: 'Amitraz Dip Solution',            price: 320,  tags: ['Demodicosis', 'Mites', 'Pets'],         imageType: 'bottle',    description: 'Acaricidal dip for Demodicosis, Scabies, and Tick Infestation in dogs, cats, and livestock.' },
  { id: 'med-3',  name: 'Ketoconazole Antifungal Shampoo', price: 550,  tags: ['Fungal Infections', 'Dermatitis', 'Pets'], imageType: 'bottle', description: 'Medicated shampoo for Fungal Infections, Ringworm, Rain Rot, and Dermatitis in pets and horses.' },
  { id: 'med-4',  name: 'Iodine Topical Spray',            price: 190,  tags: ['Ringworm', 'Pig', 'Sheep'],            imageType: 'spray',     description: 'Antiseptic iodine spray for Ringworm, Greasy Skin Disease, and open wounds in pigs and sheep.' },
  { id: 'med-5',  name: 'Insecticide Dust (Pyrethrin)',    price: 260,  tags: ['Mite/Lice', 'Poultry', 'Hen'],         imageType: 'powder',    description: 'Poultry-safe dusting powder to eliminate Mites, Lice, and external parasites from hens and coops.' },
  { id: 'med-6',  name: 'Flea & Tick Spot-On',             price: 280,  tags: ['Flea Allergy', 'Prevention', 'Pets'],   imageType: 'drops',     description: 'Topical monthly preventative for Flea Allergy and Hypersensitivity in cats and dogs.' },
  { id: 'med-7',  name: 'Blowfly & Maggot Wound Spray',   price: 340,  tags: ['Myiasis', 'Sheep', 'Livestock'],       imageType: 'spray',     description: 'Insecticidal spray for Myiasis (Blowfly strike) — kills maggots and repels re-infestation in sheep.' },
  // ── Antibiotics / Antimicrobials ──────────────────────────────────────────
  { id: 'med-8',  name: 'Oxytetracycline LA Injection',   price: 850,  tags: ['Anthrax', 'Black Quarter', 'Livestock'], imageType: 'injection', description: 'Long-acting broad-spectrum antibiotic for Anthrax, Black Quarter, Pink Eye, and Respiratory Infections.' },
  { id: 'med-9',  name: 'Penicillin G Injection',         price: 420,  tags: ['Anthrax', 'Strangles', 'Equine'],       imageType: 'injection', description: 'First-line antibiotic for Anthrax, Strangles, Tetanus, and Black Quarter in cattle, horses, and goats.' },
  { id: 'med-10', name: 'Antibiotic Eye Ointment',        price: 210,  tags: ['Pink Eye', 'Cattle', 'Eye'],            imageType: 'ointment',  description: 'Chloramphenicol eye drops/ointment for Pink Eye (Infectious Bovine Keratoconjunctivitis) in cattle.' },
  { id: 'med-11', name: 'Mastitis Intramammary Tube',     price: 380,  tags: ['Mastitis', 'Dairy', 'Cattle'],         imageType: 'tube',      description: 'Cephalosporin-based antibiotic tube for Mastitis in dairy cows, buffalo, and goats.' },
  { id: 'med-12', name: 'Antimicrobial Shampoo',          price: 430,  tags: ['Rain Rot', 'Skin', 'Equine'],          imageType: 'bottle',    description: 'Chlorhexidine shampoo for Rain Rot, Bacterial Dermatosis, Greasy Skin Disease, and surface infections.' },
  { id: 'med-13', name: 'Zinc Sulfate Foot Bath',         price: 310,  tags: ['Foot Rot', 'Hoof', 'Livestock'],       imageType: 'solution',  description: 'Foot bath solution for Foot Rot prevention and treatment in cattle, sheep, and goats.' },
  // ── Vaccines ──────────────────────────────────────────────────────────────
  { id: 'med-14', name: 'FMD Vaccine',                    price: 1200, tags: ['FMD', 'Viral', 'Livestock'],           imageType: 'vaccine',   description: 'Trivalent vaccine preventing Foot and Mouth Disease (FMD) in cloven-hoofed livestock.' },
  { id: 'med-15', name: 'Lumpy Skin Disease Vaccine',     price: 950,  tags: ['Lumpy Skin', 'Viral', 'Livestock'],   imageType: 'vaccine',   description: 'Live attenuated vaccine protecting cattle from Lumpy Skin Disease (Capripoxvirus).' },
  { id: 'med-16', name: 'Newcastle Disease Vaccine',      price: 520,  tags: ['Newcastle', 'Poultry', 'Hen'],        imageType: 'vaccine',   description: 'Oral/intranasal vaccine for Newcastle Disease (Ranikhet) in poultry and hens.' },
  { id: 'med-17', name: 'Fowl Pox Vaccine',               price: 480,  tags: ['Fowl Pox', 'Poultry', 'Hen'],        imageType: 'vaccine',   description: 'Wing-web vaccination to protect hens and poultry from Fowl Pox (Avipoxvirus).' },
  { id: 'med-18', name: 'Anthrax Spore Vaccine',          price: 890,  tags: ['Anthrax', 'Cattle', 'Bull'],          imageType: 'vaccine',   description: 'Annual preventive vaccine for Anthrax in cattle, buffalo, and bulls in endemic regions.' },
  { id: 'med-19', name: 'Equine Influenza Vaccine',       price: 1050, tags: ['Equine Influenza', 'Equine', 'Strangles'], imageType: 'vaccine', description: 'Bivalent vaccine for Equine Influenza in horses, donkeys, and ponies.' },
  { id: 'med-20', name: 'Tetanus Toxoid Vaccine',         price: 410,  tags: ['Tetanus', 'Equine', 'Livestock'],     imageType: 'vaccine',   description: 'Prevents Tetanus (Clostridium tetani) in horses, cattle, and all livestock with wound exposure.' },
  // ── Anti-Parasitics / Anti-Protozoan ──────────────────────────────────────
  { id: 'med-21', name: 'Suramin Injection',              price: 1100, tags: ['Trypanosomiasis', 'Camel', 'Equine'],  imageType: 'injection', description: 'Trypanocidal drug for Trypanosomiasis (Surra) in Camels, Horses, and Donkeys.' },
  { id: 'med-22', name: 'Diminazene Aceturate Injection', price: 760,  tags: ['Trypanosomiasis', 'Livestock', 'Camel'], imageType: 'injection', description: 'Antiprotozoal injection for Trypanosomiasis and Babesiosis in all livestock.' },
  { id: 'med-23', name: 'Broad-Spectrum Dewormer',        price: 180,  tags: ['Parasites', 'Worms', 'Livestock'],    imageType: 'tablet',    description: 'Oral dewormer (Albendazole) for roundworms, tapeworms, and flukes in all livestock.' },
  // ── Anti-Inflammatories / Supportive ─────────────────────────────────────
  { id: 'med-24', name: 'Anti-Inflammatory Paste (NSAID)', price: 640, tags: ['Equine Influenza', 'Strangles', 'Equine'], imageType: 'paste', description: 'Phenylbutazone paste for fever and pain in Equine Influenza, Strangles, and Respiratory disease.' },
  { id: 'med-25', name: 'Antipyretic Injection',          price: 290,  tags: ['Fever', 'General Infection', 'Livestock'], imageType: 'injection', description: 'Meloxicam-based injection to reduce high fever in Lumpy Skin, Black Quarter, and general infections.' },
  { id: 'med-26', name: 'Anti-Bloat Drench (Simethicone)', price: 220, tags: ['Bloat', 'Buffalo', 'Cattle'],         imageType: 'solution',  description: 'Immediate relief for rumen Bloat in buffalo, cattle, and goats — disperses trapped gas quickly.' },
  { id: 'med-27', name: 'Oral Rehydration Salts (ORS)',   price: 150,  tags: ['Recovery', 'Fever', 'Livestock'],     imageType: 'sachet',    description: 'Electrolyte formula to prevent dehydration in diarrhoea, fever, and post-infection recovery.' },
  { id: 'med-28', name: 'Vitamin A + D3 Injection',       price: 310,  tags: ['Fungal Infections', 'Poultry', 'Feather Loss'], imageType: 'injection', description: 'Boosts immunity and promotes skin healing in Fungal Infections, Feather Loss, and nutritional deficiency.' },
  // ── Specialty ─────────────────────────────────────────────────────────────
  { id: 'med-29', name: 'Atropine Eye Drops',             price: 180,  tags: ['Uveitis', 'Eye', 'Equine'],           imageType: 'drops',     description: 'Mydriatic drops for Equine Recurrent Uveitis (Moon Blindness) — reduces pain and inflammation.' },
  { id: 'med-30', name: 'Tetanus Antitoxin',              price: 950,  tags: ['Tetanus', 'Emergency', 'Equine'],     imageType: 'injection', description: 'Emergency antitoxin for acute Tetanus treatment in horses, cattle, and goats.' },
  { id: 'med-31', name: 'Antihistamine Injection',        price: 370,  tags: ['Hypersensitivity', 'Allergy', 'Pets'], imageType: 'injection', description: 'Chlorpheniramine injection for Hypersensitivity, Flea Allergy, and allergic Dermatitis reactions.' },
  { id: 'med-32', name: 'Lime Sulfur Dip',                price: 290,  tags: ['Mange', 'Ringworm', 'Pets'],         imageType: 'bottle',    description: 'Classic acaricidal dip for Mange-Scabies, Ringworm, and skin mite infestations in cats and small animals.' },
];

// Type-colour map for visual variety
const TYPE_COLORS: Record<string, string> = {
  injection: 'from-blue-500/20 to-blue-600/10 border-blue-400/30',
  bottle:    'from-emerald-500/20 to-emerald-600/10 border-emerald-400/30',
  vaccine:   'from-purple-500/20 to-purple-600/10 border-purple-400/30',
  spray:     'from-cyan-500/20 to-cyan-600/10 border-cyan-400/30',
  powder:    'from-amber-500/20 to-amber-600/10 border-amber-400/30',
  drops:     'from-pink-500/20 to-pink-600/10 border-pink-400/30',
  paste:     'from-orange-500/20 to-orange-600/10 border-orange-400/30',
  solution:  'from-teal-500/20 to-teal-600/10 border-teal-400/30',
  tube:      'from-red-500/20 to-red-600/10 border-red-400/30',
  tablet:    'from-lime-500/20 to-lime-600/10 border-lime-400/30',
  sachet:    'from-yellow-500/20 to-yellow-600/10 border-yellow-400/30',
  ointment:  'from-violet-500/20 to-violet-600/10 border-violet-400/30',
};

const TYPE_ICON_COLOR: Record<string, string> = {
  injection: 'text-blue-400',
  bottle:    'text-emerald-400',
  vaccine:   'text-purple-400',
  spray:     'text-cyan-400',
  powder:    'text-amber-400',
  drops:     'text-pink-400',
  paste:     'text-orange-400',
  solution:  'text-teal-400',
  tube:      'text-red-400',
  tablet:    'text-lime-400',
  sachet:    'text-yellow-400',
  ointment:  'text-violet-400',
};

export default function MedicinesPage() {
  const { language } = useLanguage();
  const searchParams = useSearchParams();
  const { items, addItem, removeItem, updateQty, clearCart, placeOrder, totalCount, totalPrice } = useCart();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [addedId, setAddedId] = useState<string | null>(null);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const highlightRef = useRef<HTMLDivElement | null>(null);

  // On mount: read ?search= param from URL (set by diagnosis "Buy Now")
  useEffect(() => {
    const q = searchParams.get('search');
    if (q) setSearchTerm(q);
  }, [searchParams]);

  // Scroll to highlighted card when search is set from URL
  useEffect(() => {
    if (highlightRef.current) {
      setTimeout(() => highlightRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300);
    }
  }, [searchTerm]);

  const allTags = Array.from(new Set(MEDICINES.flatMap(m => m.tags)));

  const filteredMedicines = MEDICINES.filter(med => {
    const matchesSearch = !searchTerm ||
      med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesTag = selectedTag ? med.tags.includes(selectedTag) : true;
    return matchesSearch && matchesTag;
  });

  const handleAddToCart = (med: typeof MEDICINES[0]) => {
    addItem({ id: med.id, name: med.name, price: med.price, type: med.imageType, description: med.description });
    setAddedId(med.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  const isInCart = (id: string) => items.some(i => i.id === id);
  const cartQty = (id: string) => items.find(i => i.id === id)?.quantity ?? 0;

  const handlePlaceOrder = () => {
    placeOrder();           // saves to order history in context + localStorage
    setOrderPlaced(true);
    setTimeout(() => { setOrderPlaced(false); setCartOpen(false); }, 3000);
  };

  return (
    <main className="flex-1 py-8 bg-transparent min-h-screen page-enter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header ────────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 animate-slide-down">
          <div>
            <Link href="/dashboard" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-4">
              <ArrowLeft size={20} />
              {getTranslation(language, 'common.back') || 'Back to Dashboard'}
            </Link>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Veterinary Medicine Store</h1>
            <p className="text-muted-foreground mt-2">Browse preventative care and treatments for common animal diseases.</p>
          </div>

          {/* Cart Button with live badge */}
          <button
            onClick={() => setCartOpen(true)}
            className="relative inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-3 rounded-xl font-semibold text-sm shadow-lg hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 shrink-0 animate-pulse-glow"
          >
            <ShoppingCart size={20} />
            View Cart
            {totalCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow">
                {totalCount}
              </span>
            )}
          </button>
        </div>

        {/* ── Search & Filter ───────────────────────────────────────────── */}
        <Card className="p-4 mb-8 bg-card border-border flex flex-col md:flex-row gap-4 items-center shadow-sm animate-fade-up delay-100">
          <div className="relative flex-1 w-full flex items-center">
            <Search className="absolute left-3 text-muted-foreground" size={20} />
            <Input
              placeholder="Search by medicine name or disease..."
              className="pl-10 h-12"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="absolute right-3 text-muted-foreground hover:text-foreground">
                <X size={16} />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto scrollbar-hide">
            <Filter size={18} className="text-muted-foreground mr-1 hidden sm:block shrink-0" />
            <Badge
              variant={selectedTag === null ? 'default' : 'outline'}
              className="cursor-pointer whitespace-nowrap min-w-max"
              onClick={() => setSelectedTag(null)}
            >All</Badge>
            {allTags.map(tag => (
              <Badge
                key={tag}
                variant={selectedTag === tag ? 'default' : 'outline'}
                className="cursor-pointer whitespace-nowrap min-w-max"
                onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
              >{tag}</Badge>
            ))}
          </div>
        </Card>

        {/* ── Medicine Grid ─────────────────────────────────────────────── */}
        {filteredMedicines.length === 0 ? (
          <div className="text-center py-20 bg-card rounded-xl border border-border">
            <Pill size={48} className="mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Medicines Found</h3>
            <p className="text-muted-foreground">Try adjusting your search or category filters.</p>
            <Button variant="outline" className="mt-4" onClick={() => { setSearchTerm(''); setSelectedTag(null); }}>Clear Filters</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMedicines.map(med => {
              const inCart = isInCart(med.id);
              const qty = cartQty(med.id);
              const justAdded = addedId === med.id;
              const colorClass = TYPE_COLORS[med.imageType] || TYPE_COLORS['injection'];
              const iconColor = TYPE_ICON_COLOR[med.imageType] || 'text-primary';
              // Highlight if it's the first result from a URL search
              const isHighlighted = searchTerm && med.id === filteredMedicines[0]?.id;

              return (
                <div
                  key={med.id}
                  ref={isHighlighted ? highlightRef : null}
                  className={`flex flex-col rounded-2xl border bg-card overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover-lift animate-scale-pop delay-${Math.min((filteredMedicines.indexOf(med) % 6) * 100 + 100, 600)} ${isHighlighted ? 'ring-2 ring-primary shadow-primary/20 shadow-lg' : 'border-border'}`}
                >
                  {/* Visual top panel */}
                  <div className={`w-full h-36 bg-gradient-to-br ${colorClass} border-b flex flex-col items-center justify-center gap-2`}>
                    <Pill size={40} className={iconColor} />
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${iconColor}`}>{med.imageType}</span>
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-bold text-foreground mb-1 leading-tight">{med.name}</h3>
                    <p className="text-sm text-muted-foreground flex-1 mb-3 line-clamp-3">{med.description}</p>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {med.tags.map(t => (
                        <span key={t} className="text-[10px] px-2 py-0.5 bg-primary/10 text-primary rounded-full font-medium">{t}</span>
                      ))}
                    </div>

                    <div className="mt-auto pt-4 border-t border-border/50">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xl font-bold font-mono">₹{med.price}</span>
                        {inCart && (
                          <span className="text-xs text-green-600 font-semibold flex items-center gap-1">
                            <CheckCircle size={12} /> In cart ×{qty}
                          </span>
                        )}
                      </div>

                      {inCart ? (
                        /* Quantity control row */
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQty(med.id, qty - 1)}
                            className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-destructive/10 hover:border-destructive hover:text-destructive transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="flex-1 text-center font-bold text-lg">{qty}</span>
                          <button
                            onClick={() => updateQty(med.id, qty + 1)}
                            className="w-8 h-8 rounded-lg border border-primary/50 flex items-center justify-center hover:bg-primary/10 text-primary transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                          <button
                            onClick={() => removeItem(med.id)}
                            className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-red-50 hover:text-red-500 hover:border-red-300 transition-colors ml-1"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ) : (
                        <Button
                          onClick={() => handleAddToCart(med)}
                          className={`w-full gap-2 transition-all ${justAdded ? 'bg-green-600 hover:bg-green-700' : ''}`}
                        >
                          {justAdded ? <><CheckCircle size={16} /> Added!</> : <><ShoppingCart size={16} /> Add to Cart</>}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Cart Drawer Overlay ───────────────────────────────────────────── */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div className="flex-1 bg-black/50 backdrop-blur-sm" onClick={() => setCartOpen(false)} />

          {/* Drawer panel */}
          <div className="w-full max-w-md bg-background border-l border-border flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
            {/* Drawer header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <ShoppingBag size={22} className="text-primary" />
                Your Cart
                {totalCount > 0 && (
                  <span className="bg-primary/10 text-primary text-sm px-2 py-0.5 rounded-full font-medium">
                    {totalCount} item{totalCount !== 1 ? 's' : ''}
                  </span>
                )}
              </h2>
              <button onClick={() => setCartOpen(false)} className="p-2 hover:bg-accent rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Cart body */}
            <div className="flex-1 overflow-y-auto p-6">
              {orderPlaced ? (
                <div className="flex flex-col items-center justify-center h-full text-center gap-4 py-20">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle size={32} className="text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-green-700">Order Placed!</h3>
                  <p className="text-muted-foreground">Your order has been confirmed. A veterinary supplier will contact you shortly.</p>
                </div>
              ) : items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center gap-4 py-20">
                  <Package size={48} className="text-muted-foreground/30" />
                  <h3 className="text-lg font-semibold text-muted-foreground">Your cart is empty</h3>
                  <p className="text-sm text-muted-foreground">Add medicines from the store to get started.</p>
                  <Button variant="outline" onClick={() => setCartOpen(false)}>Browse Medicines</Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map(item => (
                    <div key={item.id} className="flex gap-4 p-4 rounded-xl border border-border bg-card">
                      {/* Icon */}
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${TYPE_COLORS[item.type] || TYPE_COLORS['injection']} border flex items-center justify-center shrink-0`}>
                        <Pill size={20} className={TYPE_ICON_COLOR[item.type] || 'text-primary'} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-foreground truncate">{item.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">₹{item.price} × {item.quantity}</p>
                        {/* Qty controls */}
                        <div className="flex items-center gap-2 mt-2">
                          <button onClick={() => updateQty(item.id, item.quantity - 1)} className="w-6 h-6 rounded border border-border flex items-center justify-center hover:bg-destructive/10 hover:text-destructive transition-colors text-sm">
                            <Minus size={12} />
                          </button>
                          <span className="w-6 text-center font-bold text-sm">{item.quantity}</span>
                          <button onClick={() => updateQty(item.id, item.quantity + 1)} className="w-6 h-6 rounded border border-primary/50 flex items-center justify-center hover:bg-primary/10 text-primary transition-colors text-sm">
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-col items-end justify-between">
                        <button onClick={() => removeItem(item.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                          <Trash2 size={16} />
                        </button>
                        <span className="font-bold text-sm font-mono">₹{item.price * item.quantity}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Cart footer */}
            {!orderPlaced && items.length > 0 && (
              <div className="p-6 border-t border-border space-y-4 bg-card/50">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Subtotal ({totalCount} items)</span>
                  <span className="font-bold text-lg font-mono">₹{totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Delivery</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <div className="h-px bg-border" />
                <div className="flex items-center justify-between">
                  <span className="font-bold text-lg">Total</span>
                  <span className="font-bold text-xl font-mono text-primary">₹{totalPrice.toLocaleString()}</span>
                </div>
                <Button className="w-full h-12 text-base gap-2 font-semibold" onClick={handlePlaceOrder}>
                  <ShoppingBag size={18} />
                  Place Order
                </Button>
                <Button variant="outline" className="w-full bg-transparent" onClick={() => { clearCart(); }}>
                  Clear Cart
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  ⚠️ Always consult a veterinarian before administering medicines.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
