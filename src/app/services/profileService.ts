import { Profile } from '../types';

// Obtener perfil de usuario
export const getUserProfile = async (userId: string): Promise<Profile> => {
  try {
    const response = await fetch(`/api/profile/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching profile: ${response.status}`);
    }

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Error al obtener el perfil');
    }

    return result.profile;
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    throw error;
  }
};

// Guardar/actualizar perfil de usuario
export const saveUserProfile = async (
  userId: string,
  profileData: Partial<Profile>
): Promise<{ success: boolean; profile?: Profile; message: string }> => {
  try {
    const response = await fetch(`/api/profile/${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error in saveUserProfile:', error);
    return {
      success: false,
      message: 'Error de conexión'
    };
  }
};

// Eliminar perfil de usuario
export const deleteUserProfile = async (userId: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch(`/api/profile/${userId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error in deleteUserProfile:', error);
    return {
      success: false,
      message: 'Error de conexión'
    };
  }
};

// Verificar si el usuario tiene un perfil completo
export const hasCompleteProfile = (profile: Profile | null): boolean => {
  if (!profile) return false;

  return !!(
    profile.age &&
    profile.weight &&
    profile.height &&
    profile.gender &&
    profile.activityLevel &&
    profile.goal
  );
};

// Calcular porcentaje de completitud del perfil
export const getProfileCompleteness = (profile: Profile | null): number => {
  if (!profile) return 0;

  const requiredFields = ['age', 'weight', 'height', 'gender', 'activityLevel', 'goal'];
  const optionalFields = ['dailyCalories', 'dailyProtein', 'dailyCarbs', 'dailyFat'];

  let completed = 0;
  let total = requiredFields.length + optionalFields.length;

  // Campos requeridos (peso doble)
  requiredFields.forEach(field => {
    if (profile[field as keyof Profile]) {
      completed += 2;
    }
    total += 1; // Peso extra para campos requeridos
  });

  // Campos opcionales
  optionalFields.forEach(field => {
    if (profile[field as keyof Profile]) {
      completed += 1;
    }
  });

  return Math.round((completed / total) * 100);
};