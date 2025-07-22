import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { UserRole } from '../../../types';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, invitationCode, role = 'USER' } = await request.json();

    // Validar datos de entrada
    if (!name?.trim() || !email?.trim() || !password?.trim() || !invitationCode?.trim()) {
      return NextResponse.json(
        { success: false, message: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'El formato del email no es válido' },
        { status: 400 }
      );
    }

    // Validar longitud de contraseña
    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: 'La contraseña debe tener al menos 6 caracteres' },
        { status: 400 }
      );
    }

    // Verificar si el email ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() }
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'Ya existe una cuenta con este email' },
        { status: 409 }
      );
    }

    // Hash de la contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Crear nuevo usuario
    const newUser = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        role: role as UserRole,
        invitationCode: invitationCode.trim(),
      }
    });

    // Retornar usuario sin contraseña
    const { password: _, ...publicUser } = newUser;

    return NextResponse.json({
      success: true,
      user: publicUser,
      message: 'Usuario registrado exitosamente'
    });
  } catch (error) {
    console.error('Error registering user:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}