import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { calculateMacroTargets, RecipeWithNutrition } from '../../../../services/nutritionServiceClient';
import { NutritionProfile } from '../../../../types/index';

export async function POST(request: NextRequest) {
  try {
    const { profile, date } = await request.json();

    if (!profile) {
      return NextResponse.json(
        { error: 'Se requiere un perfil nutricional' },
        { status: 400 }
      );
    }

    const macroTargets = calculateMacroTargets(profile as NutritionProfile);

    // Obtener todas las recetas con información nutricional
    const recipes = await prisma.recipe.findMany({
      include: {
        items: {
          include: {
            food: true
          }
        }
      }
    });

    const recipesWithNutrition = recipes.map(recipe => ({
      id: recipe.id,
      name: recipe.name,
      description: recipe.description || undefined,
      instructions: recipe.instructions || undefined,
      prepTime: recipe.prepTime || undefined,
      cookTime: recipe.cookTime || undefined,
      servings: recipe.servings,
      calories: recipe.calories,
      protein: recipe.protein,
      carbs: recipe.carbs,
      fat: recipe.fat,
      items: recipe.items.map(item => ({
        food: {
          id: item.food.id,
          name: item.food.name,
          calories: item.food.calories,
          protein: item.food.protein,
          carbs: item.food.carbs,
          fat: item.food.fat,
          category: item.food.category,
          unit: item.food.commonPortionUnit
        },
        quantity: item.quantity,
        unit: item.unit
      }))
    }));

    // Distribución de calorías por comida
    // Ajustamos la distribución según el objetivo del usuario
    let mealDistribution;

    if (profile.goal === 'lose') {
      // Para pérdida de peso: desayuno más sustancioso, cena más ligera
      mealDistribution = {
        breakfast: 0.30,  // 30%
        lunch: 0.35,      // 35%
        dinner: 0.25,     // 25%
        snack: 0.10       // 10%
      };
    } else if (profile.goal === 'lose_maintain_muscle') {
      // Para pérdida de peso manteniendo músculo: más proteína distribuida en el día
      mealDistribution = {
        breakfast: 0.25,  // 25%
        lunch: 0.35,      // 35%
        dinner: 0.25,     // 25%
        snack: 0.15       // 15% (snacks proteicos)
      };
    } else if (profile.goal === 'gain') {
      // Para ganancia de peso: más calorías en todas las comidas
      mealDistribution = {
        breakfast: 0.25,  // 25%
        lunch: 0.30,      // 30%
        dinner: 0.30,     // 30%
        snack: 0.15       // 15% (snack más sustancioso)
      };
    } else if (profile.goal === 'gain_muscle_lose_fat') {
      // Para ganar músculo y perder grasa: distribución enfocada en proteínas
      mealDistribution = {
        breakfast: 0.25,  // 25%
        lunch: 0.35,      // 35%
        dinner: 0.25,     // 25%
        snack: 0.15       // 15% (snacks proteicos)
      };
    } else if (profile.goal === 'recomp') {
      // Para recomposición corporal: distribución equilibrada con énfasis en proteínas
      mealDistribution = {
        breakfast: 0.25,  // 25%
        lunch: 0.35,      // 35%
        dinner: 0.30,     // 30%
        snack: 0.10       // 10%
      };
    } else {
      // Para mantenimiento: distribución equilibrada
      mealDistribution = {
        breakfast: 0.25,  // 25%
        lunch: 0.35,      // 35%
        dinner: 0.30,     // 30%
        snack: 0.10       // 10%
      };
    }

    const meals = [];

    // Generar cada comida
    for (const [mealType, percentage] of Object.entries(mealDistribution)) {
      const targetCalories = Math.round(macroTargets.calories * percentage);

      // Filtrar recetas apropiadas para cada tipo de comida
      let suitableRecipes = recipesWithNutrition;

      // Lógica mejorada para filtrar recetas por tipo de comida
      const mealTargetCalories = targetCalories;

      if (mealType === 'breakfast') {
        // Desayuno: ajustamos según el objetivo del usuario
        if (profile.goal === 'lose') {
          // Para pérdida de peso: desayunos con más proteína
          suitableRecipes = recipesWithNutrition.filter(r =>
            r.calories <= mealTargetCalories * 1.2 &&
            r.protein >= 15 && // Mínimo 15g de proteína
            (r.prepTime || 0) + (r.cookTime || 0) <= 25 // Rápido de preparar
          );
        } else if (profile.goal === 'lose_maintain_muscle') {
          // Para pérdida de peso manteniendo músculo: alto en proteína
          suitableRecipes = recipesWithNutrition.filter(r =>
            r.calories <= mealTargetCalories * 1.1 &&
            r.protein >= 20 && // Alto en proteína
            (r.prepTime || 0) + (r.cookTime || 0) <= 30
          );
        } else if (profile.goal === 'gain') {
          // Para ganancia de peso: desayunos más calóricos
          suitableRecipes = recipesWithNutrition.filter(r =>
            r.calories >= mealTargetCalories * 0.7 &&
            r.calories <= mealTargetCalories * 1.3
          );
        } else if (profile.goal === 'gain_muscle_lose_fat' || profile.goal === 'recomp') {
          // Para recomposición o ganancia muscular con pérdida de grasa: alto en proteína
          suitableRecipes = recipesWithNutrition.filter(r =>
            r.calories >= mealTargetCalories * 0.8 &&
            r.calories <= mealTargetCalories * 1.2 &&
            r.protein >= 20 // Alto en proteína
          );
        } else {
          // Para mantenimiento: desayunos equilibrados
          suitableRecipes = recipesWithNutrition.filter(r =>
            r.calories >= mealTargetCalories * 0.7 &&
            r.calories <= mealTargetCalories * 1.2 &&
            (r.prepTime || 0) + (r.cookTime || 0) <= 30
          );
        }
      } else if (mealType === 'lunch') {
        // Almuerzo: comida principal con buen balance de macros
        if (profile.goal === 'lose_maintain_muscle' || profile.goal === 'gain_muscle_lose_fat' || profile.goal === 'recomp') {
          // Para objetivos relacionados con músculo: alto en proteína
          suitableRecipes = recipesWithNutrition.filter(r =>
            r.calories >= mealTargetCalories * 0.7 &&
            r.calories <= mealTargetCalories * 1.3 &&
            r.protein >= 25 // Alta cantidad de proteína
          );
        } else {
          suitableRecipes = recipesWithNutrition.filter(r =>
            r.calories >= mealTargetCalories * 0.7 &&
            r.calories <= mealTargetCalories * 1.3 &&
            r.protein >= 20 // Buena cantidad de proteína
          );
        }
      } else if (mealType === 'dinner') {
        // Cena: ajustada según objetivo
        if (profile.goal === 'lose') {
          // Para pérdida de peso: cenas más ligeras
          suitableRecipes = recipesWithNutrition.filter(r =>
            r.calories <= mealTargetCalories &&
            r.carbs <= 40 // Menos carbohidratos para la noche
          );
        } else if (profile.goal === 'lose_maintain_muscle') {
          // Para pérdida de peso manteniendo músculo: alto en proteína, bajo en carbos
          suitableRecipes = recipesWithNutrition.filter(r =>
            r.calories <= mealTargetCalories * 1.1 &&
            r.protein >= 25 && // Alto en proteína
            r.carbs <= 30 // Bajo en carbohidratos
          );
        } else if (profile.goal === 'gain_muscle_lose_fat' || profile.goal === 'recomp') {
          // Para recomposición: alto en proteína, moderado en carbos
          suitableRecipes = recipesWithNutrition.filter(r =>
            r.calories >= mealTargetCalories * 0.7 &&
            r.calories <= mealTargetCalories * 1.2 &&
            r.protein >= 25 && // Alto en proteína
            r.carbs <= 50 // Moderado en carbohidratos
          );
        } else {
          // Para otros objetivos: cenas normales
          suitableRecipes = recipesWithNutrition.filter(r =>
            r.calories >= mealTargetCalories * 0.7 &&
            r.calories <= mealTargetCalories * 1.2
          );
        }
      } else if (mealType === 'snack') {
        // Snacks: ajustados según objetivo
        if (profile.goal === 'lose') {
          // Para pérdida de peso: snacks bajos en calorías, altos en proteína
          suitableRecipes = recipesWithNutrition.filter(r =>
            r.calories <= mealTargetCalories &&
            r.protein >= 5 && // Algo de proteína
            r.fat <= 10 // Bajo en grasas
          );
        } else if (profile.goal === 'lose_maintain_muscle') {
          // Para pérdida de peso manteniendo músculo: snacks altos en proteína
          suitableRecipes = recipesWithNutrition.filter(r =>
            r.calories <= mealTargetCalories * 1.1 &&
            r.protein >= 10 && // Alta proteína
            r.fat <= 12 // Moderado en grasas
          );
        } else if (profile.goal === 'gain') {
          // Para ganancia de peso: snacks más sustanciosos
          suitableRecipes = recipesWithNutrition.filter(r =>
            r.calories >= mealTargetCalories * 0.7 &&
            r.calories <= mealTargetCalories * 1.5
          );
        } else if (profile.goal === 'gain_muscle_lose_fat' || profile.goal === 'recomp') {
          // Para recomposición: snacks proteicos
          suitableRecipes = recipesWithNutrition.filter(r =>
            r.calories <= mealTargetCalories * 1.2 &&
            r.protein >= 8 // Buena cantidad de proteína
          );
        } else {
          // Para mantenimiento: snacks equilibrados
          suitableRecipes = recipesWithNutrition.filter(r =>
            r.calories <= mealTargetCalories * 1.2
          );
        }
      }

      // Si no hay recetas adecuadas, usar todas
      if (suitableRecipes.length === 0) {
        suitableRecipes = recipesWithNutrition;
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
    let totalCalories = meals.reduce((sum, meal) => sum + meal.totalCalories, 0);
    let totalProtein = meals.reduce((sum, meal) => sum + meal.totalProtein, 0);
    let totalCarbs = meals.reduce((sum, meal) => sum + meal.totalCarbs, 0);
    let totalFat = meals.reduce((sum, meal) => sum + meal.totalFat, 0);

    // Verificar si estamos muy por debajo del objetivo calórico
    // Si estamos más de un 15% por debajo, añadimos un snack adicional
    if (totalCalories < macroTargets.calories * 0.85) {
      const caloriesNeeded = macroTargets.calories - totalCalories;

      // Buscar una receta adecuada para un snack adicional
      const additionalSnacks = recipesWithNutrition
        .filter(recipe =>
          recipe.calories <= caloriesNeeded * 1.2 &&
          recipe.calories >= caloriesNeeded * 0.5)
        .sort((a, b) => Math.abs(a.calories - caloriesNeeded) - Math.abs(b.calories - caloriesNeeded));

      if (additionalSnacks.length > 0) {
        const additionalSnack = additionalSnacks[0];

        // Añadir un snack adicional
        meals.push({
          mealType: 'snack',
          targetCalories: caloriesNeeded,
          recipes: [additionalSnack],
          totalCalories: additionalSnack.calories,
          totalProtein: additionalSnack.protein,
          totalCarbs: additionalSnack.carbs,
          totalFat: additionalSnack.fat
        });

        // Recalcular totales
        totalCalories += additionalSnack.calories;
        totalProtein += additionalSnack.protein;
        totalCarbs += additionalSnack.carbs;
        totalFat += additionalSnack.fat;
      }
    }

    const mealPlan = {
      date: date ? new Date(date) : new Date(),
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

    return NextResponse.json(mealPlan);
  } catch (error) {
    console.error('Error generating daily meal plan:', error);
    return NextResponse.json(
      { error: 'Error al generar el plan de comidas diario' },
      { status: 500 }
    );
  }
}

// Función auxiliar para seleccionar recetas para una comida específica
function selectRecipesForMeal(
  availableRecipes: RecipeWithNutrition[],
  targetCalories: number
): RecipeWithNutrition[] {
  if (availableRecipes.length === 0) return [];

  // Ordenar recetas por calorías (de mayor a menor)
  const sortedRecipes = [...availableRecipes].sort((a, b) => b.calories - a.calories);

  // Estrategia mejorada: usar programación dinámica para encontrar la mejor combinación
  // que se acerque al objetivo calórico sin pasarse demasiado

  // Primero intentamos encontrar una combinación exacta o cercana
  const selectedRecipes: RecipeWithNutrition[] = [];
  let currentCalories = 0;
  let targetRemaining = targetCalories;

  // Intentamos primero con recetas grandes (para comidas principales)
  for (const recipe of sortedRecipes) {
    // Si una sola receta está cerca del objetivo (±15%), la usamos directamente
    if (recipe.calories >= targetCalories * 0.85 && recipe.calories <= targetCalories * 1.15) {
      return [recipe];
    }
  }

  // Si no encontramos una receta única adecuada, intentamos combinar varias
  // Primero buscamos la receta más grande que no supere el objetivo
  let bestLargeRecipe: RecipeWithNutrition | null = null;
  for (const recipe of sortedRecipes) {
    if (recipe.calories <= targetCalories && (!bestLargeRecipe || recipe.calories > bestLargeRecipe.calories)) {
      bestLargeRecipe = recipe;
    }
  }

  if (bestLargeRecipe) {
    selectedRecipes.push(bestLargeRecipe);
    currentCalories += bestLargeRecipe.calories;
    targetRemaining -= bestLargeRecipe.calories;
  } else {
    // Si todas las recetas son más grandes que el objetivo, elegimos la más pequeña
    const smallestRecipe = sortedRecipes[sortedRecipes.length - 1];
    selectedRecipes.push(smallestRecipe);
    currentCalories += smallestRecipe.calories;
    return selectedRecipes; // Retornamos ya que superamos el objetivo
  }

  // Si estamos por debajo del objetivo por más de un 15%, intentamos añadir más recetas
  if (currentCalories < targetCalories * 0.85) {
    // Ordenamos las recetas restantes por calorías (de menor a mayor)
    const remainingRecipes = sortedRecipes
      .filter(recipe => !selectedRecipes.includes(recipe))
      .sort((a, b) => a.calories - b.calories);

    // Intentamos añadir recetas pequeñas hasta acercarnos al objetivo
    for (const recipe of remainingRecipes) {
      // Si añadir esta receta nos acerca más al objetivo sin pasarnos demasiado, la añadimos
      if (currentCalories + recipe.calories <= targetCalories * 1.1) {
        selectedRecipes.push(recipe);
        currentCalories += recipe.calories;

        // Si ya estamos cerca del objetivo, paramos
        if (currentCalories >= targetCalories * 0.9) {
          break;
        }
      }
    }
  }

  // Si después de todo seguimos muy por debajo del objetivo, añadimos la receta
  // que más nos acerque sin pasarnos demasiado
  if (currentCalories < targetCalories * 0.85) {
    const remainingRecipes = sortedRecipes
      .filter(recipe => !selectedRecipes.includes(recipe))
      .map(recipe => ({
        recipe,
        diff: Math.abs(targetRemaining - recipe.calories)
      }))
      .sort((a, b) => a.diff - b.diff);

    if (remainingRecipes.length > 0) {
      selectedRecipes.push(remainingRecipes[0].recipe);
    }
  }

  return selectedRecipes;
}