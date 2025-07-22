import { ExtendedFood, FoodCategory } from '../types/extendedTypes';

// Obtener todos los alimentos
export const getAllFoods = async (): Promise<ExtendedFood[]> => {
  try {
    const response = await fetch('/api/foods');
    if (!response.ok) {
      throw new Error('Error al obtener alimentos');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching foods:', error);
    throw error;
  }
};

// Obtener un alimento por ID
export const getFoodById = async (id: string): Promise<ExtendedFood | null> => {
  try {
    const response = await fetch(`/api/foods/${id}`);
    if (response.status === 404) {
      return null;
    }
    if (!response.ok) {
      throw new Error('Error al obtener el alimento');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching food ${id}:`, error);
    throw error;
  }
};

// Buscar alimentos por nombre o categoría
export const searchFoods = async (
  query: string,
  category?: FoodCategory
): Promise<ExtendedFood[]> => {
  try {
    let url = `/api/foods/search?q=${encodeURIComponent(query)}`;
    if (category) {
      url += `&category=${encodeURIComponent(category)}`;
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Error al buscar alimentos');
    }
    return await response.json();
  } catch (error) {
    console.error('Error searching foods:', error);
    throw error;
  }
};

// Crear un nuevo alimento
export const createFood = async (
  foodData: Omit<ExtendedFood, 'id'>
): Promise<ExtendedFood> => {
  try {
    const response = await fetch('/api/foods', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(foodData),
    });

    if (!response.ok) {
      throw new Error('Error al crear el alimento');
    }
    return await response.json();
  } catch (error) {
    console.error('Error creating food:', error);
    throw error;
  }
};

// Actualizar un alimento existente
export const updateFood = async (
  id: string,
  foodData: Partial<ExtendedFood>
): Promise<ExtendedFood> => {
  try {
    const response = await fetch(`/api/foods/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(foodData),
    });

    if (!response.ok) {
      throw new Error('Error al actualizar el alimento');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error updating food ${id}:`, error);
    throw error;
  }
};

// Eliminar un alimento
export const deleteFood = async (id: string): Promise<boolean> => {
  try {
    const response = await fetch(`/api/foods/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Error al eliminar el alimento');
    }
    return true;
  } catch (error) {
    console.error(`Error deleting food ${id}:`, error);
    throw error;
  }
};

// Obtener alimentos por categoría
export const getFoodsByCategory = async (
  category: FoodCategory
): Promise<ExtendedFood[]> => {
  try {
    const response = await fetch(`/api/foods/category/${category}`);
    if (!response.ok) {
      throw new Error(`Error al obtener alimentos de categoría ${category}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching foods by category ${category}:`, error);
    throw error;
  }
};

// Obtener alternativas para un alimento
export const getFoodAlternatives = async (id: string): Promise<ExtendedFood[]> => {
  try {
    const response = await fetch(`/api/foods/${id}/alternatives`);
    if (!response.ok) {
      throw new Error('Error al obtener alternativas');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching alternatives for food ${id}:`, error);
    throw error;
  }
};