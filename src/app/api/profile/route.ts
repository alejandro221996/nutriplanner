import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Obtener parámetros de consulta
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';

    // Calcular offset para paginación
    const offset = (page - 1) * limit;

    // Construir filtros de búsqueda
    const where = search ? {
      OR: [
        { user: { name: { contains: search, mode: 'insensitive' as const } } },
        { user: { email: { contains: search, mode: 'insensitive' as const } } }
      ]
    } : {};

    // Obtener perfiles con información del usuario
    const [profiles, total] = await Promise.all([
      prisma.profile.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              createdAt: true
            }
          }
        },
        skip: offset,
        take: limit,
        orderBy: {
          user: {
            createdAt: 'desc'
          }
        }
      }),
      prisma.profile.count({ where })
    ]);

    // Calcular metadatos de paginación
    const totalPages = Math.ceil(total / limit);
    const hasMore = page < totalPages;

    return NextResponse.json({
      success: true,
      profiles,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasMore
      }
    });

  } catch (error) {
    console.error('Error fetching profiles:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// Endpoint para obtener estadísticas de perfiles
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'stats') {
      // Obtener estadísticas generales
      const [
        totalProfiles,
        completeProfiles,
        averageAge,
        genderDistribution,
        goalDistribution,
        activityDistribution
      ] = await Promise.all([
        // Total de perfiles
        prisma.profile.count(),

        // Perfiles completos (con todos los campos básicos)
        prisma.profile.count({
          where: {
            AND: [
              { age: { not: null } },
              { weight: { not: null } },
              { height: { not: null } },
              { gender: { not: null } },
              { activityLevel: { not: null } },
              { goal: { not: null } }
            ]
          }
        }),

        // Edad promedio
        prisma.profile.aggregate({
          _avg: { age: true },
          where: { age: { not: null } }
        }),

        // Distribución por género
        prisma.profile.groupBy({
          by: ['gender'],
          _count: true,
          where: { gender: { not: null } }
        }),

        // Distribución por objetivo
        prisma.profile.groupBy({
          by: ['goal'],
          _count: true,
          where: { goal: { not: null } }
        }),

        // Distribución por nivel de actividad
        prisma.profile.groupBy({
          by: ['activityLevel'],
          _count: true,
          where: { activityLevel: { not: null } }
        })
      ]);

      const stats = {
        totalProfiles,
        completeProfiles,
        incompleteProfiles: totalProfiles - completeProfiles,
        completionRate: totalProfiles > 0 ? Math.round((completeProfiles / totalProfiles) * 100) : 0,
        averageAge: averageAge._avg.age ? Math.round(averageAge._avg.age) : null,
        distributions: {
          gender: genderDistribution.reduce((acc, item) => ({
            ...acc,
            [item.gender || 'unknown']: item._count
          }), {}),
          goal: goalDistribution.reduce((acc, item) => ({
            ...acc,
            [item.goal || 'unknown']: item._count
          }), {}),
          activityLevel: activityDistribution.reduce((acc, item) => ({
            ...acc,
            [item.activityLevel || 'unknown']: item._count
          }), {})
        }
      };

      return NextResponse.json({
        success: true,
        stats
      });
    }

    return NextResponse.json(
      { success: false, message: 'Acción no válida' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Error processing profiles request:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}