import { useState, useMemo } from "react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, ChevronsUpDown, Heart, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface MedicalCondition {
  name: string;
  category: string;
  chronic: boolean;
}

// Comprehensive database of medical conditions organized by category
const MEDICAL_CONDITIONS: MedicalCondition[] = [
  // Cardiovascular
  { name: "Hypertension (High Blood Pressure)", category: "Cardiovascular", chronic: true },
  { name: "Hypotension (Low Blood Pressure)", category: "Cardiovascular", chronic: true },
  { name: "Coronary Artery Disease", category: "Cardiovascular", chronic: true },
  { name: "Heart Failure", category: "Cardiovascular", chronic: true },
  { name: "Atrial Fibrillation", category: "Cardiovascular", chronic: true },
  { name: "Arrhythmia", category: "Cardiovascular", chronic: true },
  { name: "Angina Pectoris", category: "Cardiovascular", chronic: true },
  { name: "Myocardial Infarction (Heart Attack)", category: "Cardiovascular", chronic: false },
  { name: "Deep Vein Thrombosis (DVT)", category: "Cardiovascular", chronic: false },
  { name: "Peripheral Artery Disease", category: "Cardiovascular", chronic: true },
  { name: "Cardiomyopathy", category: "Cardiovascular", chronic: true },
  { name: "Valvular Heart Disease", category: "Cardiovascular", chronic: true },
  
  // Endocrine
  { name: "Type 1 Diabetes Mellitus", category: "Endocrine", chronic: true },
  { name: "Type 2 Diabetes Mellitus", category: "Endocrine", chronic: true },
  { name: "Gestational Diabetes", category: "Endocrine", chronic: false },
  { name: "Hypothyroidism", category: "Endocrine", chronic: true },
  { name: "Hyperthyroidism", category: "Endocrine", chronic: true },
  { name: "Goiter", category: "Endocrine", chronic: true },
  { name: "Thyroid Nodules", category: "Endocrine", chronic: true },
  { name: "Cushing's Syndrome", category: "Endocrine", chronic: true },
  { name: "Addison's Disease", category: "Endocrine", chronic: true },
  { name: "Polycystic Ovary Syndrome (PCOS)", category: "Endocrine", chronic: true },
  { name: "Metabolic Syndrome", category: "Endocrine", chronic: true },
  { name: "Obesity", category: "Endocrine", chronic: true },
  
  // Respiratory
  { name: "Asthma", category: "Respiratory", chronic: true },
  { name: "Chronic Obstructive Pulmonary Disease (COPD)", category: "Respiratory", chronic: true },
  { name: "Emphysema", category: "Respiratory", chronic: true },
  { name: "Chronic Bronchitis", category: "Respiratory", chronic: true },
  { name: "Pneumonia", category: "Respiratory", chronic: false },
  { name: "Tuberculosis (TB)", category: "Respiratory", chronic: false },
  { name: "Pulmonary Fibrosis", category: "Respiratory", chronic: true },
  { name: "Sleep Apnea", category: "Respiratory", chronic: true },
  { name: "Bronchiectasis", category: "Respiratory", chronic: true },
  { name: "Pulmonary Hypertension", category: "Respiratory", chronic: true },
  
  // Neurological
  { name: "Epilepsy", category: "Neurological", chronic: true },
  { name: "Migraine", category: "Neurological", chronic: true },
  { name: "Tension Headache", category: "Neurological", chronic: true },
  { name: "Stroke (Cerebrovascular Accident)", category: "Neurological", chronic: false },
  { name: "Transient Ischemic Attack (TIA)", category: "Neurological", chronic: false },
  { name: "Parkinson's Disease", category: "Neurological", chronic: true },
  { name: "Alzheimer's Disease", category: "Neurological", chronic: true },
  { name: "Dementia", category: "Neurological", chronic: true },
  { name: "Multiple Sclerosis", category: "Neurological", chronic: true },
  { name: "Neuropathy (Peripheral)", category: "Neurological", chronic: true },
  { name: "Bell's Palsy", category: "Neurological", chronic: false },
  { name: "Vertigo", category: "Neurological", chronic: true },
  { name: "Carpal Tunnel Syndrome", category: "Neurological", chronic: true },
  
  // Gastrointestinal
  { name: "Peptic Ulcer Disease", category: "Gastrointestinal", chronic: true },
  { name: "Gastritis", category: "Gastrointestinal", chronic: false },
  { name: "Gastroesophageal Reflux Disease (GERD)", category: "Gastrointestinal", chronic: true },
  { name: "Irritable Bowel Syndrome (IBS)", category: "Gastrointestinal", chronic: true },
  { name: "Inflammatory Bowel Disease (IBD)", category: "Gastrointestinal", chronic: true },
  { name: "Crohn's Disease", category: "Gastrointestinal", chronic: true },
  { name: "Ulcerative Colitis", category: "Gastrointestinal", chronic: true },
  { name: "Celiac Disease", category: "Gastrointestinal", chronic: true },
  { name: "Hepatitis A", category: "Gastrointestinal", chronic: false },
  { name: "Hepatitis B", category: "Gastrointestinal", chronic: true },
  { name: "Hepatitis C", category: "Gastrointestinal", chronic: true },
  { name: "Cirrhosis", category: "Gastrointestinal", chronic: true },
  { name: "Fatty Liver Disease (NAFLD)", category: "Gastrointestinal", chronic: true },
  { name: "Gallstones", category: "Gastrointestinal", chronic: false },
  { name: "Pancreatitis", category: "Gastrointestinal", chronic: false },
  { name: "Hemorrhoids", category: "Gastrointestinal", chronic: true },
  { name: "Diverticulitis", category: "Gastrointestinal", chronic: true },
  
  // Mental Health
  { name: "Depression (Major Depressive Disorder)", category: "Mental Health", chronic: true },
  { name: "Anxiety Disorder", category: "Mental Health", chronic: true },
  { name: "Generalized Anxiety Disorder", category: "Mental Health", chronic: true },
  { name: "Panic Disorder", category: "Mental Health", chronic: true },
  { name: "Bipolar Disorder", category: "Mental Health", chronic: true },
  { name: "Schizophrenia", category: "Mental Health", chronic: true },
  { name: "Post-Traumatic Stress Disorder (PTSD)", category: "Mental Health", chronic: true },
  { name: "Obsessive-Compulsive Disorder (OCD)", category: "Mental Health", chronic: true },
  { name: "Attention Deficit Hyperactivity Disorder (ADHD)", category: "Mental Health", chronic: true },
  { name: "Eating Disorder (Anorexia/Bulimia)", category: "Mental Health", chronic: true },
  { name: "Insomnia", category: "Mental Health", chronic: true },
  { name: "Substance Use Disorder", category: "Mental Health", chronic: true },
  
  // Musculoskeletal
  { name: "Osteoarthritis", category: "Musculoskeletal", chronic: true },
  { name: "Rheumatoid Arthritis", category: "Musculoskeletal", chronic: true },
  { name: "Gout", category: "Musculoskeletal", chronic: true },
  { name: "Osteoporosis", category: "Musculoskeletal", chronic: true },
  { name: "Fibromyalgia", category: "Musculoskeletal", chronic: true },
  { name: "Chronic Back Pain", category: "Musculoskeletal", chronic: true },
  { name: "Herniated Disc", category: "Musculoskeletal", chronic: true },
  { name: "Scoliosis", category: "Musculoskeletal", chronic: true },
  { name: "Tendinitis", category: "Musculoskeletal", chronic: false },
  { name: "Bursitis", category: "Musculoskeletal", chronic: false },
  { name: "Lupus (Systemic Lupus Erythematosus)", category: "Musculoskeletal", chronic: true },
  
  // Renal/Urinary
  { name: "Chronic Kidney Disease", category: "Renal", chronic: true },
  { name: "Kidney Stones", category: "Renal", chronic: false },
  { name: "Urinary Tract Infection (UTI)", category: "Renal", chronic: false },
  { name: "Benign Prostatic Hyperplasia (BPH)", category: "Renal", chronic: true },
  { name: "Urinary Incontinence", category: "Renal", chronic: true },
  { name: "Polycystic Kidney Disease", category: "Renal", chronic: true },
  { name: "Glomerulonephritis", category: "Renal", chronic: true },
  
  // Hematological
  { name: "Iron Deficiency Anemia", category: "Hematological", chronic: false },
  { name: "Sickle Cell Disease", category: "Hematological", chronic: true },
  { name: "Thalassemia", category: "Hematological", chronic: true },
  { name: "Hemophilia", category: "Hematological", chronic: true },
  { name: "Leukemia", category: "Hematological", chronic: true },
  { name: "Lymphoma", category: "Hematological", chronic: true },
  { name: "Thrombocytopenia", category: "Hematological", chronic: false },
  
  // Infectious/Immunological
  { name: "HIV/AIDS", category: "Infectious", chronic: true },
  { name: "Malaria (Recurrent)", category: "Infectious", chronic: false },
  { name: "Typhoid (Recurrent)", category: "Infectious", chronic: false },
  { name: "Sexually Transmitted Infection (STI)", category: "Infectious", chronic: false },
  { name: "Herpes Simplex Virus", category: "Infectious", chronic: true },
  { name: "Human Papillomavirus (HPV)", category: "Infectious", chronic: true },
  
  // Ophthalmological
  { name: "Glaucoma", category: "Ophthalmological", chronic: true },
  { name: "Cataracts", category: "Ophthalmological", chronic: true },
  { name: "Macular Degeneration", category: "Ophthalmological", chronic: true },
  { name: "Diabetic Retinopathy", category: "Ophthalmological", chronic: true },
  { name: "Dry Eye Syndrome", category: "Ophthalmological", chronic: true },
  
  // Dermatological
  { name: "Eczema (Atopic Dermatitis)", category: "Dermatological", chronic: true },
  { name: "Psoriasis", category: "Dermatological", chronic: true },
  { name: "Acne", category: "Dermatological", chronic: true },
  { name: "Rosacea", category: "Dermatological", chronic: true },
  { name: "Vitiligo", category: "Dermatological", chronic: true },
  
  // Cancer/Oncology
  { name: "Breast Cancer", category: "Oncology", chronic: true },
  { name: "Prostate Cancer", category: "Oncology", chronic: true },
  { name: "Lung Cancer", category: "Oncology", chronic: true },
  { name: "Colorectal Cancer", category: "Oncology", chronic: true },
  { name: "Cervical Cancer", category: "Oncology", chronic: true },
  { name: "Liver Cancer", category: "Oncology", chronic: true },
  { name: "Skin Cancer (Melanoma)", category: "Oncology", chronic: true },
  { name: "Cancer (History of)", category: "Oncology", chronic: false },
  
  // Women's Health
  { name: "Endometriosis", category: "Women's Health", chronic: true },
  { name: "Uterine Fibroids", category: "Women's Health", chronic: true },
  { name: "Menorrhagia (Heavy Periods)", category: "Women's Health", chronic: true },
  { name: "Menopause", category: "Women's Health", chronic: true },
  { name: "Preeclampsia (History of)", category: "Women's Health", chronic: false },
  
  // Surgical History
  { name: "Previous Cesarean Section", category: "Surgical History", chronic: false },
  { name: "Appendectomy", category: "Surgical History", chronic: false },
  { name: "Cholecystectomy (Gallbladder Removal)", category: "Surgical History", chronic: false },
  { name: "Hysterectomy", category: "Surgical History", chronic: false },
  { name: "Coronary Artery Bypass (CABG)", category: "Surgical History", chronic: false },
  { name: "Joint Replacement Surgery", category: "Surgical History", chronic: false },
  { name: "Organ Transplant", category: "Surgical History", chronic: false },
];

interface MedicalConditionAutocompleteProps {
  value: string;
  onSelect: (condition: string) => void;
  placeholder?: string;
  className?: string;
}

export default function MedicalConditionAutocomplete({
  value,
  onSelect,
  placeholder = "Search medical conditions...",
  className,
}: MedicalConditionAutocompleteProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter conditions based on search query (client-side)
  const filteredConditions = useMemo(() => {
    if (!searchQuery) {
      // Show popular/common conditions when no search
      return MEDICAL_CONDITIONS.slice(0, 15);
    }
    const query = searchQuery.toLowerCase();
    return MEDICAL_CONDITIONS.filter(
      condition =>
        condition.name.toLowerCase().includes(query) ||
        condition.category.toLowerCase().includes(query)
    ).slice(0, 20);
  }, [searchQuery]);

  const handleSelect = (condition: MedicalCondition | string) => {
    const conditionName = typeof condition === 'string' ? condition : condition.name;
    onSelect(conditionName);
    setOpen(false);
    setSearchQuery("");
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "Cardiovascular": "bg-red-100 text-red-800 border-red-300",
      "Endocrine": "bg-purple-100 text-purple-800 border-purple-300",
      "Respiratory": "bg-blue-100 text-blue-800 border-blue-300",
      "Neurological": "bg-indigo-100 text-indigo-800 border-indigo-300",
      "Gastrointestinal": "bg-green-100 text-green-800 border-green-300",
      "Mental Health": "bg-pink-100 text-pink-800 border-pink-300",
      "Musculoskeletal": "bg-orange-100 text-orange-800 border-orange-300",
      "Renal": "bg-teal-100 text-teal-800 border-teal-300",
      "Hematological": "bg-rose-100 text-rose-800 border-rose-300",
      "Infectious": "bg-yellow-100 text-yellow-800 border-yellow-300",
      "Immunological": "bg-violet-100 text-violet-800 border-violet-300",
      "Ophthalmological": "bg-cyan-100 text-cyan-800 border-cyan-300",
      "Dermatological": "bg-amber-100 text-amber-800 border-amber-300",
      "Oncology": "bg-red-200 text-red-900 border-red-400",
      "Women's Health": "bg-fuchsia-100 text-fuchsia-800 border-fuchsia-300",
      "Surgical History": "bg-slate-100 text-slate-800 border-slate-300",
    };
    return colors[category] || "bg-gray-100 text-gray-800 border-gray-300";
  };

  // Check if search query matches any existing condition exactly
  const hasExactMatch = filteredConditions.some(
    c => c.name.toLowerCase() === searchQuery.toLowerCase()
  );

  return (
    <div className="w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200",
              "border-slate-300 hover:border-slate-400",
              !value && "text-muted-foreground",
              className
            )}
          >
            <div className="flex items-center gap-2 flex-1 text-left overflow-hidden">
              <Heart className="h-4 w-4 text-emerald-500 flex-shrink-0" />
              {value ? (
                <span className="truncate">{value}</span>
              ) : (
                <span>{placeholder}</span>
              )}
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[450px] p-0" align="start">
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Type to search medical conditions..."
              value={searchQuery}
              onValueChange={setSearchQuery}
              className="border-0 focus:ring-0"
            />
            <CommandList>
            <CommandEmpty>
                <div className="p-4 text-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    No matching conditions found
                  </p>
                  {searchQuery && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSelect(searchQuery)}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add "{searchQuery}" as custom condition
                    </Button>
                  )}
                </div>
            </CommandEmpty>
              
              {filteredConditions.length > 0 && (
                <CommandGroup heading={searchQuery ? "Matching conditions" : "Common conditions"}>
                  {filteredConditions.map((condition) => (
                  <CommandItem
                    key={condition.name}
                    value={condition.name}
                    onSelect={() => handleSelect(condition)}
                    className="flex items-center gap-3 p-3 cursor-pointer hover:bg-emerald-50"
                  >
                    <div className="flex items-center gap-2 flex-1">
                      <Heart className="h-4 w-4 text-emerald-500" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-slate-900 truncate">
                          {condition.name}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge 
                            variant="outline" 
                            className={cn("text-xs", getCategoryColor(condition.category))}
                          >
                            {condition.category}
                          </Badge>
                          {condition.chronic && (
                            <Badge variant="outline" className="text-xs bg-amber-100 text-amber-800 border-amber-300">
                              Chronic
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        value === condition.name ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
              
              {/* Custom entry option */}
              {searchQuery && !hasExactMatch && (
                <CommandGroup heading="Custom entry">
                  <CommandItem
                    value={searchQuery}
                    onSelect={() => handleSelect(searchQuery)}
                    className="flex items-center gap-2 p-3 cursor-pointer hover:bg-emerald-50"
                  >
                    <Plus className="h-4 w-4 text-emerald-600" />
                    <span>Add "{searchQuery}" as custom condition</span>
                  </CommandItem>
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}