'use client';

import { Inter } from 'next/font/google';
import Navbar from './components/layout/Navbar';
import { AuthProvider } from './contexts/AuthContext';
import { MenuProvider } from './contexts/MenuContext';
import { ProfileProvider } from './contexts/ProfileContext';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-neutral-50 min-h-screen`}>
        <AuthProvider>
          <ProfileProvider>
            <MenuProvider>
              <Navbar />
              <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
              </main>
            </MenuProvider>
          </ProfileProvider>
        </AuthProvider>
      </body>
    </html>
  );
}