import { Ingredient, IngredientCategory } from '../types/ingredient';

// Obtener todos los ingredientes
export const getAllIngredients = async (): Promise<Ingredient[]> => {
  try {
    const response = await fetch('/api/ingredients');
    if (!response.ok) {
      throw new Error('Error al obtener ingredientes');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching ingredients:', error);
    throw error;
  }
};

// Obtener un ingrediente por ID
export const getIngredientById = async (id: string): Promise<Ingredient | null> => {
  try {
    const response = await fetch(`/api/ingredients/${id}`);
    if (response.status === 404) {
      return null;
    }
    if (!response.ok) {
      throw new Error('Error al obtener el ingrediente');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ingredient ${id}:`, error);
    throw error;
  }
};

// Buscar ingredientes por nombre o categoría
export const searchIngredients = async (
  query: string,
  category?: IngredientCategory
): Promise<Ingredient[]> => {
  try {
    let url = `/api/ingredients/search?q=${encodeURIComponent(query)}`;
    if (category) {
      url += `&category=${encodeURIComponent(category)}`;
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Error al buscar ingredientes');
    }
    return await response.json();
  } catch (error) {
    console.error('Error searching ingredients:', error);
    throw error;
  }
};

// Crear un nuevo ingrediente
export const createIngredient = async (
  ingredientData: Omit<Ingredient, 'id'>
): Promise<Ingredient> => {
  try {
    const response = await fetch('/api/ingredients', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ingredientData),
    });

    if (!response.ok) {
      throw new Error('Error al crear el ingrediente');
    }
    return await response.json();
  } catch (error) {
    console.error('Error creating ingredient:', error);
    throw error;
  }
};

// Actualizar un ingrediente existente
export const updateIngredient = async (
  id: string,
  ingredientData: Partial<Ingredient>
): Promise<Ingredient> => {
  try {
    const response = await fetch(`/api/ingredients/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ingredientData),
    });

    if (!response.ok) {
      throw new Error('Error al actualizar el ingrediente');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error updating ingredient ${id}:`, error);
    throw error;
  }
};

// Eliminar un ingrediente
export const deleteIngredient = async (id: string): Promise<boolean> => {
  try {
    const response = await fetch(`/api/ingredients/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Error al eliminar el ingrediente');
    }
    return true;
  } catch (error) {
    console.error(`Error deleting ingredient ${id}:`, error);
    throw error;
  }
};

// Obtener ingredientes por categoría
export const getIngredientsByCategory = async (
  category: IngredientCategory
): Promise<Ingredient[]> => {
  try {
    const response = await fetch(`/api/ingredients/category/${category}`);
    if (!response.ok) {
      throw new Error(`Error al obtener ingredientes de categoría ${category}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ingredients by category ${category}:`, error);
    throw error;
  }
};

// Obtener alternativas para un ingrediente
export const getIngredientAlternatives = async (id: string): Promise<Ingredient[]> => {
  try {
    const response = await fetch(`/api/ingredients/${id}/alternatives`);
    if (!response.ok) {
      throw new Error('Error al obtener alternativas');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching alternatives for ingredient ${id}:`, error);
    throw error;
  }
};