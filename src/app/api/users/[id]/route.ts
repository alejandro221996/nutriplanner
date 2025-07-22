import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

// Actualizar perfil de usuario
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: userId } = params;
    const updates = await request.json();

    // Buscar usuario por ID
    const existingUser = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!existingUser) {
      return NextResponse.json(
        { success: false, message: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Si se está actualizando el email, verificar que no exista ya
    if (updates.email) {
      const emailExists = await prisma.user.findFirst({
        where: {
          email: updates.email.toLowerCase(),
          id: { not: userId }
        }
      });

      if (emailExists) {
        return NextResponse.json(
          { success: false, message: 'Ya existe una cuenta con este email' },
          { status: 409 }
        );
      }
    }

    // Actualizar usuario
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...updates,
        email: updates.email?.toLowerCase(),
      }
    });

    // Retornar usuario sin contraseña
    const { password: _, ...publicUser } = updatedUser;

    return NextResponse.json({
      success: true,
      user: publicUser,
      message: 'Perfil actualizado exitosamente'
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// Eliminar usuario
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: userId } = params;

    // Verificar si el usuario existe
    const existingUser = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!existingUser) {
      return NextResponse.json(
        { success: false, message: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Eliminar usuario
    await prisma.user.delete({
      where: { id: userId }
    });

    return NextResponse.json({
      success: true,
      message: 'Usuario eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}