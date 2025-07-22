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
        fat: 15,

        isVegetarian: false,
        isVegan: false,
        isGlutenFree: true,
        isLactoseFree: true,
        isNutFree: true
      }
    });

    // Añadir ingredientes a la ensalada de pollo
    const polloFood = await findFoodByName('Pechuga de pollo');
    const tomateFood = await findFoodByName('Tomate');
    const zanahoriaFood = await findFoodByName('Zanahoria');
    const aceiteFood = await findFoodByName('Aceite de oliva');

    if (polloFood && tomateFood && zanahoriaFood && aceiteFood) {
      await prisma.recipeItem.createMany({
        data: [
          {
            recipeId: ensaladaPollo.id,
            foodId: polloFood.id,
            quantity: 120,
            unit: 'g'
          },
          {
            recipeId: ensaladaPollo.id,
            foodId: tomateFood.id,
            quantity: 100,
            unit: 'g'
          },
          {
            recipeId: ensaladaPollo.id,
            foodId: zanahoriaFood.id,
            quantity: 50,
            unit: 'g'
          },
          {
            recipeId: ensaladaPollo.id,
            foodId: aceiteFood.id,
            quantity: 10,
            unit: 'ml'
          }
        ]
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
        fat: 18,

        isVegetarian: false,
        isVegan: false,
        isGlutenFree: true,
        isLactoseFree: true,
        isNutFree: true
      }
    });

    // Añadir ingredientes al salmón con quinoa
    const salmonFood = await findFoodByName('Salmón');
    const quinoaFood = await findFoodByName('Quinoa');
    const brocoliFood = await findFoodByName('Brócoli');

    if (salmonFood && quinoaFood && brocoliFood && aceiteFood) {
      await prisma.recipeItem.createMany({
        data: [
          {
            recipeId: salmonQuinoa.id,
            foodId: salmonFood.id,
            quantity: 150,
            unit: 'g'
          },
          {
            recipeId: salmonQuinoa.id,
            foodId: quinoaFood.id,
            quantity: 60,
            unit: 'g'
          },
          {
            recipeId: salmonQuinoa.id,
            foodId: brocoliFood.id,
            quantity: 100,
            unit: 'g'
          },
          {
            recipeId: salmonQuinoa.id,
            foodId: aceiteFood.id,
            quantity: 5,
            unit: 'ml'
          }
        ]
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
        fat: 8,

        isVegetarian: true,
        isVegan: false,
        isGlutenFree: false,
        isLactoseFree: false,
        isNutFree: true
      }
    });

    // Añadir ingredientes al batido de proteínas
    const avenaFood = await findFoodByName('Avena');
    const lecheFood = await findFoodByName('Leche desnatada');
    const platanoFood = await findFoodByName('Plátano');
    const fresasFood = await findFoodByName('Fresas');
    const yogurFood = await findFoodByName('Yogur griego');

    if (avenaFood && lecheFood && platanoFood && fresasFood && yogurFood) {
      await prisma.recipeItem.createMany({
        data: [
          {
            recipeId: batidoProteinas.id,
            foodId: avenaFood.id,
            quantity: 30,
            unit: 'g'
          },
          {
            recipeId: batidoProteinas.id,
            foodId: lecheFood.id,
            quantity: 200,
            unit: 'ml'
          },
          {
            recipeId: batidoProteinas.id,
            foodId: platanoFood.id,
            quantity: 100,
            unit: 'g'
          },
          {
            recipeId: batidoProteinas.id,
            foodId: fresasFood.id,
            quantity: 50,
            unit: 'g'
          },
          {
            recipeId: batidoProteinas.id,
            foodId: yogurFood.id,
            quantity: 100,
            unit: 'g'
          }
        ]
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
        fat: 24,
        isVegetarian: true,
        isVegan: false,
        isGlutenFree: false,
        isLactoseFree: true,
        isNutFree: true
      }
    });

    // Añadir ingredientes a las tostadas de aguacate
    const panFood = await findFoodByName('Pan integral');
    const aguacateFood = await findFoodByName('Aguacate');
    const huevoFood = await findFoodByName('Huevo');

    if (panFood && aguacateFood && huevoFood && tomateFood) {
      await prisma.recipeItem.createMany({
        data: [
          {
            recipeId: tostadaAguacate.id,
            foodId: panFood.id,
            quantity: 60,
            unit: 'g'
          },
          {
            recipeId: tostadaAguacate.id,
            foodId: aguacateFood.id,
            quantity: 50,
            unit: 'g'
          },
          {
            recipeId: tostadaAguacate.id,
            foodId: huevoFood.id,
            quantity: 50,
            unit: 'g'
          },
          {
            recipeId: tostadaAguacate.id,
            foodId: tomateFood.id,
            quantity: 30,
            unit: 'g'
          }
        ]
      });
    }

    console.log(`✅ ${await prisma.recipe.count()} recetas creadas`);
    console.log(`✅ ${await prisma.recipeItem.count()} ingredientes de recetas creados`);

    console.log('🎉 Seed de recetas completado exitosamente!');
  } catch (error: any) {
    console.error('❌ Error durante el seed de recetas:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el seed si este archivo se ejecuta directamente
if (require.main === module) {
  seedRecipes()
    .then(() => {
      console.log('Seed de recetas ejecutado exitosamente');
      process.exit(0);
    })
    .catch((error: any) => {
      console.error('Error ejecutando seed de recetas:', error);
      process.exit(1);
    });
}