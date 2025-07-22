import { Ingredient, IngredientWithAmount, NutritionInfo, calculateIngredientNutrition } from './ingredient';

export interface Meal {
  id: string;
  name: string;
  description?: string;
  type: MealType;
  ingredients: IngredientWithAmount[];
  preparationSteps?: string[];
  preparationTime?: number; // en minutos
  cookingTime?: number; // en minutos
  servings: number;
  tags: string[];
  isVegetarian?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
  isLactoseFree?: boolean;
  isNutFree?: boolean;
  imageUrl?: string;
}

export type MealType =
  | 'breakfast'
  | 'lunch'
  | 'dinner'
  | 'snack'
  | 'dessert';

export interface DailyMenu {
  id: string;
  userId: string;
  date: Date;
  name?: string;
  meals: {
    mealId: string;
    type: MealType;
    servings: number;
  }[];
  totalNutrition?: NutritionInfo;
  isFavorite: boolean;
}

export interface WeeklyMenu {
  id: string;
  userId: string;
  startDate: Date;
  endDate: Date;
  name?: string;
  dailyMenus: {
    dayOfWeek: number; // 0-6 (domingo-sábado)
    menuId: string;
  }[];
  isFavorite: boolean;
}

// Función para calcular la nutrición total de una comida
export function calculateMealNutrition(
  meal: Meal,
  ingredientsMap: Map<string, Ingredient>
): NutritionInfo {
  // Inicializar con valores en cero
  const totalNutrition: NutritionInfo = {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0
  };

  // Sumar la nutrición de cada ingrediente
  meal.ingredients.forEach(item => {
    const ingredient = ingredientsMap.get(item.ingredientId);
    if (ingredient) {
      const nutrition = calculateIngredientNutrition(ingredient, item.amount);

      // Sumar valores básicos
      totalNutrition.calories += nutrition.calories;
      totalNutrition.protein += nutrition.protein;
      totalNutrition.carbs += nutrition.carbs;
      totalNutrition.fat += nutrition.fat;

      // Sumar valores opcionales si existen
      if (nutrition.fiber) {
        totalNutrition.fiber = (totalNutrition.fiber || 0) + nutrition.fiber;
      }
      if (nutrition.sugar) {
        totalNutrition.sugar = (totalNutrition.sugar || 0) + nutrition.sugar;
      }
      if (nutrition.saturatedFat) {
        totalNutrition.saturatedFat = (totalNutrition.saturatedFat || 0) + nutrition.saturatedFat;
      }
      // ... y así con el resto de propiedades opcionales
    }
  });

  return totalNutrition;
}