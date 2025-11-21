'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, BarChart3, FileText, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Header() {
  const pathname = usePathname();

  const handleLogout = () => {
    // Remove JWT token from localStorage
    localStorage.removeItem('authToken');
    // Redirect to login page
    window.location.href = '/login';
  };

  const isActive = (path) => pathname === path;

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-gray-900">Default Sales App</span>
            </div>
            <nav className="ml-6 flex space-x-4">
              <Link href="/dashboard" className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                isActive('/dashboard')
                  ? 'border-blue-500 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}>
                <Home className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
              <Link href="/website-visits" className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                isActive('/website-visits')
                  ? 'border-blue-500 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}>
                <BarChart3 className="mr-2 h-4 w-4" />
                Website Visits
              </Link>
              <Link href="/newsletter-blogs" className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                isActive('/newsletter-blogs')
                  ? 'border-blue-500 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}>
                <FileText className="mr-2 h-4 w-4" />
                Newsletter/Blogs
              </Link>
            </nav>
          </div>
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              onClick={handleLogout}
              className="text-gray-500 hover:text-gray-700"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}