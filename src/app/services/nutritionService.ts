import {
  ActivityLevel,
  Food,
  Goal,
  MacroTargets,
  NutritionProfile
} from '../types';

export interface FoodWithNutrition extends Food { }

export interface RecipeWithNutrition {
  id: string;
  name: string;
  description?: string;
  instructions?: string;
  prepTime?: number;
  cookTime?: number;
  servings: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  items: {
    food: FoodWithNutrition;
    quantity: number;
    unit: string;
  }[];
}

export interface MealPlan {
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  targetCalories: number;
  recipes: RecipeWithNutrition[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

export interface DailyMealPlan {
  date: Date;
  meals: MealPlan[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  targetCalories: number;
  targetProtein: number;
  targetCarbs: number;
  targetFat: number;
}

// Calcular BMR (Basal Metabolic Rate) usando la fórmula de Mifflin-St Jeor
export function calculateBMR(profile: NutritionProfile): number {
  const { weight, height, age, gender } = profile;

  let bmr: number;

  if (gender === 'male') {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else if (gender === 'female') {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  } else {
    // Para 'other', usar el promedio de ambas fórmulas
    const maleBMR = 10 * weight + 6.25 * height - 5 * age + 5;
    const femaleBMR = 10 * weight + 6.25 * height - 5 * age - 161;
    bmr = (maleBMR + femaleBMR) / 2;
  }

  return Math.round(bmr);
}

// Calcular TDEE (Total Daily Energy Expenditure)
export function calculateTDEE(profile: NutritionProfile): number {
  const bmr = calculateBMR(profile);

  // Factores de actividad
  const activityFactors: Record<ActivityLevel, number> = {
    sedentary: 1.2,      // Poco o ningún ejercicio
    light: 1.375,        // Ejercicio ligero 1-3 días/semana
    moderate: 1.55,      // Ejercicio moderado 3-5 días/semana
    active: 1.725,       // Ejercicio intenso 6-7 días/semana
    very_active: 1.9     // Ejercicio muy intenso, trabajo físico
  };

  const tdee = bmr * activityFactors[profile.activityLevel];
  return Math.round(tdee);
}

// Calcular calorías objetivo según el objetivo del usuario
export function calculateTargetCalories(profile: NutritionProfile): number {
  const tdee = calculateTDEE(profile);

  switch (profile.goal) {
    case 'lose':
      return Math.round(tdee * 0.8); // Déficit del 20%
    case 'gain':
      return Math.round(tdee * 1.15); // Superávit del 15%
    case 'lose_maintain_muscle':
      return Math.round(tdee * 0.85); // Déficit moderado del 15%
    case 'gain_muscle_lose_fat':
      return Math.round(tdee * 1.05); // Ligero superávit del 5%
    case 'recomp':
      return tdee; // Mantenimiento de calorías pero con diferente distribución de macros
    case 'maintain':
    default:
      return tdee;
  }
}

// Calcular macronutrientes objetivo
export function calculateMacroTargets(profile: NutritionProfile): MacroTargets {
  const targetCalories = calculateTargetCalories(profile);

  // Distribución de macronutrientes según el objetivo
  let proteinPercentage: number;
  let fatPercentage: number;
  let carbPercentage: number;

  switch (profile.goal) {
    case 'lose':
      // Mayor proteína para preservar masa muscular
      proteinPercentage = 0.35; // 35%
      fatPercentage = 0.30;     // 30%
      carbPercentage = 0.35;    // 35%
      break;
    case 'gain':
      // Más carbohidratos para energía
      proteinPercentage = 0.25; // 25%
      fatPercentage = 0.25;     // 25%
      carbPercentage = 0.50;    // 50%
      break;
    case 'lose_maintain_muscle':
      // Alta proteína para preservar músculo, grasa moderada, carbos reducidos
      proteinPercentage = 0.40; // 40%
      fatPercentage = 0.30;     // 30%
      carbPercentage = 0.30;    // 30%
      break;
    case 'gain_muscle_lose_fat':
      // Alta proteína para construcción muscular, grasa moderada
      proteinPercentage = 0.35; // 35%
      fatPercentage = 0.25;     // 25%
      carbPercentage = 0.40;    // 40%
      break;
    case 'recomp':
      // Alta proteína, grasa moderada, carbos moderados
      proteinPercentage = 0.40; // 40%
      fatPercentage = 0.30;     // 30%
      carbPercentage = 0.30;    // 30%
      break;
    case 'maintain':
    default:
      // Distribución equilibrada
      proteinPercentage = 0.30; // 30%
      fatPercentage = 0.30;     // 30%
      carbPercentage = 0.40;    // 40%
      break;
  }

  // Calcular gramos de cada macronutriente
  // 1g proteína = 4 kcal, 1g carbohidrato = 4 kcal, 1g grasa = 9 kcal
  const protein = Math.round((targetCalories * proteinPercentage) / 4);
  const carbs = Math.round((targetCalories * carbPercentage) / 4);
  const fat = Math.round((targetCalories * fatPercentage) / 9);

  return {
    calories: targetCalories,
    protein,
    carbs,
    fat
  };
}

// Obtener todas las recetas con información nutricional
export async function getRecipesWithNutrition(): Promise<RecipeWithNutrition[]> {
  try {
    const response = await fetch('/api/nutrition/recipes');
    if (!response.ok) {
      throw new Error('Error al obtener recetas con información nutricional');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return [];
  }
}

// Generar plan de comidas para un día
export async function generateDailyMealPlan(
  profile: NutritionProfile,
  date: Date = new Date()
): Promise<DailyMealPlan> {
  const macroTargets = calculateMacroTargets(profile);
  const recipes = await getRecipesWithNutrition();

  // Distribución de calorías por comida
  const mealDistribution = {
    breakfast: 0.25,  // 25%
    lunch: 0.35,      // 35%
    dinner: 0.30,     // 30%
    snack: 0.10       // 10%
  };

  const meals: MealPlan[] = [];

  // Generar cada comida
  for (const [mealType, percentage] of Object.entries(mealDistribution)) {
    const targetCalories = Math.round(macroTargets.calories * percentage);

    // Filtrar recetas apropiadas para cada tipo de comida
    let suitableRecipes = recipes;

    // Lógica simple para filtrar recetas por tipo de comida
    if (mealType === 'breakfast') {
      // Preferir recetas con menos calorías y más rápidas para el desayuno
      suitableRecipes = recipes.filter(r =>
        r.calories <= 400 &&
        (r.prepTime || 0) + (r.cookTime || 0) <= 20
      );
    } else if (mealType === 'snack') {
      // Preferir recetas ligeras para snacks
      suitableRecipes = recipes.filter(r => r.calories <= 200);
    }

    // Si no hay recetas adecuadas, usar todas
    if (suitableRecipes.length === 0) {
      suitableRecipes = recipes;
    }

    // Seleccionar recetas que se acerquen al objetivo calórico
    const selectedRecipes = selectRecipesForMeal(suitableRecipes, targetCalories);

    // Calcular totales nutricionales de la comida
    const totalCalories = selectedRecipes.reduce((sum, recipe) => sum + recipe.calories, 0);
    const totalProtein = selectedRecipes.reduce((sum, recipe) => sum + recipe.protein, 0);
    const totalCarbs = selectedRecipes.reduce((sum, recipe) => sum + recipe.carbs, 0);
    const totalFat = selectedRecipes.reduce((sum, recipe) => sum + recipe.fat, 0);

    meals.push({
      mealType: mealType as 'breakfast' | 'lunch' | 'dinner' | 'snack',
      targetCalories,
      recipes: selectedRecipes,
      totalCalories,
      totalProtein,
      totalCarbs,
      totalFat
    });
  }

  // Calcular totales del día
  const totalCalories = meals.reduce((sum, meal) => sum + meal.totalCalories, 0);
  const totalProtein = meals.reduce((sum, meal) => sum + meal.totalProtein, 0);
  const totalCarbs = meals.reduce((sum, meal) => sum + meal.totalCarbs, 0);
  const totalFat = meals.reduce((sum, meal) => sum + meal.totalFat, 0);

  return {
    date,
    meals,
    totalCalories,
    totalProtein,
    totalCarbs,
    totalFat,
    targetCalories: macroTargets.calories,
    targetProtein: macroTargets.protein,
    targetCarbs: macroTargets.carbs,
    targetFat: macroTargets.fat
  };
}

// Seleccionar recetas para una comida específica
function selectRecipesForMeal(
  availableRecipes: RecipeWithNutrition[],
  targetCalories: number
): RecipeWithNutrition[] {
  if (availableRecipes.length === 0) return [];

  // Ordenar recetas por proximidad al objetivo calórico
  const sortedRecipes = availableRecipes
    .map(recipe => ({
      recipe,
      caloriesDiff: Math.abs(recipe.calories - targetCalories)
    }))
    .sort((a, b) => a.caloriesDiff - b.caloriesDiff);

  // Seleccionar la receta más cercana al objetivo
  // En una implementación más avanzada, podríamos combinar múltiples recetas
  return [sortedRecipes[0].recipe];
}

// Generar plan de comidas semanal
export async function generateWeeklyMealPlan(
  profile: NutritionProfile,
  startDate: Date = new Date()
): Promise<DailyMealPlan[]> {
  const weeklyPlan: DailyMealPlan[] = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);

    const dailyPlan = await generateDailyMealPlan(profile, date);
    weeklyPlan.push(dailyPlan);
  }

  return weeklyPlan;
}

// Obtener información nutricional de un perfil
export function getNutritionInfo(profile: NutritionProfile) {
  const bmr = calculateBMR(profile);
  const tdee = calculateTDEE(profile);
  const macroTargets = calculateMacroTargets(profile);

  return {
    bmr,
    tdee,
    macroTargets,
    activityLevelDescription: getActivityLevelDescription(profile.activityLevel),
    goalDescription: getGoalDescription(profile.goal)
  };
}

// Obtener descripción del nivel de actividad
function getActivityLevelDescription(level: ActivityLevel): string {
  const descriptions: Record<ActivityLevel, string> = {
    sedentary: 'Sedentario (poco o ningún ejercicio)',
    light: 'Actividad ligera (ejercicio ligero 1-3 días/semana)',
    moderate: 'Actividad moderada (ejercicio moderado 3-5 días/semana)',
    active: 'Activo (ejercicio intenso 6-7 días/semana)',
    very_active: 'Muy activo (ejercicio muy intenso, trabajo físico)'
  };

  return descriptions[level];
}

// Obtener descripción del objetivo
function getGoalDescription(goal: Goal): string {
  const descriptions: Record<Goal, string> = {
    maintain: 'Mantener peso actual',
    lose: 'Perder peso (déficit calórico)',
    gain: 'Ganar peso (superávit calórico)',
    lose_maintain_muscle: 'Perder peso manteniendo masa muscular',
    gain_muscle_lose_fat: 'Ganar músculo y perder grasa',
    recomp: 'Recomposición corporal (mantener peso, cambiar composición)'
  };

  return descriptions[goal];
}