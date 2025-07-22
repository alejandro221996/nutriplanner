'use client';

import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import {
  calculateMacroTargets
} from '../services/nutritionServiceClient';

import { getProfileCompleteness, getUserProfile, hasCompleteProfile, saveUserProfile } from '../services/profileService';
import { NutritionProfile, Profile } from '../types';
import { useAuth } from './AuthContext';

type ProfileContextType = {
  profile: Profile | null;
  loading: boolean;
  error: string | null;
  updateProfile: (profileData: Partial<Profile>) => Promise<{ success: boolean; profile?: Profile; message: string }>;
  calculateNutrition: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  // Utilidades adicionales
  completeness: number;
  isComplete: boolean;
  hasNutritionData: boolean;
  clearError: () => void;
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setProfile(null);
        setLoading(false);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const userProfile = await getUserProfile(user.id);
        setProfile(userProfile);
        setError(null);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error al cargar el perfil';
        setError(errorMessage);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const updateProfile = async (profileData: Partial<Profile>): Promise<{ success: boolean; profile?: Profile; message: string }> => {
    if (!user) {
      const error = { success: false, message: 'Usuario no autenticado' };
      setError(error.message);
      return error;
    }
    // No cambiar el estado de loading aquí para evitar conflictos
    setError(null);

    try {
      const result = await saveUserProfile(user.id, profileData);

      if (result.success && result.profile) {
        setProfile(result.profile);
        setError(null);
        return result;
      } else {
        const errorMsg = result.message || 'Error al actualizar el perfil';
        setError(errorMsg);
        return { success: false, message: errorMsg };
      }
    } catch (error) {
      console.error('ProfileContext: Error updating profile:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error al actualizar el perfil';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  const refreshProfile = async (): Promise<void> => {
    if (!user) {
      setError('Usuario no autenticado');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const userProfile = await getUserProfile(user.id);
      setProfile(userProfile);
      setError(null);
    } catch (error) {
      console.error('ProfileContext: Error refreshing profile:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error al recargar el perfil';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const calculateNutrition = async (): Promise<void> => {
    if (!user) {
      setError('Usuario no autenticado');
      throw new Error('Usuario no autenticado');
    }

    // Refresca el perfil antes de calcular macros
    await refreshProfile();

    // Obtén el perfil actualizado
    const updatedProfile = await getUserProfile(user.id);

    if (!updatedProfile) {
      const errorMsg = 'No hay perfil disponible para calcular la nutrición';
      setError(errorMsg);
      throw new Error(errorMsg);
    }

    const { weight, height, age, gender, activityLevel, goal } = updatedProfile;

    if (!weight || !height || !age || !gender || !activityLevel || !goal) {
      const errorMsg = 'Faltan datos del perfil para calcular la nutrición';
      setError(errorMsg);
      throw new Error(errorMsg);
    }

    try {
      setError(null);

      const nutritionProfile: NutritionProfile = {
        age,
        weight,
        height,
        gender: gender as 'male' | 'female' | 'other',
        activityLevel: activityLevel as 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active',
        goal: goal as 'maintain' | 'lose' | 'gain'
      };

      const macroTargets = calculateMacroTargets(nutritionProfile);

      // Usa los arrays actualizados
      const nutritionData = {
        dailyCalories: Math.round(macroTargets.calories),
        dailyProtein: Math.round(macroTargets.protein),
        dailyCarbs: Math.round(macroTargets.carbs),
        dailyFat: Math.round(macroTargets.fat),
        dietaryRestrictions: updatedProfile.dietaryRestrictions,
        foodPreferences: updatedProfile.foodPreferences,
        allergies: updatedProfile.allergies,
      };
      const result = await updateProfile(nutritionData);
      if (!result.success) {
        throw new Error(result.message);
      }

    } catch (error) {
      console.error('ProfileContext: Error calculating nutrition:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error al calcular la nutrición';
      setError(errorMessage);
      throw error;
    }
  };

  const clearError = (): void => {
    setError(null);
  };

  // Calcular valores derivados
  const completeness: number = profile ? getProfileCompleteness(profile) : 0;
  const isComplete: boolean = hasCompleteProfile(profile);
  const hasNutritionData: boolean = !!(profile &&
    profile.dailyCalories &&
    profile.dailyProtein &&
    profile.dailyCarbs &&
    profile.dailyFat
  );

  const contextValue: ProfileContextType = {
    profile,
    loading,
    error,
    updateProfile,
    calculateNutrition,
    refreshProfile,
    completeness,
    isComplete,
    hasNutritionData,
    clearError
  };

  return (
    <ProfileContext.Provider value={contextValue}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}