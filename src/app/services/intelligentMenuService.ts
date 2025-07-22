import { prisma } from '../lib/prisma';

interface NutritionTargets {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface MealTargets {
  breakfast: NutritionTargets;
  lunch: NutritionTargets;
  snack: NutritionTargets;
  dinner: NutritionTargets;
}

interface FoodWithNutrition {
  id: string;
  name: string;
  category: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  commonPortionSize: number;
  commonPortionUnit: string;
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  isLactoseFree: boolean;
  isNutFree: boolean;
  tags: string[];
}

interface SelectedIngredient {
  food: FoodWithNutrition;
  quantity: number;
  unit: string;
}

export class IntelligentMenuService {

  // Distribución típica de macros por comida
  private static MEAL_DISTRIBUTION = {
    breakfast: { calories: 0.25, protein: 0.20, carbs: 0.30, fat: 0.25 },
    lunch: { calories: 0.35, protein: 0.40, carbs: 0.35, fat: 0.30 },
    snack: { calories: 0.15, protein: 0.15, carbs: 0.20, fat: 0.20 },
    dinner: { calories: 0.25, protein: 0.25, carbs: 0.15, fat: 0.25 }
  };

  // Categorías preferidas por tipo de comida
  private static MEAL_PREFERENCES = {
    breakfast: {
      preferred: ['dairy', 'fruit', 'grain', 'nut'],
      protein: ['protein', 'dairy'],
      carbs: ['grain', 'fruit'],
      fats: ['nut', 'fat']
    },
    lunch: {
      preferred: ['protein', 'carb', 'vegetable'],
      protein: ['protein'],
      carbs: ['carb', 'grain'],
      fats: ['fat', 'nut']
    },
    snack: {
      preferred: ['fruit', 'nut', 'dairy'],
      protein: ['dairy', 'protein'],
      carbs: ['fruit', 'grain'],
      fats: ['nut', 'fat']
    },
    dinner: {
      preferred: ['protein', 'vegetable', 'carb'],
      protein: ['protein'],
      carbs: ['carb', 'vegetable'],
      fats: ['fat', 'nut']
    }
  };

  static async generateIntelligentMenu(
    userId: string,
    dailyCalories: number,
    preferences: {
      isVegetarian?: boolean;
      isVegan?: boolean;
      isGlutenFree?: boolean;
      isLactoseFree?: boolean;
      isNutFree?: boolean;
      excludedFoods?: string[];
    } = {}
  ) {
    console.log('🧠 Generando menú inteligente para usuario:', userId);
    console.log('🎯 Calorías objetivo:', dailyCalories);
    console.log('🥗 Preferencias:', preferences);

    // 1. Obtener todos los alimentos disponibles
    const availableFoods = await this.getAvailableFoods(preferences);
    console.log('📋 Alimentos disponibles:', availableFoods.length);

    // 2. Calcular objetivos nutricionales por comida
    const mealTargets = this.calculateMealTargets(dailyCalories);
    console.log('🎯 Objetivos por comida:', mealTargets);

    // 3. Generar cada comida
    const menuItems = [];

    for (const mealType of ['breakfast', 'lunch', 'snack', 'dinner'] as const) {
      const ingredients = await this.generateMealIngredients(
        availableFoods,
        mealType,
        mealTargets[mealType]
      );

      menuItems.push({
        mealType,
        name: this.getMealName(mealType),
        ingredients
      });
    }

    return menuItems;
  }

  private static async getAvailableFoods(preferences: any): Promise<FoodWithNutrition[]> {
    const whereClause: any = {};

    // Aplicar filtros de preferencias alimentarias
    if (preferences.isVegetarian) whereClause.isVegetarian = true;
    if (preferences.isVegan) whereClause.isVegan = true;
    if (preferences.isGlutenFree) whereClause.isGlutenFree = true;
    if (preferences.isLactoseFree) whereClause.isLactoseFree = true;
    if (preferences.isNutFree) whereClause.isNutFree = true;

    // Excluir alimentos específicos
    if (preferences.excludedFoods?.length > 0) {
      whereClause.name = {
        notIn: preferences.excludedFoods
      };
    }

    const foods = await prisma.food.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        category: true,
        calories: true,
        protein: true,
        carbs: true,
        fat: true,
        commonPortionSize: true,
        commonPortionUnit: true,
        isVegetarian: true,
        isVegan: true,
        isGlutenFree: true,
        isLactoseFree: true,
        isNutFree: true,
        tags: true
      }
    });

    return foods;
  }

  private static calculateMealTargets(dailyCalories: number): MealTargets {
    // Calcular macros diarios (ejemplo: 30% proteína, 40% carbs, 30% grasas)
    const dailyProtein = (dailyCalories * 0.30) / 4; // 4 kcal por gramo de proteína
    const dailyCarbs = (dailyCalories * 0.40) / 4;   // 4 kcal por gramo de carbos
    const dailyFat = (dailyCalories * 0.30) / 9;     // 9 kcal por gramo de grasa

    const targets: MealTargets = {
      breakfast: {
        calories: dailyCalories * this.MEAL_DISTRIBUTION.breakfast.calories,
        protein: dailyProtein * this.MEAL_DISTRIBUTION.breakfast.protein,
        carbs: dailyCarbs * this.MEAL_DISTRIBUTION.breakfast.carbs,
        fat: dailyFat * this.MEAL_DISTRIBUTION.breakfast.fat
      },
      lunch: {
        calories: dailyCalories * this.MEAL_DISTRIBUTION.lunch.calories,
        protein: dailyProtein * this.MEAL_DISTRIBUTION.lunch.protein,
        carbs: dailyCarbs * this.MEAL_DISTRIBUTION.lunch.carbs,
        fat: dailyFat * this.MEAL_DISTRIBUTION.lunch.fat
      },
      snack: {
        calories: dailyCalories * this.MEAL_DISTRIBUTION.snack.calories,
        protein: dailyProtein * this.MEAL_DISTRIBUTION.snack.protein,
        carbs: dailyCarbs * this.MEAL_DISTRIBUTION.snack.carbs,
        fat: dailyFat * this.MEAL_DISTRIBUTION.snack.fat
      },
      dinner: {
        calories: dailyCalories * this.MEAL_DISTRIBUTION.dinner.calories,
        protein: dailyProtein * this.MEAL_DISTRIBUTION.dinner.protein,
        carbs: dailyCarbs * this.MEAL_DISTRIBUTION.dinner.carbs,
        fat: dailyFat * this.MEAL_DISTRIBUTION.dinner.fat
      }
    };

    return targets;
  }

  private static async generateMealIngredients(
    availableFoods: FoodWithNutrition[],
    mealType: keyof typeof this.MEAL_PREFERENCES,
    targets: NutritionTargets
  ): Promise<SelectedIngredient[]> {
    const selectedIngredients: SelectedIngredient[] = [];
    const mealPrefs = this.MEAL_PREFERENCES[mealType];

    // Filtrar alimentos apropiados para este tipo de comida
    const suitableFoods = availableFoods.filter(food =>
      mealPrefs.preferred.includes(food.category) ||
      mealPrefs.protein.includes(food.category) ||
      mealPrefs.carbs.includes(food.category) ||
      mealPrefs.fats.includes(food.category)
    );

    console.log(`🍽️ Generando ${mealType} con ${suitableFoods.length} alimentos disponibles`);

    // Algoritmo simple: seleccionar 3-5 ingredientes que cumplan los objetivos
    const numIngredients = Math.floor(Math.random() * 3) + 3; // 3-5 ingredientes

    // Seleccionar ingredientes de diferentes categorías
    const categories = ['protein', 'carb', 'vegetable', 'fruit', 'dairy', 'fat', 'nut'];
    const usedCategories = new Set<string>();

    for (let i = 0; i < numIngredients && selectedIngredients.length < 6; i++) {
      // Intentar seleccionar de una categoría no usada
      const availableCategories = categories.filter(cat => !usedCategories.has(cat));
      const targetCategory = availableCategories.length > 0
        ? availableCategories[Math.floor(Math.random() * availableCategories.length)]
        : categories[Math.floor(Math.random() * categories.length)];

      const categoryFoods = suitableFoods.filter(food => food.category === targetCategory);

      if (categoryFoods.length > 0) {
        const selectedFood = categoryFoods[Math.floor(Math.random() * categoryFoods.length)];

        // Calcular cantidad apropiada (entre 50g y 200g, ajustado por densidad calórica)
        const caloriesPerGram = selectedFood.calories / selectedFood.commonPortionSize;
        const targetCaloriesForIngredient = targets.calories / numIngredients;
        let quantity = Math.round(targetCaloriesForIngredient / caloriesPerGram);

        // Ajustar cantidad a rangos razonables
        quantity = Math.max(20, Math.min(250, quantity));

        selectedIngredients.push({
          food: selectedFood,
          quantity,
          unit: selectedFood.commonPortionUnit
        });

        usedCategories.add(targetCategory);
      }
    }

    console.log(`✅ ${mealType} generado con ${selectedIngredients.length} ingredientes`);
    return selectedIngredients;
  }

  private static getMealName(mealType: string): string {
    const names = {
      breakfast: ['Desayuno Energético', 'Desayuno Proteico', 'Desayuno Saludable', 'Desayuno Completo'],
      lunch: ['Almuerzo Balanceado', 'Almuerzo Nutritivo', 'Almuerzo Completo', 'Almuerzo Saludable'],
      snack: ['Snack Proteico', 'Merienda Saludable', 'Snack Energético', 'Merienda Nutritiva'],
      dinner: ['Cena Ligera', 'Cena Proteica', 'Cena Saludable', 'Cena Completa']
    };

    const mealNames = names[mealType as keyof typeof names] || ['Comida'];
    return mealNames[Math.floor(Math.random() * mealNames.length)];
  }
}