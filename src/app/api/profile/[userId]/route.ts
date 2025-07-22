import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'ID de usuario requerido' },
        { status: 400 }
      );
    }

    // Verificar que el usuario existe
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Buscar el perfil del usuario
    let profile = await prisma.profile.findUnique({
      where: { userId }
    });

    // Si no existe perfil, crear uno básico
    if (!profile) {
      profile = await prisma.profile.create({
        data: {
          userId,
          dietaryRestrictions: [],
          foodPreferences: [],
          allergies: []
        }
      });
    }
    // Asegurar que las arrays siempre sean arrays
    const normalizedProfile = {
      ...profile,
      dietaryRestrictions: Array.isArray(profile.dietaryRestrictions)
        ? profile.dietaryRestrictions
        : [],
      foodPreferences: Array.isArray(profile.foodPreferences)
        ? profile.foodPreferences
        : [],
      allergies: Array.isArray(profile.allergies)
        ? profile.allergies
        : []
    };

    return NextResponse.json({
      success: true,
      profile: normalizedProfile
    });

  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const body = await request.json();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'ID de usuario requerido' },
        { status: 400 }
      );
    }

    // Verificar que el usuario existe
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Función helper para normalizar arrays
    const normalizeArray = (value: unknown): string[] => {
      if (Array.isArray(value)) {
        return value.filter(Boolean);
      }
      if (typeof value === 'string') {
        return value.split(',').map(item => item.trim()).filter(Boolean);
      }
      return [];
    };

    // Preparar los datos para actualizar/crear
    const {
      age,
      weight,
      height,
      gender,
      activityLevel,
      goal,
      dailyCalories,
      dailyProtein,
      dailyCarbs,
      dailyFat,
      dietaryRestrictions,
      foodPreferences,
      allergies,
      ...otherData
    } = body;

    const profileData = {
      age: age ? parseInt(age) : undefined,
      weight: weight ? parseFloat(weight) : undefined,
      height: height ? parseFloat(height) : undefined,
      gender,
      activityLevel,
      goal,
      dailyCalories: dailyCalories ? parseInt(dailyCalories) : undefined,
      dailyProtein: dailyProtein ? parseInt(dailyProtein) : undefined,
      dailyCarbs: dailyCarbs ? parseInt(dailyCarbs) : undefined,
      dailyFat: dailyFat ? parseInt(dailyFat) : undefined,
      dietaryRestrictions: normalizeArray(dietaryRestrictions),
      foodPreferences: normalizeArray(foodPreferences),
      allergies: normalizeArray(allergies),
      ...otherData
    };

    // Filtrar valores undefined
    const filteredData = Object.fromEntries(
      Object.entries(profileData).filter(([_, value]) => value !== undefined)
    );

    // Crear o actualizar el perfil
    const profile = await prisma.profile.upsert({
      where: { userId },
      update: filteredData,
      create: {
        userId,
        dietaryRestrictions: [],
        foodPreferences: [],
        allergies: [],
        ...filteredData
      }
    });

    // Normalizar la respuesta
    const normalizedProfile = {
      ...profile,
      dietaryRestrictions: Array.isArray(profile.dietaryRestrictions)
        ? profile.dietaryRestrictions
        : [],
      foodPreferences: Array.isArray(profile.foodPreferences)
        ? profile.foodPreferences
        : [],
      allergies: Array.isArray(profile.allergies)
        ? profile.allergies
        : []
    };

    return NextResponse.json({
      success: true,
      profile: normalizedProfile,
      message: 'Perfil actualizado correctamente'
    });

  } catch (error) {
    console.error('Error saving user profile:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Error interno del servidor', 
        error: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'ID de usuario requerido' },
        { status: 400 }
      );
    }

    // Verificar que el perfil existe
    const profile = await prisma.profile.findUnique({
      where: { userId }
    });

    if (!profile) {
      return NextResponse.json(
        { success: false, message: 'Perfil no encontrado' },
        { status: 404 }
      );
    }

    // Eliminar el perfil
    await prisma.profile.delete({
      where: { userId }
    });

    return NextResponse.json({
      success: true,
      message: 'Perfil eliminado correctamente'
    });

  } catch (error) {
    console.error('Error deleting user profile:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}