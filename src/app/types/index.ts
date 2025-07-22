// Tipos centralizados para evitar duplicaciones

// Tipos de Usuario
export type UserRole = 'USER' | 'ADMIN';

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  invitationCode: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type UserPublic = Omit<User, 'password'>;

// Tipos de Nutrición
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
export type Goal = 'maintain' | 'lose' | 'gain' | 'lose_maintain_muscle' | 'gain_muscle_lose_fat' | 'recomp';
export type Gender = 'male' | 'female' | 'other';

export type NutritionProfile = {
  age: number;
  weight: number; // kg
  height: number; // cm
  gender: Gender;
  activityLevel: ActivityLevel;
  goal: Goal;
};

// Tipo de Perfil - Actualizado para coincidir con el schema de Prisma
export type Profile = {
  id: string;
  userId: string;
  age?: number;
  weight?: number; // Float en Prisma
  height?: number; // Float en Prisma
  gender?: string;
  activityLevel?: string;
  goal?: string; // 'maintain' | 'lose' | 'gain'
  dailyCalories?: number; // Int en Prisma
  dailyProtein?: number; // Int en Prisma
  dailyCarbs?: number; // Int en Prisma
  dailyFat?: number; // Int en Prisma
  dietaryRestrictions: string[];
  foodPreferences: string[];
  allergies: string[];
  createdAt: Date;
  updatedAt: Date;
};

// Tipo para crear/actualizar perfil (campos opcionales)
export type CreateProfileData = Omit<Profile, 'id' | 'userId' | 'createdAt' | 'updatedAt'> & {
  dietaryRestrictions?: string[];
  foodPreferences?: string[];
  allergies?: string[];
};

// Tipo para la respuesta de la API
export type ProfileResponse = {
  success: boolean;
  profile?: Profile;
  message?: string;
};

// Tipos de Alimentos y Recetas
export type Food = {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  category: string;
  unit: string;
};

export type Recipe = {
  id: string;
  name: string;
  description?: string;
  instructions?: string;
  prepTime?: number;
  cookTime?: number;
  servings: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

// Tipos de Ingredientes de Comida
export type MealIngredient = {
  id: string;
  menuItemId: string;
  foodId: string;
  food: Food;
  quantity: number;
  unit: string;
  createdAt: Date;
  updatedAt: Date;
};

// Tipos de Menú - Actualizado para ingredientes directos
export type MenuItem = {
  id: string;
  menuId: string;
  name: string; // Nombre descriptivo de la comida
  mealType: string;
  dayOfWeek?: number;
  servings: number;
  ingredients: MealIngredient[]; // Ingredientes directos
  // Mantener compatibilidad temporal con recetas
  recipeId?: string;
  recipe?: Recipe;
  createdAt: Date;
  updatedAt: Date;
};

export type Menu = {
  id: string;
  userId: string;
  name: string;
  description?: string;
  type: 'daily' | 'weekly';
  isFavorite: boolean;
  items: MenuItem[];
  createdAt: Date;
  updatedAt: Date;
};

// Tipos de Lista de Compras
export type ShoppingListItem = {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  purchased: boolean;
};

export type ShoppingList = {
  id: string;
  userId: string;
  menuId: string;
  items: ShoppingListItem[];
};

// // Tipos de Nutrición
// export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
// export type Goal = 'maintain' | 'lose' | 'gain';
// export type Gender = 'male' | 'female' | 'other';

// export type NutritionProfile = {
//   age: number;
//   weight: number; // kg
//   height: number; // cm
//   gender: Gender;
//   activityLevel: ActivityLevel;
//   goal: Goal;
// };

export type MacroTargets = {
  calories: number;
  protein: number; // gramos
  carbs: number; // gramos
  fat: number; // gramos
};