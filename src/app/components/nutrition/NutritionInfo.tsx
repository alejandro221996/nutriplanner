'use client';

import { useProfile } from '@/app/contexts/ProfileContext';
import { getNutritionInfo } from '@/app/services/nutritionServiceClient';
import { NutritionProfile } from '@/app/types';
import Card from '../ui/Card';

export default function NutritionInfo() {
  const { profile } = useProfile();

  if (!profile || !profile.age || !profile.weight || !profile.height || !profile.gender || !profile.activityLevel || !profile.goal) {
    return (
      <Card>
        <Card.Content className="text-center py-8">
          <p className="text-gray-500">
            Completa tu perfil para ver tu información nutricional personalizada.
          </p>
        </Card.Content>
      </Card>
    );
  }

  // Crear perfil nutricional para el servicio
  const nutritionProfile: NutritionProfile = {
    age: profile.age,
    weight: profile.weight,
    height: profile.height,
    gender: profile.gender as 'male' | 'female' | 'other',
    activityLevel: profile.activityLevel as 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active',
    goal: profile.goal as 'maintain' | 'lose' | 'gain'
  };

  const nutritionInfo = getNutritionInfo(nutritionProfile);

  return (
    <div className="space-y-6">
      {/* Información General */}
      <Card>
        <Card.Header>
          <h2 className="text-xl font-semibold text-gray-800">Tu Información Nutricional</h2>
        </Card.Header>
        <Card.Content>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-700 mb-3">Datos Personales</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Edad:</span>
                  <span className="font-medium">{profile.age} años</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Peso:</span>
                  <span className="font-medium">{profile.weight} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Altura:</span>
                  <span className="font-medium">{profile.height} cm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Género:</span>
                  <span className="font-medium capitalize">{profile.gender}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-gray-700 mb-3">Objetivos</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Actividad:</span>
                  <span className="font-medium text-xs">{nutritionInfo.activityLevelDescription}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Objetivo:</span>
                  <span className="font-medium">{nutritionInfo.goalDescription}</span>
                </div>
              </div>
            </div>
          </div>
        </Card.Content>
      </Card>

      {/* Cálculos Metabólicos */}
      <Card>
        <Card.Header>
          <h2 className="text-xl font-semibold text-gray-800">Cálculos Metabólicos</h2>
          <p className="text-sm text-gray-500 mt-1">
            Basado en la fórmula de Mifflin-St Jeor
          </p>
        </Card.Header>
        <Card.Content>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-md text-center">
              <p className="text-sm text-gray-500">BMR</p>
              <p className="text-2xl font-bold text-blue-600">{nutritionInfo.bmr}</p>
              <p className="text-xs text-gray-500">kcal/día</p>
              <p className="text-xs text-gray-400 mt-1">Metabolismo basal</p>
            </div>
            <div className="bg-green-50 p-4 rounded-md text-center">
              <p className="text-sm text-gray-500">TDEE</p>
              <p className="text-2xl font-bold text-green-600">{nutritionInfo.tdee}</p>
              <p className="text-xs text-gray-500">kcal/día</p>
              <p className="text-xs text-gray-400 mt-1">Gasto energético total</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-md text-center">
              <p className="text-sm text-gray-500">Objetivo</p>
              <p className="text-2xl font-bold text-purple-600">{nutritionInfo.macroTargets.calories}</p>
              <p className="text-xs text-gray-500">kcal/día</p>
              <p className="text-xs text-gray-400 mt-1">Calorías objetivo</p>
            </div>
          </div>

          <div className="mt-4 p-3 bg-gray-50 rounded-md">
            <h4 className="font-medium text-gray-700 mb-2">¿Qué significan estos valores?</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>BMR:</strong> Calorías que tu cuerpo necesita en reposo para funciones básicas.</p>
              <p><strong>TDEE:</strong> BMR + calorías quemadas por actividad física y digestión.</p>
              <p><strong>Objetivo:</strong> Calorías ajustadas según tu meta (mantener, perder o ganar peso).</p>
            </div>
          </div>
        </Card.Content>
      </Card>

      {/* Objetivos de Macronutrientes */}
      <Card>
        <Card.Header>
          <h2 className="text-xl font-semibold text-gray-800">Objetivos de Macronutrientes</h2>
          <p className="text-sm text-gray-500 mt-1">
            Distribución optimizada según tu objetivo
          </p>
        </Card.Header>
        <Card.Content>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-green-50 p-4 rounded-md text-center">
              <p className="text-sm text-gray-500">Calorías</p>
              <p className="text-2xl font-bold text-green-600">{nutritionInfo.macroTargets.calories}</p>
              <p className="text-xs text-gray-500">kcal/día</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-md text-center">
              <p className="text-sm text-gray-500">Proteínas</p>
              <p className="text-2xl font-bold text-blue-600">{nutritionInfo.macroTargets.protein}</p>
              <p className="text-xs text-gray-500">g/día</p>
              <p className="text-xs text-gray-400 mt-1">
                {Math.round((nutritionInfo.macroTargets.protein * 4 / nutritionInfo.macroTargets.calories) * 100)}%
              </p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-md text-center">
              <p className="text-sm text-gray-500">Carbohidratos</p>
              <p className="text-2xl font-bold text-yellow-600">{nutritionInfo.macroTargets.carbs}</p>
              <p className="text-xs text-gray-500">g/día</p>
              <p className="text-xs text-gray-400 mt-1">
                {Math.round((nutritionInfo.macroTargets.carbs * 4 / nutritionInfo.macroTargets.calories) * 100)}%
              </p>
            </div>
            <div className="bg-red-50 p-4 rounded-md text-center">
              <p className="text-sm text-gray-500">Grasas</p>
              <p className="text-2xl font-bold text-red-600">{nutritionInfo.macroTargets.fat}</p>
              <p className="text-xs text-gray-500">g/día</p>
              <p className="text-xs text-gray-400 mt-1">
                {Math.round((nutritionInfo.macroTargets.fat * 9 / nutritionInfo.macroTargets.calories) * 100)}%
              </p>
            </div>
          </div>

          <div className="mt-4 p-3 bg-gray-50 rounded-md">
            <h4 className="font-medium text-gray-700 mb-2">Distribución de Macronutrientes</h4>
            <div className="text-sm text-gray-600 space-y-1">
              {profile.goal === 'lose' && (
                <p>Para <strong>perder peso</strong>: Mayor proteína para preservar masa muscular durante el déficit calórico.</p>
              )}
              {profile.goal === 'gain' && (
                <p>Para <strong>ganar peso</strong>: Más carbohidratos para proporcionar energía para el crecimiento.</p>
              )}
              {profile.goal === 'maintain' && (
                <p>Para <strong>mantener peso</strong>: Distribución equilibrada de macronutrientes.</p>
              )}
            </div>
          </div>
        </Card.Content>
      </Card>

      {/* Consejos Personalizados */}
      <Card>
        <Card.Header>
          <h2 className="text-xl font-semibold text-gray-800">Consejos Personalizados</h2>
        </Card.Header>
        <Card.Content>
          <div className="space-y-3 text-sm">
            {profile.goal === 'lose' && (
              <div className="p-3 bg-orange-50 border-l-4 border-orange-400">
                <p className="font-medium text-orange-800">Para perder peso:</p>
                <ul className="mt-1 text-orange-700 space-y-1">
                  <li>• Mantén un déficit calórico constante pero moderado</li>
                  <li>• Prioriza alimentos ricos en proteína para preservar masa muscular</li>
                  <li>• Incluye ejercicio de resistencia en tu rutina</li>
                </ul>
              </div>
            )}

            {profile.goal === 'gain' && (
              <div className="p-3 bg-green-50 border-l-4 border-green-400">
                <p className="font-medium text-green-800">Para ganar peso:</p>
                <ul className="mt-1 text-green-700 space-y-1">
                  <li>• Consume alimentos densos en calorías y nutrientes</li>
                  <li>• Incluye carbohidratos complejos para energía</li>
                  <li>• Combina con entrenamiento de fuerza para ganar masa muscular</li>
                </ul>
              </div>
            )}

            {profile.goal === 'maintain' && (
              <div className="p-3 bg-blue-50 border-l-4 border-blue-400">
                <p className="font-medium text-blue-800">Para mantener peso:</p>
                <ul className="mt-1 text-blue-700 space-y-1">
                  <li>• Mantén un equilibrio entre calorías consumidas y gastadas</li>
                  <li>• Enfócate en la calidad nutricional de los alimentos</li>
                  <li>• Mantén una rutina de ejercicio regular</li>
                </ul>
              </div>
            )}

            <div className="p-3 bg-gray-50 border-l-4 border-gray-400">
              <p className="font-medium text-gray-800">Consejos generales:</p>
              <ul className="mt-1 text-gray-700 space-y-1">
                <li>• Bebe suficiente agua (al menos 2-3 litros al día)</li>
                <li>• Incluye variedad de frutas y verduras</li>
                <li>• Ajusta las porciones según tu hambre y saciedad</li>
                <li>• Revisa y actualiza tu perfil regularmente</li>
              </ul>
            </div>
          </div>
        </Card.Content>
      </Card>
    </div>
  );
}