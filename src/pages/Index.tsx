import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, FileText, Settings, CheckCircle } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Users className="h-8 w-8 text-blue-600" />,
      title: "Multi-Role Access",
      description: "Separate portals for Officers, Staff, and Citizens"
    },
    {
      icon: <CheckCircle className="h-8 w-8 text-emerald-600" />,
      title: "Application Tracking",
      description: "Real-time status updates and progress tracking"
    }
  ];

  const stats = [
    { label: "Active Services", value: "25+", color: "bg-orange-100 text-orange-800" },
    { label: "Applications Processed", value: "500+", color: "bg-green-100 text-green-800" },
    { label: "Citizens Registered", value: "1000+", color: "bg-blue-100 text-blue-800" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50">
      {/* Header with Indian Flag Colors */}
      <header className="bg-white shadow-lg border-b-4 border-gradient-to-r from-orange-500 via-white to-green-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-gradient-to-b from-orange-500 via-white to-green-500 rounded-lg flex items-center justify-center border-2 border-blue-600">
                <span className="text-blue-800 font-bold text-lg">🇮🇳</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">E-Services Portal</h1>
                <p className="text-sm text-gray-600">Gram Panchayat Digital Services</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" onClick={() => navigate('/login')} className="border-orange-500 text-orange-600 hover:bg-orange-50">
                Login
              </Button>
              <Button onClick={() => navigate('/register')} className="bg-green-600 hover:bg-green-700">
                Register
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section with Indian Theme */}
      <section className="relative py-20 bg-gradient-to-r from-orange-100 via-white to-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-4 bg-orange-100 text-orange-800 hover:bg-orange-100 border border-orange-300">
            🇮🇳 Digital India Initiative
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Welcome to <span className="text-orange-600">Gram Panchayat</span>
            <br />
            <span className="text-green-600">Digital Services Portal</span>
          </h1>
          <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
            Streamline citizen services with our comprehensive digital platform. 
            Apply for services, track applications, and access government schemes all in one place.
          </p>
          
          {/* Stats with Indian Colors */}
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <Badge className={`${stat.color} px-4 py-2 text-lg font-semibold border`}>
                  {stat.value}
                </Badge>
                <p className="text-sm text-gray-600 mt-2">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate('/register')}
              className="bg-orange-600 hover:bg-orange-700"
            >
              Get Started - Register Now
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section with Indian Theme */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Platform Features</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our comprehensive platform provides all the tools needed for efficient Gram Panchayat service delivery
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow border-l-4 border-l-orange-500">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Access Section */}
      <section className="py-16 bg-gradient-to-r from-orange-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Quick Access</h2>
            <p className="text-lg text-gray-600">Choose your role to access the appropriate portal</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-t-4 border-t-blue-600" onClick={() => navigate('/login?role=officer')}>
              <CardHeader className="text-center">
                <Settings className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle className="text-xl">Officer/Admin Portal</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center mb-4">
                  Manage services, approve applications, and oversee operations
                </CardDescription>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Create and manage services</li>
                  <li>• Review and approve applications</li>
                  <li>• Generate reports</li>
                  <li>• User management</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-t-4 border-t-green-600" onClick={() => navigate('/login?role=staff')}>
              <CardHeader className="text-center">
                <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle className="text-xl">Staff Portal</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center mb-4">
                  Process applications and update status
                </CardDescription>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• View service applications</li>
                  <li>• Update application status</li>
                  <li>• Communicate with citizens</li>
                  <li>• Process documents</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-t-4 border-t-orange-600" onClick={() => navigate('/login?role=citizen')}>
              <CardHeader className="text-center">
                <FileText className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <CardTitle className="text-xl">Citizen Portal</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center mb-4">
                  Apply for services and track your applications
                </CardDescription>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Browse available services</li>
                  <li>• Submit online applications</li>
                  <li>• Track application status</li>
                  <li>• Download certificates</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-orange-800 via-blue-900 to-green-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="h-8 w-8 bg-gradient-to-b from-orange-500 via-white to-green-500 rounded-lg flex items-center justify-center border border-blue-300">
                  <span className="text-blue-800 font-bold text-xs">🇮🇳</span>
                </div>
                <span className="text-xl font-bold">E-Services Portal</span>
              </div>
              <p className="text-gray-300">
                Digitizing Gram Panchayat services for better citizen experience and efficient governance.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">Support</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
              <div className="text-gray-300 space-y-2">
                <p>Gram Panchayat Office</p>
                <p>Village Center, District</p>
                <p>Email: info@grampanchayat.gov.in</p>
              </div>
            </div>
          </div>
          <div className="border-t border-orange-600 mt-8 pt-8 text-center">
            <div className="flex justify-center items-center space-x-4">
              <span className="text-2xl">🇮🇳</span>
              <span className="text-gray-300">Satyamev Jayate</span>
              <span className="text-2xl">🇮🇳</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
