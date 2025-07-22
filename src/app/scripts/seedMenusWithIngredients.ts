import { prisma } from '../lib/prisma';

// Función para encontrar un alimento por nombre
async function findFoodByName(name: string) {
  return await prisma.food.findFirst({
    where: { name: { equals: name, mode: 'insensitive' } }
  });
}

// Función para crear un MenuItem con ingredientes directos
async function createMealWithIngredients(
  menuId: string,
  name: string,
  mealType: string,
  ingredients: Array<{ foodName: string; quantity: number; unit: string }>,
  dayOfWeek?: number
) {
  const menuItem = await prisma.menuItem.create({
    data: {
      menuId,
      name,
      mealType,
      dayOfWeek,
      servings: 1
    }
  });

  // Crear los ingredientes
  for (const ingredient of ingredients) {
    const food = await findFoodByName(ingredient.foodName);
    if (food) {
      await prisma.mealIngredient.create({
        data: {
          menuItemId: menuItem.id,
          foodId: food.id,
          quantity: ingredient.quantity,
          unit: ingredient.unit
        }
      });
    } else {
      console.warn(`⚠️  Alimento no encontrado: ${ingredient.foodName}`);
    }
  }

  return menuItem;
}

export async function seedMenusWithIngredients() {
  try {
    console.log('🌱 Iniciando seed de menús con ingredientes directos...');

    // Obtener un usuario de prueba
    const user = await prisma.user.findFirst({
      where: { email: 'juan@test.com' }
    });

    if (!user) {
      console.error('❌ Usuario de prueba no encontrado');
      return;
    }

    // Limpiar menús existentes del usuario
    await prisma.menu.deleteMany({
      where: { userId: user.id }
    });

    // Crear menú diario con ingredientes directos
    const dailyMenu = await prisma.menu.create({
      data: {
        userId: user.id,
        name: 'Menú Diario Proteico',
        description: 'Menú alto en proteínas para desarrollo muscular',
        type: 'daily',
        isFavorite: false
      }
    });

    // Desayuno: Desayuno completo (~600 kcal)
    await createMealWithIngredients(
      dailyMenu.id,
      'Desayuno completo',
      'breakfast',
      [
        { foodName: 'Pan integral', quantity: 80, unit: 'g' },
        { foodName: 'Aguacate', quantity: 120, unit: 'g' },
        { foodName: 'Huevo', quantity: 180, unit: 'g' }, // 3 huevos
        { foodName: 'Yogur griego', quantity: 150, unit: 'g' },
        { foodName: 'Almendras', quantity: 25, unit: 'g' },
        { foodName: 'Aceite de oliva', quantity: 10, unit: 'ml' }
      ]
    );

    // Almuerzo: Almuerzo completo (~700 kcal)
    await createMealWithIngredients(
      dailyMenu.id,
      'Almuerzo completo',
      'lunch',
      [
        { foodName: 'Pechuga de pollo', quantity: 200, unit: 'g' },
        { foodName: 'Arroz integral', quantity: 120, unit: 'g' },
        { foodName: 'Brócoli', quantity: 150, unit: 'g' },
        { foodName: 'Aguacate', quantity: 80, unit: 'g' },
        { foodName: 'Aceite de oliva', quantity: 15, unit: 'ml' }
      ]
    );

    // Merienda: Snack proteico (~400 kcal)
    await createMealWithIngredients(
      dailyMenu.id,
      'Snack proteico',
      'snack',
      [
        { foodName: 'Yogur griego', quantity: 200, unit: 'g' },
        { foodName: 'Plátano', quantity: 120, unit: 'g' },
        { foodName: 'Avena', quantity: 40, unit: 'g' },
        { foodName: 'Nueces', quantity: 20, unit: 'g' }
      ]
    );

    // Cena: Cena completa (~500 kcal)
    await createMealWithIngredients(
      dailyMenu.id,
      'Cena completa',
      'dinner',
      [
        { foodName: 'Salmón', quantity: 150, unit: 'g' },
        { foodName: 'Quinoa', quantity: 80, unit: 'g' },
        { foodName: 'Espinacas', quantity: 120, unit: 'g' },
        { foodName: 'Batata', quantity: 100, unit: 'g' },
        { foodName: 'Aceite de oliva', quantity: 12, unit: 'ml' }
      ]
    );

    // Crear menú semanal con más variedad
    const weeklyMenu = await prisma.menu.create({
      data: {
        userId: user.id,
        name: 'Menú Semanal Variado',
        description: 'Menú semanal con diferentes combinaciones de ingredientes',
        type: 'weekly',
        isFavorite: true
      }
    });

    // Lunes - Desayuno
    await createMealWithIngredients(
      weeklyMenu.id,
      'Yogur con granola y frutas',
      'breakfast',
      [
        { foodName: 'Yogur', quantity: 200, unit: 'g' },
        { foodName: 'Avena', quantity: 40, unit: 'g' },
        { foodName: 'Plátano', quantity: 80, unit: 'g' }
      ],
      1
    );

    // Lunes - Almuerzo
    await createMealWithIngredients(
      weeklyMenu.id,
      'Ensalada de pollo con vegetales',
      'lunch',
      [
        { foodName: 'Pechuga de pollo', quantity: 140, unit: 'g' },
        { foodName: 'Lechuga', quantity: 100, unit: 'g' },
        { foodName: 'Tomate', quantity: 80, unit: 'g' },
        { foodName: 'Aguacate', quantity: 50, unit: 'g' },
        { foodName: 'Aceite de oliva', quantity: 12, unit: 'ml' }
      ],
      1
    );

    // Martes - Desayuno
    await createMealWithIngredients(
      weeklyMenu.id,
      'Tortilla de claras con vegetales',
      'breakfast',
      [
        { foodName: 'Huevo', quantity: 120, unit: 'g' }, // 4 claras
        { foodName: 'Espinacas', quantity: 80, unit: 'g' },
        { foodName: 'Tomate', quantity: 60, unit: 'g' },
        { foodName: 'Aceite de oliva', quantity: 5, unit: 'ml' }
      ],
      2
    );

    // Martes - Almuerzo
    await createMealWithIngredients(
      weeklyMenu.id,
      'Pasta con pollo y vegetales',
      'lunch',
      [
        { foodName: 'Pechuga de pollo', quantity: 120, unit: 'g' },
        { foodName: 'Brócoli', quantity: 100, unit: 'g' },
        { foodName: 'Aceite de oliva', quantity: 10, unit: 'ml' }
      ],
      2
    );

    // Miércoles - Desayuno
    await createMealWithIngredients(
      weeklyMenu.id,
      'Avena con frutas',
      'breakfast',
      [
        { foodName: 'Avena', quantity: 50, unit: 'g' },
        { foodName: 'Plátano', quantity: 100, unit: 'g' },
        { foodName: 'Aceite de oliva', quantity: 5, unit: 'ml' }
      ],
      3
    );

    // Miércoles - Almuerzo
    await createMealWithIngredients(
      weeklyMenu.id,
      'Salmón con quinoa',
      'lunch',
      [
        { foodName: 'Salmón', quantity: 130, unit: 'g' },
        { foodName: 'Quinoa', quantity: 70, unit: 'g' },
        { foodName: 'Espinacas', quantity: 90, unit: 'g' },
        { foodName: 'Aceite de oliva', quantity: 8, unit: 'ml' }
      ],
      3
    );

    // Jueves - Desayuno
    await createMealWithIngredients(
      weeklyMenu.id,
      'Tostadas integrales con aguacate',
      'breakfast',
      [
        { foodName: 'Pan integral', quantity: 70, unit: 'g' },
        { foodName: 'Aguacate', quantity: 80, unit: 'g' },
        { foodName: 'Tomate', quantity: 50, unit: 'g' }
      ],
      4
    );

    // Jueves - Almuerzo
    await createMealWithIngredients(
      weeklyMenu.id,
      'Pollo con vegetales al vapor',
      'lunch',
      [
        { foodName: 'Pechuga de pollo', quantity: 160, unit: 'g' },
        { foodName: 'Brócoli', quantity: 110, unit: 'g' },
        { foodName: 'Espinacas', quantity: 70, unit: 'g' },
        { foodName: 'Aceite de oliva', quantity: 12, unit: 'ml' }
      ],
      4
    );

    // Viernes - Desayuno
    await createMealWithIngredients(
      weeklyMenu.id,
      'Batido proteico',
      'breakfast',
      [
        { foodName: 'Plátano', quantity: 120, unit: 'g' },
        { foodName: 'Avena', quantity: 35, unit: 'g' },
        { foodName: 'Aceite de oliva', quantity: 3, unit: 'ml' }
      ],
      5
    );

    // Viernes - Almuerzo
    await createMealWithIngredients(
      weeklyMenu.id,
      'Ensalada de salmón',
      'lunch',
      [
        { foodName: 'Salmón', quantity: 140, unit: 'g' },
        { foodName: 'Espinacas', quantity: 100, unit: 'g' },
        { foodName: 'Aguacate', quantity: 60, unit: 'g' },
        { foodName: 'Tomate', quantity: 70, unit: 'g' },
        { foodName: 'Aceite de oliva', quantity: 15, unit: 'ml' }
      ],
      5
    );

    // Sábado - Desayuno
    await createMealWithIngredients(
      weeklyMenu.id,
      'Huevos revueltos con vegetales',
      'breakfast',
      [
        { foodName: 'Huevo', quantity: 140, unit: 'g' },
        { foodName: 'Espinacas', quantity: 60, unit: 'g' },
        { foodName: 'Tomate', quantity: 40, unit: 'g' },
        { foodName: 'Aceite de oliva', quantity: 8, unit: 'ml' }
      ],
      6
    );

    // Sábado - Almuerzo
    await createMealWithIngredients(
      weeklyMenu.id,
      'Pollo con quinoa y aguacate',
      'lunch',
      [
        { foodName: 'Pechuga de pollo', quantity: 150, unit: 'g' },
        { foodName: 'Quinoa', quantity: 65, unit: 'g' },
        { foodName: 'Aguacate', quantity: 70, unit: 'g' },
        { foodName: 'Aceite de oliva', quantity: 10, unit: 'ml' }
      ],
      6
    );

    // Domingo - Desayuno
    await createMealWithIngredients(
      weeklyMenu.id,
      'Tostadas con huevo',
      'breakfast',
      [
        { foodName: 'Pan integral', quantity: 65, unit: 'g' },
        { foodName: 'Huevo', quantity: 110, unit: 'g' },
        { foodName: 'Aceite de oliva', quantity: 6, unit: 'ml' }
      ],
      7
    );

    // Domingo - Almuerzo
    await createMealWithIngredients(
      weeklyMenu.id,
      'Salmón con espinacas',
      'lunch',
      [
        { foodName: 'Salmón', quantity: 135, unit: 'g' },
        { foodName: 'Espinacas', quantity: 120, unit: 'g' },
        { foodName: 'Brócoli', quantity: 80, unit: 'g' },
        { foodName: 'Aceite de oliva', quantity: 11, unit: 'ml' }
      ],
      7
    );

    // Añadir meriendas (snacks) para cada día
    await createMealWithIngredients(
      weeklyMenu.id,
      'Frutos secos y plátano',
      'snack',
      [
        { foodName: 'Plátano', quantity: 80, unit: 'g' },
        { foodName: 'Avena', quantity: 20, unit: 'g' }
      ],
      1
    );

    await createMealWithIngredients(
      weeklyMenu.id,
      'Aguacate con tostada',
      'snack',
      [
        { foodName: 'Pan integral', quantity: 30, unit: 'g' },
        { foodName: 'Aguacate', quantity: 40, unit: 'g' }
      ],
      2
    );

    await createMealWithIngredients(
      weeklyMenu.id,
      'Batido de frutas',
      'snack',
      [
        { foodName: 'Plátano', quantity: 90, unit: 'g' },
        { foodName: 'Avena', quantity: 25, unit: 'g' }
      ],
      3
    );

    await createMealWithIngredients(
      weeklyMenu.id,
      'Huevo duro con vegetales',
      'snack',
      [
        { foodName: 'Huevo', quantity: 60, unit: 'g' },
        { foodName: 'Tomate', quantity: 50, unit: 'g' }
      ],
      4
    );

    await createMealWithIngredients(
      weeklyMenu.id,
      'Salmón ahumado con aguacate',
      'snack',
      [
        { foodName: 'Salmón', quantity: 50, unit: 'g' },
        { foodName: 'Aguacate', quantity: 30, unit: 'g' }
      ],
      5
    );

    await createMealWithIngredients(
      weeklyMenu.id,
      'Pollo con espinacas',
      'snack',
      [
        { foodName: 'Pechuga de pollo', quantity: 60, unit: 'g' },
        { foodName: 'Espinacas', quantity: 40, unit: 'g' }
      ],
      6
    );

    await createMealWithIngredients(
      weeklyMenu.id,
      'Batido proteico ligero',
      'snack',
      [
        { foodName: 'Plátano', quantity: 70, unit: 'g' },
        { foodName: 'Avena', quantity: 15, unit: 'g' }
      ],
      7
    );

    // Añadir cenas (dinner) para cada día
    await createMealWithIngredients(
      weeklyMenu.id,
      'Pollo con brócoli',
      'dinner',
      [
        { foodName: 'Pechuga de pollo', quantity: 120, unit: 'g' },
        { foodName: 'Brócoli', quantity: 100, unit: 'g' },
        { foodName: 'Aceite de oliva', quantity: 8, unit: 'ml' }
      ],
      1
    );

    await createMealWithIngredients(
      weeklyMenu.id,
      'Salmón con quinoa',
      'dinner',
      [
        { foodName: 'Salmón', quantity: 110, unit: 'g' },
        { foodName: 'Quinoa', quantity: 50, unit: 'g' },
        { foodName: 'Espinacas', quantity: 80, unit: 'g' }
      ],
      2
    );

    await createMealWithIngredients(
      weeklyMenu.id,
      'Huevos con vegetales',
      'dinner',
      [
        { foodName: 'Huevo', quantity: 120, unit: 'g' },
        { foodName: 'Espinacas', quantity: 90, unit: 'g' },
        { foodName: 'Tomate', quantity: 60, unit: 'g' },
        { foodName: 'Aceite de oliva', quantity: 6, unit: 'ml' }
      ],
      3
    );

    await createMealWithIngredients(
      weeklyMenu.id,
      'Pollo con quinoa y aguacate',
      'dinner',
      [
        { foodName: 'Pechuga de pollo', quantity: 130, unit: 'g' },
        { foodName: 'Quinoa', quantity: 55, unit: 'g' },
        { foodName: 'Aguacate', quantity: 50, unit: 'g' }
      ],
      4
    );

    await createMealWithIngredients(
      weeklyMenu.id,
      'Salmón con espinacas y brócoli',
      'dinner',
      [
        { foodName: 'Salmón', quantity: 125, unit: 'g' },
        { foodName: 'Espinacas', quantity: 85, unit: 'g' },
        { foodName: 'Brócoli', quantity: 90, unit: 'g' },
        { foodName: 'Aceite de oliva', quantity: 7, unit: 'ml' }
      ],
      5
    );

    await createMealWithIngredients(
      weeklyMenu.id,
      'Huevos revueltos con aguacate',
      'dinner',
      [
        { foodName: 'Huevo', quantity: 130, unit: 'g' },
        { foodName: 'Aguacate', quantity: 60, unit: 'g' },
        { foodName: 'Espinacas', quantity: 70, unit: 'g' },
        { foodName: 'Aceite de oliva', quantity: 5, unit: 'ml' }
      ],
      6
    );

    await createMealWithIngredients(
      weeklyMenu.id,
      'Pollo con vegetales mixtos',
      'dinner',
      [
        { foodName: 'Pechuga de pollo', quantity: 140, unit: 'g' },
        { foodName: 'Brócoli', quantity: 70, unit: 'g' },
        { foodName: 'Espinacas', quantity: 60, unit: 'g' },
        { foodName: 'Aceite de oliva', quantity: 9, unit: 'ml' }
      ],
      7
    );

    console.log(`✅ Menús con ingredientes directos creados exitosamente`);
    console.log(`📊 Total de menús: ${await prisma.menu.count()}`);
    console.log(`📊 Total de items de menú: ${await prisma.menuItem.count()}`);
    console.log(`📊 Total de ingredientes de comida: ${await prisma.mealIngredient.count()}`);

    console.log('🎉 Seed de menús con ingredientes completado exitosamente!');
  } catch (error) {
    console.error('❌ Error durante el seed de menús con ingredientes:', error);
    throw error;
  }
}

// Ejecutar el seed si este archivo se ejecuta directamente
if (require.main === module) {
  seedMenusWithIngredients()
    .then(() => {
      console.log('Seed de menús con ingredientes ejecutado exitosamente');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Error ejecutando seed de menús con ingredientes:', error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}