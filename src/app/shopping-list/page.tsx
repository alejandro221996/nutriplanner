'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { useMenu } from '../contexts/MenuContext';
import ShoppingList from '../components/shopping/ShoppingList';

export default function ShoppingListPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { shoppingList, loading: menuLoading } = useMenu();

  useEffect(() => {
    // Redirigir si no hay usuario autenticado
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  if (authLoading || menuLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Cargando...</p>
      </div>
    );
  }

  if (!user) {
    return null; // Redirigiendo a login
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">
        Lista de Compras
      </h1>
      <p className="text-gray-600">
        Organiza tus compras basadas en tu menú actual.
      </p>
      
      <ShoppingList />
    </div>
  );
}