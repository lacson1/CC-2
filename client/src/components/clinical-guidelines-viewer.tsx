import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, BookOpen, AlertCircle, CheckCircle2 } from 'lucide-react';
import {
  clinicalGuidelines,
  searchGuidelines,
  getAllCategories,
  type ClinicalGuideline
} from '@/lib/clinical-guidelines';

export function ClinicalGuidelinesViewer() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGuideline, setSelectedGuideline] = useState<ClinicalGuideline | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', ...getAllCategories()];
  
  const filteredGuidelines = searchQuery
    ? searchGuidelines(searchQuery)
    : selectedCategory === 'All'
    ? clinicalGuidelines
    : clinicalGuidelines.filter(g => g.category === selectedCategory);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100vh-200px)]">
      {/* Sidebar - Guidelines List */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            Clinical Guidelines
          </CardTitle>
          <CardDescription>Evidence-based treatment protocols</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search guidelines..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>

            {/* Guidelines List */}
            <ScrollArea className="h-[500px]">
              <div className="space-y-2">
                {filteredGuidelines.map((guideline) => (
                  <Button
                    key={guideline.id}
                    variant={selectedGuideline?.id === guideline.id ? 'secondary' : 'ghost'}
                    className="w-full justify-start text-left h-auto py-3 px-3"
                    onClick={() => setSelectedGuideline(guideline)}
                  >
                    <div className="flex-1">
                      <div className="font-medium text-sm">{guideline.condition}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {guideline.category}
                      </div>
                    </div>
                  </Button>
                ))}
                {filteredGuidelines.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No guidelines found
                  </p>
                )}
              </div>
            </ScrollArea>
          </div>
        </CardContent>
      </Card>

      {/* Main Content - Guideline Details */}
      <Card className="lg:col-span-2">
        <CardContent className="pt-6">
          {selectedGuideline ? (
            <ScrollArea className="h-[calc(100vh-300px)]">
              <div className="space-y-6">
                {/* Header */}
                <div>
                  <h2 className="text-2xl font-bold mb-2">{selectedGuideline.title}</h2>
                  <p className="text-muted-foreground">{selectedGuideline.summary}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <Badge>{selectedGuideline.category}</Badge>
                    <span className="text-xs text-muted-foreground">
                      Last updated: {new Date(selectedGuideline.lastUpdated).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <Tabs defaultValue="diagnosis">
                  <TabsList className="grid grid-cols-4">
                    <TabsTrigger value="diagnosis">Diagnosis</TabsTrigger>
                    <TabsTrigger value="treatment">Treatment</TabsTrigger>
                    <TabsTrigger value="management">Management</TabsTrigger>
                    <TabsTrigger value="followup">Follow-up</TabsTrigger>
                  </TabsList>

                  <TabsContent value="diagnosis" className="space-y-4 mt-4">
                    <div>
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        Diagnostic Criteria
                      </h3>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        {selectedGuideline.diagnosis.criteria.map((criterion, idx) => (
                          <li key={idx} className="text-sm">{criterion}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Investigations</h3>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        {selectedGuideline.diagnosis.investigations.map((inv, idx) => (
                          <li key={idx} className="text-sm">{inv}</li>
                        ))}
                      </ul>
                    </div>
                  </TabsContent>

                  <TabsContent value="treatment" className="space-y-4 mt-4">
                    <div>
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        First-Line Treatment
                      </h3>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        {selectedGuideline.treatment.firstLine.map((treatment, idx) => (
                          <li key={idx} className="text-sm">{treatment}</li>
                        ))}
                      </ul>
                    </div>

                    {selectedGuideline.treatment.secondLine && (
                      <div>
                        <h3 className="font-semibold mb-2">Second-Line Treatment</h3>
                        <ul className="list-disc list-inside space-y-1 ml-4">
                          {selectedGuideline.treatment.secondLine.map((treatment, idx) => (
                            <li key={idx} className="text-sm">{treatment}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {selectedGuideline.treatment.duration && (
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <strong>Duration:</strong> {selectedGuideline.treatment.duration}
                      </div>
                    )}

                    {selectedGuideline.treatment.contraindications && (
                      <div className="bg-red-50 p-3 rounded-lg">
                        <h4 className="font-semibold mb-1 text-red-900">Contraindications:</h4>
                        <ul className="list-disc list-inside space-y-1 ml-4">
                          {selectedGuideline.treatment.contraindications.map((contra, idx) => (
                            <li key={idx} className="text-sm text-red-800">{contra}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="management" className="space-y-4 mt-4">
                    <h3 className="font-semibold mb-2">Management Plan</h3>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      {selectedGuideline.management.map((item, idx) => (
                        <li key={idx} className="text-sm">{item}</li>
                      ))}
                    </ul>

                    {selectedGuideline.referralCriteria && (
                      <div className="bg-amber-50 p-3 rounded-lg">
                        <h4 className="font-semibold mb-2">Referral Criteria:</h4>
                        <ul className="list-disc list-inside space-y-1 ml-4">
                          {selectedGuideline.referralCriteria.map((criteria, idx) => (
                            <li key={idx} className="text-sm">{criteria}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="followup" className="space-y-4 mt-4">
                    {selectedGuideline.followUp && (
                      <div className="bg-slate-50 p-4 rounded-lg">
                        <h3 className="font-semibold mb-2">Follow-up Plan</h3>
                        <p className="text-sm">{selectedGuideline.followUp}</p>
                      </div>
                    )}

                    <div>
                      <h3 className="font-semibold mb-2">Sources</h3>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        {selectedGuideline.sources.map((source, idx) => (
                          <li key={idx} className="text-sm text-muted-foreground">{source}</li>
                        ))}
                      </ul>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </ScrollArea>
          ) : (
            <div className="flex flex-col items-center justify-center h-[400px] text-muted-foreground">
              <BookOpen className="h-16 w-16 mb-4 opacity-20" />
              <p>Select a guideline to view details</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
