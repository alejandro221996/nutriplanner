import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { code, userId } = await request.json();

    if (!code?.trim() || !userId?.trim()) {
      return NextResponse.json(
        { success: false, message: 'Código y usuario requeridos' },
        { status: 400 }
      );
    }

    // Buscar el código
    const invitationCode = await prisma.invitationCode.findUnique({
      where: { code: code.toUpperCase().trim() }
    });

    if (!invitationCode) {
      return NextResponse.json({
        success: false,
        message: 'Código de invitación no encontrado'
      });
    }

    // Validar antes de usar
    if (invitationCode.expiresAt && invitationCode.expiresAt < new Date()) {
      return NextResponse.json({
        success: false,
        message: 'El código de invitación ha expirado'
      });
    }

    if (invitationCode.currentUses >= invitationCode.maxUses) {
      return NextResponse.json({
        success: false,
        message: 'El código de invitación ha alcanzado el límite de usos'
      });
    }

    // Incrementar el contador de usos
    await prisma.invitationCode.update({
      where: { code: code.toUpperCase().trim() },
      data: {
        currentUses: invitationCode.currentUses + 1,
        usedBy: userId
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Código de invitación usado exitosamente'
    });
  } catch (error) {
    console.error('Error using invitation code:', error);
    return NextResponse.json(
      { success: false, message: 'Error al usar el código de invitación' },
      { status: 500 }
    );
  }
}