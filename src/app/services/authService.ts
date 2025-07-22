import { User, UserPublic, UserRole } from '../types';

// Almacenamiento local solo para la sesión actual
const CURRENT_USER_KEY = 'nutriplaner_current_user';

// Obtener usuario actual del almacenamiento local
export const getCurrentUser = (): UserPublic | null => {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(CURRENT_USER_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Error reading current user from storage:', error);
    return null;
  }
};

// Guardar usuario actual en el almacenamiento local
const saveCurrentUser = (user: UserPublic | null): void => {
  if (typeof window === 'undefined') return;

  try {
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  } catch (error) {
    console.error('Error saving current user to storage:', error);
  }
};

// Esta función ya no es necesaria ya que las API routes devuelven usuarios públicos

// Registrar nuevo usuario
export const registerUser = async (
  name: string,
  email: string,
  password: string,
  invitationCode: string,
  role: UserRole = 'USER'
): Promise<{ success: boolean; user?: UserPublic; message: string }> => {
  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        password,
        invitationCode,
        role
      }),
    });

    const result = await response.json();

    if (result.success && result.user) {
      saveCurrentUser(result.user);
    }

    return result;
  } catch (error) {
    console.error('Error registering user:', error);
    return {
      success: false,
      message: 'Error de conexión'
    };
  }
};

// Iniciar sesión
export const loginUser = async (
  email: string,
  password: string
): Promise<{ success: boolean; user?: UserPublic; message: string }> => {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password
      }),
    });

    const result = await response.json();

    if (result.success && result.user) {
      saveCurrentUser(result.user);
    }

    return result;
  } catch (error) {
    console.error('Error logging in user:', error);
    return {
      success: false,
      message: 'Error de conexión'
    };
  }
};

// Cerrar sesión
export const logoutUser = (): void => {
  saveCurrentUser(null);
};

// Actualizar perfil de usuario
export const updateUserProfile = async (
  userId: string,
  updates: Partial<Pick<User, 'name' | 'email'>>
): Promise<{ success: boolean; user?: UserPublic; message: string }> => {
  try {
    const response = await fetch(`/api/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    const result = await response.json();

    // Actualizar usuario actual si es el mismo
    if (result.success && result.user) {
      const currentUser = getCurrentUser();
      if (currentUser && currentUser.id === userId) {
        saveCurrentUser(result.user);
      }
    }

    return result;
  } catch (error) {
    console.error('Error updating user profile:', error);
    return {
      success: false,
      message: 'Error de conexión'
    };
  }
};

// Cambiar contraseña
export const changePassword = async (
  userId: string,
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch(`/api/users/${userId}/password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        currentPassword,
        newPassword
      }),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error changing password:', error);
    return {
      success: false,
      message: 'Error de conexión'
    };
  }
};

// Obtener todos los usuarios (para administración)
export const getAllUsers = async (): Promise<UserPublic[]> => {
  try {
    const response = await fetch('/api/users');
    if (!response.ok) {
      throw new Error('Error fetching users');
    }
    const users = await response.json();
    return users;
  } catch (error) {
    console.error('Error getting all users:', error);
    return [];
  }
};

// Eliminar usuario
export const deleteUser = async (userId: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch(`/api/users/${userId}`, {
      method: 'DELETE',
    });

    const result = await response.json();

    // Si el usuario eliminado es el usuario actual, cerrar sesión
    if (result.success) {
      const currentUser = getCurrentUser();
      if (currentUser && currentUser.id === userId) {
        logoutUser();
      }
    }

    return result;
  } catch (error) {
    console.error('Error deleting user:', error);
    return {
      success: false,
      message: 'Error de conexión'
    };
  }
};
//
//Funciones específicas para manejo de roles

// Verificar si un usuario es administrador
export const isAdmin = (user: UserPublic | null): boolean => {
  return user?.role === 'ADMIN';
};

// Verificar si un usuario puede acceder a un perfil específico
export const canAccessProfile = (currentUser: UserPublic | null, targetUserId: string): boolean => {
  if (!currentUser) return false;

  // Los administradores pueden acceder a cualquier perfil
  if (currentUser.role === 'ADMIN') return true;

  // Los usuarios regulares solo pueden acceder a su propio perfil
  return currentUser.id === targetUserId;
};

// Crear usuario administrador
export const createAdminUser = async (
  name: string,
  email: string,
  password: string
): Promise<{ success: boolean; user?: UserPublic; message: string }> => {
  try {
    const response = await fetch('/api/admin/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        password
      }),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error creating admin user:', error);
    return {
      success: false,
      message: 'Error de conexión'
    };
  }
};

// Cambiar rol de usuario (solo para administradores)
export const changeUserRole = async (
  adminUserId: string,
  targetUserId: string,
  newRole: UserRole
): Promise<{ success: boolean; user?: UserPublic; message: string }> => {
  try {
    const response = await fetch(`/api/users/${targetUserId}/role`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        adminUserId,
        newRole
      }),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error changing user role:', error);
    return {
      success: false,
      message: 'Error de conexión'
    };
  }
};

// Obtener estadísticas de usuarios (solo para administradores)
export const getUserStats = async (): Promise<{
  totalUsers: number;
  adminUsers: number;
  regularUsers: number;
  recentUsers: number; // usuarios creados en los últimos 7 días
}> => {
  try {
    const response = await fetch('/api/admin/stats');
    if (!response.ok) {
      throw new Error('Error fetching user stats');
    }
    const stats = await response.json();
    return stats;
  } catch (error) {
    console.error('Error getting user stats:', error);
    return {
      totalUsers: 0,
      adminUsers: 0,
      regularUsers: 0,
      recentUsers: 0
    };
  }
};

// Inicializar usuario administrador por defecto
export const initializeDefaultAdmin = async (): Promise<void> => {
  try {
    const response = await fetch('/api/admin/initialize', {
      method: 'POST',
    });

    const result = await response.json();

    if (result.success) {
      console.log('Usuario administrador por defecto creado exitosamente');
      console.log('Email: admin@nutriplaner.com');
      console.log('Contraseña: admin123456');
    } else {
      console.log(result.message); // Ya existe un administrador o error
    }
  } catch (error) {
    console.error('Error inicializando administrador por defecto:', error);
  }
};