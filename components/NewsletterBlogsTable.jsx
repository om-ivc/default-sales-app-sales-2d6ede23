'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Search, Mail, BookOpen } from 'lucide-react';
import axios from 'axios';

export default function NewsletterBlogsTable() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newSubscription, setNewSubscription] = useState({
    email: '',
    subscription_type: 'newsletter'
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const response = await axios.get('/api/newsletter-blogs');
      setSubscriptions(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching subscriptions:', err);
      setError('Failed to load subscriptions');
      setLoading(false);
    }
  };

  const handleCreateSubscription = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('/api/newsletter-blogs', newSubscription);
      setSubscriptions([...subscriptions, response.data]);
      setIsDialogOpen(false);
      setNewSubscription({
        email: '',
        subscription_type: 'newsletter'
      });
    } catch (err) {
      console.error('Error creating subscription:', err);
      setError('Failed to create subscription');
    }
  };

  const filteredSubscriptions = subscriptions.filter(sub => 
    sub.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.subscription_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSubscriptionIcon = (type) => {
    return type === 'newsletter' ? 
      <Mail className="w-4 h-4 text-blue-600" /> : 
      <BookOpen className="w-4 h-4 text-green-600" />;
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Newsletter & Blog Subscriptions</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Subscription
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Subscription</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateSubscription} className="space-y-4">
              {error && <div className="text-red-600 text-sm">{error}</div>}
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={newSubscription.email}
                  onChange={(e) => setNewSubscription({...newSubscription, email: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="subscription_type">Subscription Type</Label>
                <select
                  id="subscription_type"
                  className="w-full p-2 border rounded-md"
                  value={newSubscription.subscription_type}
                  onChange={(e) => setNewSubscription({...newSubscription, subscription_type: e.target.value})}
                >
                  <option value="newsletter">Newsletter</option>
                  <option value="blog">Blog</option>
                </select>
              </div>
              <Button type="submit" className="w-full">Create Subscription</Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search subscriptions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="text-red-600 text-center py-4">{error}</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Subscribed At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubscriptions.length > 0 ? (
                filteredSubscriptions.map((sub) => (
                  <TableRow key={sub.id}>
                    <TableCell className="font-medium">{sub.email}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {getSubscriptionIcon(sub.subscription_type)}
                        <span className="ml-2 capitalize">{sub.subscription_type}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(sub.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan="3" className="text-center py-8 text-gray-500">
                    No subscriptions found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}