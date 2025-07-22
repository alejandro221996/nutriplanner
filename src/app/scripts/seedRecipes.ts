import { prisma } from '../lib/prisma';

// Función para encontrar un alimento por nombre
async function findFoodByName(name: string) {
  return await prisma.food.findFirst({
    where: { name: { equals: name, mode: 'insensitive' } }
  });
}

export async function seedRecipes() {
  try {
    console.log('🌱 Iniciando seed de recetas...');

    // Limpiar recetas existentes (opcional)
    console.log('🧹 Limpiando recetas existentes...');
    await prisma.recipeItem.deleteMany();
    await prisma.recipe.deleteMany();

    // Crear recetas
    console.log('🍲 Creando recetas...');

    // 1. Ensalada de pollo
    const ensaladaPollo = await prisma.recipe.create({
      data: {
        name: 'Ensalada de pollo a la parrilla',
        description: 'Ensalada fresca con pechuga de pollo a la parrilla, perfecta para almorzar',
        instructions: '1. Cocinar la pechuga de pollo a la parrilla con un poco de aceite de oliva, sal y pimienta. 2. Lavar y cortar la lechuga, el tomate y la zanahoria. 3. Mezclar todos los vegetales en un bowl. 4. Cortar el pollo en tiras y añadirlo a la ensalada. 5. Aliñar con aceite de oliva, sal y pimienta al gusto.',
        prepTime: 15,
        cookTime: 10,
        servings: 1,
        calories: 320,
        protein: 35,
        carbs: 12,
        fat: 15
      }
    });

    // Ingredientes para ensalada de pollo
    const pollo = await findFoodByName('Pechuga de pollo');
    const lechuga = await findFoodByName('Lechuga');
    const tomate = await findFoodByName('Tomate');
    const aceiteOliva = await findFoodByName('Aceite de oliva');

    if (pollo) {
      await prisma.recipeItem.create({
        data: {
          recipeId: ensaladaPollo.id,
          foodId: pollo.id,
          quantity: 150,
          unit: 'g'
        }
      });
    }

    if (lechuga) {
      await prisma.recipeItem.create({
        data: {
          recipeId: ensaladaPollo.id,
          foodId: lechuga.id,
          quantity: 100,
          unit: 'g'
        }
      });
    }

    if (tomate) {
      await prisma.recipeItem.create({
        data: {
          recipeId: ensaladaPollo.id,
          foodId: tomate.id,
          quantity: 80,
          unit: 'g'
        }
      });
    }

    if (aceiteOliva) {
      await prisma.recipeItem.create({
        data: {
          recipeId: ensaladaPollo.id,
          foodId: aceiteOliva.id,
          quantity: 10,
          unit: 'ml'
        }
      });
    }

    // 2. Salmón con quinoa
    const salmonQuinoa = await prisma.recipe.create({
      data: {
        name: 'Salmón con quinoa y brócoli',
        description: 'Plato completo y nutritivo con salmón, quinoa y verduras',
        instructions: '1. Precalentar el horno a 180°C. 2. Sazonar el salmón con sal, pimienta y un poco de aceite de oliva. 3. Hornear el salmón durante 15-20 minutos. 4. Cocinar la quinoa según las instrucciones del paquete. 5. Cocinar el brócoli al vapor durante 5 minutos. 6. Servir el salmón sobre la quinoa con el brócoli al lado.',
        prepTime: 10,
        cookTime: 25,
        servings: 1,
        calories: 450,
        protein: 32,
        carbs: 35,
        fat: 18
      }
    });

    // Ingredientes para salmón con quinoa
    const salmon = await findFoodByName('Salmón');
    const quinoa = await findFoodByName('Quinoa');
    const brocoli = await findFoodByName('Brócoli');

    if (salmon) {
      await prisma.recipeItem.create({
        data: {
          recipeId: salmonQuinoa.id,
          foodId: salmon.id,
          quantity: 120,
          unit: 'g'
        }
      });
    }

    if (quinoa) {
      await prisma.recipeItem.create({
        data: {
          recipeId: salmonQuinoa.id,
          foodId: quinoa.id,
          quantity: 60,
          unit: 'g'
        }
      });
    }

    if (brocoli) {
      await prisma.recipeItem.create({
        data: {
          recipeId: salmonQuinoa.id,
          foodId: brocoli.id,
          quantity: 100,
          unit: 'g'
        }
      });
    }

    // 3. Batido de proteínas
    const batidoProteinas = await prisma.recipe.create({
      data: {
        name: 'Batido de proteínas con avena y frutas',
        description: 'Batido nutritivo perfecto para el desayuno o post-entrenamiento',
        instructions: '1. Añadir todos los ingredientes a la licuadora. 2. Licuar hasta obtener una consistencia cremosa. 3. Servir inmediatamente.',
        prepTime: 5,
        cookTime: 0,
        servings: 1,
        calories: 280,
        protein: 18,
        carbs: 35,
        fat: 8
      }
    });

    // Ingredientes para batido de proteínas
    const leche = await findFoodByName('Leche');
    const avena = await findFoodByName('Avena');
    const platano = await findFoodByName('Plátano');

    if (leche) {
      await prisma.recipeItem.create({
        data: {
          recipeId: batidoProteinas.id,
          foodId: leche.id,
          quantity: 250,
          unit: 'ml'
        }
      });
    }

    if (avena) {
      await prisma.recipeItem.create({
        data: {
          recipeId: batidoProteinas.id,
          foodId: avena.id,
          quantity: 40,
          unit: 'g'
        }
      });
    }

    if (platano) {
      await prisma.recipeItem.create({
        data: {
          recipeId: batidoProteinas.id,
          foodId: platano.id,
          quantity: 100,
          unit: 'g'
        }
      });
    }

    // 4. Tostadas de aguacate con huevo
    const tostadaAguacate = await prisma.recipe.create({
      data: {
        name: 'Tostadas de aguacate con huevo',
        description: 'Desayuno saludable con pan integral, aguacate y huevo',
        instructions: '1. Tostar el pan integral. 2. Machacar el aguacate y extender sobre el pan. 3. Cocinar el huevo como prefieras (frito, revuelto o pochado). 4. Colocar el huevo sobre las tostadas con aguacate. 5. Sazonar con sal, pimienta y un poco de tomate picado.',
        prepTime: 10,
        cookTime: 5,
        servings: 1,
        calories: 380,
        protein: 16,
        carbs: 28,
        fat: 24
      }
    });

    // Ingredientes para tostadas de aguacate
    const panIntegral = await findFoodByName('Pan integral');
    const aguacate = await findFoodByName('Aguacate');
    const huevo = await findFoodByName('Huevo');

    if (panIntegral) {
      await prisma.recipeItem.create({
        data: {
          recipeId: tostadaAguacate.id,
          foodId: panIntegral.id,
          quantity: 60,
          unit: 'g'
        }
      });
    }

    if (aguacate) {
      await prisma.recipeItem.create({
        data: {
          recipeId: tostadaAguacate.id,
          foodId: aguacate.id,
          quantity: 100,
          unit: 'g'
        }
      });
    }

    if (huevo) {
      await prisma.recipeItem.create({
        data: {
          recipeId: tostadaAguacate.id,
          foodId: huevo.id,
          quantity: 60,
          unit: 'unidad'
        }
      });
    }

    console.log(`✅ ${await prisma.recipe.count()} recetas creadas`);
    console.log(`✅ ${await prisma.recipeItem.count()} ingredientes de recetas creados`);

    console.log('🎉 Seed de recetas completado exitosamente!');
    return [ensaladaPollo, salmonQuinoa, batidoProteinas, tostadaAguacate];
  } catch (error) {
    console.error('❌ Error durante el seed de recetas:', error);
    throw error;
  }
}

// Ejecutar el seed si este archivo se ejecuta directamente
if (require.main === module) {
  seedRecipes()
    .then(() => {
      console.log('Seed de recetas ejecutado exitosamente');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Error ejecutando seed de recetas:', error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}