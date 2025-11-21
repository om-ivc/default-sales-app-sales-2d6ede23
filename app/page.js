'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BarChart, Users, Globe, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function HomePage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleGetStarted = () => {
    if (isLoggedIn) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Default Sales App
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            Internal CRM for tracking website visits, managing user authentication, and handling newsletter/blog subscriptions
          </p>
          <Button 
            onClick={handleGetStarted}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
          >
            {isLoggedIn ? 'Go to Dashboard' : 'Get Started'}
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">Key Features</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <Users className="text-blue-600" />
                </div>
                <CardTitle>User Authentication</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Secure login and registration system with JWT tokens and password encryption
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <Globe className="text-green-600" />
                </div>
                <CardTitle>Website Visit Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Monitor and analyze website traffic with detailed visit records and metrics
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                  <Mail className="text-purple-600" />
                </div>
                <CardTitle>Newsletter & Blog</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Manage newsletter subscribers and blog subscriptions with organized lists
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-4">
                  <BarChart className="text-orange-600" />
                </div>
                <CardTitle>CRM Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Centralized dashboard for monitoring all sales and customer engagement metrics
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to boost your sales operations?</h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto">
            Join our internal CRM platform to streamline customer engagement and track performance
          </p>
          <Button 
            onClick={handleGetStarted}
            variant="secondary"
            size="lg"
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg"
          >
            Access Dashboard
          </Button>
        </div>
      </section>
    </div>
  );
}