export interface DiseaseDetail {
    causes: string[];
    treatment: string[];
    prevention: string[];
}

export const DISEASE_INFO: Record<string, DiseaseDetail> = {
    // Pig Diseases
    'Greasy skin disease': {
        causes: ['Staphylococcus hyicus bacterium', 'Breaks in skin', 'High humidity', 'Fighting'],
        treatment: ['Antibiotics (Penicillin/Amoxicillin)', 'Topical antiseptics', 'Wash pig with mild soap'],
        prevention: ['Clip needle teeth', 'Avoid overcrowding', 'Maintain dry bedding', 'Isolate affected pigs']
    },
    'Mange': {
        causes: ['Sarcoptes scabiei var. suis (mite)', 'Direct contact'],
        treatment: ['Ivermectin injection', 'Topical acaricides', 'Treat all pigs in contact'],
        prevention: ['Quarantine new stock', 'Regular monitoring', 'Treat sows before farrowing']
    },
    'Ringworm': {
        causes: ['Fungal infection (Trichophyton)', 'Humid environment'],
        treatment: ['Topical antifungal sprays', 'Iodine application', 'Sunlight exposure'],
        prevention: ['Clean and disinfect pens', 'Control rodents', 'Good nutrition']
    },

    // Sheep Diseases
    'Dermatophytosis (Ringworm)': {
        causes: ['Fungal spores', 'Direct contact', 'Contaminated equipment'],
        treatment: ['Antifungal washes', 'Topical iodine', 'Isolate infected sheep'],
        prevention: ['Disinfect shearing tools', 'Avoid overcrowding', 'Vitamin A supplementation']
    },
    'Myiasis': {
        causes: ['Blowfly infestation', 'Open wounds', 'Soiled wool'],
        treatment: ['Remove maggots manually', 'Apply insecticide', 'Clean wounds'],
        prevention: ['Tail docking (if approved)', 'Crutching/Shearing', 'Fly control']
    },
    // Reusing Mange for Sheep as well if needed, or define specific if different

    // Default / Fallback
    'Unknown Condition': {
        causes: ['Unidentified pathogen'],
        treatment: ['Consult Veterinarian for diagnosis'],
        prevention: ['Isolate animal', 'Observe symptoms']
    },
    'Healthy': {
        causes: ['N/A'],
        treatment: ['No treatment needed'],
        prevention: ['Continue regular care', 'Routine vaccinations', 'Good hygiene']
    },
    'Bad Quality': {
        causes: ['Poor lighting', 'Blurry image', 'Subject too far'],
        treatment: ['Retake photo'],
        prevention: ['Ensure good lighting', 'Steady camera', 'Focus on affected area']
    },

    // Cow Diseases
    'Mastitis': {
        causes: ['Bacterial infection', 'Poor hygiene', 'Physical injury'],
        treatment: ['Antibiotics', 'Frequent milking', 'Anti-inflammatory drugs'],
        prevention: ['Teat dipping', 'Clean bedding', 'Dry cow therapy']
    },
    'Pink eye': {
        causes: ['Moraxella bovis bacteria', 'Flies', 'Dust/Sunlight'],
        treatment: ['Antibiotic eye ointment', 'Patching the eye', 'Isolate affected cattle'],
        prevention: ['Fly control', 'Provide shade', 'Vaccination']
    },
    'Lumpy Skin Disease': {
        causes: ['Capripoxvirus', 'Insect vectors (mosquitoes, flies)'],
        treatment: ['Supportive care', 'Antibiotics for secondary infection', 'Antipyretics'],
        prevention: ['Vaccination', 'Vector control', 'Quarantine']
    },
    'Foot Rot': {
        causes: ['Bacteria (Fusobacterium)', 'Wet/muddy conditions', 'Foot injury'],
        treatment: ['Antibiotics', 'Foot trimming', 'Zinc sulfate foot bath'],
        prevention: ['Keep environment dry', 'Regular foot trimming', 'Foot baths']
    },

    // Buffalo Diseases
    'Bloat': {
        causes: ['Rapid consumption of lush legumes', 'Gas trapping in rumen'],
        treatment: ['Anti-bloat agents', 'Stomach tube', 'Trocarization (in severe cases)'],
        prevention: ['Feed dry roughage first', 'Avoid wet pastures', 'Bloat blocks']
    },
    'Malignant Catarrhal Fever': {
        causes: ['Ovine herpesvirus-2', 'Contact with sheep'],
        treatment: ['No specific treatment', 'Supportive care', 'Manage secondary infections'],
        prevention: ['Separate cattle/buffalo from sheep', 'Stress reduction']
    },

    // Horse Diseases
    'Equine Recurrent Uveitis': {
        causes: ['Autoimmune response', 'Leptospirosis', 'Trauma'],
        treatment: ['Anti-inflammatory drugs', 'Atropine', 'Cyclosporine implants'],
        prevention: ['Regular eye exams', 'Control leptospirosis', 'Fly masks']
    },
    'Rain Rot': {
        causes: ['Dermatophilus congolensis bacteria', 'Prolonged wetness', 'Skin damage'],
        treatment: ['Remove scabs', 'Antimicrobial shampoo', 'Keep horse dry'],
        prevention: ['Shelter from rain', 'Regular grooming', 'Insect control']
    },
    'Tetanus': {
        causes: ['Clostridium tetani toxin', 'Deep puncture wounds'],
        treatment: ['Tetanus antitoxin', 'Antibiotics', 'Muscle relaxants', 'Dark/quiet stall'],
        prevention: ['Tetanus toxoid vaccination', 'Proper wound care']
    },
    'Tick Infestation': {
        causes: ['Tick vectors', 'Grazing in infested areas'],
        treatment: ['Acaricides', 'Manual removal', 'Topical prevention'],
        prevention: ['Regular grooming', 'Pasture management', 'Tick repellents']
    },

    // Hen/Poultry Diseases
    'Fowl Pox': {
        causes: ['Avipoxvirus', 'Mosquito bites', 'Contact with infected birds'],
        treatment: ['Supportive care', 'Prevent secondary infections', 'Vitamin A'],
        prevention: ['Vaccination', 'Mosquito control', 'Biosecurity']
    },
    'Newcastle Disease': {
        causes: ['Paramyxovirus', 'Contact with infected birds/feces'],
        treatment: ['No specific treatment', 'Supportive care', 'Antibiotics for secondary issues'],
        prevention: ['Vaccination', 'Strict biosecurity', 'Quarantine']
    },
    'Mite/Lice Infestation': {
        causes: ['External parasites', 'Contact with wild birds', 'Poor hygiene'],
        treatment: ['Insecticide dusting/spraying', 'Treat coop', 'Diatomaceous earth'],
        prevention: ['Check flock regularly', 'Clean coop', 'Dust baths']
    },
    'Feather Loss / Pecking': {
        causes: ['Stress', 'Nutritional deficiency', 'Overcrowding'],
        treatment: ['Isolate injured birds', 'Treat wounds', 'Correct diet/environment'],
        prevention: ['Adequate space', 'Balanced diet (Protein/Calcium)', 'Enrichment']
    },

    // Goat Diseases
    'Ectoparasites': {
        causes: ['Ticks', 'Lice', 'Mites', 'Poor hygiene'],
        treatment: ['Acaricides', 'Dipping/Spraying', 'Ivermectin injection'],
        prevention: ['Regular grooming', 'Clean housing', 'Quarantine new animals']
    },

    // New Additions: Dog
    'Bacterial Dermatosis': {
        causes: ['Bacterial infection', 'Allergies', 'Poor grooming'],
        treatment: ['Antibiotics', 'Medicated shampoos', 'Topical ointments'],
        prevention: ['Regular grooming', 'Flea/Tick control', 'Dry coat']
    },
    'Demodicosis': {
        causes: ['Demodex mites', 'Weakened immune system'],
        treatment: ['Acaricidal dips', 'Oral medications', 'Treat underlying conditions'],
        prevention: ['Good nutrition', 'Immune support', 'Regular vet checkups']
    },
    'Dermatitis': {
        causes: ['Environmental allergens', 'Food allergies', 'Flea bites'],
        treatment: ['Antihistamines', 'Corticosteroids', 'Hypoallergenic diet'],
        prevention: ['Flea prevention', 'Identify and avoid allergens']
    },
    'Fungal Infections': {
        causes: ['Yeast (Malassezia)', 'Ringworm fungi', 'Warm/Humid environment'],
        treatment: ['Antifungal shampoos', 'Oral antifungals'],
        prevention: ['Keep ears/skin folds dry', 'Regular grooming']
    },
    'Hypersensitivity': {
        causes: ['Allergies to food, fleas, or environment'],
        treatment: ['Allergen avoidance', 'Immunotherapy', 'Antihistamines'],
        prevention: ['Strict flea control', 'Controlled diet']
    },

    // New Additions: Donkey/Pony
    'Glanders': {
        causes: ['Burkholderia mallei bacteria'],
        treatment: ['Often fatal/euthanasia recommended', 'Strict isolation', 'Antibiotics (rarely effective)'],
        prevention: ['Test and cull', 'Strict quarantine', 'Hygiene']
    },
    'Equine Influenza': {
        causes: ['Equine influenza virus'],
        treatment: ['Rest', 'Anti-inflammatories', 'Antibiotics for secondary infections'],
        prevention: ['Vaccination', 'Isolation of sick animals', 'Biosecurity']
    },
    'Strangles': {
        causes: ['Streptococcus equi bacteria'],
        treatment: ['Warm compresses on lymph nodes', 'Antibiotics (if vet recommended)', 'Rest'],
        prevention: ['Vaccination', 'Isolate new/sick horses']
    },

    // New Additions: Yak
    'Yak Tuberculosis': {
        causes: ['Mycobacterium bovis'],
        treatment: ['No standard treatment (often culled to prevent spread)'],
        prevention: ['Testing and culling', 'Pasteurize milk', 'Avoid wildlife contact']
    },

    // New Additions: Camel
    'Camel Pox': {
        causes: ['Orthopoxvirus'],
        treatment: ['Supportive care', 'Antibiotics for secondary infections', 'Fly repellents'],
        prevention: ['Isolation', 'Vaccination', 'Good hygiene']
    },
    'Trypanosomiasis (Surra)': {
        causes: ['Trypanosoma evansi parasite', 'Biting flies'],
        treatment: ['Trypanocidal drugs (e.g., Suramin, Diminazene)'],
        prevention: ['Fly control', 'Routine screening']
    },

    // New Additions: Cat
    'Flea Allergy': {
        causes: ['Flea bites/saliva'],
        treatment: ['Flea control products', 'Corticosteroids for itching'],
        prevention: ['Year-round flea prevention', 'Treat home environment']
    },
    'Mange - Scabies': {
        causes: ['Notoedres cati mites'],
        treatment: ['Acaricidal treatments', 'Lime sulfur dips'],
        prevention: ['Avoid contact with infected cats']
    },

    // New Additions: Bull-Bison / Mixed
    'Anthrax': {
        causes: ['Bacillus anthracis spores', 'Grazing contaminated soil'],
        treatment: ['High-dose antibiotics (Penicillin/Oxytetracycline) if caught early'],
        prevention: ['Vaccination', 'Deep burial of carcasses', 'Spore control']
    },
    'Black Quarter (Blackleg)': {
        causes: ['Clostridium chauvoei bacteria', 'Soil exposure to wounds'],
        treatment: ['Penicillin (rarely effective once severe)', 'Supportive care'],
        prevention: ['Vaccination', 'Proper carcass disposal']
    },
    'Foot, Mouth, Hoof Rot Diseases': {
        causes: ['Viral/Bacterial pathogens', 'Wet conditions'],
        treatment: ['Antibiotics', 'Foot trimming', 'Zinc sulfate foot baths'],
        prevention: ['Dry environment', 'Vaccination (for FMD)', 'Regular hoof care']
    },
    'Lumpy Skin': {
        causes: ['Capripoxvirus', 'Insect vectors'],
        treatment: ['Supportive care', 'Antibiotics for secondary issues'],
        prevention: ['Vaccination', 'Insect control']
    }
};

export function getDiseaseDetails(diseaseName: string): DiseaseDetail {
    return DISEASE_INFO[diseaseName] || DISEASE_INFO['Unknown Condition'];
}
