import { Food, MacroTargets, Menu, MenuItem, Recipe } from './index';

// Extendemos el tipo Food existente para incluir información nutricional más detallada
export interface ExtendedFood extends Food {
  fiber?: number; // gramos
  sugar?: number; // gramos
  saturatedFat?: number; // gramos
  unsaturatedFat?: number; // gramos
  sodium?: number; // mg
  potassium?: number; // mg
  calcium?: number; // mg
  iron?: number; // mg
  vitaminA?: number; // UI
  vitaminC?: number; // mg
  vitaminD?: number; // UI
  vitaminE?: number; // mg
  commonPortionSize: number; // en gramos
  commonPortionUnit: string; // "g", "ml", "unidad", etc.
  alternativesIds: string[]; // IDs de ingredientes que pueden ser sustitutos
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  isLactoseFree: boolean;
  isNutFree: boolean;
  tags: string[]; // etiquetas adicionales para búsqueda y filtrado
}

// Tipo para categorías de alimentos más específicas
export type FoodCategory =
  | 'protein' // proteínas (carnes, pescados, huevos, legumbres)
  | 'carb' // carbohidratos (arroz, pasta, pan, patatas)
  | 'vegetable' // verduras
  | 'fruit' // frutas
  | 'dairy' // lácteos
  | 'fat' // grasas (aceites, mantequilla, frutos secos)
  | 'spice' // especias y condimentos
  | 'grain' // cereales y granos
  | 'legume' // legumbres
  | 'nut' // frutos secos
  | 'seed' // semillas
  | 'sweetener' // edulcorantes y azúcares
  | 'beverage' // bebidas
  | 'other'; // otros

// Alimento con cantidad para usar en recetas y menús
export interface FoodWithAmount {
  foodId: string;
  amount: number; // cantidad en gramos o ml
  unit: string; // unidad de medida
}

// Extendemos el tipo Recipe para incluir más detalles
export interface ExtendedRecipe extends Recipe {
  type: MealType;
  preparationSteps: string[];
  ingredients: FoodWithAmount[];
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  isLactoseFree: boolean;
  isNutFree: boolean;
  imageUrl?: string;
  tags: string[];
}

export type MealType =
  | 'breakfast'
  | 'lunch'
  | 'dinner'
  | 'snack'
  | 'dessert';

// Extendemos el tipo Menu para incluir información nutricional
export interface ExtendedMenu extends Menu {
  date?: Date;
  totalNutrition?: MacroTargets;
}

// Extendemos el tipo MenuItem para incluir más detalles
export interface ExtendedMenuItem extends MenuItem {
  servings: number;
}

// Funciones de utilidad para cálculos nutricionales

// Calcular la nutrición de un alimento según la cantidad
export function calculateFoodNutrition(
  food: Food,
  amountInGrams: number
): Food {
  const ratio = amountInGrams / 100; // nutrición por cada 100g

  return {
    id: food.id,
    name: food.name,
    calories: Math.round(food.calories * ratio),
    protein: Math.round(food.protein * ratio * 10) / 10,
    carbs: Math.round(food.carbs * ratio * 10) / 10,
    fat: Math.round(food.fat * ratio * 10) / 10,
    category: food.category,
    unit: food.unit
  };
}

// Calcular la nutrición total de una receta
export function calculateRecipeNutrition(
  recipe: ExtendedRecipe,
  foodsMap: Map<string, Food>
): MacroTargets {
  // Inicializar con valores en cero
  const totalNutrition: MacroTargets = {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0
  };

  // Sumar la nutrición de cada ingrediente
  recipe.ingredients.forEach(item => {
    const food = foodsMap.get(item.foodId);
    if (food) {
      const nutrition = calculateFoodNutrition(food, item.amount);

      // Sumar valores
      totalNutrition.calories += nutrition.calories;
      totalNutrition.protein += nutrition.protein;
      totalNutrition.carbs += nutrition.carbs;
      totalNutrition.fat += nutrition.fat;
    }
  });

  return {
    calories: Math.round(totalNutrition.calories),
    protein: Math.round(totalNutrition.protein * 10) / 10,
    carbs: Math.round(totalNutrition.carbs * 10) / 10,
    fat: Math.round(totalNutrition.fat * 10) / 10
  };
}