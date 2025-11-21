'use client';

import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Calendar, MapPin, Globe, Eye } from 'lucide-react';
import axios from 'axios';

export default function WebsiteVisitsTable() {
  const [visits, setVisits] = useState([]);
  const [filteredVisits, setFilteredVisits] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVisits = async () => {
      try {
        const response = await axios.get('/api/website-visits');
        setVisits(response.data);
        setFilteredVisits(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch website visits');
        setLoading(false);
      }
    };

    fetchVisits();
  }, []);

  useEffect(() => {
    const filtered = visits.filter(visit => 
      visit.ip_address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visit.user_agent.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visit.referrer?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredVisits(filtered);
  }, [searchTerm, visits]);

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDeviceType = (userAgent) => {
    if (/mobile/i.test(userAgent)) return 'Mobile';
    if (/tablet/i.test(userAgent)) return 'Tablet';
    return 'Desktop';
  };

  const getBrowser = (userAgent) => {
    if (/chrome/i.test(userAgent)) return 'Chrome';
    if (/firefox/i.test(userAgent)) return 'Firefox';
    if (/safari/i.test(userAgent)) return 'Safari';
    if (/edge/i.test(userAgent)) return 'Edge';
    return 'Other';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-800">Error Loading Data</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="flex items-center gap-2 text-xl font-bold">
          <Eye className="h-5 w-5 text-blue-600" />
          Website Visits
        </CardTitle>
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search visits..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date & Time</TableHead>
              <TableHead>IP Address</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Device</TableHead>
              <TableHead>Browser</TableHead>
              <TableHead>Referrer</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredVisits.length > 0 ? (
              filteredVisits.map((visit) => (
                <TableRow key={visit.id} className="border-b hover:bg-gray-50">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      {formatDateTime(visit.created_at)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono">
                      {visit.ip_address}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      {visit.country || 'Unknown'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{getDeviceType(visit.user_agent)}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{getBrowser(visit.user_agent)}</Badge>
                  </TableCell>
                  <TableCell>
                    {visit.referrer ? (
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-gray-500" />
                        <span className="truncate max-w-xs">{visit.referrer}</span>
                      </div>
                    ) : (
                      <span className="text-gray-500">Direct</span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  No website visits found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {filteredVisits.length > 0 && (
          <div className="mt-4 text-sm text-gray-500">
            Showing {filteredVisits.length} of {visits.length} visits
          </div>
        )}
      </CardContent>
    </Card>
  );
}