import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // En Next.js 15, params es una promesa que debe ser esperada
    const params = await context.params;
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'ID de receta requerido' },
        { status: 400 }
      );
    }

    const recipeItems = await prisma.recipeItem.findMany({
      where: { recipeId: id },
      include: {
        food: {
          select: {
            id: true,
            name: true,
            commonPortionUnit: true
          }
        }
      }
    });

    return NextResponse.json(recipeItems);
  } catch (error) {
    console.error('Error fetching recipe ingredients:', error);
    return NextResponse.json(
      { error: 'Error al obtener ingredientes de la receta' },
      { status: 500 }
    );
  }
}