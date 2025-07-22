import { DailyMenu, Meal, MealType, WeeklyMenu } from '../types/meal';

// Obtener todas las comidas
export const getAllMeals = async (): Promise<Meal[]> => {
  try {
    const response = await fetch('/api/meals');
    if (!response.ok) {
      throw new Error('Error al obtener comidas');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching meals:', error);
    throw error;
  }
};

// Obtener una comida por ID
export const getMealById = async (id: string): Promise<Meal | null> => {
  try {
    const response = await fetch(`/api/meals/${id}`);
    if (response.status === 404) {
      return null;
    }
    if (!response.ok) {
      throw new Error('Error al obtener la comida');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching meal ${id}:`, error);
    throw error;
  }
};

// Crear una nueva comida
export const createMeal = async (mealData: Omit<Meal, 'id'>): Promise<Meal> => {
  try {
    const response = await fetch('/api/meals', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mealData),
    });

    if (!response.ok) {
      throw new Error('Error al crear la comida');
    }
    return await response.json();
  } catch (error) {
    console.error('Error creating meal:', error);
    throw error;
  }
};

// Actualizar una comida existente
export const updateMeal = async (
  id: string,
  mealData: Partial<Meal>
): Promise<Meal> => {
  try {
    const response = await fetch(`/api/meals/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mealData),
    });

    if (!response.ok) {
      throw new Error('Error al actualizar la comida');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error updating meal ${id}:`, error);
    throw error;
  }
};

// Eliminar una comida
export const deleteMeal = async (id: string): Promise<boolean> => {
  try {
    const response = await fetch(`/api/meals/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Error al eliminar la comida');
    }
    return true;
  } catch (error) {
    console.error(`Error deleting meal ${id}:`, error);
    throw error;
  }
};

// Buscar comidas por nombre o tipo
export const searchMeals = async (
  query: string,
  type?: MealType
): Promise<Meal[]> => {
  try {
    let url = `/api/meals/search?q=${encodeURIComponent(query)}`;
    if (type) {
      url += `&type=${encodeURIComponent(type)}`;
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Error al buscar comidas');
    }
    return await response.json();
  } catch (error) {
    console.error('Error searching meals:', error);
    throw error;
  }
};

// Generar un menú diario basado en el perfil del usuario
export const generateDailyMenu = async (
  userId: string,
  date: Date,
  preferences?: {
    excludeIngredients?: string[];
    preferredCategories?: string[];
    calorieAdjustment?: number; // porcentaje de ajuste (-20 a +20)
  }
): Promise<DailyMenu> => {
  try {
    const response = await fetch('/api/menus/generate/daily', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        date: date.toISOString(),
        preferences
      }),
    });

    if (!response.ok) {
      throw new Error('Error al generar el menú diario');
    }
    return await response.json();
  } catch (error) {
    console.error('Error generating daily menu:', error);
    throw error;
  }
};

// Generar un menú semanal basado en el perfil del usuario
export const generateWeeklyMenu = async (
  userId: string,
  startDate: Date,
  preferences?: {
    excludeIngredients?: string[];
    preferredCategories?: string[];
    calorieAdjustment?: number; // porcentaje de ajuste (-20 a +20)
  }
): Promise<WeeklyMenu> => {
  try {
    const response = await fetch('/api/menus/generate/weekly', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        startDate: startDate.toISOString(),
        preferences
      }),
    });

    if (!response.ok) {
      throw new Error('Error al generar el menú semanal');
    }
    return await response.json();
  } catch (error) {
    console.error('Error generating weekly menu:', error);
    throw error;
  }
};

// Obtener menús favoritos del usuario
export const getFavoriteMenus = async (userId: string): Promise<(DailyMenu | WeeklyMenu)[]> => {
  try {
    const response = await fetch(`/api/menus/favorites?userId=${userId}`);
    if (!response.ok) {
      throw new Error('Error al obtener menús favoritos');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching favorite menus:', error);
    throw error;
  }
};

// Marcar un menú como favorito
export const toggleFavoriteMenu = async (
  menuId: string,
  isFavorite: boolean
): Promise<boolean> => {
  try {
    const response = await fetch(`/api/menus/${menuId}/favorite`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ isFavorite }),
    });

    if (!response.ok) {
      throw new Error('Error al actualizar favorito');
    }
    return true;
  } catch (error) {
    console.error(`Error toggling favorite for menu ${menuId}:`, error);
    throw error;
  }
};