'use client';

import { useMenu } from '@/app/contexts/MenuContext';
import { exportMenuToPDF } from '@/app/services/pdfService';
import { Menu, MenuItem } from '@/app/types';
import { useState } from 'react';
import Button from '../ui/Button';
import Card from '../ui/Card';

interface MenuCardProps {
  menu: Menu;
  showActions?: boolean;
}

export default function MenuCard({ menu, showActions = true }: MenuCardProps) {
  const { toggleFavorite, generateShoppingList, substituteMenuItem } = useMenu();
  const [expandedDay, setExpandedDay] = useState<number | null>(null);
  const [expandedMeal, setExpandedMeal] = useState<string | null>(null);


  const handleToggleFavorite = () => {
    toggleFavorite(menu.id);
  };

  const handleGenerateShoppingList = () => {
    generateShoppingList(menu.id);
  };

  const handleSubstituteMenuItem = (menuItemId: string) => {
    substituteMenuItem(menuItemId);
  };

  const handleExportToPDF = () => {
    exportMenuToPDF(menu);
  };

  const toggleExpandDay = (day: number) => {
    setExpandedDay(expandedDay === day ? null : day);
  };

  const toggleExpandMeal = (mealType: string) => {
    setExpandedMeal(expandedMeal === mealType ? null : mealType);
  };

  const getMealTypeLabel = (mealType: string) => {
    switch (mealType) {
      case 'breakfast': return 'Desayuno';
      case 'lunch': return 'Almuerzo';
      case 'dinner': return 'Cena';
      case 'snack': return 'Merienda';
      default: return mealType;
    }
  };

  const getDayLabel = (day: number) => {
    const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    return days[day - 1] || `Día ${day}`;
  };

  const renderDailyMenu = () => {
    // Agrupar por tipo de comida
    const mealsByType = menu.items.reduce((acc, item) => {
      const type = item.mealType;
      if (!acc[type]) acc[type] = [];
      acc[type].push(item);
      return acc;
    }, {} as Record<string, MenuItem[]>);

    // Ordenar los tipos de comida
    const mealOrder = {
      'breakfast': 1,
      'lunch': 2,
      'dinner': 3,
      'snack': 4
    };

    const sortedMealTypes = Object.keys(mealsByType).sort((a, b) =>
      (mealOrder[a as keyof typeof mealOrder] || 99) - (mealOrder[b as keyof typeof mealOrder] || 99)
    );

    return (
      <div className="space-y-4">
        {sortedMealTypes.map((mealType) => (
          <div key={mealType} className="border rounded-md overflow-hidden mb-4 last:mb-0">
            <div
              className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer"
              onClick={() => toggleExpandMeal(mealType)}
            >
              <div>
                <h3 className="font-medium text-gray-800">{getMealTypeLabel(mealType)}</h3>
                <p className="text-sm text-gray-600">
                  {mealsByType[mealType].length} comida(s)
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
              >
                {expandedMeal === mealType ? 'Ocultar' : 'Ver detalles'}
              </Button>
            </div>

            {expandedMeal === mealType && (
              <div className="p-4 space-y-6">
                {mealsByType[mealType].map(item => (
                  <div key={item.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                    <div className="flex justify-between items-start">
                      <div className="w-full">
                        {/* Mostrar ingredientes individuales sin agrupar */}
                        {item.ingredients && item.ingredients.length > 0 ? (
                          <div className="space-y-3">
                            {item.ingredients.map((ingredient) => {
                              // Calcular macros individuales para cada ingrediente
                              const portionSize = Number(ingredient.food.commonPortionSize) || 100;
                              const quantity = Number(ingredient.quantity) || 0;
                              const ratio = quantity / portionSize;

                              const calories = Math.round((Number(ingredient.food.calories) || 0) * ratio);
                              const protein = Math.round((Number(ingredient.food.protein) || 0) * ratio);
                              const carbs = Math.round((Number(ingredient.food.carbs) || 0) * ratio);
                              const fat = Math.round((Number(ingredient.food.fat) || 0) * ratio);

                              return (
                                <div key={ingredient.id} className="border-l-4 border-green-500 pl-4 py-2 bg-gray-50 rounded-r-md">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <h6 className="font-semibold text-gray-800">{ingredient.food.name}</h6>
                                      <p className="text-sm text-gray-600">{ingredient.quantity} {ingredient.unit}</p>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">
                                        {calories} kcal
                                      </span>
                                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                                        {protein}g prot
                                      </span>
                                      <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-medium">
                                        {carbs}g carbs
                                      </span>
                                      <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-medium">
                                        {fat}g grasas
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}

                            {/* Mostrar totales de la comida */}
                            <div className="mt-4 p-3 bg-green-50 rounded-md">
                              <h6 className="font-medium text-green-800 mb-2">Total de la comida:</h6>
                              <div className="flex flex-wrap gap-3">
                                <div className="bg-green-100 px-3 py-1 rounded-md text-center">
                                  <span className="text-sm text-green-700 font-medium">
                                    {(item as any).calculatedNutrition?.calories || 0} kcal
                                  </span>
                                </div>
                                <div className="bg-blue-100 px-3 py-1 rounded-md text-center">
                                  <span className="text-sm text-blue-700 font-medium">
                                    {(item as any).calculatedNutrition?.protein || 0}g proteínas
                                  </span>
                                </div>
                                <div className="bg-yellow-100 px-3 py-1 rounded-md text-center">
                                  <span className="text-sm text-yellow-700 font-medium">
                                    {(item as any).calculatedNutrition?.carbs || 0}g carbos
                                  </span>
                                </div>
                                <div className="bg-red-100 px-3 py-1 rounded-md text-center">
                                  <span className="text-sm text-red-700 font-medium">
                                    {(item as any).calculatedNutrition?.fat || 0}g grasas
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">No hay ingredientes disponibles para esta comida</p>
                        )}
                      </div>
                      {showActions && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSubstituteMenuItem(item.id)}
                        >
                          Sustituir
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderWeeklyMenu = () => {
    // Agrupar por día de la semana
    const itemsByDay = menu.items.reduce((acc, item) => {
      const day = item.dayOfWeek || 1;
      if (!acc[day]) acc[day] = [];
      acc[day].push(item);
      return acc;
    }, {} as Record<number, MenuItem[]>);

    // Ordenar los días de la semana
    const sortedDays = Object.keys(itemsByDay)
      .map(day => parseInt(day))
      .sort((a, b) => a - b);

    return (
      <div className="space-y-4">
        {sortedDays.map(dayNumber => {
          const items = itemsByDay[dayNumber];
          const isExpanded = expandedDay === dayNumber;

          return (
            <div key={dayNumber} className="border rounded-md overflow-hidden">
              <div
                className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer"
                onClick={() => toggleExpandDay(dayNumber)}
              >
                <h3 className="font-medium text-gray-800">{getDayLabel(dayNumber)}</h3>
                <Button
                  variant="ghost"
                  size="sm"
                >
                  {isExpanded ? 'Ocultar' : 'Ver detalles'}
                </Button>
              </div>

              {isExpanded && (
                <div className="p-4 space-y-6">
                  {/* Agrupar por tipo de comida dentro del día */}
                  {['breakfast', 'lunch', 'dinner', 'snack'].map(mealType => {
                    const mealItems = items.filter(item => item.mealType === mealType);
                    if (mealItems.length === 0) return null;

                    return (
                      <div key={mealType} className="border-b pb-4 last:border-b-0 last:pb-0">
                        <h4 className="font-medium text-green-600 mb-3">{getMealTypeLabel(mealType)}</h4>
                        <div className="space-y-6">
                          {mealItems.map(item => (
                            <div key={item.id} className="flex justify-between items-start">
                              <div className="w-full">
                                {/* Mostrar ingredientes individuales sin agrupar */}
                                {item.ingredients && item.ingredients.length > 0 ? (
                                  <div className="space-y-3">
                                    {item.ingredients.map((ingredient) => {
                                      // Calcular macros individuales para cada ingrediente
                                      const portionSize = Number(ingredient.food.commonPortionSize) || 100;
                                      const quantity = Number(ingredient.quantity) || 0;
                                      const ratio = quantity / portionSize;

                                      const calories = Math.round((Number(ingredient.food.calories) || 0) * ratio);
                                      const protein = Math.round((Number(ingredient.food.protein) || 0) * ratio);
                                      const carbs = Math.round((Number(ingredient.food.carbs) || 0) * ratio);
                                      const fat = Math.round((Number(ingredient.food.fat) || 0) * ratio);

                                      return (
                                        <div key={ingredient.id} className="border-l-4 border-green-500 pl-4 py-2 bg-gray-50 rounded-r-md">
                                          <div className="flex justify-between items-start">
                                            <div>
                                              <h6 className="font-semibold text-gray-800">{ingredient.food.name}</h6>
                                              <p className="text-sm text-gray-600">{ingredient.quantity} {ingredient.unit}</p>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                              <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">
                                                {calories} kcal
                                              </span>
                                              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                                                {protein}g prot
                                              </span>
                                              <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-medium">
                                                {carbs}g carbs
                                              </span>
                                              <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-medium">
                                                {fat}g grasas
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    })}

                                    {/* Mostrar totales de la comida */}
                                    <div className="mt-4 p-3 bg-green-50 rounded-md">
                                      <h6 className="font-medium text-green-800 mb-2">Total de la comida:</h6>
                                      <div className="flex flex-wrap gap-3">
                                        <div className="bg-green-100 px-3 py-1 rounded-md text-center">
                                          <span className="text-sm text-green-700 font-medium">
                                            {(item as any).calculatedNutrition?.calories || 0} kcal
                                          </span>
                                        </div>
                                        <div className="bg-blue-100 px-3 py-1 rounded-md text-center">
                                          <span className="text-sm text-blue-700 font-medium">
                                            {(item as any).calculatedNutrition?.protein || 0}g proteínas
                                          </span>
                                        </div>
                                        <div className="bg-yellow-100 px-3 py-1 rounded-md text-center">
                                          <span className="text-sm text-yellow-700 font-medium">
                                            {(item as any).calculatedNutrition?.carbs || 0}g carbos
                                          </span>
                                        </div>
                                        <div className="bg-red-100 px-3 py-1 rounded-md text-center">
                                          <span className="text-sm text-red-700 font-medium">
                                            {(item as any).calculatedNutrition?.fat || 0}g grasas
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <p className="text-sm text-gray-500">No hay ingredientes disponibles para esta comida</p>
                                )}
                              </div>
                              {showActions && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleSubstituteMenuItem(item.id)}
                                >
                                  Sustituir
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // Calcular totales nutricionales
  const calculateTotals = () => {
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;

    // Calcular macros para cada item y guardarlos para mostrarlos después
    menu.items.forEach((item, index) => {
      // Si hay ingredientes directos, calcular basado en ellos
      if (item.ingredients && item.ingredients.length > 0) {
        let itemCalories = 0;
        let itemProtein = 0;
        let itemCarbs = 0;
        let itemFat = 0;

        item.ingredients.forEach((ingredient) => {
          if (ingredient.food) {
            // Validar que commonPortionSize no sea 0 o undefined
            const portionSize = Number(ingredient.food.commonPortionSize) || 100;
            const quantity = Number(ingredient.quantity) || 0;

            // Calcular basado en la cantidad del ingrediente y la porción común
            const ratio = quantity / portionSize;

            // Validar que los valores nutricionales sean números válidos
            const calories = Number(ingredient.food.calories) || 0;
            const protein = Number(ingredient.food.protein) || 0;
            const carbs = Number(ingredient.food.carbs) || 0;
            const fat = Number(ingredient.food.fat) || 0;

            const caloriesForIngredient = calories * ratio;
            const proteinForIngredient = protein * ratio;
            const carbsForIngredient = carbs * ratio;
            const fatForIngredient = fat * ratio;

            // Validar que los resultados sean números válidos antes de sumar
            if (!isNaN(caloriesForIngredient) && isFinite(caloriesForIngredient)) {
              itemCalories += caloriesForIngredient;
            }
            if (!isNaN(proteinForIngredient) && isFinite(proteinForIngredient)) {
              itemProtein += proteinForIngredient;
            }
            if (!isNaN(carbsForIngredient) && isFinite(carbsForIngredient)) {
              itemCarbs += carbsForIngredient;
            }
            if (!isNaN(fatForIngredient) && isFinite(fatForIngredient)) {
              itemFat += fatForIngredient;
            }
          }
        });

        // Guardar los macros calculados en el item para mostrarlos después
        // Esto es una modificación temporal solo para la UI, no modifica el objeto real
        (item as any).calculatedNutrition = {
          calories: Math.round(isNaN(itemCalories) ? 0 : itemCalories),
          protein: Math.round(isNaN(itemProtein) ? 0 : itemProtein),
          carbs: Math.round(isNaN(itemCarbs) ? 0 : itemCarbs),
          fat: Math.round(isNaN(itemFat) ? 0 : itemFat)
        };

        // Sumar a los totales generales solo si son números válidos
        if (!isNaN(itemCalories) && isFinite(itemCalories)) totalCalories += itemCalories;
        if (!isNaN(itemProtein) && isFinite(itemProtein)) totalProtein += itemProtein;
        if (!isNaN(itemCarbs) && isFinite(itemCarbs)) totalCarbs += itemCarbs;
        if (!isNaN(itemFat) && isFinite(itemFat)) totalFat += itemFat;
      }
      // Fallback a receta si está disponible
      else if (item.recipe) {
        const recipeCalories = Number(item.recipe.calories) || 0;
        const recipeProtein = Number(item.recipe.protein) || 0;
        const recipeCarbs = Number(item.recipe.carbs) || 0;
        const recipeFat = Number(item.recipe.fat) || 0;

        totalCalories += recipeCalories;
        totalProtein += recipeProtein;
        totalCarbs += recipeCarbs;
        totalFat += recipeFat;

        // Guardar los macros de la receta en el item para mostrarlos después
        (item as any).calculatedNutrition = {
          calories: Math.round(recipeCalories),
          protein: Math.round(recipeProtein),
          carbs: Math.round(recipeCarbs),
          fat: Math.round(recipeFat)
        };
      }
    });

    // Si es un menú semanal, dividir entre el número de días
    if (menu.type === 'weekly') {
      // Contar cuántos días únicos hay en el menú
      const uniqueDays = new Set(
        menu.items
          .map(item => item.dayOfWeek)
          .filter(day => day !== null && day !== undefined && !isNaN(Number(day)))
      ).size;

      if (uniqueDays > 1) {
        totalCalories = totalCalories / uniqueDays;
        totalProtein = totalProtein / uniqueDays;
        totalCarbs = totalCarbs / uniqueDays;
        totalFat = totalFat / uniqueDays;
      }
    }

    return {
      calories: Math.round(isNaN(totalCalories) ? 0 : totalCalories),
      protein: Math.round(isNaN(totalProtein) ? 0 : totalProtein),
      carbs: Math.round(isNaN(totalCarbs) ? 0 : totalCarbs),
      fat: Math.round(isNaN(totalFat) ? 0 : totalFat)
    };
  };

  const nutritionTotals = calculateTotals();

  return (
    <Card>
      <Card.Header className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">{menu.name}</h2>
          {menu.description && (
            <p className="text-sm text-gray-500">{menu.description}</p>
          )}
        </div>
        {showActions && (
          <Button
            variant={menu.isFavorite ? 'primary' : 'outline'}
            size="sm"
            onClick={handleToggleFavorite}
          >
            {menu.isFavorite ? '★ Favorito' : '☆ Marcar Favorito'}
          </Button>
        )}
      </Card.Header>

      <Card.Content>
        {menu.type === 'daily' ? renderDailyMenu() : renderWeeklyMenu()}
      </Card.Content>

      {/* Resumen nutricional */}
      <div className="px-6 py-4 border-t border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Resumen Nutricional</h3>
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-green-50 p-3 rounded-md text-center">
            <p className="text-sm text-gray-500">Calorías Totales</p>
            <p className="text-lg font-bold text-green-600">{nutritionTotals.calories || 0}</p>
            <p className="text-xs text-gray-500">kcal</p>
          </div>
          <div className="bg-blue-50 p-3 rounded-md text-center">
            <p className="text-sm text-gray-500">Proteínas Totales</p>
            <p className="text-lg font-bold text-blue-600">{nutritionTotals.protein || 0}</p>
            <p className="text-xs text-gray-500">g</p>
          </div>
          <div className="bg-yellow-50 p-3 rounded-md text-center">
            <p className="text-sm text-gray-500">Carbohidratos Totales</p>
            <p className="text-lg font-bold text-yellow-600">{nutritionTotals.carbs || 0}</p>
            <p className="text-xs text-gray-500">g</p>
          </div>
          <div className="bg-red-50 p-3 rounded-md text-center">
            <p className="text-sm text-gray-500">Grasas Totales</p>
            <p className="text-lg font-bold text-red-600">{nutritionTotals.fat || 0}</p>
            <p className="text-xs text-gray-500">g</p>
          </div>
        </div>
      </div>

      {showActions && (
        <Card.Footer className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleExportToPDF}
          >
            Exportar a PDF
          </Button>
          <Button onClick={handleGenerateShoppingList}>
            Generar Lista de Compras
          </Button>
        </Card.Footer>
      )}
    </Card>
  );
}