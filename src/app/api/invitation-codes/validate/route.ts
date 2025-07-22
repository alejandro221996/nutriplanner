import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code?.trim()) {
      return NextResponse.json(
        { valid: false, message: 'Código de invitación requerido' },
        { status: 400 }
      );
    }

    // Buscar el código en la base de datos
    const invitationCode = await prisma.invitationCode.findUnique({
      where: { code: code.toUpperCase().trim() }
    });

    if (!invitationCode) {
      return NextResponse.json({
        valid: false,
        message: 'Código de invitación no válido'
      });
    }

    // Verificar si el código ha expirado
    if (invitationCode.expiresAt && invitationCode.expiresAt < new Date()) {
      return NextResponse.json({
        valid: false,
        message: 'El código de invitación ha expirado'
      });
    }

    // Verificar si el código ha alcanzado el máximo de usos
    if (invitationCode.currentUses >= invitationCode.maxUses) {
      return NextResponse.json({
        valid: false,
        message: 'El código de invitación ha alcanzado el límite de usos'
      });
    }

    return NextResponse.json({
      valid: true,
      message: 'Código de invitación válido'
    });
  } catch (error) {
    console.error('Error validating invitation code:', error);
    return NextResponse.json(
      { valid: false, message: 'Error al validar el código de invitación' },
      { status: 500 }
    );
  }
}