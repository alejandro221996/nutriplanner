'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import ProfileForm from '../components/profile/ProfileForm';
import NutritionInfo from '../components/nutrition/NutritionInfo';

export default function Profile() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    // Redirigir si no hay usuario autenticado
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
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
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Tu Perfil Nutricional
        </h1>
        <p className="text-gray-600">
          Completa tu información para obtener recomendaciones nutricionales personalizadas basadas en tu TDEE.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Configuración</h2>
          <ProfileForm />
        </div>
        
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Información Nutricional</h2>
          <NutritionInfo />
        </div>
      </div>
    </div>
  );
}