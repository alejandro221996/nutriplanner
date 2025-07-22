import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

// Obtener todas las recetas con información nutricional
export async function GET() {
  try {
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

    return NextResponse.json(recipesWithNutrition);
  } catch (error) {
    console.error('Error fetching recipes with nutrition:', error);
    return NextResponse.json(
      { error: 'Error al obtener recetas con información nutricional' },
      { status: 500 }
    );
  }
}