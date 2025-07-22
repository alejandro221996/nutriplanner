'use client';

import { useAuth } from '@/app/contexts/AuthContext';
import Link from 'next/link';
import Button from '../ui/Button';

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth();

  return (
    <nav className="bg-white shadow-lg border-b border-green-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-green-600 font-bold text-2xl">🥗 NutriPlaner</span>
            </Link>
            {user && (
              <div className="hidden sm:ml-8 sm:flex sm:space-x-6">
                <Link href="/dashboard" className="border-transparent text-gray-600 hover:border-green-500 hover:text-green-600 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors">
                  Dashboard
                </Link>
                <Link href="/profile" className="border-transparent text-gray-600 hover:border-green-500 hover:text-green-600 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors">
                  Perfil
                </Link>
                <Link href="/menus" className="border-transparent text-gray-600 hover:border-green-500 hover:text-green-600 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors">
                  Menús
                </Link>
                <Link href="/meal-plan" className="border-transparent text-gray-600 hover:border-green-500 hover:text-green-600 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors">
                  Plan de Comidas
                </Link>
                <Link href="/shopping-list" className="border-transparent text-gray-600 hover:border-green-500 hover:text-green-600 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors">
                  Lista de Compras
                </Link>
                {isAdmin && (
                  <Link href="/admin" className="border-transparent text-orange-500 hover:border-orange-500 hover:text-orange-600 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors">
                    Administración
                  </Link>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="text-sm">
                  <span className="text-gray-700">Hola, {user.name}</span>
                  {isAdmin && (
                    <span className="ml-2 px-2 py-1 bg-orange-100 text-orange-800 text-xs font-semibold rounded-full">
                      Admin
                    </span>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => logout()}
                >
                  Cerrar Sesión
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/invitation-codes">
                  <Button variant="ghost" size="sm">
                    Códigos
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline" size="sm">
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">
                    Registrarse
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}