'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  LayoutDashboard, 
  Users, 
  FileText, 
  BarChart3, 
  Mail, 
  LogIn, 
  UserPlus,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const Sidebar = () => {
  const pathname = usePathname();

  const navigationItems = [
    {
      name: 'Home',
      href: '/',
      icon: Home,
      requiresAuth: false
    },
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      requiresAuth: true
    },
    {
      name: 'Website Visits',
      href: '/website-visits',
      icon: Globe,
      requiresAuth: true
    },
    {
      name: 'Newsletter Blogs',
      href: '/newsletter-blogs',
      icon: Mail,
      requiresAuth: true
    },
    {
      name: 'Login',
      href: '/login',
      icon: LogIn,
      requiresAuth: false
    },
    {
      name: 'Register',
      href: '/register',
      icon: UserPlus,
      requiresAuth: false
    }
  ];

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white w-64 fixed left-0 top-0 bottom-0 z-50">
      <div className="flex items-center h-16 px-4 border-b border-gray-800">
        <h1 className="text-xl font-bold">Default Sales App</h1>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-gray-800">
        <Button variant="secondary" className="w-full">
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;