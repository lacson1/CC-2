import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Search, Calendar, Baby, User, Users, Plane, Briefcase, 
  Shield, ChevronRight, Info, AlertCircle, CheckCircle2,
  Syringe, Clock
} from 'lucide-react';
import { 
  STANDARD_VACCINE_SCHEDULES, 
  getVaccinesByCategory,
  type VaccineSchedule,
  type VaccineAgeGroup
} from '@/lib/vaccine-schedules';

export function VaccinationScheduleViewer() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('routine');
  const [expandedVaccine, setExpandedVaccine] = useState<string | null>(null);

  const categories = [
    { id: 'routine', label: 'Routine', icon: Calendar, description: 'Standard recommended vaccines' },
    { id: 'catch-up', label: 'Catch-up', icon: Clock, description: 'For missed vaccinations' },
    { id: 'travel', label: 'Travel', icon: Plane, description: 'For international travel' },
    { id: 'occupational', label: 'Occupational', icon: Briefcase, description: 'Work-related vaccines' },
  ];

  const filteredSchedules = STANDARD_VACCINE_SCHEDULES.filter(vaccine => {
    const matchesSearch = searchQuery === '' || 
      vaccine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vaccine.shortName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vaccine.diseasesPrevented.some(d => d.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || vaccine.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const getAgeGroupBadge = (group: VaccineAgeGroup) => {
    if (group.recommended) {
      return <Badge className="bg-emerald-500 text-xs">Recommended</Badge>;
    }
    if (group.catchUp) {
      return <Badge className="bg-amber-500 text-xs">Catch-up</Badge>;
    }
    return <Badge variant="secondary" className="text-xs">Optional</Badge>;
  };

  const getRouteBadge = (route: string) => {
    const colors: Record<string, string> = {
      intramuscular: 'bg-blue-100 text-blue-700',
      subcutaneous: 'bg-purple-100 text-purple-700',
      intradermal: 'bg-pink-100 text-pink-700',
      oral: 'bg-green-100 text-green-700',
      nasal: 'bg-cyan-100 text-cyan-700',
    };
    return (
      <Badge variant="outline" className={`${colors[route] || ''} text-xs`}>
        {route.charAt(0).toUpperCase() + route.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-100 rounded-xl">
                <Calendar className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-emerald-900">Vaccination Schedules</h2>
                <p className="text-emerald-700 text-sm">CDC & WHO recommended immunization schedules</p>
              </div>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Search vaccines or diseases..." 
                className="pl-9 w-full md:w-80 bg-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <Button
            key={cat.id}
            variant={selectedCategory === cat.id ? 'default' : 'outline'}
            className={selectedCategory === cat.id ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
            onClick={() => setSelectedCategory(cat.id)}
          >
            <cat.icon className="h-4 w-4 mr-2" />
            {cat.label}
          </Button>
        ))}
        <Button
          variant={selectedCategory === 'all' ? 'default' : 'outline'}
          className={selectedCategory === 'all' ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
          onClick={() => setSelectedCategory('all')}
        >
          All Vaccines
        </Button>
      </div>

      {/* Age Group Reference */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            Age-Based Schedule Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-pink-50 rounded-lg border border-pink-200">
              <div className="flex items-center gap-2 mb-2">
                <Baby className="h-5 w-5 text-pink-600" />
                <h4 className="font-medium text-pink-900">Infants (0-12 months)</h4>
              </div>
              <p className="text-sm text-pink-700">HepB, RV, DTaP, Hib, PCV, IPV</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <User className="h-5 w-5 text-blue-600" />
                <h4 className="font-medium text-blue-900">Children (1-6 years)</h4>
              </div>
              <p className="text-sm text-blue-700">MMR, VAR, HepA, DTaP (booster)</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <User className="h-5 w-5 text-purple-600" />
                <h4 className="font-medium text-purple-900">Adolescents (11-18)</h4>
              </div>
              <p className="text-sm text-purple-700">Tdap, HPV, MenACWY</p>
            </div>
            <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-5 w-5 text-emerald-600" />
                <h4 className="font-medium text-emerald-900">Adults (19+)</h4>
              </div>
              <p className="text-sm text-emerald-700">Flu, COVID-19, Shingles, Pneumococcal</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vaccine List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredSchedules.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Syringe className="h-12 w-12 mx-auto text-slate-300 mb-3" />
              <p className="text-slate-500">No vaccines found matching your search</p>
            </CardContent>
          </Card>
        ) : (
          filteredSchedules.map(vaccine => (
            <Card key={vaccine.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <Accordion type="single" collapsible value={expandedVaccine === vaccine.id ? vaccine.id : ''}>
                <AccordionItem value={vaccine.id} className="border-0">
                  <AccordionTrigger 
                    className="px-6 py-4 hover:no-underline hover:bg-slate-50"
                    onClick={() => setExpandedVaccine(expandedVaccine === vaccine.id ? null : vaccine.id)}
                  >
                    <div className="flex items-center gap-4 flex-1 text-left">
                      <div className="p-2 bg-emerald-100 rounded-lg">
                        <Syringe className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-slate-900">{vaccine.name}</h3>
                          <Badge variant="outline" className="text-xs">{vaccine.shortName}</Badge>
                          {getRouteBadge(vaccine.route)}
                          <Badge 
                            variant="secondary" 
                            className={`text-xs ${
                              vaccine.source === 'Both' ? 'bg-emerald-100 text-emerald-700' :
                              vaccine.source === 'CDC' ? 'bg-blue-100 text-blue-700' :
                              'bg-purple-100 text-purple-700'
                            }`}
                          >
                            {vaccine.source}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-500 mt-1">
                          Prevents: {vaccine.diseasesPrevented.join(', ')}
                        </p>
                      </div>
                      <div className="hidden md:flex items-center gap-2 text-sm text-slate-500">
                        <span>{vaccine.ageGroups.length} doses</span>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="px-6 pb-6 pt-2 space-y-6">
                      {/* Dose Schedule */}
                      <div>
                        <h4 className="font-medium text-slate-900 mb-3 flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-emerald-600" />
                          Dose Schedule
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {vaccine.ageGroups.map((group, idx) => (
                            <div 
                              key={idx}
                              className="p-3 bg-slate-50 rounded-lg border"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <Badge className="bg-slate-700">Dose {group.doseNumber}</Badge>
                                {getAgeGroupBadge(group)}
                              </div>
                              <p className="text-sm font-medium text-slate-700">
                                Age: {group.minAge} - {group.maxAge}
                              </p>
                              {group.intervalFromPrevious && (
                                <p className="text-xs text-slate-500 mt-1">
                                  <Clock className="h-3 w-3 inline mr-1" />
                                  {group.intervalFromPrevious} after previous dose
                                </p>
                              )}
                              {group.notes && (
                                <p className="text-xs text-blue-600 mt-2 flex items-start gap-1">
                                  <Info className="h-3 w-3 mt-0.5 flex-shrink-0" />
                                  {group.notes}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Contraindications & Side Effects */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-slate-900 mb-2 flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 text-red-500" />
                            Contraindications
                          </h4>
                          <ul className="space-y-1">
                            {vaccine.contraindications.map((c, idx) => (
                              <li key={idx} className="text-sm text-slate-600 flex items-start gap-2">
                                <span className="text-red-400 mt-1">•</span>
                                {c}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium text-slate-900 mb-2 flex items-center gap-2">
                            <Info className="h-4 w-4 text-amber-500" />
                            Common Side Effects
                          </h4>
                          <ul className="space-y-1">
                            {vaccine.sideEffects.map((s, idx) => (
                              <li key={idx} className="text-sm text-slate-600 flex items-start gap-2">
                                <span className="text-amber-400 mt-1">•</span>
                                {s}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Manufacturer Info */}
                      {vaccine.manufacturer && vaccine.manufacturer.length > 0 && (
                        <div>
                          <h4 className="font-medium text-slate-900 mb-2 flex items-center gap-2">
                            <Shield className="h-4 w-4 text-blue-500" />
                            Available Products
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {vaccine.manufacturer.map((m, idx) => (
                              <Badge key={idx} variant="outline" className="text-sm">
                                {m}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </Card>
          ))
        )}
      </div>

      {/* Legend */}
      <Card className="bg-slate-50">
        <CardContent className="p-4">
          <h4 className="font-medium text-sm text-slate-700 mb-2">Legend</h4>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Badge className="bg-emerald-500 text-xs">Recommended</Badge>
              <span className="text-slate-600">Standard schedule</span>
            </div>
            <div className="flex items-center gap-1">
              <Badge className="bg-amber-500 text-xs">Catch-up</Badge>
              <span className="text-slate-600">For missed doses</span>
            </div>
            <div className="flex items-center gap-1">
              <Badge variant="outline" className="bg-blue-100 text-blue-700 text-xs">IM</Badge>
              <span className="text-slate-600">Intramuscular</span>
            </div>
            <div className="flex items-center gap-1">
              <Badge variant="outline" className="bg-purple-100 text-purple-700 text-xs">SC</Badge>
              <span className="text-slate-600">Subcutaneous</span>
            </div>
            <div className="flex items-center gap-1">
              <Badge variant="outline" className="bg-green-100 text-green-700 text-xs">Oral</Badge>
              <span className="text-slate-600">By mouth</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

