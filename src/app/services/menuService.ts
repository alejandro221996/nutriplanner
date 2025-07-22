import { ExtendedMenu } from '../types/extendedTypes';

// Generar un menú diario basado en el perfil del usuario
export const generateDailyMenu = async (
  userId: string,
  date: Date,
  preferences?: {
    excludeFoods?: string[];
    preferredCategories?: string[];
    calorieAdjustment?: number; // porcentaje de ajuste (-20 a +20)
  }
): Promise<ExtendedMenu> => {
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
    excludeFoods?: string[];
    preferredCategories?: string[];
    calorieAdjustment?: number; // porcentaje de ajuste (-20 a +20)
  }
): Promise<ExtendedMenu[]> => {
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
export const getFavoriteMenus = async (userId: string): Promise<ExtendedMenu[]> => {
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

// Obtener un menú por ID
export const getMenuById = async (id: string): Promise<ExtendedMenu | null> => {
  try {
    const response = await fetch(`/api/menus/${id}`);
    if (response.status === 404) {
      return null;
    }
    if (!response.ok) {
      throw new Error('Error al obtener el menú');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching menu ${id}:`, error);
    throw error;
  }
};

// Obtener todos los menús de un usuario
export const getUserMenus = async (userId: string): Promise<ExtendedMenu[]> => {
  try {
    const response = await fetch(`/api/menus/user/${userId}`);
    if (!response.ok) {
      throw new Error('Error al obtener los menús del usuario');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching menus for user ${userId}:`, error);
    throw error;
  }
};