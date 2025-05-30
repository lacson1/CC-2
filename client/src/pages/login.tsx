import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Heart, Shield, Activity, Stethoscope, Users, Eye, EyeOff, Zap, Star, CheckCircle } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-indigo-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Enhanced Background Graphics */}
      <div className="absolute inset-0">
        {/* Main gradient orbs */}
        <div className="absolute top-20 -right-32 w-96 h-96 bg-gradient-to-br from-blue-400/30 to-cyan-400/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-gradient-to-tr from-indigo-400/30 to-blue-400/30 rounded-full blur-3xl animate-pulse"></div>
        
        {/* Secondary accent orbs */}
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-gradient-to-br from-cyan-300/20 to-blue-300/20 rounded-full blur-2xl"></div>
        <div className="absolute bottom-1/4 right-1/3 w-72 h-72 bg-gradient-to-tr from-blue-300/25 to-indigo-300/25 rounded-full blur-2xl"></div>
        
        {/* Medical graphics */}
        <div className="absolute top-10 left-10 opacity-10">
          <Heart className="w-24 h-24 text-blue-600 rotate-12" />
        </div>
        <div className="absolute bottom-10 right-10 opacity-10">
          <Activity className="w-32 h-32 text-indigo-600 -rotate-12" />
        </div>
        <div className="absolute top-1/2 left-5 opacity-8">
          <Stethoscope className="w-20 h-20 text-cyan-600 rotate-45" />
        </div>
        
        {/* Floating elements */}
        <div className="absolute top-1/4 right-20 w-3 h-3 bg-blue-400 rounded-full animate-bounce"></div>
        <div className="absolute top-2/3 left-20 w-2 h-2 bg-cyan-400 rounded-full animate-bounce delay-300"></div>
        <div className="absolute top-1/3 right-1/3 w-4 h-4 bg-indigo-400 rounded-full animate-bounce delay-700"></div>
      </div>
      
      <div className="relative z-10 w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Side - Enhanced Branding & Features */}
        <div className="hidden lg:block space-y-8">
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-300">
                  <Stethoscope className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                  <Star className="w-3 h-3 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 bg-clip-text text-transparent">
                  ClinicConnect
                </h1>
                <p className="text-blue-600 font-medium flex items-center">
                  <Zap className="w-4 h-4 mr-1" />
                  Advanced Healthcare Management
                </p>
              </div>
            </div>
            
            <div className="space-y-6 p-6 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 rounded-2xl border border-blue-100">
              <h2 className="text-3xl font-bold text-blue-900">
                Transform Your Healthcare Practice
              </h2>
              <p className="text-lg text-blue-700 leading-relaxed">
                Experience the future of clinic management with our comprehensive platform designed specifically for Southwest Nigerian healthcare providers.
              </p>
              <div className="flex items-center space-x-4 text-sm text-blue-600">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Multi-tenant Support
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  HIPAA Compliant
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Real-time Updates
                </div>
              </div>
            </div>
          </div>
          
          {/* Enhanced Feature Highlights */}
          <div className="grid grid-cols-2 gap-6">
            <div className="group bg-gradient-to-br from-blue-50/90 to-indigo-50/90 backdrop-blur-sm p-6 rounded-2xl border border-blue-200/50 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <div className="relative w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform duration-300">
                <Users className="w-6 h-6 text-white" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-400 rounded-full animate-ping"></div>
              </div>
              <h3 className="font-bold text-blue-900 mb-2">Patient Management</h3>
              <p className="text-sm text-blue-700">Complete patient records and visit tracking with real-time updates</p>
            </div>
            
            <div className="group bg-gradient-to-br from-cyan-50/90 to-blue-50/90 backdrop-blur-sm p-6 rounded-2xl border border-cyan-200/50 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <div className="relative w-12 h-12 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform duration-300">
                <Activity className="w-6 h-6 text-white" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-400 rounded-full animate-ping"></div>
              </div>
              <h3 className="font-bold text-cyan-900 mb-2">Lab Management</h3>
              <p className="text-sm text-cyan-700">435+ comprehensive laboratory tests across all medical specialties</p>
            </div>
            
            <div className="group bg-gradient-to-br from-indigo-50/90 to-purple-50/90 backdrop-blur-sm p-6 rounded-2xl border border-indigo-200/50 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <div className="relative w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform duration-300">
                <Heart className="w-6 h-6 text-white" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-purple-400 rounded-full animate-ping"></div>
              </div>
              <h3 className="font-bold text-indigo-900 mb-2">Specialist Care</h3>
              <p className="text-sm text-indigo-700">26 specialist consultation forms for comprehensive care</p>
            </div>
            
            <div className="group bg-gradient-to-br from-blue-50/90 to-cyan-50/90 backdrop-blur-sm p-6 rounded-2xl border border-blue-200/50 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <div className="relative w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform duration-300">
                <Shield className="w-6 h-6 text-white" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-ping"></div>
              </div>
              <h3 className="font-bold text-blue-900 mb-2">Secure & Compliant</h3>
              <p className="text-sm text-blue-700">Multi-tenant architecture with advanced role-based access control</p>
            </div>
          </div>
        </div>
        
        {/* Right Side - Enhanced Login Form */}
        <div className="w-full max-w-md mx-auto lg:mx-0">
          <Card className="bg-gradient-to-br from-white/95 to-blue-50/95 backdrop-blur-xl border-0 shadow-2xl ring-1 ring-blue-200/50">
            <CardHeader className="space-y-6 pb-8">
              <div className="text-center space-y-4">
                <div className="relative mx-auto">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 rounded-3xl flex items-center justify-center shadow-2xl hover:scale-110 transition-transform duration-300">
                    <Stethoscope className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full flex items-center justify-center animate-pulse">
                    <Star className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="space-y-2">
                  <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-800 to-cyan-700 bg-clip-text text-transparent">
                    Welcome Back
                  </CardTitle>
                  <CardDescription className="text-blue-600 font-medium">
                    Sign in to access your clinic dashboard
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-sm font-medium text-gray-700">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    required
                    disabled={isLoading}
                    className="h-12 bg-white/80 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                      disabled={isLoading}
                      className="h-12 bg-white/80 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600"
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
                  <Alert variant="destructive" className="border-red-200 bg-red-50">
                    <AlertDescription className="text-red-700">{error}</AlertDescription>
                  </Alert>
                )}
                
                <Button 
                  type="submit" 
                  className="w-full h-14 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-700 hover:via-blue-600 hover:to-cyan-600 text-white font-semibold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 relative overflow-hidden group" 
                  disabled={isLoading}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      <Zap className="mr-2 h-5 w-5" />
                      Sign In to Dashboard
                    </>
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