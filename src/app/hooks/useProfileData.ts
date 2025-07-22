import { useState, useEffect } from 'react';
import { Profile } from '../types';
import { getUserProfile, saveUserProfile, hasCompleteProfile, getProfileCompleteness } from '../services/profileService';

export function useProfileData(userId: string | null) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar perfil inicial
  useEffect(() => {
    if (!userId) {
      setProfile(null);
      setLoading(false);
      return;
    }

    const loadProfile = async () => {
      setLoading(true);
      setError(null);

      try {
        const userProfile = await getUserProfile(userId);
        setProfile(userProfile);
      } catch (err) {
        console.error('Error loading profile:', err);
        setError(err instanceof Error ? err.message : 'Error al cargar el perfil');
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [userId]);

  // Actualizar perfil
  const updateProfile = async (profileData: Partial<Profile>) => {
    if (!userId) {
      throw new Error('Usuario no autenticado');
    }

    setLoading(true);
    setError(null);

    try {
      const result = await saveUserProfile(userId, profileData);

      if (result.success && result.profile) {
        setProfile(result.profile);
        return result.profile;
      } else {
        throw new Error(result.message || 'Error al actualizar el perfil');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar el perfil';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Recargar perfil
  const refreshProfile = async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      const userProfile = await getUserProfile(userId);
      setProfile(userProfile);
    } catch (err) {
      console.error('Error refreshing profile:', err);
      setError(err instanceof Error ? err.message : 'Error al recargar el perfil');
    } finally {
      setLoading(false);
    }
  };

  // Calcular completitud
  const completeness = profile ? getProfileCompleteness(profile) : 0;
  const isComplete = hasCompleteProfile(profile);

  // Verificar si tiene datos nutricionales
  const hasNutritionData = profile && !!(
    profile.dailyCalories &&
    profile.dailyProtein &&
    profile.dailyCarbs &&
    profile.dailyFat
  );

  return {
    profile,
    loading,
    error,
    updateProfile,
    refreshProfile,
    completeness,
    isComplete,
    hasNutritionData,
    // Funciones de utilidad
    clearError: () => setError(null)
  };
}