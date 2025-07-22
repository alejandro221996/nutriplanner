'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import MealPlanCard from '../components/meal/MealPlanCard';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../contexts/ProfileContext';
import { DailyMealPlan, generateDailyMealPlan } from '../services/nutritionServiceClient';
import { ActivityLevel, Gender, Goal } from '../types/index';

export default function MealPlanPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { profile } = useProfile();
  const [mealPlan, setMealPlan] = useState<DailyMealPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Redirigir si no hay usuario autenticado
    if (!user) {
      router.push('/login');
    }

    // Redirigir a la página de perfil si no hay perfil configurado
    if (user && !profile?.age) {
      router.push('/profile');
    }
  }, [user, profile, router]);

  const handleGenerateMealPlan = async () => {
    if (!profile) return;

    setLoading(true);
    setError(null);

    try {
      const nutritionProfile = {
        age: profile.age || 30,
        weight: profile.weight || 70,
        height: profile.height || 170,
        gender: (profile.gender as Gender) || 'male',
        activityLevel: (profile.activityLevel as ActivityLevel) || 'moderate',
        goal: (profile.goal as Goal) || 'maintain'
      };

      const generatedPlan = await generateDailyMealPlan(nutritionProfile);
      setMealPlan(generatedPlan);
    } catch (error) {
      console.error('Error generating meal plan:', error);
      setError('Error al generar el plan de comidas. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (!user || !profile?.age) {
    return null; // Redirigiendo...
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Plan de Comidas Personalizado
        </h1>
        <Button
          onClick={handleGenerateMealPlan}
          disabled={loading}
        >
          {loading ? 'Generando...' : 'Generar Plan de Comidas'}
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md">
          {error}
        </div>
      )}

      {!mealPlan && !loading && !error && (
        <Card>
          <Card.Content className="text-center py-12">
            <p className="text-gray-500 mb-4">
              Genera un plan de comidas personalizado basado en tu perfil nutricional.
            </p>
            <Button onClick={handleGenerateMealPlan}>
              Generar Plan de Comidas
            </Button>
          </Card.Content>
        </Card>
      )}

      {loading && (
        <Card>
          <Card.Content className="text-center py-12">
            <p className="text-gray-500 mb-4">
              Generando tu plan de comidas personalizado...
            </p>
            <div className="animate-pulse flex justify-center">
              <div className="h-4 w-32 bg-gray-200 rounded"></div>
            </div>
          </Card.Content>
        </Card>
      )}

      {mealPlan && (
        <MealPlanCard mealPlan={mealPlan} />
      )}
    </div>
  );
}