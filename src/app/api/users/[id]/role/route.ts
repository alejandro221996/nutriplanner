import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { UserRole } from '../../../../types';

// Cambiar rol de usuario
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: targetUserId } = params;
    const { adminUserId, newRole } = await request.json();

    // Verificar que el usuario que hace el cambio sea administrador
    const adminUser = await prisma.user.findUnique({
      where: { id: adminUserId }
    });

    if (!adminUser || adminUser.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, message: 'No tienes permisos para realizar esta acción' },
        { status: 403 }
      );
    }

    // Verificar que el usuario objetivo existe
    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId }
    });

    if (!targetUser) {
      return NextResponse.json(
        { success: false, message: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Actualizar el rol del usuario
    const updatedUser = await prisma.user.update({
      where: { id: targetUserId },
      data: { role: newRole as UserRole }
    });

    // Retornar usuario sin contraseña
    const { password: _, ...publicUser } = updatedUser;

    return NextResponse.json({
      success: true,
      user: publicUser,
      message: `Rol cambiado a ${newRole} exitosamente`
    });
  } catch (error) {
    console.error('Error changing user role:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}