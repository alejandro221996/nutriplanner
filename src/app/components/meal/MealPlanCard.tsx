import { DailyMealPlan } from '@/app/services/nutritionServiceClient';
import { useState } from 'react';
import RecipeDetail from '../recipe/RecipeDetail';
import Button from '../ui/Button';
import Card from '../ui/Card';

interface MealPlanCardProps {
  mealPlan: DailyMealPlan;
}

export default function MealPlanCard({ mealPlan }: MealPlanCardProps) {
  const [expandedMeal, setExpandedMeal] = useState<string | null>(null);

  // Formatear la fecha
  const formattedDate = new Date(mealPlan.date).toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Ordenar las comidas según el tipo
  const mealOrder = {
    'breakfast': 1,
    'lunch': 2,
    'dinner': 3,
    'snack': 4
  };

  const sortedMeals = [...mealPlan.meals].sort((a, b) =>
    mealOrder[a.mealType] - mealOrder[b.mealType]
  );

  // Traducir el tipo de comida
  const mealTypeTranslation = {
    'breakfast': 'Desayuno',
    'lunch': 'Almuerzo',
    'dinner': 'Cena',
    'snack': 'Merienda'
  };

  const toggleMeal = (mealType: string) => {
    if (expandedMeal === mealType) {
      setExpandedMeal(null);
    } else {
      setExpandedMeal(mealType);
    }
  };

  return (
    <Card className="w-full">
      <Card.Header>
        <h2 className="text-xl font-semibold text-gray-800 capitalize">
          Plan de comidas: {formattedDate}
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Objetivo: {mealPlan.targetCalories} kcal | Proteínas: {mealPlan.targetProtein}g |
          Carbohidratos: {mealPlan.targetCarbs}g | Grasas: {mealPlan.targetFat}g
        </p>
      </Card.Header>

      <Card.Content>
        <div className="space-y-6">
          {sortedMeals.map((meal) => (
            <div key={meal.mealType} className="border border-gray-200 rounded-lg overflow-hidden">
              {/* Encabezado de la comida */}
              <div
                className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer"
                onClick={() => toggleMeal(meal.mealType)}
              >
                <div>
                  <h3 className="font-medium text-gray-800">
                    {mealTypeTranslation[meal.mealType]}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {meal.recipes.length} receta(s) | {meal.totalCalories} kcal
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                >
                  {expandedMeal === meal.mealType ? 'Ocultar' : 'Ver detalles'}
                </Button>
              </div>

              {/* Detalles de la comida expandida */}
              {expandedMeal === meal.mealType && (
                <div className="p-4 space-y-6">
                  {meal.recipes.map((recipe) => (
                    <RecipeDetail
                      key={recipe.id}
                      recipe={recipe}
                      showNutrition={true}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </Card.Content>

      <Card.Footer>
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-green-50 p-3 rounded-md text-center">
            <p className="text-sm text-gray-500">Calorías Totales</p>
            <p className="text-lg font-bold text-green-600">{mealPlan.totalCalories}</p>
            <p className="text-xs text-gray-500">kcal</p>
          </div>
          <div className="bg-blue-50 p-3 rounded-md text-center">
            <p className="text-sm text-gray-500">Proteínas Totales</p>
            <p className="text-lg font-bold text-blue-600">{mealPlan.totalProtein}</p>
            <p className="text-xs text-gray-500">g</p>
          </div>
          <div className="bg-yellow-50 p-3 rounded-md text-center">
            <p className="text-sm text-gray-500">Carbohidratos Totales</p>
            <p className="text-lg font-bold text-yellow-600">{mealPlan.totalCarbs}</p>
            <p className="text-xs text-gray-500">g</p>
          </div>
          <div className="bg-red-50 p-3 rounded-md text-center">
            <p className="text-sm text-gray-500">Grasas Totales</p>
            <p className="text-lg font-bold text-red-600">{mealPlan.totalFat}</p>
            <p className="text-xs text-gray-500">g</p>
          </div>
        </div>
      </Card.Footer>
    </Card>
  );
}