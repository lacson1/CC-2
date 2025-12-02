import { useState, useMemo } from "react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, ChevronsUpDown, AlertTriangle, Plus, Pill, Apple, Wind } from "lucide-react";
import { cn } from "@/lib/utils";

interface Allergy {
  name: string;
  category: string;
  severity: string;
  type: 'drug' | 'food' | 'environmental' | 'other';
}

// Comprehensive database of common allergens
const COMMON_ALLERGENS: Allergy[] = [
  // Drug Allergies - High Risk
  { name: "Penicillin", category: "Antibiotic", severity: "High", type: "drug" },
  { name: "Amoxicillin", category: "Antibiotic", severity: "High", type: "drug" },
  { name: "Ampicillin", category: "Antibiotic", severity: "High", type: "drug" },
  { name: "Cephalosporins", category: "Antibiotic", severity: "High", type: "drug" },
  { name: "Sulfonamides (Sulfa drugs)", category: "Antibiotic", severity: "High", type: "drug" },
  { name: "Tetracycline", category: "Antibiotic", severity: "Medium", type: "drug" },
  { name: "Erythromycin", category: "Antibiotic", severity: "Medium", type: "drug" },
  { name: "Ciprofloxacin", category: "Antibiotic", severity: "Medium", type: "drug" },
  { name: "Vancomycin", category: "Antibiotic", severity: "High", type: "drug" },
  { name: "Aspirin", category: "NSAID", severity: "High", type: "drug" },
  { name: "Ibuprofen", category: "NSAID", severity: "Medium", type: "drug" },
  { name: "Naproxen", category: "NSAID", severity: "Medium", type: "drug" },
  { name: "Diclofenac", category: "NSAID", severity: "Medium", type: "drug" },
  { name: "Morphine", category: "Opioid", severity: "High", type: "drug" },
  { name: "Codeine", category: "Opioid", severity: "High", type: "drug" },
  { name: "Tramadol", category: "Opioid", severity: "Medium", type: "drug" },
  { name: "Lidocaine", category: "Anesthetic", severity: "High", type: "drug" },
  { name: "Novocaine", category: "Anesthetic", severity: "High", type: "drug" },
  { name: "Propofol", category: "Anesthetic", severity: "High", type: "drug" },
  { name: "ACE Inhibitors", category: "Cardiovascular", severity: "Medium", type: "drug" },
  { name: "Beta Blockers", category: "Cardiovascular", severity: "Medium", type: "drug" },
  { name: "Statins", category: "Cardiovascular", severity: "Low", type: "drug" },
  { name: "Warfarin", category: "Anticoagulant", severity: "Medium", type: "drug" },
  { name: "Heparin", category: "Anticoagulant", severity: "High", type: "drug" },
  { name: "Insulin", category: "Diabetes", severity: "Medium", type: "drug" },
  { name: "Metformin", category: "Diabetes", severity: "Low", type: "drug" },
  { name: "Contrast Dye (Iodine)", category: "Diagnostic", severity: "High", type: "drug" },
  { name: "Latex", category: "Medical Material", severity: "High", type: "drug" },
  { name: "Adhesive/Medical Tape", category: "Medical Material", severity: "Low", type: "drug" },
  
  // Food Allergies
  { name: "Peanuts", category: "Legume", severity: "High", type: "food" },
  { name: "Tree Nuts", category: "Nuts", severity: "High", type: "food" },
  { name: "Almonds", category: "Tree Nut", severity: "High", type: "food" },
  { name: "Cashews", category: "Tree Nut", severity: "High", type: "food" },
  { name: "Walnuts", category: "Tree Nut", severity: "High", type: "food" },
  { name: "Milk/Dairy", category: "Dairy", severity: "Medium", type: "food" },
  { name: "Eggs", category: "Animal Protein", severity: "Medium", type: "food" },
  { name: "Fish", category: "Seafood", severity: "High", type: "food" },
  { name: "Shellfish", category: "Seafood", severity: "High", type: "food" },
  { name: "Shrimp", category: "Shellfish", severity: "High", type: "food" },
  { name: "Crab", category: "Shellfish", severity: "High", type: "food" },
  { name: "Lobster", category: "Shellfish", severity: "High", type: "food" },
  { name: "Wheat/Gluten", category: "Grain", severity: "Medium", type: "food" },
  { name: "Soy", category: "Legume", severity: "Medium", type: "food" },
  { name: "Sesame", category: "Seed", severity: "Medium", type: "food" },
  { name: "Strawberries", category: "Fruit", severity: "Low", type: "food" },
  { name: "Kiwi", category: "Fruit", severity: "Medium", type: "food" },
  { name: "Banana", category: "Fruit", severity: "Low", type: "food" },
  { name: "Citrus Fruits", category: "Fruit", severity: "Low", type: "food" },
  { name: "Chocolate", category: "Food", severity: "Low", type: "food" },
  { name: "Sulfites", category: "Preservative", severity: "Medium", type: "food" },
  
  // Environmental Allergies
  { name: "Pollen (Grass)", category: "Plant", severity: "Medium", type: "environmental" },
  { name: "Pollen (Tree)", category: "Plant", severity: "Medium", type: "environmental" },
  { name: "Dust Mites", category: "Indoor", severity: "Medium", type: "environmental" },
  { name: "Mold/Mildew", category: "Fungal", severity: "Medium", type: "environmental" },
  { name: "Pet Dander (Cat)", category: "Animal", severity: "Medium", type: "environmental" },
  { name: "Pet Dander (Dog)", category: "Animal", severity: "Medium", type: "environmental" },
  { name: "Bee Venom", category: "Insect", severity: "High", type: "environmental" },
  { name: "Wasp Venom", category: "Insect", severity: "High", type: "environmental" },
  { name: "Fire Ant Venom", category: "Insect", severity: "High", type: "environmental" },
  { name: "Nickel", category: "Metal", severity: "Low", type: "environmental" },
  { name: "Perfume/Fragrance", category: "Chemical", severity: "Low", type: "environmental" },
];

interface AllergyAutocompleteProps {
  value: string;
  onSelect: (allergy: string) => void;
  placeholder?: string;
  className?: string;
}

export default function AllergyAutocomplete({
  value,
  onSelect,
  placeholder = "Search allergies...",
  className,
}: AllergyAutocompleteProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter allergens based on search query (client-side)
  const filteredAllergens = useMemo(() => {
    if (!searchQuery) {
      // Show common high-risk allergens when no search
      return COMMON_ALLERGENS.filter(a => a.severity === "High").slice(0, 15);
    }
    const query = searchQuery.toLowerCase();
    return COMMON_ALLERGENS.filter(
      allergy =>
        allergy.name.toLowerCase().includes(query) ||
        allergy.category.toLowerCase().includes(query) ||
        allergy.type.toLowerCase().includes(query)
    ).slice(0, 20);
  }, [searchQuery]);

  const handleSelect = (allergy: Allergy | string) => {
    const allergyName = typeof allergy === 'string' ? allergy : allergy.name;
    onSelect(allergyName);
    setOpen(false);
    setSearchQuery("");
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "High": return "bg-red-100 text-red-800 border-red-300";
      case "Medium": return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "Low": return "bg-green-100 text-green-800 border-green-300";
      default: return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'drug': return <Pill className="h-4 w-4 text-purple-500" />;
      case 'food': return <Apple className="h-4 w-4 text-green-500" />;
      case 'environmental': return <Wind className="h-4 w-4 text-blue-500" />;
      default: return <AlertTriangle className="h-4 w-4 text-orange-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'drug': return "bg-purple-100 text-purple-800 border-purple-300";
      case 'food': return "bg-green-100 text-green-800 border-green-300";
      case 'environmental': return "bg-blue-100 text-blue-800 border-blue-300";
      default: return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  // Check if search query matches any existing allergen exactly
  const hasExactMatch = filteredAllergens.some(
    a => a.name.toLowerCase() === searchQuery.toLowerCase()
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
              "w-full justify-between focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200",
              "border-slate-300 hover:border-slate-400",
              !value && "text-muted-foreground",
              className
            )}
          >
            <div className="flex items-center gap-2 flex-1 text-left overflow-hidden">
              <AlertTriangle className="h-4 w-4 text-orange-500 flex-shrink-0" />
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
              placeholder="Type to search allergies..."
              value={searchQuery}
              onValueChange={setSearchQuery}
              className="border-0 focus:ring-0"
            />
            <CommandList>
            <CommandEmpty>
                <div className="p-4 text-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    No matching allergens found
                  </p>
                  {searchQuery && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSelect(searchQuery)}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add "{searchQuery}" as custom allergen
                    </Button>
                  )}
                </div>
            </CommandEmpty>
              
              {filteredAllergens.length > 0 && (
                <CommandGroup heading={searchQuery ? "Matching allergens" : "High-risk allergens"}>
                  {filteredAllergens.map((allergy) => (
                  <CommandItem
                    key={allergy.name}
                    value={allergy.name}
                    onSelect={() => handleSelect(allergy)}
                    className="flex items-center gap-3 p-3 cursor-pointer hover:bg-orange-50"
                  >
                    <div className="flex items-center gap-2 flex-1">
                        {getTypeIcon(allergy.type)}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-slate-900 truncate">
                          {allergy.name}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className={cn("text-xs", getTypeColor(allergy.type))}>
                              {allergy.type}
                            </Badge>
                          <Badge variant="outline" className="text-xs">
                            {allergy.category}
                          </Badge>
                          <Badge 
                            variant="outline" 
                            className={cn("text-xs", getSeverityColor(allergy.severity))}
                          >
                              {allergy.severity}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        value === allergy.name ? "opacity-100" : "opacity-0"
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
                    className="flex items-center gap-2 p-3 cursor-pointer hover:bg-orange-50"
                  >
                    <Plus className="h-4 w-4 text-orange-600" />
                    <span>Add "{searchQuery}" as custom allergen</span>
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