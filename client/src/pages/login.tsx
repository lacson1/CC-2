import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Heart, Shield, Activity, Stethoscope, Users, Eye, EyeOff, Zap, Star, CheckCircle, Brain, BarChart3 } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      await login(username, password);
    } catch (error) {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50/30 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Clean Futuristic Background */}
      <div className="absolute inset-0">
        {/* Simplified gradient orbs */}
        <div className="absolute top-20 -right-32 w-80 h-80 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-gradient-to-tr from-indigo-500/20 to-blue-500/20 rounded-full blur-3xl"></div>
        
        {/* Geometric patterns */}
        <div className="absolute top-1/4 right-1/4 w-1 h-32 bg-gradient-to-b from-blue-400/30 to-transparent transform rotate-45"></div>
        <div className="absolute bottom-1/4 left-1/4 w-1 h-24 bg-gradient-to-t from-cyan-400/30 to-transparent transform -rotate-45"></div>
        
        {/* Minimal floating elements */}
        <div className="absolute top-1/3 right-1/5 w-2 h-2 bg-blue-400/60 rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/3 left-1/5 w-1.5 h-1.5 bg-cyan-400/60 rounded-full animate-pulse delay-1000"></div>
      </div>
      
      <div className="relative z-10 w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Side - Clean Futuristic Branding */}
        <div className="hidden lg:block space-y-10">
          <div className="space-y-8">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Stethoscope className="w-7 h-7 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-blue-600 bg-clip-text text-transparent">
                  ClinicConnect
                </h1>
                <p className="text-slate-600 font-medium">
                  Next-Generation Healthcare Platform
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-slate-800">
                AI-Powered Healthcare Platform
              </h2>
              <p className="text-slate-600 leading-relaxed">
                Intelligent healthcare automation with advanced analytics, predictive insights, and seamless patient care coordination.
              </p>
              <div className="flex items-center space-x-6 text-sm text-slate-500">
                <span className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                  AI Diagnostics
                </span>
                <span className="flex items-center">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse"></div>
                  Smart Analytics
                </span>
                <span className="flex items-center">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-2 animate-pulse"></div>
                  Predictive Care
                </span>
              </div>
            </div>
          </div>
          
          {/* Clean Feature Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="group bg-white/60 backdrop-blur-sm p-5 rounded-xl border border-slate-200 hover:border-blue-200 hover:shadow-lg transition-all duration-300">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-3">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-1">AI Diagnostics</h3>
              <p className="text-sm text-slate-600">Intelligent health insights</p>
            </div>
            
            <div className="group bg-white/60 backdrop-blur-sm p-5 rounded-xl border border-slate-200 hover:border-cyan-200 hover:shadow-lg transition-all duration-300">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-lg flex items-center justify-center mb-3">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-1">Smart Analytics</h3>
              <p className="text-sm text-slate-600">Predictive healthcare data</p>
            </div>
            
            <div className="group bg-white/60 backdrop-blur-sm p-5 rounded-xl border border-slate-200 hover:border-indigo-200 hover:shadow-lg transition-all duration-300">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center mb-3">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-1">Patient Monitoring</h3>
              <p className="text-sm text-slate-600">Real-time health tracking</p>
            </div>
            
            <div className="group bg-white/60 backdrop-blur-sm p-5 rounded-xl border border-slate-200 hover:border-blue-200 hover:shadow-lg transition-all duration-300">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-slate-600 rounded-lg flex items-center justify-center mb-3">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-1">Secure Platform</h3>
              <p className="text-sm text-slate-600">HIPAA-compliant security</p>
            </div>
          </div>
        </div>
        
        {/* Right Side - Clean Futuristic Login Form */}
        <div className="w-full max-w-md mx-auto lg:mx-0">
          <Card className="bg-white/95 backdrop-blur-xl border-0 shadow-xl ring-1 ring-slate-200/50">
            <CardHeader className="space-y-6 pb-8">
              <div className="text-center space-y-4">
                <div className="relative mx-auto">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <Stethoscope className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="space-y-2">
                  <CardTitle className="text-2xl font-bold text-slate-800">
                    Welcome Back
                  </CardTitle>
                  <CardDescription className="text-slate-600">
                    Access your healthcare dashboard
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-sm font-medium text-slate-700">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                    required
                    disabled={isLoading}
                    className="h-12 bg-white border-slate-200 focus:border-blue-400 focus:ring-blue-400/20"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-slate-700">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      required
                      disabled={isLoading}
                      className="h-12 bg-white border-slate-200 focus:border-blue-400 focus:ring-blue-400/20 pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
                
                {error && (
                  <Alert variant="destructive" className="border-red-200 bg-red-50/80">
                    <AlertDescription className="text-red-700">{error}</AlertDescription>
                  </Alert>
                )}
                
                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    'Access Dashboard'
                  )}
                </Button>
              </form>
              
              {/* Demo Accounts */}
              <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
                <p className="text-sm font-semibold text-blue-900 mb-3 flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  Demo Accounts
                </p>
                <div className="grid grid-cols-1 gap-2 text-xs">
                  <div className="flex justify-between items-center py-1 px-2 bg-white/60 rounded-lg">
                    <span className="font-medium text-gray-700">Admin</span>
                    <span className="text-blue-600 font-mono">admin / admin123</span>
                  </div>
                  <div className="flex justify-between items-center py-1 px-2 bg-white/60 rounded-lg">
                    <span className="font-medium text-gray-700">Doctor</span>
                    <span className="text-blue-600 font-mono">ade / doctor123</span>
                  </div>
                  <div className="flex justify-between items-center py-1 px-2 bg-white/60 rounded-lg">
                    <span className="font-medium text-gray-700">Nurse</span>
                    <span className="text-blue-600 font-mono">syb / nurse123</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Mobile Branding */}
          <div className="lg:hidden mt-8 text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
                <Stethoscope className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                ClinicConnect
              </h1>
            </div>
            <p className="text-sm text-gray-600">Advanced Healthcare Management Platform</p>
          </div>
        </div>
      </div>
    </div>
  );
}