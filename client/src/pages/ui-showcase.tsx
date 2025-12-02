import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertCircle,
  CheckCircle2,
  Info,
  XCircle,
  Heart,
  Activity,
  User,
  Calendar,
  Stethoscope,
  Pill,
  FileText,
  Settings,
  Palette
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function UIShowcase() {
  const { toast } = useToast();
  const [switchValue, setSwitchValue] = useState(false);
  const [sliderValue, setSliderValue] = useState([50]);

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Palette className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-gray-900">UI Component Showcase</h1>
        </div>
        <p className="text-gray-600">
          Explore the design system and UI components available in Bluequee Healthcare
        </p>
      </div>

      <Tabs defaultValue="buttons" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="buttons">Buttons</TabsTrigger>
          <TabsTrigger value="inputs">Inputs</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="cards">Cards</TabsTrigger>
          <TabsTrigger value="badges">Badges</TabsTrigger>
        </TabsList>

        {/* Buttons Tab */}
        <TabsContent value="buttons" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Button Variants</CardTitle>
              <CardDescription>Different button styles and sizes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Variants */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Variants</Label>
                <div className="flex flex-wrap gap-3">
                  <Button variant="default">Default</Button>
                  <Button variant="destructive">Destructive</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="link">Link</Button>
                </div>
              </div>

              <Separator />

              {/* Sizes */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Sizes</Label>
                <div className="flex flex-wrap gap-3 items-center">
                  <Button size="sm">Small</Button>
                  <Button size="default">Default</Button>
                  <Button size="lg">Large</Button>
                </div>
              </div>

              <Separator />

              {/* With Icons */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">With Icons</Label>
                <div className="flex flex-wrap gap-3">
                  <Button>
                    <Heart className="mr-2 h-4 w-4" />
                    Save Patient
                  </Button>
                  <Button variant="outline">
                    <Activity className="mr-2 h-4 w-4" />
                    View Vitals
                  </Button>
                  <Button variant="secondary">
                    <Stethoscope className="mr-2 h-4 w-4" />
                    Examine
                  </Button>
                </div>
              </div>

              <Separator />

              {/* States */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">States</Label>
                <div className="flex flex-wrap gap-3">
                  <Button disabled>Disabled</Button>
                  <Button 
                    onClick={() => toast({
                      title: "Button clicked!",
                      description: "This is a clickable button",
                    })}
                  >
                    Click Me
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Inputs Tab */}
        <TabsContent value="inputs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Form Controls</CardTitle>
              <CardDescription>Input fields, selects, switches, and sliders</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Text Input */}
              <div className="space-y-2">
                <Label htmlFor="patient-name">Patient Name</Label>
                <Input id="patient-name" placeholder="Enter patient name" />
              </div>

              {/* Select */}
              <div className="space-y-2">
                <Label htmlFor="blood-type">Blood Type</Label>
                <Select>
                  <SelectTrigger id="blood-type">
                    <SelectValue placeholder="Select blood type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="a+">A+</SelectItem>
                    <SelectItem value="a-">A-</SelectItem>
                    <SelectItem value="b+">B+</SelectItem>
                    <SelectItem value="b-">B-</SelectItem>
                    <SelectItem value="ab+">AB+</SelectItem>
                    <SelectItem value="ab-">AB-</SelectItem>
                    <SelectItem value="o+">O+</SelectItem>
                    <SelectItem value="o-">O-</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* Switch */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifications">Email Notifications</Label>
                  <p className="text-sm text-gray-500">
                    Receive email notifications for appointments
                  </p>
                </div>
                <Switch
                  id="notifications"
                  checked={switchValue}
                  onCheckedChange={setSwitchValue}
                />
              </div>

              <Separator />

              {/* Slider */}
              <div className="space-y-4">
                <div className="flex justify-between">
                  <Label htmlFor="pain-level">Pain Level</Label>
                  <span className="text-sm text-gray-500">{sliderValue[0]}/100</span>
                </div>
                <Slider
                  id="pain-level"
                  value={sliderValue}
                  onValueChange={setSliderValue}
                  max={100}
                  step={1}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Alerts Tab */}
        <TabsContent value="alerts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Alert Messages</CardTitle>
              <CardDescription>Different types of notification alerts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Information</AlertTitle>
                <AlertDescription>
                  This is an informational message for general updates.
                </AlertDescription>
              </Alert>

              <Alert variant="default" className="border-green-200 bg-green-50">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800">Success</AlertTitle>
                <AlertDescription className="text-green-700">
                  Patient record has been successfully updated.
                </AlertDescription>
              </Alert>

              <Alert variant="default" className="border-yellow-200 bg-yellow-50">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <AlertTitle className="text-yellow-800">Warning</AlertTitle>
                <AlertDescription className="text-yellow-700">
                  This patient has multiple medication allergies.
                </AlertDescription>
              </Alert>

              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  Failed to save patient data. Please try again.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cards Tab */}
        <TabsContent value="cards" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Simple Card */}
            <Card>
              <CardHeader>
                <CardTitle>Simple Card</CardTitle>
                <CardDescription>Basic card with header and content</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  This is a basic card component used throughout the application.
                </p>
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,543</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>

            {/* Action Card */}
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  Appointments
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-gray-700">5 appointments today</p>
                <Button variant="outline" size="sm" className="w-full">
                  View Schedule
                </Button>
              </CardContent>
            </Card>

            {/* Medical Card */}
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Pill className="h-5 w-5 text-green-600" />
                  Pharmacy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-gray-700">15 pending prescriptions</p>
                <Button variant="outline" size="sm" className="w-full">
                  View Pharmacy
                </Button>
              </CardContent>
            </Card>

            {/* Document Card */}
            <Card className="border-purple-200 bg-purple-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-purple-600" />
                  Documents
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-gray-700">New lab results available</p>
                <Button variant="outline" size="sm" className="w-full">
                  View Documents
                </Button>
              </CardContent>
            </Card>

            {/* Settings Card */}
            <Card className="border-gray-200 bg-gray-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-gray-600" />
                  Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-gray-700">Configure system preferences</p>
                <Button variant="outline" size="sm" className="w-full">
                  Open Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Badges Tab */}
        <TabsContent value="badges" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Badge Components</CardTitle>
              <CardDescription>Status indicators and labels</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Variants */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Variants</Label>
                <div className="flex flex-wrap gap-3">
                  <Badge variant="default">Default</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="outline">Outline</Badge>
                  <Badge variant="destructive">Destructive</Badge>
                </div>
              </div>

              <Separator />

              {/* Medical Status Badges */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Medical Status</Label>
                <div className="flex flex-wrap gap-3">
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                    Stable
                  </Badge>
                  <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
                    Monitoring
                  </Badge>
                  <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">
                    Critical
                  </Badge>
                  <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
                    Emergency
                  </Badge>
                  <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                    Scheduled
                  </Badge>
                  <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">
                    In Progress
                  </Badge>
                  <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">
                    Completed
                  </Badge>
                </div>
              </div>

              <Separator />

              {/* With Icons */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">With Icons</Label>
                <div className="flex flex-wrap gap-3">
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle2 className="mr-1 h-3 w-3" />
                    Verified
                  </Badge>
                  <Badge className="bg-blue-100 text-blue-800">
                    <Activity className="mr-1 h-3 w-3" />
                    Active
                  </Badge>
                  <Badge className="bg-red-100 text-red-800">
                    <AlertCircle className="mr-1 h-3 w-3" />
                    Alert
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog Example */}
      <Card>
        <CardHeader>
          <CardTitle>Modal Dialog</CardTitle>
          <CardDescription>Interactive dialog component</CardDescription>
        </CardHeader>
        <CardContent>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Open Dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Patient Information</DialogTitle>
                <DialogDescription>
                  This is an example of a modal dialog used for displaying information or forms.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Enter patient name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input id="age" type="number" placeholder="Enter age" />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline">Cancel</Button>
                <Button>Save</Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* Color Palette */}
      <Card>
        <CardHeader>
          <CardTitle>Color Palette</CardTitle>
          <CardDescription>Primary colors used in the healthcare system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div className="space-y-2">
              <div className="h-20 rounded-lg bg-blue-500"></div>
              <p className="text-sm font-medium">Primary Blue</p>
            </div>
            <div className="space-y-2">
              <div className="h-20 rounded-lg bg-green-500"></div>
              <p className="text-sm font-medium">Success Green</p>
            </div>
            <div className="space-y-2">
              <div className="h-20 rounded-lg bg-yellow-500"></div>
              <p className="text-sm font-medium">Warning Yellow</p>
            </div>
            <div className="space-y-2">
              <div className="h-20 rounded-lg bg-red-500"></div>
              <p className="text-sm font-medium">Error Red</p>
            </div>
            <div className="space-y-2">
              <div className="h-20 rounded-lg bg-purple-500"></div>
              <p className="text-sm font-medium">Accent Purple</p>
            </div>
            <div className="space-y-2">
              <div className="h-20 rounded-lg bg-gray-500"></div>
              <p className="text-sm font-medium">Neutral Gray</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

