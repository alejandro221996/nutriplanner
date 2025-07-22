import { ExtendedRecipe, FoodWithAmount, MealType } from '../types/extendedTypes';

// Obtener todas las recetas
export const getAllRecipes = async (): Promise<ExtendedRecipe[]> => {
  try {
    const response = await fetch('/api/recipes');
    if (!response.ok) {
      throw new Error('Error al obtener recetas');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching recipes:', error);
    throw error;
  }
};

// Obtener una receta por ID
export const getRecipeById = async (id: string): Promise<ExtendedRecipe | null> => {
  try {
    const response = await fetch(`/api/recipes/${id}`);
    if (response.status === 404) {
      return null;
    }
    if (!response.ok) {
      throw new Error('Error al obtener la receta');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching recipe ${id}:`, error);
    throw error;
  }
};

// Crear una nueva receta
export const createRecipe = async (
  recipeData: Omit<ExtendedRecipe, 'id'>
): Promise<ExtendedRecipe> => {
  try {
    const response = await fetch('/api/recipes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(recipeData),
    });

    if (!response.ok) {
      throw new Error('Error al crear la receta');
    }
    return await response.json();
  } catch (error) {
    console.error('Error creating recipe:', error);
    throw error;
  }
};

// Actualizar una receta existente
export const updateRecipe = async (
  id: string,
  recipeData: Partial<ExtendedRecipe>
): Promise<ExtendedRecipe> => {
  try {
    const response = await fetch(`/api/recipes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(recipeData),
    });

    if (!response.ok) {
      throw new Error('Error al actualizar la receta');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error updating recipe ${id}:`, error);
    throw error;
  }
};

// Eliminar una receta
export const deleteRecipe = async (id: string): Promise<boolean> => {
  try {
    const response = await fetch(`/api/recipes/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Error al eliminar la receta');
    }
    return true;
  } catch (error) {
    console.error(`Error deleting recipe ${id}:`, error);
    throw error;
  }
};

// Buscar recetas por nombre o tipo
export const searchRecipes = async (
  query: string,
  type?: MealType
): Promise<ExtendedRecipe[]> => {
  try {
    let url = `/api/recipes/search?q=${encodeURIComponent(query)}`;
    if (type) {
      url += `&type=${encodeURIComponent(type)}`;
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Error al buscar recetas');
    }
    return await response.json();
  } catch (error) {
    console.error('Error searching recipes:', error);
    throw error;
  }
};

// Obtener recetas por tipo de comida
export const getRecipesByType = async (
  type: MealType
): Promise<ExtendedRecipe[]> => {
  try {
    const response = await fetch(`/api/recipes/type/${type}`);
    if (!response.ok) {
      throw new Error(`Error al obtener recetas de tipo ${type}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching recipes by type ${type}:`, error);
    throw error;
  }
};

// Obtener recetas por restricciones dietéticas
export const getRecipesByDietaryRestrictions = async (
  restrictions: string[]
): Promise<ExtendedRecipe[]> => {
  try {
    const response = await fetch('/api/recipes/dietary', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ restrictions }),
    });

    if (!response.ok) {
      throw new Error('Error al obtener recetas por restricciones dietéticas');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching recipes by dietary restrictions:', error);
    throw error;
  }
};

// Añadir un ingrediente a una receta
export const addIngredientToRecipe = async (
  recipeId: string,
  ingredient: FoodWithAmount
): Promise<ExtendedRecipe> => {
  try {
    const response = await fetch(`/api/recipes/${recipeId}/ingredients`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ingredient),
    });

    if (!response.ok) {
      throw new Error('Error al añadir ingrediente a la receta');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error adding ingredient to recipe ${recipeId}:`, error);
    throw error;
  }
};

// Eliminar un ingrediente de una receta
export const removeIngredientFromRecipe = async (
  recipeId: string,
  ingredientId: string
): Promise<ExtendedRecipe> => {
  try {
    const response = await fetch(`/api/recipes/${recipeId}/ingredients/${ingredientId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Error al eliminar ingrediente de la receta');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error removing ingredient from recipe ${recipeId}:`, error);
    throw error;
  }
};