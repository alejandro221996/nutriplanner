'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { useMenu } from '../contexts/MenuContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import MenuCard from '../components/menu/MenuCard';

export default function Menus() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { 
    currentMenu, 
    favoriteMenus, 
    generateMenu, 
    loading: menuLoading 
  } = useMenu();
  
  const [activeTab, setActiveTab] = useState<'current' | 'favorites'>('current');

  useEffect(() => {
    // Redirigir si no hay usuario autenticado
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const handleGenerateMenu = async (type: 'daily' | 'weekly') => {
    try {
      await generateMenu(type);
      setActiveTab('current');
    } catch (error) {
      console.error('Error generating menu:', error);
    }
  };

  if (authLoading) {
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
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Tus Menús
        </h1>
        <div className="flex space-x-4">
          <Button 
            onClick={() => handleGenerateMenu('daily')}
            disabled={menuLoading}
          >
            Generar Menú Diario
          </Button>
          <Button 
            onClick={() => handleGenerateMenu('weekly')}
            disabled={menuLoading}
          >
            Generar Menú Semanal
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('current')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'current'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Menú Actual
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'favorites'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Favoritos ({favoriteMenus.length})
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="mt-6">
        {activeTab === 'current' ? (
          currentMenu ? (
            <MenuCard menu={currentMenu} />
          ) : (
            <Card>
              <Card.Content className="text-center py-8">
                <p className="text-gray-500 mb-4">No tienes ningún menú generado actualmente.</p>
                <div className="flex justify-center space-x-4">
                  <Button 
                    onClick={() => handleGenerateMenu('daily')}
                    disabled={menuLoading}
                  >
                    Generar Menú Diario
                  </Button>
                  <Button 
                    onClick={() => handleGenerateMenu('weekly')}
                    disabled={menuLoading}
                  >
                    Generar Menú Semanal
                  </Button>
                </div>
              </Card.Content>
            </Card>
          )
        ) : (
          favoriteMenus.length > 0 ? (
            <div className="space-y-6">
              {favoriteMenus.map(menu => (
                <MenuCard key={menu.id} menu={menu} />
              ))}
            </div>
          ) : (
            <Card>
              <Card.Content className="text-center py-8">
                <p className="text-gray-500">
                  No tienes menús favoritos guardados.
                </p>
                <p className="text-gray-500 mt-2">
                  Genera un menú y márcalo como favorito para guardarlo aquí.
                </p>
              </Card.Content>
            </Card>
          )
        )}
      </div>
    </div>
  );
}