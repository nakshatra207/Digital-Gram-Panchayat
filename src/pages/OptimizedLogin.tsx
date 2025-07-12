import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '@/components/OptimizedAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, ArrowLeft, User, Shield, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { setupDemoUsers } from '@/utils/setupDemoUsers';

const OptimizedLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const preselectedRole = searchParams.get('role');

  // Set preselected role only once
  React.useEffect(() => {
    if (preselectedRole && !role) {
      setRole(preselectedRole);
    }
  }, [preselectedRole, role]);

  // Memoized role options to prevent re-creation
  const roleOptions = useMemo(() => [
    { value: 'officer', label: 'Officer/Admin', icon: Shield, description: 'System administration and oversight' },
    { value: 'staff', label: 'Staff', icon: Users, description: 'Application processing and management' },
    { value: 'citizen', label: 'Citizen', icon: User, description: 'Service applications and tracking' }
  ], []);

  // Memoized demo credentials
  const demoCredentials = useMemo(() => ({
    officer: { email: 'admin@gp.gov.in', password: 'admin123' },
    staff: { email: 'staff@gp.gov.in', password: 'staff123' },
    citizen: { email: 'citizen@gp.gov.in', password: 'citizen123' }
  }), []);

  // Optimized form submission
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password || !role) {
      setError('Please fill in all fields');
      return;
    }

    console.log('Attempting login with:', { email, role });

    const success = await login(email, password);
    
    if (success) {
      // Show success message immediately
      toast({
        title: "Login Successful",
        description: `Welcome back! Redirecting to dashboard...`,
      });
      
      // Small delay to ensure auth state is updated
      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 100);
    } else {
      setError('Login failed. Please check your credentials or configuration.');
    }
  }, [email, password, role, login, navigate, toast]);

  // Optimized demo credentials filler
  const fillDemoCredentials = useCallback((roleType: keyof typeof demoCredentials) => {
    const creds = demoCredentials[roleType];
    setEmail(creds.email);
    setPassword(creds.password);
    setRole(roleType);
  }, [demoCredentials]);

  // Optimized input handlers
  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) setError(''); // Clear error on input
  }, [error]);

  const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (error) setError(''); // Clear error on input
  }, [error]);

  const handleRoleChange = useCallback((value: string) => {
    setRole(value);
    if (error) setError(''); // Clear error on input
  }, [error]);

  // Setup demo users on component mount
  React.useEffect(() => {
    // Only setup demo users if Supabase is configured
    if (isSupabaseConfigured) {
      setupDemoUsers().catch(console.error);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="h-12 w-12 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">GP</span>
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-bold text-gray-900">E-Services Portal</h1>
              <p className="text-sm text-gray-600">Secure Login</p>
            </div>
          </div>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Sign In</CardTitle>
            <CardDescription>
              Access your Gram Panchayat services account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="role">Select Role</Label>
                <Select value={role} onValueChange={handleRoleChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose your role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roleOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center space-x-2">
                          <option.icon className="h-4 w-4" />
                          <div>
                            <div className="font-medium">{option.label}</div>
                            <div className="text-xs text-gray-500">{option.description}</div>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="Enter your email"
                  required
                  autoComplete="email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-3">Demo Credentials:</p>
              <div className="space-y-2">
                {Object.entries(demoCredentials).map(([roleType, creds]) => (
                  <Button
                    key={roleType}
                    variant="outline"
                    size="sm"
                    onClick={() => fillDemoCredentials(roleType as keyof typeof demoCredentials)}
                    className="w-full justify-start text-xs"
                  >
                    <span className="capitalize font-medium">{roleType}:</span>
                    <span className="ml-2">{creds.email}</span>
                  </Button>
                ))}
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="text-blue-600 hover:underline font-medium">
                  Register here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OptimizedLogin;
