import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { profile, startDate } = await request.json();

    if (!profile) {
      return NextResponse.json(
        { error: 'Se requiere un perfil nutricional' },
        { status: 400 }
      );
    }

    const weeklyPlan = [];
    const start = startDate ? new Date(startDate) : new Date();

    // Generar un plan para cada día de la semana
    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);

      // Llamar a la API de plan diario para cada día
      const dailyPlanResponse = await fetch(new URL('/api/nutrition/meal-plan/daily', request.url).toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profile,
          date: date.toISOString()
        }),
      });

      if (!dailyPlanResponse.ok) {
        throw new Error(`Error al generar el plan para el día ${i + 1}`);
      }

      const dailyPlan = await dailyPlanResponse.json();
      weeklyPlan.push(dailyPlan);
    }

    return NextResponse.json(weeklyPlan);
  } catch (error) {
    console.error('Error generating weekly meal plan:', error);
    return NextResponse.json(
      { error: 'Error al generar el plan de comidas semanal' },
      { status: 500 }
    );
  }
}