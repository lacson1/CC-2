import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Stethoscope,
  FileText,
  Zap,
  Plus,
  History,
  Star,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { ModernConsultationWizard } from "./modern-consultation-wizard";
import { IntegratedConsultationForms } from "./integrated-consultation-forms";
import { visitTemplates, getAllCategories } from "@/lib/visit-templates";

interface QuickConsultationLauncherProps {
  patientId: number;
  onConsultationSaved?: () => void;
}

export function QuickConsultationLauncher({
  patientId,
  onConsultationSaved,
}: QuickConsultationLauncherProps) {
  const [showWizard, setShowWizard] = useState(false);
  const [showForms, setShowForms] = useState(false);

  // Get most commonly used templates
  const popularTemplates = visitTemplates.slice(0, 5);
  const categories = getAllCategories().slice(0, 4);

  return (
    <>
      <Card className="border-2 border-dashed border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-purple-500 to-blue-600 p-2 rounded-lg">
              <Zap className="h-5 w-5 text-white" />
            </div>
            Quick Consultation Access
          </CardTitle>
          <CardDescription>
            Choose your preferred method to record patient consultation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Modern Wizard */}
            <Button
              variant="outline"
              className="h-auto p-6 flex flex-col items-start gap-3 hover:bg-blue-50 hover:border-blue-400 transition-all group"
              onClick={() => setShowWizard(true)}
            >
              <div className="flex items-center gap-3 w-full">
                <div className="bg-blue-100 p-3 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <Stethoscope className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-semibold text-base">Modern Wizard</div>
                  <div className="text-sm text-gray-600 font-normal">
                    Step-by-step guided consultation
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
              </div>
              <div className="flex flex-wrap gap-2 w-full">
                <Badge variant="secondary" className="text-xs">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Smart Suggestions
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  <History className="h-3 w-3 mr-1" />
                  Auto-save
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  5 Steps
                </Badge>
              </div>
            </Button>

            {/* Specialist Forms */}
            <Button
              variant="outline"
              className="h-auto p-6 flex flex-col items-start gap-3 hover:bg-purple-50 hover:border-purple-400 transition-all group"
              onClick={() => setShowForms(true)}
            >
              <div className="flex items-center gap-3 w-full">
                <div className="bg-purple-100 p-3 rounded-lg group-hover:bg-purple-200 transition-colors">
                  <FileText className="h-6 w-6 text-purple-600" />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-semibold text-base">Specialist Forms</div>
                  <div className="text-sm text-gray-600 font-normal">
                    Condition-specific assessments
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
              </div>
              <div className="flex flex-wrap gap-2 w-full">
                <Badge variant="secondary" className="text-xs">
                  <Star className="h-3 w-3 mr-1" />
                  Pre-configured
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  Multiple Specialties
                </Badge>
              </div>
            </Button>
          </div>

          {/* Quick Templates Access */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-gray-700">Quick Templates</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowWizard(true)}
                className="text-xs"
              >
                View All →
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {popularTemplates.map((template) => (
                <Button
                  key={template.id}
                  variant="outline"
                  size="sm"
                  className="h-auto py-2 px-3 flex flex-col items-center gap-1 hover:bg-purple-50"
                  onClick={() => setShowWizard(true)}
                >
                  <span className="text-xs font-medium text-center line-clamp-2">
                    {template.name}
                  </span>
                  <Badge variant="secondary" className="text-[10px] mt-1">
                    {template.category}
                  </Badge>
                </Button>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="mt-4">
            <div className="flex items-center gap-2 mb-3">
              <h4 className="text-sm font-semibold text-gray-700">Browse by Category</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant="outline"
                  size="sm"
                  onClick={() => setShowWizard(true)}
                  className="text-xs hover:bg-blue-50"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <ModernConsultationWizard
        patientId={patientId}
        open={showWizard}
        onOpenChange={setShowWizard}
        onSave={() => {
          setShowWizard(false);
          if (onConsultationSaved) onConsultationSaved();
        }}
      />

      <IntegratedConsultationForms
        patientId={patientId}
        open={showForms}
        onOpenChange={setShowForms}
        onFormSubmit={() => {
          setShowForms(false);
          if (onConsultationSaved) onConsultationSaved();
        }}
      />
    </>
  );
}

// Compact version for toolbar/header
export function QuickConsultationButton({
  patientId,
  onConsultationSaved,
}: QuickConsultationLauncherProps) {
  const [showWizard, setShowWizard] = useState(false);
  const [showForms, setShowForms] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            New Consultation
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuLabel>Choose Consultation Type</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => setShowWizard(true)}>
              <Stethoscope className="h-4 w-4 mr-2 text-blue-600" />
              <div className="flex-1">
                <div className="font-medium">Modern Wizard</div>
                <div className="text-xs text-gray-500">Step-by-step guided form</div>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setShowForms(true)}>
              <FileText className="h-4 w-4 mr-2 text-purple-600" />
              <div className="flex-1">
                <div className="font-medium">Specialist Forms</div>
                <div className="text-xs text-gray-500">Condition-specific</div>
              </div>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuLabel className="text-xs font-normal text-gray-500">
            Quick Access Templates
          </DropdownMenuLabel>
          {visitTemplates.slice(0, 3).map((template) => (
            <DropdownMenuItem
              key={template.id}
              onClick={() => setShowWizard(true)}
              className="text-xs"
            >
              <Zap className="h-3 w-3 mr-2 text-yellow-500" />
              {template.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <ModernConsultationWizard
        patientId={patientId}
        open={showWizard}
        onOpenChange={setShowWizard}
        onSave={() => {
          setShowWizard(false);
          if (onConsultationSaved) onConsultationSaved();
        }}
      />

      <IntegratedConsultationForms
        patientId={patientId}
        open={showForms}
        onOpenChange={setShowForms}
        onFormSubmit={() => {
          setShowForms(false);
          if (onConsultationSaved) onConsultationSaved();
        }}
      />
    </>
  );
}

