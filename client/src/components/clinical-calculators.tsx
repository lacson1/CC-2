import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator, Heart, Activity, Droplet, Baby, Thermometer } from 'lucide-react';

export function ClinicalCalculators() {
  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-6 w-6 text-blue-600" />
            Clinical Calculators
          </CardTitle>
          <CardDescription>
            Evidence-based medical calculators for clinical decision support
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="bmi">
            <TabsList className="grid grid-cols-3 lg:grid-cols-6 gap-2">
              <TabsTrigger value="bmi">BMI</TabsTrigger>
              <TabsTrigger value="gfr">GFR</TabsTrigger>
              <TabsTrigger value="cardiac">Cardiac Risk</TabsTrigger>
              <TabsTrigger value="fluid">Fluid Needs</TabsTrigger>
              <TabsTrigger value="pregnancy">Pregnancy</TabsTrigger>
              <TabsTrigger value="dosing">Dosing</TabsTrigger>
            </TabsList>

            <TabsContent value="bmi">
              <BMICalculator />
            </TabsContent>

            <TabsContent value="gfr">
              <GFRCalculator />
            </TabsContent>

            <TabsContent value="cardiac">
              <CardiacRiskCalculator />
            </TabsContent>

            <TabsContent value="fluid">
              <FluidRequirementsCalculator />
            </TabsContent>

            <TabsContent value="pregnancy">
              <PregnancyCalculator />
            </TabsContent>

            <TabsContent value="dosing">
              <DosingCalculator />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

function BMICalculator() {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height) / 100; // cm to m
    const a = parseInt(age);
    
    if (w > 0 && h > 0) {
      const bmi = w / (h * h);
      let category = '';
      let color = '';
      
      if (a < 18) {
        // Use pediatric percentiles (simplified)
        category = 'See pediatric growth charts';
        color = 'blue';
      } else {
        if (bmi < 18.5) {
          category = 'Underweight';
          color = 'blue';
        } else if (bmi < 25) {
          category = 'Normal weight';
          color = 'green';
        } else if (bmi < 30) {
          category = 'Overweight';
          color = 'yellow';
        } else {
          category = 'Obese';
          color = 'red';
        }
      }
      
      setResult({ bmi: bmi.toFixed(1), category, color });
    }
  };

  return (
    <div className="space-y-4 py-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label>Weight (kg)</Label>
          <Input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="70"
          />
        </div>
        <div>
          <Label>Height (cm)</Label>
          <Input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder="170"
          />
        </div>
        <div>
          <Label>Age (years)</Label>
          <Input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="25"
          />
        </div>
      </div>

      <Button onClick={calculate} className="w-full">Calculate BMI</Button>

      {result && (
        <Card className="bg-slate-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">{result.bmi}</div>
              <Badge variant={result.color === 'green' ? 'default' : 'secondary'} className="text-lg">
                {result.category}
              </Badge>
              <p className="text-sm text-muted-foreground mt-4">
                BMI = Weight (kg) / Height² (m²)
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function GFRCalculator() {
  const [creatinine, setCreatinine] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('male');
  const [race, setRace] = useState('other');
  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    const cr = parseFloat(creatinine);
    const a = parseInt(age);
    
    if (cr > 0 && a > 0) {
      // MDRD formula (simplified)
      let gfr = 175 * Math.pow(cr, -1.154) * Math.pow(a, -0.203);
      if (gender === 'female') gfr *= 0.742;
      if (race === 'black') gfr *= 1.212;
      
      let stage = '';
      let color = '';
      
      if (gfr >= 90) {
        stage = 'Stage 1 (Normal or high)';
        color = 'green';
      } else if (gfr >= 60) {
        stage = 'Stage 2 (Mild reduction)';
        color = 'green';
      } else if (gfr >= 45) {
        stage = 'Stage 3a (Mild to moderate reduction)';
        color = 'yellow';
      } else if (gfr >= 30) {
        stage = 'Stage 3b (Moderate to severe reduction)';
        color = 'orange';
      } else if (gfr >= 15) {
        stage = 'Stage 4 (Severe reduction)';
        color = 'red';
      } else {
        stage = 'Stage 5 (Kidney failure)';
        color = 'red';
      }
      
      setResult({ gfr: gfr.toFixed(1), stage, color });
    }
  };

  return (
    <div className="space-y-4 py-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Serum Creatinine (mg/dL)</Label>
          <Input
            type="number"
            step="0.1"
            value={creatinine}
            onChange={(e) => setCreatinine(e.target.value)}
            placeholder="1.0"
          />
        </div>
        <div>
          <Label>Age (years)</Label>
          <Input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="50"
          />
        </div>
        <div>
          <Label>Gender</Label>
          <Select value={gender} onValueChange={setGender}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Race</Label>
          <Select value={race} onValueChange={setRace}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="black">Black/African American</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button onClick={calculate} className="w-full">Calculate GFR</Button>

      {result && (
        <Card className="bg-slate-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">{result.gfr} <span className="text-lg">mL/min/1.73m²</span></div>
              <Badge variant="secondary" className="text-lg">
                {result.stage}
              </Badge>
              <p className="text-sm text-muted-foreground mt-4">
                Using MDRD formula
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function CardiacRiskCalculator() {
  const [age, setAge] = useState('');
  const [systolic, setSystolic] = useState('');
  const [cholesterol, setCholesterol] = useState('');
  const [hdl, setHdl] = useState('');
  const [smoker, setSmoker] = useState('no');
  const [diabetic, setDiabetic] = useState('no');
  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    // Simplified Framingham risk score
    const a = parseInt(age);
    const sbp = parseInt(systolic);
    const tc = parseInt(cholesterol);
    const hdlc = parseInt(hdl);
    
    if (a > 0 && sbp > 0 && tc > 0 && hdlc > 0) {
      let points = 0;
      
      // Age points (simplified)
      if (a >= 70) points += 8;
      else if (a >= 60) points += 6;
      else if (a >= 50) points += 4;
      else if (a >= 40) points += 2;
      
      // Cholesterol
      if (tc >= 280) points += 4;
      else if (tc >= 240) points += 3;
      else if (tc >= 200) points += 2;
      
      // HDL
      if (hdlc < 35) points += 2;
      else if (hdlc < 45) points += 1;
      else if (hdlc >= 60) points -= 1;
      
      // BP
      if (sbp >= 160) points += 3;
      else if (sbp >= 140) points += 2;
      else if (sbp >= 130) points += 1;
      
      // Risk factors
      if (smoker === 'yes') points += 2;
      if (diabetic === 'yes') points += 2;
      
      const risk = Math.min(Math.max(points * 2, 1), 30);
      let category = '';
      
      if (risk < 10) category = 'Low Risk';
      else if (risk < 20) category = 'Moderate Risk';
      else category = 'High Risk';
      
      setResult({ risk: risk.toFixed(1), category });
    }
  };

  return (
    <div className="space-y-4 py-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Age (years)</Label>
          <Input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="55"
          />
        </div>
        <div>
          <Label>Systolic BP (mmHg)</Label>
          <Input
            type="number"
            value={systolic}
            onChange={(e) => setSystolic(e.target.value)}
            placeholder="140"
          />
        </div>
        <div>
          <Label>Total Cholesterol (mg/dL)</Label>
          <Input
            type="number"
            value={cholesterol}
            onChange={(e) => setCholesterol(e.target.value)}
            placeholder="200"
          />
        </div>
        <div>
          <Label>HDL Cholesterol (mg/dL)</Label>
          <Input
            type="number"
            value={hdl}
            onChange={(e) => setHdl(e.target.value)}
            placeholder="50"
          />
        </div>
        <div>
          <Label>Smoker</Label>
          <Select value={smoker} onValueChange={setSmoker}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="no">No</SelectItem>
              <SelectItem value="yes">Yes</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Diabetic</Label>
          <Select value={diabetic} onValueChange={setDiabetic}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="no">No</SelectItem>
              <SelectItem value="yes">Yes</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button onClick={calculate} className="w-full">
        <Heart className="mr-2 h-4 w-4" />
        Calculate 10-Year CVD Risk
      </Button>

      {result && (
        <Card className="bg-slate-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">{result.risk}%</div>
              <Badge variant="secondary" className="text-lg">
                {result.category}
              </Badge>
              <p className="text-sm text-muted-foreground mt-4">
                10-year cardiovascular disease risk
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function FluidRequirementsCalculator() {
  const [weight, setWeight] = useState('');
  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    const w = parseFloat(weight);
    
    if (w > 0) {
      // Holliday-Segar method
      let fluids = 0;
      
      if (w <= 10) {
        fluids = w * 100;
      } else if (w <= 20) {
        fluids = 1000 + ((w - 10) * 50);
      } else {
        fluids = 1500 + ((w - 20) * 20);
      }
      
      setResult({ 
        daily: fluids.toFixed(0), 
        hourly: (fluids / 24).toFixed(1) 
      });
    }
  };

  return (
    <div className="space-y-4 py-4">
      <div>
        <Label>Weight (kg)</Label>
        <Input
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          placeholder="25"
        />
      </div>

      <Button onClick={calculate} className="w-full">
        <Droplet className="mr-2 h-4 w-4" />
        Calculate Fluid Requirements
      </Button>

      {result && (
        <Card className="bg-slate-50">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-sm text-muted-foreground">Daily Requirement</div>
                <div className="text-3xl font-bold">{result.daily} mL/day</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-muted-foreground">Hourly Rate</div>
                <div className="text-3xl font-bold">{result.hourly} mL/hr</div>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Using Holliday-Segar method
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function PregnancyCalculator() {
  const [lmp, setLmp] = useState('');
  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    if (lmp) {
      const lmpDate = new Date(lmp);
      const today = new Date();
      
      // Calculate EDD (Naegele's rule: LMP + 280 days)
      const edd = new Date(lmpDate);
      edd.setDate(edd.getDate() + 280);
      
      // Calculate gestational age
      const diffTime = Math.abs(today.getTime() - lmpDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const weeks = Math.floor(diffDays / 7);
      const days = diffDays % 7;
      
      const trimester = weeks < 13 ? 1 : weeks < 27 ? 2 : 3;
      
      setResult({
        edd: edd.toLocaleDateString(),
        weeks,
        days,
        trimester
      });
    }
  };

  return (
    <div className="space-y-4 py-4">
      <div>
        <Label>Last Menstrual Period (LMP)</Label>
        <Input
          type="date"
          value={lmp}
          onChange={(e) => setLmp(e.target.value)}
        />
      </div>

      <Button onClick={calculate} className="w-full">
        <Baby className="mr-2 h-4 w-4" />
        Calculate Pregnancy Dates
      </Button>

      {result && (
        <Card className="bg-slate-50">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground">Gestational Age</div>
                <div className="text-2xl font-bold">
                  {result.weeks} weeks, {result.days} days
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Trimester</div>
                <div className="text-xl font-semibold">{result.trimester}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Estimated Due Date (EDD)</div>
                <div className="text-xl font-semibold">{result.edd}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function DosingCalculator() {
  const [weight, setWeight] = useState('');
  const [dose, setDose] = useState('');
  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    const w = parseFloat(weight);
    const d = parseFloat(dose);
    
    if (w > 0 && d > 0) {
      const totalDose = (w * d).toFixed(1);
      setResult({ totalDose });
    }
  };

  return (
    <div className="space-y-4 py-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Patient Weight (kg)</Label>
          <Input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="70"
          />
        </div>
        <div>
          <Label>Dose (mg/kg)</Label>
          <Input
            type="number"
            step="0.1"
            value={dose}
            onChange={(e) => setDose(e.target.value)}
            placeholder="10"
          />
        </div>
      </div>

      <Button onClick={calculate} className="w-full">Calculate Dose</Button>

      {result && (
        <Card className="bg-slate-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Total Dose</div>
              <div className="text-4xl font-bold">{result.totalDose} mg</div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
