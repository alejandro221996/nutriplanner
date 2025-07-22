'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { validateInvitationCode, useInvitationCode } from '../services/invitationService';
import { 
  getCurrentUser, 
  loginUser, 
  registerUser, 
  logoutUser,
  isAdmin,
  canAccessProfile,
  initializeDefaultAdmin
} from '../services/authService';
import { UserPublic } from '../types';

type AuthContextType = {
  user: UserPublic | null;
  loading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, invitationCode: string) => Promise<void>;
  validateInvitation: (code: string) => Promise<{ valid: boolean; message: string }>;
  canAccessProfile: (targetUserId: string) => boolean;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserPublic | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay una sesión activa e inicializar administrador por defecto
    const checkSession = async () => {
      try {
        // Inicializar administrador por defecto si no existe
        await initializeDefaultAdmin();
        
        const currentUser = getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const result = await loginUser(email, password);
      if (!result.success) {
        throw new Error(result.message);
      }
      
      if (result.user) {
        setUser(result.user);
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, invitationCode: string) => {
    setLoading(true);
    try {
      // Validar código de invitación antes de registrar
      const validation = await validateInvitationCode(invitationCode);
      if (!validation.valid) {
        throw new Error(validation.message);
      }

      // Registrar usuario usando el servicio de autenticación
      const result = await registerUser(name, email, password, invitationCode);
      if (!result.success) {
        throw new Error(result.message);
      }
      
      // Marcar el código de invitación como usado
      if (result.user) {
        await useInvitationCode(invitationCode, result.user.id);
        setUser(result.user);
      }
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const validateInvitation = async (code: string) => {
    return await validateInvitationCode(code);
  };

  const logout = async () => {
    setLoading(true);
    try {
      logoutUser();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Funciones de roles
  const userIsAdmin = isAdmin(user);
  const userCanAccessProfile = (targetUserId: string) => canAccessProfile(user, targetUserId);

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      isAdmin: userIsAdmin,
      login, 
      register, 
      validateInvitation, 
      canAccessProfile: userCanAccessProfile,
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}