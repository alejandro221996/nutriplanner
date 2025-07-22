'use client';

import { useProfile } from '@/app/contexts/ProfileContext';
import { FormEvent, useCallback, useEffect, useState } from 'react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import ConfirmationModal from '../ui/ConfirmationModal';
import Input from '../ui/Input';

export default function ProfileForm() {
  const { profile, updateProfile, calculateNutrition, loading, refreshProfile, error } = useProfile();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Estados para el modal de confirmación
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const [formData, setFormData] = useState({
    age: '',
    weight: '',
    height: '',
    gender: 'male',
    activityLevel: 'moderate',
    goal: 'maintain',
    dietaryRestrictions: '',
    foodPreferences: '',
    allergies: '',
  });

  // Función helper para convertir array a string
  const arrayToString = useCallback((value: string[] | string | undefined): string => {
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    if (typeof value === 'string') {
      return value;
    }
    return '';
  }, []);

  // Sincronizar formData con profile cuando cambie - MEJORADO
  useEffect(() => {
    // Solo actualizar si tenemos un profile válido y no estamos cargando
    if (profile && !loading) {
      setFormData({
        age: profile.age?.toString() || '',
        weight: profile.weight?.toString() || '',
        height: profile.height?.toString() || '',
        gender: profile.gender || 'male',
        activityLevel: profile.activityLevel || 'moderate',
        goal: profile.goal || 'maintain',
        dietaryRestrictions: arrayToString(profile.dietaryRestrictions),
        foodPreferences: arrayToString(profile.foodPreferences),
        allergies: arrayToString(profile.allergies),
      });

      setIsInitialized(true);
    }
    // Si no hay profile pero tampoco estamos cargando, inicializar con valores por defecto
    else if (!profile && !loading && !isInitialized) {
      setIsInitialized(true);
    }
  }, [profile, loading, arrayToString, isInitialized]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const profileData = {
        age: Number(formData.age),
        weight: Number(formData.weight),
        height: Number(formData.height),
        gender: formData.gender,
        activityLevel: formData.activityLevel,
        goal: formData.goal,
        dietaryRestrictions: formData.dietaryRestrictions
          ? formData.dietaryRestrictions.split(',').map(item => item.trim()).filter(Boolean)
          : profile?.dietaryRestrictions ?? [],
        foodPreferences: formData.foodPreferences
          ? formData.foodPreferences.split(',').map(item => item.trim()).filter(Boolean)
          : profile?.foodPreferences ?? [],
        allergies: formData.allergies
          ? formData.allergies.split(',').map(item => item.trim()).filter(Boolean)
          : profile?.allergies ?? [],
      };

      await updateProfile(profileData);

      // Calcular nutrición solo si tenemos los datos básicos
      if (profileData.age && profileData.weight && profileData.height &&
        profileData.gender && profileData.activityLevel && profileData.goal) {
        await calculateNutrition();
      }

      // Mostrar modal de éxito
      setModalMessage('Tu perfil ha sido actualizado correctamente.');
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error updating profile:', error);
      // Mostrar modal de error
      setModalMessage('Error al actualizar el perfil: ' + (error instanceof Error ? error.message : 'Error desconocido'));
      setShowErrorModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRefresh = async () => {
    try {
      await refreshProfile();
    } catch (error) {
      console.error('Error refreshing profile:', error);
      setModalMessage('Error al recargar el perfil');
      setShowErrorModal(true);
    }
  };

  // Mostrar error si hay uno
  if (error && !loading) {
    return (
      <Card className="max-w-2xl mx-auto">
        <Card.Content>
          <div className="flex flex-col items-center py-8 space-y-4">
            <div className="text-red-500">Error: {error}</div>
            <Button onClick={handleRefresh} variant="outline">
              Reintentar
            </Button>
          </div>
        </Card.Content>
      </Card>
    );
  }

  // Mostrar loading mientras se carga el perfil Y mientras no está inicializado
  if (loading || !isInitialized) {
    return (
      <Card className="max-w-2xl mx-auto">
        <Card.Content>
          <div className="flex justify-center items-center py-8">
            <div className="text-gray-500">Cargando perfil...</div>
          </div>
        </Card.Content>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      {/* Modales de confirmación */}
      <ConfirmationModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="¡Perfil Actualizado!"
        message={modalMessage}
        type="success"
      />

      <ConfirmationModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title="Error"
        message={modalMessage}
        type="error"
      />

      <Card.Header>
        <h2 className="text-xl font-semibold text-gray-800">Tu Perfil Nutricional</h2>
      </Card.Header>
      <Card.Content>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Edad"
              name="age"
              type="number"
              value={formData.age}
              onChange={handleChange}
              placeholder="Años"
              fullWidth
            />
            <Input
              label="Peso"
              name="weight"
              type="number"
              step="0.1"
              value={formData.weight}
              onChange={handleChange}
              placeholder="kg"
              fullWidth
            />
            <Input
              label="Altura"
              name="height"
              type="number"
              value={formData.height}
              onChange={handleChange}
              placeholder="cm"
              fullWidth
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Género
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="male">Masculino</option>
                <option value="female">Femenino</option>
                <option value="other">Otro</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nivel de Actividad
              </label>
              <select
                name="activityLevel"
                value={formData.activityLevel}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="sedentary">Sedentario</option>
                <option value="light">Actividad Ligera</option>
                <option value="moderate">Actividad Moderada</option>
                <option value="active">Activo</option>
                <option value="very_active">Muy Activo</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Objetivo
              </label>
              <select
                name="goal"
                value={formData.goal}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="maintain">Mantener Peso</option>
                <option value="lose">Perder Peso</option>
                <option value="gain">Ganar Peso</option>
                <option value="lose_maintain_muscle">Perder Peso - Mantener Músculo</option>
                <option value="gain_muscle_lose_fat">Ganar Músculo - Perder Grasa</option>
                <option value="recomp">Recomposición Corporal</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <Input
              label="Restricciones Dietéticas (separadas por comas)"
              name="dietaryRestrictions"
              value={formData.dietaryRestrictions}
              onChange={handleChange}
              placeholder="Vegetariano, Sin gluten, etc."
              fullWidth
            />

            <Input
              label="Preferencias Alimentarias (separadas por comas)"
              name="foodPreferences"
              value={formData.foodPreferences}
              onChange={handleChange}
              placeholder="Pollo, Pescado, Verduras, etc."
              fullWidth
            />

            <Input
              label="Alergias (separadas por comas)"
              name="allergies"
              value={formData.allergies}
              onChange={handleChange}
              placeholder="Frutos secos, Mariscos, etc."
              fullWidth
            />
          </div>

          <Button
            type="submit"
            fullWidth
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Guardando...' : 'Guardar Perfil'}
          </Button>

        </form>
      </Card.Content>

      {profile?.dailyCalories && (
        <Card.Footer>
          <h3 className="text-lg font-medium text-gray-800 mb-3">Tus Necesidades Nutricionales</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-green-50 p-3 rounded-md text-center">
              <p className="text-sm text-gray-500">Calorías</p>
              <p className="text-xl font-bold text-green-600">{profile.dailyCalories}</p>
              <p className="text-xs text-gray-500">kcal/día</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-md text-center">
              <p className="text-sm text-gray-500">Proteínas</p>
              <p className="text-xl font-bold text-blue-600">{profile.dailyProtein}</p>
              <p className="text-xs text-gray-500">g/día</p>
            </div>
            <div className="bg-yellow-50 p-3 rounded-md text-center">
              <p className="text-sm text-gray-500">Carbohidratos</p>
              <p className="text-xl font-bold text-yellow-600">{profile.dailyCarbs}</p>
              <p className="text-xs text-gray-500">g/día</p>
            </div>
            <div className="bg-red-50 p-3 rounded-md text-center">
              <p className="text-sm text-gray-500">Grasas</p>
              <p className="text-xl font-bold text-red-600">{profile.dailyFat}</p>
              <p className="text-xs text-gray-500">g/día</p>
            </div>
          </div>
        </Card.Footer>
      )}
    </Card>
  );
}