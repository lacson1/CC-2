import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Zap,
  CheckCircle2,
  TrendingUp,
  Clock,
  Shield,
  BarChart3,
} from "lucide-react";

export function ConsultationDemoBanner() {
  return (
    <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-3 rounded-xl">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl">Modern Consultation System</CardTitle>
            <CardDescription className="text-base mt-1">
              Enhanced clinical documentation with smart features
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Feature 1 */}
          <div className="bg-white p-4 rounded-lg border border-blue-200 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Zap className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">60% Faster</h3>
            </div>
            <p className="text-sm text-gray-600">
              Quick templates and auto-fill reduce documentation time significantly
            </p>
            <Badge variant="secondary" className="mt-2 text-xs">
              <Clock className="h-3 w-3 mr-1" />
              Time Saver
            </Badge>
          </div>

          {/* Feature 2 */}
          <div className="bg-white p-4 rounded-lg border border-purple-200 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-purple-100 p-2 rounded-lg">
                <Sparkles className="h-5 w-5 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900">AI-Powered</h3>
            </div>
            <p className="text-sm text-gray-600">
              Smart medication suggestions and clinical decision support
            </p>
            <Badge variant="secondary" className="mt-2 text-xs">
              <TrendingUp className="h-3 w-3 mr-1" />
              Smart Tech
            </Badge>
          </div>

          {/* Feature 3 */}
          <div className="bg-white p-4 rounded-lg border border-green-200 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-green-100 p-2 rounded-lg">
                <Shield className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Zero Data Loss</h3>
            </div>
            <p className="text-sm text-gray-600">
              Auto-save every 30 seconds ensures no work is lost
            </p>
            <Badge variant="secondary" className="mt-2 text-xs">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Reliable
            </Badge>
          </div>

          {/* Feature 4 */}
          <div className="bg-white p-4 rounded-lg border border-orange-200 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-orange-100 p-2 rounded-lg">
                <BarChart3 className="h-5 w-5 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Better Quality</h3>
            </div>
            <p className="text-sm text-gray-600">
              Structured forms and validation improve documentation quality
            </p>
            <Badge variant="secondary" className="mt-2 text-xs">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Quality First
            </Badge>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-purple-600">10+</div>
              <div className="text-sm text-gray-600 mt-1">Templates</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">5</div>
              <div className="text-sm text-gray-600 mt-1">Steps</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600">100%</div>
              <div className="text-sm text-gray-600 mt-1">Mobile Ready</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600">24/7</div>
              <div className="text-sm text-gray-600 mt-1">Auto-Save</div>
            </div>
          </div>
        </div>

        {/* New Features List */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-3">✨ New Features</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2 text-gray-700">
              <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
              <span>Multi-step wizard with progress tracking</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
              <span>Real-time vital signs validation</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
              <span>Automatic BMI calculation</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
              <span>Smart medication suggestions</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
              <span>Specialist consultation forms</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
              <span>Quick templates for common cases</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
              <span>Form completion percentage tracking</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
              <span>Clinical alerts for abnormal values</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

