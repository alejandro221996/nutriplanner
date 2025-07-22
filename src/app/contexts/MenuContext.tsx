'use client';

import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import {
  calculateTargetCalories
} from '../services/nutritionService';
import { Menu, MenuItem, Recipe, ShoppingList, ShoppingListItem } from '../types';
import { useAuth } from './AuthContext';
import { useProfile } from './ProfileContext';

type MenuContextType = {
  currentMenu: Menu | null;
  favoriteMenus: Menu[];
  shoppingList: ShoppingList | null;
  loading: boolean;
  generateMenu: (type: 'daily' | 'weekly') => Promise<void>;
  saveMenu: (menu: Menu) => Promise<void>;
  toggleFavorite: (menuId: string) => Promise<void>;
  generateShoppingList: (menuId: string) => Promise<void>;
  updateShoppingListItem: (itemId: string, purchased: boolean) => Promise<void>;
  substituteMenuItem: (menuItemId: string) => Promise<void>;
};

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export function MenuProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { profile } = useProfile();
  const [currentMenu, setCurrentMenu] = useState<Menu | null>(null);
  const [favoriteMenus, setFavoriteMenus] = useState<Menu[]>([]);
  const [shoppingList, setShoppingList] = useState<ShoppingList | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserMenus = async () => {
      if (!user) {
        setFavoriteMenus([]);
        setCurrentMenu(null);
        return;
      }

      setLoading(true);
      try {
        // Obtener menús del usuario desde la API
        console.log('🔍 Fetching menus for user:', user.id);
        const response = await fetch(`/api/menus/user/${user.id}`);
        console.log('📡 API Response status:', response.status);

        if (response.ok) {
          const menus: Menu[] = await response.json();
          console.log('📊 Menus received:', menus.length);
          console.log('📋 Menus data:', menus);

          // Separar menús favoritos y el menú más reciente como actual
          const favoriteMenusList = menus.filter(menu => menu.isFavorite);
          const mostRecentMenu = menus.length > 0 ? menus[0] : null;

          console.log('⭐ Favorite menus:', favoriteMenusList.length);
          console.log('🎯 Current menu:', mostRecentMenu?.name);

          setFavoriteMenus(favoriteMenusList);
          if (mostRecentMenu) {
            setCurrentMenu(mostRecentMenu);
          }
        } else {
          console.error('❌ Error fetching user menus:', response.status, response.statusText);
          const errorText = await response.text();
          console.error('❌ Error details:', errorText);
        }
      } catch (error) {
        console.error('Error fetching user menus:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserMenus();
  }, [user]);

  const generateMenu = async (type: 'daily' | 'weekly') => {
    if (!user || !profile) return;

    // Verificar que el perfil tenga los datos necesarios
    const { weight, height, age, gender, activityLevel, goal } = profile;
    if (!weight || !height || !age || !gender || !activityLevel || !goal) {
      throw new Error('Perfil incompleto. Por favor, completa tu información nutricional.');
    }

    setLoading(true);
    try {
      // Calcular calorías objetivo basado en el perfil
      const targetCalories = calculateTargetCalories({
        age,
        weight,
        height,
        gender: gender as 'male' | 'female' | 'other',
        activityLevel: activityLevel as 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active',
        goal: goal as 'maintain' | 'lose' | 'gain' | 'lose_maintain_muscle' | 'gain_muscle_lose_fat' | 'recomp'
      });

      console.log('🎯 Calorías objetivo:', targetCalories);

      if (type === 'daily') {
        // Usar el servicio inteligente para generar menú
        const { IntelligentMenuService } = await import('../services/intelligentMenuService');

        // Obtener preferencias del perfil
        const preferences = {
          isVegetarian: profile.dietaryRestrictions?.includes('vegetarian') || false,
          isVegan: profile.dietaryRestrictions?.includes('vegan') || false,
          isGlutenFree: profile.dietaryRestrictions?.includes('gluten-free') || false,
          isLactoseFree: profile.dietaryRestrictions?.includes('lactose-free') || false,
          isNutFree: profile.allergies?.includes('nuts') || false,
          excludedFoods: profile.foodPreferences?.filter(pref => pref.startsWith('no-')) || []
        };

        console.log('🧠 Generando menú inteligente con preferencias:', preferences);

        const intelligentMeals = await IntelligentMenuService.generateIntelligentMenu(
          user.id,
          targetCalories,
          preferences
        );

        console.log('🍽️ Comidas generadas:', intelligentMeals);

        // Convertir a formato MenuItem
        const menuItems: MenuItem[] = intelligentMeals.map((meal, index) => ({
          id: `${meal.mealType}-${Date.now()}-${index}`,
          menuId: Date.now().toString(),
          name: meal.name,
          mealType: meal.mealType,
          servings: 1,
          ingredients: meal.ingredients.map((ingredient, ingIndex) => ({
            id: `ing-${Date.now()}-${index}-${ingIndex}`,
            menuItemId: `${meal.mealType}-${Date.now()}-${index}`,
            foodId: ingredient.food.id,
            food: ingredient.food,
            quantity: ingredient.quantity,
            unit: ingredient.unit,
            createdAt: new Date(),
            updatedAt: new Date()
          })),
          createdAt: new Date(),
          updatedAt: new Date()
        }));

        const newMenu: Menu = {
          id: Date.now().toString(),
          userId: user.id,
          name: `Menú Inteligente - ${new Date().toLocaleDateString()}`,
          description: `Menú generado automáticamente basado en tu perfil (${targetCalories} kcal/día)`,
          type: 'daily',
          isFavorite: false,
          items: menuItems,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        setCurrentMenu(newMenu);
      } else {
        // Generar menú semanal simple basado en ingredientes
        const menuItems: MenuItem[] = [];
        const menuId = Date.now().toString();

        // Crear comidas para cada día de la semana
        const mealTypes = ['breakfast', 'lunch', 'snack', 'dinner'];
        const mealNames = {
          breakfast: ['Desayuno Energético', 'Desayuno Proteico', 'Desayuno Ligero', 'Desayuno Completo', 'Desayuno Saludable', 'Desayuno Nutritivo', 'Desayuno Balanceado'],
          lunch: ['Almuerzo Completo', 'Almuerzo Proteico', 'Almuerzo Ligero', 'Almuerzo Saludable', 'Almuerzo Nutritivo', 'Almuerzo Balanceado', 'Almuerzo Energético'],
          snack: ['Merienda Saludable', 'Snack Proteico', 'Merienda Ligera', 'Snack Nutritivo', 'Merienda Energética', 'Snack Balanceado', 'Merienda Natural'],
          dinner: ['Cena Ligera', 'Cena Proteica', 'Cena Saludable', 'Cena Nutritiva', 'Cena Balanceada', 'Cena Completa', 'Cena Natural']
        };

        for (let day = 1; day <= 7; day++) {
          mealTypes.forEach((mealType, mealIndex) => {
            const mealNameArray = mealNames[mealType as keyof typeof mealNames];
            const mealName = mealNameArray[day - 1] || `${mealType} - Día ${day}`;

            menuItems.push({
              id: `${mealType}-day${day}-${Date.now()}-${mealIndex}`,
              menuId,
              name: mealName,
              mealType,
              dayOfWeek: day,
              servings: 1,
              ingredients: [], // Se llenarán con ingredientes reales desde la API
              createdAt: new Date(),
              updatedAt: new Date()
            });
          });
        }

        const newMenu: Menu = {
          id: menuId,
          userId: user.id,
          name: `Menú Semanal - ${new Date().toLocaleDateString()}`,
          description: `Menú semanal personalizado basado en tu perfil (${targetCalories} kcal/día promedio)`,
          type: 'weekly',
          isFavorite: false,
          items: menuItems,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        setCurrentMenu(newMenu);
      }
    } catch (error) {
      console.error('Error generating menu:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const saveMenu = async (menu: Menu) => {
    if (!user) return;

    setLoading(true);
    try {
      // Aquí iría la lógica real para guardar el menú en la API
      // Por ahora actualizamos el estado local
      setCurrentMenu(menu);

      // Si es favorito, actualizamos la lista de favoritos
      if (menu.isFavorite) {
        const exists = favoriteMenus.some(m => m.id === menu.id);
        if (!exists) {
          setFavoriteMenus([...favoriteMenus, menu]);
        } else {
          setFavoriteMenus(favoriteMenus.map(m => m.id === menu.id ? menu : m));
        }
      }
    } catch (error) {
      console.error('Error saving menu:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (menuId: string) => {
    if (!user) return;

    setLoading(true);
    try {
      // Actualizar menú actual si corresponde
      if (currentMenu && currentMenu.id === menuId) {
        const updatedMenu = { ...currentMenu, isFavorite: !currentMenu.isFavorite };
        setCurrentMenu(updatedMenu);

        // Actualizar lista de favoritos
        if (updatedMenu.isFavorite) {
          setFavoriteMenus([...favoriteMenus, updatedMenu]);
        } else {
          setFavoriteMenus(favoriteMenus.filter(m => m.id !== menuId));
        }
      } else {
        // Buscar en favoritos
        const menuIndex = favoriteMenus.findIndex(m => m.id === menuId);
        if (menuIndex >= 0) {
          const updatedMenus = [...favoriteMenus];
          updatedMenus[menuIndex] = {
            ...updatedMenus[menuIndex],
            isFavorite: !updatedMenus[menuIndex].isFavorite
          };

          // Si ya no es favorito, eliminarlo de la lista
          if (!updatedMenus[menuIndex].isFavorite) {
            updatedMenus.splice(menuIndex, 1);
          }

          setFavoriteMenus(updatedMenus);
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const generateShoppingList = async (menuId: string) => {
    if (!user) return;

    setLoading(true);
    try {
      // Encontrar el menú correspondiente
      const menu = currentMenu && currentMenu.id === menuId
        ? currentMenu
        : favoriteMenus.find(m => m.id === menuId);

      if (!menu) throw new Error('Menú no encontrado');

      // Aquí iría la lógica real para generar la lista de compras basada en el menú
      // Por ahora simulamos una lista de compras
      const mockShoppingListItems: ShoppingListItem[] = [
        {
          id: '1',
          name: 'Pechuga de pollo',
          quantity: 500,
          unit: 'g',
          purchased: false,
        },
        {
          id: '2',
          name: 'Lechuga',
          quantity: 1,
          unit: 'unidad',
          purchased: false,
        },
        {
          id: '3',
          name: 'Pasta integral',
          quantity: 200,
          unit: 'g',
          purchased: false,
        },
        {
          id: '4',
          name: 'Proteína en polvo',
          quantity: 30,
          unit: 'g',
          purchased: false,
        },
      ];

      const newShoppingList: ShoppingList = {
        id: Date.now().toString(),
        userId: user.id,
        menuId: menu.id,
        items: mockShoppingListItems,
      };

      setShoppingList(newShoppingList);
    } catch (error) {
      console.error('Error generating shopping list:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateShoppingListItem = async (itemId: string, purchased: boolean) => {
    if (!shoppingList) return;

    setLoading(true);
    try {
      // Actualizar el estado del item en la lista de compras
      const updatedItems = shoppingList.items.map(item =>
        item.id === itemId ? { ...item, purchased } : item
      );

      setShoppingList({
        ...shoppingList,
        items: updatedItems,
      });
    } catch (error) {
      console.error('Error updating shopping list item:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const substituteMenuItem = async (menuItemId: string) => {
    if (!currentMenu) return;

    setLoading(true);
    try {
      // Encontrar el ítem a sustituir
      const itemIndex = currentMenu.items.findIndex(item => item.id === menuItemId);
      if (itemIndex < 0) throw new Error('Ítem de menú no encontrado');

      const itemToReplace = currentMenu.items[itemIndex];

      // Aquí iría la lógica real para encontrar una sustitución adecuada
      // Por ahora simulamos una sustitución

      // Simulación de recetas alternativas
      const alternativeRecipe: Recipe = {
        id: '4',
        name: 'Ensalada de atún',
        description: 'Ensalada fresca con atún',
        servings: 1,
        calories: 320,
        protein: 28,
        carbs: 12,
        fat: 18,
      };

      // Crear el nuevo ítem de menú
      const newMenuItem: MenuItem = {
        ...itemToReplace,
        recipe: alternativeRecipe,
      };

      // Actualizar el menú
      const updatedItems = [...currentMenu.items];
      updatedItems[itemIndex] = newMenuItem;

      setCurrentMenu({
        ...currentMenu,
        items: updatedItems,
      });
    } catch (error) {
      console.error('Error substituting menu item:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <MenuContext.Provider
      value={{
        currentMenu,
        favoriteMenus,
        shoppingList,
        loading,
        generateMenu,
        saveMenu,
        toggleFavorite,
        generateShoppingList,
        updateShoppingListItem,
        substituteMenuItem
      }}
    >
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu() {
  const context = useContext(MenuContext);
  if (context === undefined) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
}