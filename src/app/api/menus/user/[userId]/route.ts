import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function GET(
  request: Request,
  context: { params: Promise<{ userId: string }> }
) {
  try {
    const params = await context.params;
    const { userId } = params;

    if (!userId) {
      return NextResponse.json(
        { error: 'ID de usuario requerido' },
        { status: 400 }
      );
    }

    const menus = await prisma.menu.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            ingredients: {
              include: {
                food: {
                  select: {
                    id: true,
                    name: true,
                    commonPortionUnit: true,
                    calories: true,
                    protein: true,
                    carbs: true,
                    fat: true
                  }
                }
              }
            },
            recipe: {
              select: {
                id: true,
                name: true,
                description: true,
                instructions: true,
                calories: true,
                protein: true,
                carbs: true,
                fat: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(menus);
  } catch (error) {
    console.error('Error fetching user menus:', error);
    return NextResponse.json(
      { error: 'Error al obtener los menús del usuario' },
      { status: 500 }
    );
  }
}