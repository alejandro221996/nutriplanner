import { NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';

// Obtener todos los usuarios
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' }
    });

    // Retornar usuarios sin contraseñas
    const publicUsers = users.map(({ password, ...user }) => user);

    return NextResponse.json(publicUsers);
  } catch (error) {
    console.error('Error getting all users:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}