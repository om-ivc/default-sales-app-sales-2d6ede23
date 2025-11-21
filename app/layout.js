import './globals.css';
import { Inter } from 'next/font/google';
import Sidebar from '@/components/Sidebar';
import { Providers } from '@/lib/providers';
import { cn } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME || 'Default Sales App',
  description: 'Internal CRM application for tracking website visits, managing user authentication, and handling newsletter/blog subscriptions',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={cn('min-h-screen bg-gray-50', inter.className)}>
        <Providers>
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 p-6 md:p-8">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}