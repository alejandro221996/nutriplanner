'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../contexts/ProfileContext';
import { useMenu } from '../contexts/MenuContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import MenuCard from '../components/menu/MenuCard';

export default function Dashboard() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const { 
    currentMenu, 
    favoriteMenus, 
    generateMenu, 
    loading: menuLoading 
  } = useMenu();

  useEffect(() => {
    // Redirigir si no hay usuario autenticado
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Redirigir a la página de perfil si no hay perfil configurado
  useEffect(() => {
    if (!profileLoading && user && !profile?.age) {
      router.push('/profile');
    }
  }, [profile, profileLoading, user, router]);

  const handleGenerateMenu = async (type: 'daily' | 'weekly') => {
    try {
      await generateMenu(type);
      alert(`¡Menú ${type === 'daily' ? 'diario' : 'semanal'} generado exitosamente!`);
    } catch (error) {
      console.error('Error generating menu:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido al generar el menú';
      alert(`Error: ${errorMessage}`);
    }
  };

  if (authLoading || profileLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Cargando...</p>
      </div>
    );
  }

  if (!user) {
    return null; // Redirigiendo a login
  }

  if (!profile?.age) {
    return null; // Redirigiendo a perfil
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Bienvenido, {user.name}
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

      {/* Resumen Nutricional */}
      <Card>
        <Card.Header>
          <h2 className="text-xl font-semibold text-gray-800">Tu Resumen Nutricional</h2>
          <p className="text-sm text-gray-500 mt-1">
            Basado en tu TDEE y objetivos personales
          </p>
        </Card.Header>
        <Card.Content>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-green-50 p-4 rounded-md text-center">
              <p className="text-sm text-gray-500">Calorías Objetivo</p>
              <p className="text-2xl font-bold text-green-600">{profile.dailyCalories || 0}</p>
              <p className="text-xs text-gray-500">kcal/día</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-md text-center">
              <p className="text-sm text-gray-500">Proteínas</p>
              <p className="text-2xl font-bold text-blue-600">{profile.dailyProtein || 0}</p>
              <p className="text-xs text-gray-500">g/día</p>
              <p className="text-xs text-gray-400">
                {profile.dailyCalories ? Math.round((profile.dailyProtein! * 4 / profile.dailyCalories) * 100) : 0}%
              </p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-md text-center">
              <p className="text-sm text-gray-500">Carbohidratos</p>
              <p className="text-2xl font-bold text-yellow-600">{profile.dailyCarbs || 0}</p>
              <p className="text-xs text-gray-500">g/día</p>
              <p className="text-xs text-gray-400">
                {profile.dailyCalories ? Math.round((profile.dailyCarbs! * 4 / profile.dailyCalories) * 100) : 0}%
              </p>
            </div>
            <div className="bg-red-50 p-4 rounded-md text-center">
              <p className="text-sm text-gray-500">Grasas</p>
              <p className="text-2xl font-bold text-red-600">{profile.dailyFat || 0}</p>
              <p className="text-xs text-gray-500">g/día</p>
              <p className="text-xs text-gray-400">
                {profile.dailyCalories ? Math.round((profile.dailyFat! * 9 / profile.dailyCalories) * 100) : 0}%
              </p>
            </div>
          </div>
          
          {profile.goal && (
            <div className="mt-4 p-3 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-600 text-center">
                <strong>Objetivo:</strong> {
                  profile.goal === 'lose' ? 'Perder peso (déficit calórico)' :
                  profile.goal === 'gain' ? 'Ganar peso (superávit calórico)' :
                  'Mantener peso actual'
                }
              </p>
            </div>
          )}
          
          <div className="mt-4 text-center">
            <Link href="/profile">
              <Button variant="outline" size="sm">
                Ver Información Completa
              </Button>
            </Link>
          </div>
        </Card.Content>
      </Card>

      {/* Menú Actual */}
      {currentMenu ? (
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Tu Menú Actual</h2>
          <MenuCard menu={currentMenu} />
        </div>
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
      )}

      {/* Menús Favoritos */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Tus Menús Favoritos</h2>
        {favoriteMenus.length > 0 ? (
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
        )}
      </div>
    </div>
  );
}