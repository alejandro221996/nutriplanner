export interface Ingredient {
  id: string;
  name: string;
  category: IngredientCategory;
  nutritionPer100g: NutritionInfo;
  commonPortionSize: number; // en gramos
  commonPortionUnit: string; // "g", "ml", "unidad", etc.
  alternativesIds?: string[]; // IDs de ingredientes que pueden ser sustitutos
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  isLactoseFree: boolean;
  isNutFree: boolean;
  tags: string[]; // etiquetas adicionales para búsqueda y filtrado
}

export interface NutritionInfo {
  calories: number; // kcal
  protein: number; // gramos
  carbs: number; // gramos
  fat: number; // gramos
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
}

export type IngredientCategory =
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

// Ingrediente con cantidad para usar en recetas y menús
export interface IngredientWithAmount {
  ingredientId: string;
  amount: number; // cantidad en gramos o ml
  unit: string; // unidad de medida
}

// Función para calcular la nutrición de un ingrediente según la cantidad
export function calculateIngredientNutrition(
  ingredient: Ingredient,
  amountInGrams: number
): NutritionInfo {
  const ratio = amountInGrams / 100; // nutrición por cada 100g

  return {
    calories: ingredient.nutritionPer100g.calories * ratio,
    protein: ingredient.nutritionPer100g.protein * ratio,
    carbs: ingredient.nutritionPer100g.carbs * ratio,
    fat: ingredient.nutritionPer100g.fat * ratio,
    fiber: ingredient.nutritionPer100g.fiber ? ingredient.nutritionPer100g.fiber * ratio : undefined,
    sugar: ingredient.nutritionPer100g.sugar ? ingredient.nutritionPer100g.sugar * ratio : undefined,
    saturatedFat: ingredient.nutritionPer100g.saturatedFat ? ingredient.nutritionPer100g.saturatedFat * ratio : undefined,
    unsaturatedFat: ingredient.nutritionPer100g.unsaturatedFat ? ingredient.nutritionPer100g.unsaturatedFat * ratio : undefined,
    sodium: ingredient.nutritionPer100g.sodium ? ingredient.nutritionPer100g.sodium * ratio : undefined,
    potassium: ingredient.nutritionPer100g.potassium ? ingredient.nutritionPer100g.potassium * ratio : undefined,
    calcium: ingredient.nutritionPer100g.calcium ? ingredient.nutritionPer100g.calcium * ratio : undefined,
    iron: ingredient.nutritionPer100g.iron ? ingredient.nutritionPer100g.iron * ratio : undefined,
    vitaminA: ingredient.nutritionPer100g.vitaminA ? ingredient.nutritionPer100g.vitaminA * ratio : undefined,
    vitaminC: ingredient.nutritionPer100g.vitaminC ? ingredient.nutritionPer100g.vitaminC * ratio : undefined,
    vitaminD: ingredient.nutritionPer100g.vitaminD ? ingredient.nutritionPer100g.vitaminD * ratio : undefined,
    vitaminE: ingredient.nutritionPer100g.vitaminE ? ingredient.nutritionPer100g.vitaminE * ratio : undefined,
  };
}