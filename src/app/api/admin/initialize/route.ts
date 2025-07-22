import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function POST() {
  try {
    // Verificar si ya existe un administrador
    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    });

    if (existingAdmin) {
      return NextResponse.json({
        success: false,
        message: 'Ya existe un usuario administrador'
      });
    }

    // Hash de la contraseña por defecto
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash('admin123456', saltRounds);

    // Crear administrador por defecto
    const newAdmin = await prisma.user.create({
      data: {
        name: 'Administrador',
        email: 'admin@nutriplaner.com',
        password: hashedPassword,
        role: 'ADMIN',
        invitationCode: 'ADMIN_CREATED',
      }
    });

    // Retornar usuario sin contraseña
    const { password: _, ...publicUser } = newAdmin;

    return NextResponse.json({
      success: true,
      user: publicUser,
      message: 'Usuario administrador creado exitosamente'
    });
  } catch (error) {
    console.error('Error creating default admin:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}