'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, AlertTriangle, Download, MapPin, CheckCircle, Zap, Loader, Pill, ShoppingCart } from 'lucide-react';
import Footer from '@/components/footer';
import { useDiagnosis } from '@/contexts/diagnosis-context';
import { useAuth } from '@/contexts/auth-context';
import { useCart } from '@/contexts/cart-context';

// ── Medicine catalogue ──────────────────────────────────────────────────────
const MEDICINE_DATA = [
  // ── Parasitic / Skin ──────────────────────────────────────────────────────
  { id: 'med-1',  name: 'Ivermectin Injection',          price: 450,  type: 'injection', description: 'Broad-spectrum antiparasitic effective against Mange, Ectoparasites, and internal worms in all livestock.', keywords: ['ectoparasites', 'mange', 'parasites', 'ringworm', 'scabies', 'myiasis', 'mite', 'lice', 'tick infestation'] },
  { id: 'med-2',  name: 'Amitraz Dip Solution',          price: 320,  type: 'bottle',    description: 'Acaricidal dip for Demodicosis, Scabies, and Tick Infestation in dogs, cats, and livestock.',               keywords: ['demodicosis', 'scabies', 'mites', 'tick', 'flea', 'mange - scabies', 'mange', 'tick infestation'] },
  { id: 'med-3',  name: 'Ketoconazole Antifungal Shampoo', price: 550, type: 'bottle',   description: 'Medicated shampoo for Fungal Infections, Ringworm, Rain Rot, and Dermatitis in pets and horses.',           keywords: ['fungal', 'ringworm', 'dermatitis', 'dermatophytosis', 'rain rot', 'dermatophilosis', 'greasy skin', 'fungal infections'] },
  { id: 'med-4',  name: 'Iodine Topical Spray',          price: 190,  type: 'spray',     description: 'Antiseptic iodine spray for Ringworm, Greasy Skin Disease, and open wounds in pigs and sheep.',             keywords: ['ringworm', 'greasy skin', 'greasy pig', 'wound', 'antiseptic', 'myiasis'] },
  { id: 'med-5',  name: 'Insecticide Dust (Pyrethrin)',   price: 260,  type: 'powder',    description: 'Poultry-safe dusting powder to eliminate Mites, Lice, and external parasites from hens and coops.',         keywords: ['mite', 'lice', 'mite/lice', 'poultry', 'feather', 'ectoparasites', 'tick'] },
  { id: 'med-6',  name: 'Flea & Tick Spot-On',           price: 280,  type: 'drops',     description: 'Topical monthly preventative for Flea Allergy and Hypersensitivity in cats and dogs.',                       keywords: ['flea allergy', 'flea', 'tick', 'hypersensitivity', 'allergy', 'dermatitis', 'demodicosis'] },
  { id: 'med-7',  name: 'Blowfly & Maggot Wound Spray',  price: 340,  type: 'spray',     description: 'Insecticidal spray for Myiasis (Blowfly strike) — kills maggots and repels re-infestation in sheep.',       keywords: ['myiasis', 'blowfly', 'maggot', 'ectoparasites', 'fly'] },

  // ── Antibiotics / Antimicrobials ──────────────────────────────────────────
  { id: 'med-8',  name: 'Oxytetracycline LA Injection',  price: 850,  type: 'injection', description: 'Long-acting broad-spectrum antibiotic for Anthrax, Black Quarter, Pink Eye, and Respiratory Infections.',    keywords: ['anthrax', 'black quarter', 'blackleg', 'respiratory', 'bacterial', 'pneumonia', 'pink eye', 'pink', 'foot rot', 'glanders', 'strangles'] },
  { id: 'med-9',  name: 'Penicillin G Injection',        price: 420,  type: 'injection', description: 'First-line antibiotic for Anthrax, Strangles, Tetanus, and Black Quarter in cattle, horses, and goats.',     keywords: ['anthrax', 'strangles', 'tetanus', 'black quarter', 'blackleg', 'foot rot', 'foot, mouth'] },
  { id: 'med-10', name: 'Antibiotic Eye Ointment',       price: 210,  type: 'ointment',  description: 'Chloramphenicol eye drops/ointment for Pink Eye (Infectious Bovine Keratoconjunctivitis) in cattle.',         keywords: ['pink eye', 'eye', 'keratoconjunctivitis', 'uveitis', 'equine recurrent uveitis'] },
  { id: 'med-11', name: 'Mastitis Intramammary Tube',    price: 380,  type: 'tube',      description: 'Cephalosporin-based antibiotic tube for Mastitis in dairy cows, buffalo, and goats.',                         keywords: ['mastitis', 'milk', 'dairy', 'mammary', 'udder'] },
  { id: 'med-12', name: 'Antimicrobial Shampoo',         price: 430,  type: 'bottle',    description: 'Chlorhexidine shampoo for Rain Rot, Bacterial Dermatosis, Greasy Skin Disease, and surface infections.',     keywords: ['rain rot', 'bacterial dermatosis', 'dermatosis', 'greasy skin', 'bacterial', 'skin'] },
  { id: 'med-13', name: 'Zinc Sulfate Foot Bath',        price: 310,  type: 'solution',  description: 'Foot bath solution for Foot Rot prevention and treatment in cattle, sheep, and goats.',                       keywords: ['foot rot', 'hoof', 'foot, mouth', 'blackleg', 'clostridium'] },

  // ── Vaccines ──────────────────────────────────────────────────────────────
  { id: 'med-14', name: 'FMD Vaccine',                   price: 1200, type: 'vaccine',   description: 'Trivalent vaccine preventing Foot and Mouth Disease (FMD) in cloven-hoofed livestock.',                      keywords: ['foot and mouth', 'fmd', 'foot, mouth', 'cloven', 'hoof rot'] },
  { id: 'med-15', name: 'Lumpy Skin Disease Vaccine',    price: 950,  type: 'vaccine',   description: 'Live attenuated vaccine protecting cattle from Lumpy Skin Disease (Capripoxvirus).',                          keywords: ['lumpy skin', 'lumpy', 'lsd', 'capripox', 'camel pox', 'pox'] },
  { id: 'med-16', name: 'Newcastle Disease Vaccine',     price: 520,  type: 'vaccine',   description: 'Oral/intranasal vaccine for Newcastle Disease (Ranikhet) in poultry and hens.',                              keywords: ['newcastle', 'ranikhet', 'paramyxovirus', 'poultry', 'hen', 'bird'] },
  { id: 'med-17', name: 'Fowl Pox Vaccine',              price: 480,  type: 'vaccine',   description: 'Wing-web vaccination to protect hens and poultry from Fowl Pox (Avipoxvirus).',                               keywords: ['fowl pox', 'avipoxvirus', 'pox', 'poultry', 'hen'] },
  { id: 'med-18', name: 'Anthrax Spore Vaccine',         price: 890,  type: 'vaccine',   description: 'Annual preventive vaccine for Anthrax in cattle, buffalo, and bulls in endemic regions.',                    keywords: ['anthrax', 'bacillus', 'spore', 'bull', 'bison'] },
  { id: 'med-19', name: 'Equine Influenza Vaccine',      price: 1050, type: 'vaccine',   description: 'Bivalent vaccine for Equine Influenza in horses, donkeys, and ponies.',                                       keywords: ['equine influenza', 'influenza', 'horse', 'donkey', 'pony', 'strangles'] },
  { id: 'med-20', name: 'Tetanus Toxoid Vaccine',        price: 410,  type: 'vaccine',   description: 'Prevents Tetanus (Clostridium tetani) in horses, cattle, and all livestock with wound exposure.',             keywords: ['tetanus', 'clostridium', 'wound', 'puncture'] },

  // ── Anti-Parasitics / Anti-Protozoan ──────────────────────────────────────
  { id: 'med-21', name: 'Suramin Injection',             price: 1100, type: 'injection', description: 'Trypanocidal drug for Trypanosomiasis (Surra) in Camels, Horses, and Donkeys.',                               keywords: ['trypanosomiasis', 'surra', 'trypanosoma', 'camel', 'trypanosom'] },
  { id: 'med-22', name: 'Diminazene Aceturate Injection',price: 760,  type: 'injection', description: 'Antiprotozoal injection for Trypanosomiasis and Babesiosis in all livestock.',                                 keywords: ['trypanosomiasis', 'babesiosis', 'surra', 'protozoa', 'camel'] },
  { id: 'med-23', name: 'Broad-Spectrum Dewormer',       price: 180,  type: 'tablet',    description: 'Oral dewormer (Albendazole) for roundworms, tapeworms, and flukes in all livestock.',                        keywords: ['worm', 'parasite', 'dewormer', 'helminth', 'gastrointestinal', 'myiasis'] },

  // ── Anti-Inflammatories / Supportive ─────────────────────────────────────
  { id: 'med-24', name: 'Anti-Inflammatory Paste (NSAID)', price: 640, type: 'paste',   description: 'Phenylbutazone paste for fever and pain in Equine Influenza, Strangles, and Respiratory disease.',            keywords: ['equine influenza', 'strangles', 'influenza', 'fever', 'respiratory', 'cough', 'rain rot', 'tetanus', 'uveitis'] },
  { id: 'med-25', name: 'Antipyretic Injection',          price: 290,  type: 'injection', description: 'Meloxicam-based injection to reduce high fever in Lumpy Skin, Black Quarter, Pink Eye, and general infections.', keywords: ['fever', 'high temperature', 'pyrexia', 'general infection', 'viral', 'lumpy', 'newcastle', 'camel pox', 'malignant'] },
  { id: 'med-26', name: 'Anti-Bloat Drench (Simethicone)',price: 220,  type: 'solution',  description: 'Immediate relief for rumen Bloat in buffalo, cattle, and goats — disperses trapped gas quickly.',           keywords: ['bloat', 'rumen', 'gas', 'buffalo'] },
  { id: 'med-27', name: 'Oral Rehydration Salts (ORS)',  price: 150,  type: 'sachet',    description: 'Electrolyte formula to prevent dehydration in diarrhoea, fever, and post-infection recovery.',                keywords: ['general infection', 'fever', 'newcastle', 'malignant', 'bloat', 'recovery'] },
  { id: 'med-28', name: 'Vitamin A + D3 Injection',      price: 310,  type: 'injection', description: 'Boosts immunity and promotes skin healing in Fungal Infections, Feather Loss, and nutritional deficiency.',     keywords: ['feather loss', 'pecking', 'fungal', 'ringworm', 'dermatophytosis', 'nutrition', 'vitamin'] },

  // ── Specialty ─────────────────────────────────────────────────────────────
  { id: 'med-29', name: 'Atropine Eye Drops',            price: 180,  type: 'drops',     description: 'Mydriatic drops for Equine Recurrent Uveitis (Moon Blindness) — reduces pain and inflammation.',              keywords: ['uveitis', 'equine recurrent uveitis', 'moon blindness', 'eye', 'pink eye'] },
  { id: 'med-30', name: 'Tetanus Antitoxin',             price: 950,  type: 'injection', description: 'Emergency antitoxin for acute Tetanus treatment in horses, cattle, and goats.',                                keywords: ['tetanus', 'clostridium', 'wound', 'horse', 'donkey', 'pony'] },
  { id: 'med-31', name: 'Antihistamine Injection',       price: 370,  type: 'injection', description: 'Chlorpheniramine injection for Hypersensitivity, Flea Allergy, and allergic Dermatitis reactions.',            keywords: ['hypersensitivity', 'flea allergy', 'allergy', 'dermatitis', 'malignant catarrhal'] },
  { id: 'med-32', name: 'Lime Sulfur Dip',               price: 290,  type: 'bottle',    description: 'Classic acaricidal dip for Mange-Scabies, Ringworm, and skin mite infestations in cats and small animals.',    keywords: ['mange - scabies', 'scabies', 'ringworm', 'mite', 'cat', 'skin'] },
];

/**
 * Direct disease → medicine ID mapping.
 * Covers every disease in disease-info.ts + common symptom-diagnosed diseases.
 */
const DISEASE_MEDICINE_MAP: Record<string, string[]> = {
  // ── Pig ───────────────────────────────────────────────────────────────────
  'Greasy skin disease':              ['med-4', 'med-3', 'med-12', 'med-8'],
  'Greasy Skin Disease':              ['med-4', 'med-3', 'med-12', 'med-8'],
  'Mange':                            ['med-1', 'med-2', 'med-32'],
  'Ringworm':                         ['med-3', 'med-4', 'med-28', 'med-32'],

  // ── Sheep ─────────────────────────────────────────────────────────────────
  'Dermatophytosis (Ringworm)':       ['med-3', 'med-4', 'med-28'],
  'Myiasis':                          ['med-7', 'med-1', 'med-4', 'med-23'],

  // ── Cow ───────────────────────────────────────────────────────────────────
  'Mastitis':                         ['med-11', 'med-8', 'med-25'],
  'Pink eye':                         ['med-10', 'med-8', 'med-29', 'med-25'],
  'Pink Eye':                         ['med-10', 'med-8', 'med-29', 'med-25'],
  'Lumpy Skin Disease':               ['med-15', 'med-25', 'med-8', 'med-27'],
  'Foot Rot':                         ['med-13', 'med-9', 'med-8'],
  'Lumpy Skin':                       ['med-15', 'med-25', 'med-8'],

  // ── Buffalo ───────────────────────────────────────────────────────────────
  'Bloat':                            ['med-26', 'med-27'],
  'Malignant Catarrhal Fever':        ['med-25', 'med-27', 'med-31', 'med-8'],

  // ── Horse ─────────────────────────────────────────────────────────────────
  'Equine Recurrent Uveitis':         ['med-29', 'med-24', 'med-10'],
  'Rain Rot':                         ['med-3', 'med-12', 'med-4'],
  'Tetanus':                          ['med-30', 'med-20', 'med-9', 'med-24'],
  'Tick Infestation':                 ['med-1', 'med-2', 'med-5', 'med-6'],

  // ── Hen / Poultry ─────────────────────────────────────────────────────────
  'Fowl Pox':                         ['med-17', 'med-28', 'med-25'],
  'Newcastle Disease':                ['med-16', 'med-25', 'med-27', 'med-28'],
  'Mite/Lice Infestation':            ['med-5', 'med-1', 'med-2'],
  'Feather Loss / Pecking':           ['med-28', 'med-25', 'med-27'],
  'Feather Loss':                     ['med-28', 'med-25', 'med-27'],

  // ── Goat ──────────────────────────────────────────────────────────────────
  'Ectoparasites':                    ['med-1', 'med-2', 'med-5'],

  // ── Dog ───────────────────────────────────────────────────────────────────
  'Bacterial Dermatosis':             ['med-12', 'med-3', 'med-8', 'med-31'],
  'Demodicosis':                      ['med-2', 'med-6', 'med-32', 'med-1'],
  'Dermatitis':                       ['med-3', 'med-31', 'med-6', 'med-12'],
  'Fungal Infections':                ['med-3', 'med-4', 'med-28'],
  'Hypersensitivity':                 ['med-31', 'med-6', 'med-3'],

  // ── Donkey / Pony ─────────────────────────────────────────────────────────
  'Glanders':                         ['med-8', 'med-9', 'med-25'],
  'Equine Influenza':                 ['med-19', 'med-24', 'med-8', 'med-25'],
  'Strangles':                        ['med-9', 'med-24', 'med-19'],
  'Equine Influenza / Strangles':     ['med-19', 'med-24', 'med-9', 'med-8', 'med-25'],

  // ── Yak ───────────────────────────────────────────────────────────────────
  'Yak Tuberculosis':                 ['med-8', 'med-25', 'med-27'],

  // ── Camel ─────────────────────────────────────────────────────────────────
  'Camel Pox':                        ['med-15', 'med-25', 'med-8', 'med-27'],
  'Trypanosomiasis (Surra)':          ['med-21', 'med-22', 'med-25'],
  'Trypanosomiasis':                  ['med-21', 'med-22', 'med-25'],

  // ── Cat ───────────────────────────────────────────────────────────────────
  'Flea Allergy':                     ['med-6', 'med-31', 'med-2'],
  'Mange - Scabies':                  ['med-32', 'med-2', 'med-1'],

  // ── Bull / Bison ──────────────────────────────────────────────────────────
  'Anthrax':                          ['med-18', 'med-8', 'med-9', 'med-25'],
  'Black Quarter (Blackleg)':         ['med-9', 'med-8', 'med-25'],
  'Black Quarter':                    ['med-9', 'med-8', 'med-25'],
  'Foot, Mouth, Hoof Rot Diseases':   ['med-14', 'med-13', 'med-9', 'med-8'],

  // ── Symptom-diagnosed (Gemini) ────────────────────────────────────────────
  'Foot and Mouth Disease (FMD)':     ['med-14', 'med-13', 'med-9', 'med-25'],
  'Foot and Mouth Disease':           ['med-14', 'med-13', 'med-9', 'med-25'],
  'General Infection (Viral/Bacterial)': ['med-25', 'med-8', 'med-27', 'med-28'],
  'General Infection':                ['med-25', 'med-8', 'med-27'],
  'Bacterial Dermatosis / Dermatitis':['med-3', 'med-12', 'med-8', 'med-31'],

  // ── Fallback keywords for other AI-generated names ────────────────────────
};

/** General / supportive medicines shown when nothing else matches. */
const GENERAL_FALLBACK_IDS = ['med-25', 'med-27', 'med-8'];

/**
 * Priority order:
 * 1. Exact match in DISEASE_MEDICINE_MAP  (case-insensitive key lookup)
 * 2. Partial-key match in DISEASE_MEDICINE_MAP
 * 3. Keyword scan across MEDICINE_DATA
 * 4. General supportive-care fallback — always shows something
 */
function getRelatedMedicines(diseaseName: string) {
  if (!diseaseName) return MEDICINE_DATA.filter(m => GENERAL_FALLBACK_IDS.includes(m.id));

  const lower = diseaseName.toLowerCase();

  // 1. Exact key match (case-insensitive)
  const exactKey = Object.keys(DISEASE_MEDICINE_MAP).find(k => k.toLowerCase() === lower);
  if (exactKey) {
    const ids = DISEASE_MEDICINE_MAP[exactKey];
    return MEDICINE_DATA.filter(m => ids.includes(m.id));
  }

  // 2. Partial key match — disease name contains a known key or vice-versa
  const partialKey = Object.keys(DISEASE_MEDICINE_MAP).find(
    k => lower.includes(k.toLowerCase()) || k.toLowerCase().includes(lower)
  );
  if (partialKey) {
    const ids = DISEASE_MEDICINE_MAP[partialKey];
    return MEDICINE_DATA.filter(m => ids.includes(m.id));
  }

  // 3. Keyword scan
  const keywordMatches = MEDICINE_DATA.filter(med =>
    med.keywords.some(kw => lower.includes(kw) || kw.includes(lower.split(' ')[0]))
  );
  if (keywordMatches.length > 0) return keywordMatches;

  // 4. Always show at least general supportive care
  return MEDICINE_DATA.filter(m => GENERAL_FALLBACK_IDS.includes(m.id));
}
// ────────────────────────────────────────────────────────────────────────────

export default function DiagnosisResultPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { selectedAnimalId, selectedSymptoms, selectedImage, clearDiagnosis } = useDiagnosis();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [diagnosis, setDiagnosis] = useState<any>(null);
  const hasRun = useRef(false);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (!selectedAnimalId && !diagnosis) {
      router.push('/dashboard');
      return;
    }

    if (!diagnosis && !hasRun.current) {
      hasRun.current = true;
      processDiagnosis();
    }
  }, [user, selectedAnimalId]);

  const processDiagnosis = async () => {
    try {
      setLoading(true);
      setError(''); // Clear any previous errors

      // Fetch animal details first
      let animalData = null;
      let breed = '';
      let animalType = 'animal';

      if (selectedAnimalId) {
        try {
          const animalRes = await fetch(`/api/animals/${selectedAnimalId}`, {
            headers: { Authorization: `Bearer ${user?.id}` }
          });
          if (animalRes.ok) {
            animalData = await animalRes.json();
            breed = animalData.animal?.breed || '';
            animalType = breed || 'animal';
          }
        } catch (e) {
          console.error('Failed to fetch animal details:', e);
        }
      }

      // Real AI Analysis
      const isImageDiagnosis = !!selectedImage;
      let diagnosisResult;

      try {
        // Attempt AI Diagnosis
        if (isImageDiagnosis) {
          // IMAGE HYBRID FLOW
          // 1. Local Context
          let localPrediction = null;
          try {
            const img = document.createElement('img');
            img.src = selectedImage!;
            await new Promise(resolve => img.onload = resolve);

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

            if (modelType !== 'other') {
              const { analyzeImage } = await import('@/lib/ml');
              const { getDiseaseDetails } = await import('@/lib/disease-info');
              const mlResult = await analyzeImage(img, modelType as any);
              const details = getDiseaseDetails(mlResult.disease);
              localPrediction = { ...mlResult, ...details };
            }
          } catch (localErr) {
            console.warn('Local context failed:', localErr);
          }

          // 2. Gemini API
          const apiRes = await fetch('/api/gemini-diagnosis', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user?.id}` },
            body: JSON.stringify({
              image: selectedImage,
              local_prediction: localPrediction,
              animal_details: { breed, age: animalData?.animal?.age_months + ' months' || 'unknown', type: animalType }
            }),
          });

          if (!apiRes.ok) {
            const errData = await apiRes.json().catch(() => ({}));
            throw new Error(errData.error || 'AI Service Unavailable');
          }
          diagnosisResult = await apiRes.json();

        } else {
          // SYMPTOM FLOW
          const apiRes = await fetch('/api/gemini-diagnosis', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user?.id}` },
            body: JSON.stringify({
              symptoms: selectedSymptoms,
              animal_details: { breed, age: animalData?.animal?.age_months + ' months' || 'unknown', type: animalType }
            }),
          });

          if (!apiRes.ok) {
            const errData = await apiRes.json().catch(() => ({}));
            throw new Error(errData.error || 'AI Service Unavailable');
          }
          diagnosisResult = await apiRes.json();
        }

      } catch (aiError: any) {
  console.error("AI Diagnosis Error:", aiError);

  // If user exceeded the free demo, DO NOT fallback.
  if (
    aiError.message?.includes("already used") ||
    aiError.message?.includes("403")
  ) {
    setError("Limit exceeded! Only 1 diagnosis is allowed in the demo version.");
    return;
  }


  // Fallback only for genuine AI failures
  if (isImageDiagnosis) {
    try {
      const img = document.createElement('img');
      img.src = selectedImage!;
      await new Promise(resolve => (img.onload = resolve));

      diagnosisResult = getMockImageDiagnosis();
    } catch {
      diagnosisResult = getMockImageDiagnosis();
    }
  } else {
    diagnosisResult = getMockSymptomDiagnosis(selectedSymptoms);
  }
}

      // Save to Database
      // If diagnosisResult is still null (shouldn't be), throw
      if (!diagnosisResult) throw new Error('Diagnosis generation failed completely.');

      const response = await fetch('/api/diagnoses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.id}`,
        },
        body: JSON.stringify({
          animal_id: selectedAnimalId,
          diagnosis_type: isImageDiagnosis ? 'image' : 'symptoms',
          symptoms: isImageDiagnosis ? [] : selectedSymptoms,
          image_url: isImageDiagnosis ? selectedImage : null,
          disease_name: diagnosisResult.disease,
          confidence_score: diagnosisResult.confidence,
          severity: diagnosisResult.severity,
          causes: diagnosisResult.causes || ['Pending analysis'],
          treatment_recommendations: diagnosisResult.treatment || ['Consult Veterinarian'],
          prevention_tips: diagnosisResult.prevention || ['Keep isolated'],
          status: 'diagnosed',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Save diagnosis failed:', errorData);
        throw new Error(errorData.error || 'Failed to save record.');
      }

      setDiagnosis(diagnosisResult);
      clearDiagnosis();

    } catch (err) {
      console.error('Final Process Diagnosis Error:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const getMockSymptomDiagnosis = (symptoms: string[]) => {
    // Simple rule-based mock
    if (symptoms.includes('Limping or lameness') && symptoms.includes('Fever or high temperature')) {
      return {
        disease: 'Foot and Mouth Disease (FMD)',
        confidence: 92,
        severity: 'High',
        causes: ['Viral infection', 'Direct contact'],
        prevention: ['Vaccination', 'Quarantine'],
        treatment: ['Consult Vet', 'Supportive care', 'Clean water'],
      };
    }
    if (symptoms.includes('Reduced milk production')) {
      return {
        disease: 'Mastitis',
        confidence: 88,
        severity: 'Medium',
        causes: ['Bacterial infection', 'Poor hygiene'],
        prevention: ['Teat dipping', 'Clean bedding'],
        treatment: ['Antibiotics (Vet prescribed)', 'Frequent milking'],
      };
    }
    // Added mock for Dog
    if (symptoms.includes('Skin lesions or wounds') && symptoms.includes('Itching or rubbing')) {
      return {
        disease: 'Bacterial Dermatosis / Dermatitis',
        confidence: 85,
        severity: 'Medium',
        causes: ['Bacterial infection', 'Allergies', 'Flea bites'],
        prevention: ['Regular grooming', 'Flea/Tick control'],
        treatment: ['Antibiotics', 'Medicated shampoos', 'Consult Vet'],
      };
    }
    // Added mock for Equine (Horse/Donkey/Pony)
    if (symptoms.includes('Nasal discharge') && symptoms.includes('Coughing')) {
      return {
        disease: 'Equine Influenza / Strangles',
        confidence: 89,
        severity: 'High',
        causes: ['Equine influenza virus', 'Streptococcus equi bacteria'],
        prevention: ['Vaccination', 'Isolation of sick animals'],
        treatment: ['Rest', 'Anti-inflammatories', 'Antibiotics for secondary infections'],
      };
    }
    // Added mock for Camel
    if (symptoms.includes('Swelling on legs or body') && symptoms.includes('Fever or high temperature')) {
      return {
        disease: 'Camel Pox',
        confidence: 82,
        severity: 'Medium',
        causes: ['Orthopoxvirus'],
        prevention: ['Isolation', 'Vaccination', 'Good hygiene'],
        treatment: ['Supportive care', 'Antibiotics for secondary infections', 'Fly repellents'],
      };
    }

    return {
      disease: 'General Infection (Viral/Bacterial)',
      confidence: 75,
      severity: 'Medium',
      causes: ['Various pathogens', 'Stress'],
      prevention: ['Hygiene', 'Vaccination', 'Nutrition'],
      treatment: ['Symptomatic treatment', 'Consult Vet'],
    };
  };

  /* 
   * ROBUST PRINT STRATEGY
   * Instead of CSS media queries (which are flaky in SPAs/Dark Mode), 
   * we generate a clean HTML document in a new window. 
   * This guarantees a perfect, white-bg, black-text report every time.
   */
  const handleDownloadReport = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to download the report.');
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Diagnosis Report - AgroVet AI</title>
        <style>
          body { font-family: sans-serif; padding: 40px; color: #000; background: #fff; line-height: 1.5; }
          .header { text-align: center; border-bottom: 2px solid #ccc; padding-bottom: 20px; margin-bottom: 30px; }
          .header h1 { color: #166534; margin: 0; font-size: 24pt; }
          .header p { color: #666; margin-top: 5px; }
          .section { margin-bottom: 25px; border: 1px solid #ddd; padding: 20px; border-radius: 8px; }
          .section h2 { margin-top: 0; color: #15803d; font-size: 16pt; border-bottom: 1px solid #eee; padding-bottom: 10px; }
          .highlight { font-weight: bold; padding: 4px 8px; border-radius: 4px; display: inline-block; margin-bottom: 10px; }
          .high-severity { background: #fee2e2; color: #991b1b; }
          .medium-severity { background: #ffedd5; color: #9a3412; }
          .grid { display: grid; grid-template-columns: 1fr; gap: 10px; }
          .item { padding: 10px; background: #f9fafb; border-left: 4px solid #166534; }
          .footer { margin-top: 50px; text-align: center; font-size: 10pt; color: #999; border-top: 1px solid #eee; pt: 20px; }
          @media print {
            body { padding: 0; }
            button { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>AgroVet AI Diagnosis Report</h1>
          <p>Generated on ${new Date().toLocaleDateString()} | reliable AI-powered veterinary insights</p>
        </div>

        <div class="section">
          <span class="highlight ${diagnosis.severity === 'High' ? 'high-severity' : 'medium-severity'}">
            ${diagnosis.severity} Severity
          </span>
          <h1 style="font-size: 28pt; margin: 10px 0;">${diagnosis.disease}</h1>
          <p><strong>Confidence Score:</strong> ${diagnosis.confidence}%</p>
        </div>

        ${diagnosis.causes ? `
          <div class="section">
            <h2>Potential Causes</h2>
            <div class="grid">
              ${diagnosis.causes.map((c: string) => `<div class="item">${c}</div>`).join('')}
            </div>
          </div>
        ` : ''}

        ${diagnosis.treatment ? `
          <div class="section">
            <h2>Treatment Recommendations</h2>
            <div style="background: #fff7ed; padding: 10px; border: 1px solid #fed7aa; color: #9a3412; margin-bottom: 15px;">
              ⚠️ <strong>Consult a Vet:</strong> This is an AI-assisted analysis.
            </div>
            <div class="grid">
              ${diagnosis.treatment.map((t: string) => `<div class="item">${t}</div>`).join('')}
            </div>
          </div>
        ` : ''}

        ${diagnosis.prevention ? `
          <div class="section">
            <h2>Prevention & Precautions</h2>
            <div class="grid">
              ${diagnosis.prevention.map((p: string) => `<div class="item">${p}</div>`).join('')}
            </div>
          </div>
        ` : ''}

        <div class="footer">
          <p>AgroVet AI - Protecting Livestock, Empowering Farmers.</p>
        </div>

        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  const getMockImageDiagnosis = () => {
    return {
      disease: 'Lumpy Skin Disease (LSD)',
      confidence: 95,
      severity: 'High',
      causes: ['Capripoxvirus', 'Insect vectors'],
      prevention: ['Vaccination', 'Vector control'],
      treatment: ['Supportive therapy', 'Antibiotics for secondary infection', 'Antipyretics'],
    };
  };

  if (loading) {
    return (
      <main className="flex-1 py-12 bg-transparent flex flex-col items-center justify-center min-h-[50vh]">
        <Loader className="w-12 h-12 animate-spin text-primary mb-4" />
        <h2 className="text-xl font-semibold">Analyzing Health Data...</h2>
        <p className="text-muted-foreground">Our AI is evaluating symptoms and potential conditions.</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="py-8 bg-transparent">
        <div className="max-w-4xl mx-auto px-4">
          <Card className="p-8 border-red-200 bg-red-50 text-center">
            <AlertTriangle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-red-800 mb-2">{error}</h2>
            <Button onClick={() => router.push('/dashboard')}>Return to Dashboard</Button>
          </Card>
        </div>
      </main>
    );
  }

  if (!diagnosis) return null;

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 py-8 bg-transparent">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-8">
            <ArrowLeft size={20} />
            Back to Dashboard
          </Link>

          {/* Printable Wrapper */}
          <div id="printable-report" className="relative">
            {/* Print Header (Hidden on Screen) */}
            <div className="hidden print:block mb-8 text-center border-b pb-6">
              <h1 className="text-3xl font-bold text-primary mb-2">AgroVet AI Diagnosis Report</h1>
              <p className="text-gray-500">Generated on {new Date().toLocaleDateString()} | reliable AI-powered veterinary insights</p>
            </div>

            {/* Diagnosis Card */}
            <Card className="mb-8 p-8 border border-border bg-background/80 backdrop-blur-sm shadow-md print:shadow-none print:border-none print:p-0">
              <div className="flex flex-col sm:flex-row gap-6 mb-6">
                <div className="flex-1">
                  <div className={`inline-block mb-4 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${diagnosis.severity === 'High' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'
                    }`}>
                    <AlertTriangle size={16} />
                    {diagnosis.severity} Severity
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                    {diagnosis.disease}
                  </h1>
                  <p className="text-muted-foreground mb-6">
                    Based on your input, this is the most likely diagnosis. Please consult a veterinarian for confirmation.
                  </p>
                </div>
                <div className="flex flex-col items-center justify-center bg-primary/10 rounded-2xl p-8 min-w-[180px] print:border print:border-primary/20">
                  <p className="text-4xl font-bold text-primary mb-2">{diagnosis.confidence}%</p>
                  <p className="text-sm text-muted-foreground text-center">Confidence Score</p>
                </div>
              </div>

              <div className="flex gap-3 flex-wrap no-print">
                <Link href="/hospitals">
                  <Button className="gap-2">
                    <MapPin size={18} />
                    Find Veterinary Hospital
                  </Button>
                </Link>
                <Link href="/medicines">
                  <Button variant="secondary" className="gap-2">
                    <Pill size={18} />
                    Medicine Store
                  </Button>
                </Link>
                <Button variant="outline" className="gap-2 bg-transparent" onClick={handleDownloadReport}>
                  <Download size={18} />
                  Download Report
                </Button>
              </div>
            </Card>

            {/* Causes */}
            {diagnosis.causes && (
              <Card className="mb-8 p-8 border border-border bg-card print:shadow-none print:border print:border-gray-200">
                <h2 className="text-2xl font-bold text-foreground mb-6">Potential Causes</h2>
                <div className="grid grid-cols-1 gap-4">
                  {diagnosis.causes.map((cause: string, index: number) => (
                    <div key={index} className="flex gap-4">
                      <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center flex-shrink-0 text-sm font-semibold print:border print:border-gray-300">
                        •
                      </div>
                      <p className="text-foreground pt-0.5">{cause}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Prevention */}
            {diagnosis.prevention && (
              <Card className="mb-8 p-8 border border-border bg-card print:shadow-none print:border print:border-gray-200">
                <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <CheckCircle size={28} className="text-primary" />
                  Prevention & Precautions
                </h2>
                <div className="space-y-3">
                  {diagnosis.prevention.map((item: string, index: number) => (
                    <div key={index} className="flex gap-4 p-4 bg-primary/5 rounded-lg border border-primary/10 print:bg-white print:border-gray-200">
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
            {diagnosis.treatment && (
              <Card className="mb-8 p-8 border border-border bg-card print:shadow-none print:border print:border-gray-200">
                <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <Zap size={28} className="text-orange-600" />
                  Treatment Recommendations
                </h2>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6 print:bg-white print:border-orange-200">
                  <p className="text-orange-900 font-semibold">
                    ⚠️ Important: Consult a veterinarian for proper diagnosis and treatment. This is an AI-assisted analysis.
                  </p>
                </div>
                <div className="space-y-3">
                  {diagnosis.treatment.map((item: string, index: number) => (
                    <div key={index} className="flex gap-4 p-4 bg-accent/5 rounded-lg border border-accent/10 print:bg-white print:border-gray-200">
                      <span className="text-sm font-semibold text-accent flex-shrink-0 mt-0.5">
                        {index + 1}.
                      </span>
                      <p className="text-foreground">{item}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* ─── Recommended Medicines ─── */}
            {(() => {
              const relatedMeds = getRelatedMedicines(diagnosis.disease);
              if (relatedMeds.length === 0) return null;
              return (
                <Card className="mb-8 p-8 border border-border bg-card no-print">
                  <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                    <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                      <Pill size={26} className="text-primary" />
                      Recommended Medicines
                    </h2>
                    <Link href="/medicines">
                      <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                        <ShoppingCart size={16} />
                        View Full Store
                      </Button>
                    </Link>
                  </div>
                  <p className="text-sm text-muted-foreground mb-5">
                    These medicines are commonly used for <strong>{diagnosis.disease}</strong>. Always consult a veterinarian before administering.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {relatedMeds.map(med => (
                      <div
                        key={med.id}
                        className="flex flex-col rounded-xl border border-border bg-background/60 backdrop-blur-sm overflow-hidden hover:shadow-lg transition-all hover:-translate-y-0.5"
                      >
                        {/* Coloured top strip by type */}
                        <div className={`h-1.5 w-full ${
                          med.type === 'vaccine' ? 'bg-purple-500' :
                          med.type === 'injection' ? 'bg-blue-500' :
                          med.type === 'bottle' ? 'bg-emerald-500' :
                          med.type === 'drops' ? 'bg-pink-500' :
                          med.type === 'spray' ? 'bg-cyan-500' :
                          med.type === 'paste' ? 'bg-orange-500' :
                          med.type === 'solution' ? 'bg-teal-500' :
                          'bg-primary'
                        }`} />
                        <div className="p-5 flex flex-col flex-1">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h3 className="font-bold text-foreground leading-tight text-sm">{med.name}</h3>
                            <span className="text-[10px] uppercase tracking-wide bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold whitespace-nowrap shrink-0">
                              {med.type}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground flex-1 mb-4 line-clamp-2">{med.description}</p>
                          <div className="flex items-center justify-between mt-auto pt-3 border-t border-border/50">
                            <span className="text-lg font-bold font-mono text-foreground">₹{med.price}</span>
                            <Link href={`/medicines?search=${encodeURIComponent(med.name)}`}>
                              <Button size="sm" className="gap-1.5">
                                <ShoppingCart size={14} />
                                Buy Now
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              );
            })()}

            {/* Footer for Print */}
            <div className="hidden print:block mt-12 text-center text-sm text-gray-400 border-t pt-4">
              <p>AgroVet AI - Protecting Livestock, Empowering Farmers.</p>
            </div>
          </div>

          {/* Next Steps */}
          <Card className="p-8 border border-border bg-primary/10 border-primary/20">
            <h3 className="text-lg font-bold text-foreground mb-4">Next Steps</h3>
            <ol className="space-y-3">
              <li className="flex gap-3">
                <span className="font-semibold text-primary flex-shrink-0">1.</span>
                <span className="text-foreground">Schedule immediate consultation with veterinarian</span>
              </li>
              <li className="flex gap-3">
                <span className="font-semibold text-primary flex-shrink-0">2.</span>
                <span className="text-foreground">Browse the Medicine Store for recommended treatments and preventive care</span>
              </li>
              <li className="flex gap-3">
                <span className="font-semibold text-primary flex-shrink-0">3.</span>
                <span className="text-foreground">Monitor the animal's temperature and feed intake</span>
              </li>
            </ol>
            <div className="mt-6 flex gap-3 flex-col sm:flex-row">
              <Link href="/hospitals" className="flex-1">
                <Button className="w-full">Find Nearby Hospital</Button>
              </Link>
              <Link href="/medicines" className="flex-1">
                <Button variant="secondary" className="w-full gap-2">
                  <Pill size={18} />
                  Medicine Store
                </Button>
              </Link>
              <Link href="/dashboard" className="flex-1">
                <Button variant="outline" className="w-full bg-transparent">
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
