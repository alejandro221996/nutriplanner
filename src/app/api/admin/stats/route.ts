import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

// Obtener estadísticas de usuarios
export async function GET() {
  try {
    const totalUsers = await prisma.user.count();

    const adminUsers = await prisma.user.count({
      where: { role: 'ADMIN' }
    });

    const regularUsers = await prisma.user.count({
      where: { role: 'USER' }
    });

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentUsers = await prisma.user.count({
      where: {
        createdAt: {
          gte: sevenDaysAgo
        }
      }
    });

    return NextResponse.json({
      totalUsers,
      adminUsers,
      regularUsers,
      recentUsers
    });
  } catch (error) {
    console.error('Error getting user stats:', error);
    return NextResponse.json(
      {
        totalUsers: 0,
        adminUsers: 0,
        regularUsers: 0,
        recentUsers: 0
      },
      { status: 500 }
    );
  }
}