'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Globe, Mail } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function HomePage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [stats, setStats] = useState({
    totalVisits: 0,
    newsletterSubscribers: 0,
    recentVisits: []
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [visitsRes, subscribersRes] = await Promise.all([
          fetch('/api/website-visits'),
          fetch('/api/newsletter-blogs')
        ]);

        const visits = await visitsRes.json();
        const subscribers = await subscribersRes.json();

        setStats({
          totalVisits: visits.length,
          newsletterSubscribers: subscribers.length,
          recentVisits: visits.slice(0, 5)
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };

    if (user) {
      fetchStats();
    }
  }, [user]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Visits</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalVisits}</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Newsletter Subscribers</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.newsletterSubscribers}</div>
            <p className="text-xs text-muted-foreground">+8% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+3 from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Recent Website Visits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentVisits.map((visit) => (
                <div key={visit.id} className="flex items-center justify-between border-b pb-2">
                  <div>
                    <p className="font-medium">{visit.page_url}</p>
                    <p className="text-sm text-muted-foreground">{visit.user_agent}</p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(visit.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => router.push('/website-visits')}
              >
                View All Visits
              </Button>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => router.push('/newsletter-blogs')}
              >
                Manage Subscriptions
              </Button>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => router.push('/dashboard')}
              >
                View Detailed Reports
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}