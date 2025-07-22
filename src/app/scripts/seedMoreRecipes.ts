import { prisma } from '../lib/prisma';

// Función para encontrar un alimento por nombre
async function findFoodByName(name: string) {
  return await prisma.food.findFirst({
    where: { name: { equals: name, mode: 'insensitive' } }
  });
}

export async function seedMoreRecipes() {
  try {
    console.log('🌱 Iniciando seed de recetas adicionales...');

    // Crear recetas adicionales con mayor variedad calórica
    console.log('🍲 Creando recetas adicionales...');

    // 5. Pasta con pollo y verduras
    const pastaPollo = await prisma.recipe.create({
      data: {
        name: 'Pasta con pollo y verduras',
        description: 'Pasta integral con pollo a la plancha y verduras salteadas',
        instructions: '1. Cocinar la pasta según las instrucciones del paquete. 2. Saltear el pollo cortado en cubos con ajo y aceite de oliva. 3. Añadir las verduras (pimiento, calabacín, cebolla) y saltear. 4. Mezclar la pasta con el pollo y las verduras. 5. Sazonar con sal, pimienta y hierbas al gusto.',
        prepTime: 15,
        cookTime: 20,
        servings: 1,
        calories: 550,
        protein: 40,
        carbs: 65,
        fat: 12
      }
    });

    // Ingredientes para pasta con pollo
    const pasta = await findFoodByName('Pasta');
    const polloP = await findFoodByName('Pechuga de pollo');
    const aceiteOlivaP = await findFoodByName('Aceite de oliva');

    if (pasta) {
      await prisma.recipeItem.create({
        data: {
          recipeId: pastaPollo.id,
          foodId: pasta.id,
          quantity: 100,
          unit: 'g'
        }
      });
    }

    if (polloP) {
      await prisma.recipeItem.create({
        data: {
          recipeId: pastaPollo.id,
          foodId: polloP.id,
          quantity: 120,
          unit: 'g'
        }
      });
    }

    if (aceiteOlivaP) {
      await prisma.recipeItem.create({
        data: {
          recipeId: pastaPollo.id,
          foodId: aceiteOlivaP.id,
          quantity: 10,
          unit: 'ml'
        }
      });
    }

    // 6. Bowl de arroz con atún
    await prisma.recipe.create({
      data: {
        name: 'Bowl de arroz con atún y aguacate',
        description: 'Bowl nutritivo con arroz integral, atún, aguacate y vegetales',
        instructions: '1. Cocinar el arroz integral según las instrucciones. 2. Escurrir el atún en conserva. 3. Cortar el aguacate, tomate y pepino en cubos. 4. Montar el bowl con el arroz como base, añadir el atún y los vegetales. 5. Aliñar con limón, aceite de oliva, sal y pimienta.',
        prepTime: 10,
        cookTime: 25,
        servings: 1,
        calories: 480,
        protein: 30,
        carbs: 55,
        fat: 18
      }
    });

    // 7. Tortilla de claras con vegetales
    const tortillaClaras = await prisma.recipe.create({
      data: {
        name: 'Tortilla de claras con vegetales',
        description: 'Tortilla alta en proteínas con claras de huevo y vegetales',
        instructions: '1. Batir las claras de huevo con un poco de sal. 2. Picar los vegetales (espinacas, champiñones, cebolla). 3. Saltear los vegetales en una sartén con un poco de aceite. 4. Añadir las claras batidas y cocinar a fuego medio-bajo. 5. Dar la vuelta cuando esté cuajada por un lado.',
        prepTime: 10,
        cookTime: 10,
        servings: 1,
        calories: 220,
        protein: 25,
        carbs: 8,
        fat: 10
      }
    });

    // Ingredientes para tortilla de claras
    const huevo = await findFoodByName('Huevo');
    const espinacas = await findFoodByName('Espinacas');
    const aceiteOliva = await findFoodByName('Aceite de oliva');

    if (huevo) {
      await prisma.recipeItem.create({
        data: {
          recipeId: tortillaClaras.id,
          foodId: huevo.id,
          quantity: 120, // 4 claras aproximadamente
          unit: 'g'
        }
      });
    }

    if (espinacas) {
      await prisma.recipeItem.create({
        data: {
          recipeId: tortillaClaras.id,
          foodId: espinacas.id,
          quantity: 80,
          unit: 'g'
        }
      });
    }

    if (aceiteOliva) {
      await prisma.recipeItem.create({
        data: {
          recipeId: tortillaClaras.id,
          foodId: aceiteOliva.id,
          quantity: 5,
          unit: 'ml'
        }
      });
    }

    // 8. Wrap de pollo con hummus
    await prisma.recipe.create({
      data: {
        name: 'Wrap de pollo con hummus',
        description: 'Wrap de tortilla integral con pollo, hummus y vegetales',
        instructions: '1. Cocinar el pollo a la plancha con especias. 2. Extender el hummus sobre la tortilla integral. 3. Añadir el pollo cortado en tiras y los vegetales (lechuga, tomate, pepino). 4. Enrollar la tortilla y cortar por la mitad.',
        prepTime: 15,
        cookTime: 10,
        servings: 1,
        calories: 420,
        protein: 35,
        carbs: 40,
        fat: 15
      }
    });

    // 9. Batido de proteínas con plátano y mantequilla de cacahuete
    await prisma.recipe.create({
      data: {
        name: 'Batido de proteínas con plátano y mantequilla de cacahuete',
        description: 'Batido alto en calorías y proteínas, ideal para ganar masa muscular',
        instructions: '1. Añadir todos los ingredientes a la licuadora: proteína en polvo, plátano, mantequilla de cacahuete, leche y hielo. 2. Licuar hasta obtener una consistencia cremosa. 3. Servir inmediatamente.',
        prepTime: 5,
        cookTime: 0,
        servings: 1,
        calories: 450,
        protein: 30,
        carbs: 45,
        fat: 18
      }
    });

    // 10. Bol de yogur con granola y frutas
    await prisma.recipe.create({
      data: {
        name: 'Bol de yogur griego con granola y frutas',
        description: 'Desayuno completo con yogur griego, granola y frutas frescas',
        instructions: '1. Colocar el yogur griego en un bol. 2. Añadir la granola por encima. 3. Cortar las frutas (plátano, fresas, arándanos) y añadirlas. 4. Opcional: añadir una cucharada de miel o sirope de arce.',
        prepTime: 10,
        cookTime: 0,
        servings: 1,
        calories: 380,
        protein: 20,
        carbs: 50,
        fat: 12
      }
    });

    // 11. Hamburguesa de ternera con patatas al horno
    await prisma.recipe.create({
      data: {
        name: 'Hamburguesa de ternera con patatas al horno',
        description: 'Hamburguesa casera de ternera con patatas al horno y ensalada',
        instructions: '1. Preparar la carne picada con especias y formar la hamburguesa. 2. Cortar las patatas en gajos, sazonar con aceite, sal y hierbas. 3. Hornear las patatas a 200°C durante 25-30 minutos. 4. Cocinar la hamburguesa a la plancha. 5. Servir con ensalada de lechuga y tomate.',
        prepTime: 15,
        cookTime: 35,
        servings: 1,
        calories: 650,
        protein: 40,
        carbs: 60,
        fat: 28
      }
    });

    // 12. Burrito de pollo
    const burritoPollo = await prisma.recipe.create({
      data: {
        name: 'Burrito de pollo con frijoles y arroz',
        description: 'Burrito completo con pollo, frijoles, arroz y guacamole',
        instructions: '1. Cocinar el pollo con especias mexicanas. 2. Calentar los frijoles. 3. Preparar el arroz. 4. Calentar la tortilla de trigo. 5. Montar el burrito con todos los ingredientes, añadir guacamole y enrollar.',
        prepTime: 20,
        cookTime: 25,
        servings: 1,
        calories: 700,
        protein: 45,
        carbs: 80,
        fat: 25
      }
    });

    // Ingredientes para burrito de pollo
    const pollo = await findFoodByName('Pechuga de pollo');
    const arroz = await findFoodByName('Arroz');
    const aguacate = await findFoodByName('Aguacate');

    if (pollo) {
      await prisma.recipeItem.create({
        data: {
          recipeId: burritoPollo.id,
          foodId: pollo.id,
          quantity: 150,
          unit: 'g'
        }
      });
    }

    if (arroz) {
      await prisma.recipeItem.create({
        data: {
          recipeId: burritoPollo.id,
          foodId: arroz.id,
          quantity: 80,
          unit: 'g'
        }
      });
    }

    if (aguacate) {
      await prisma.recipeItem.create({
        data: {
          recipeId: burritoPollo.id,
          foodId: aguacate.id,
          quantity: 50,
          unit: 'g'
        }
      });
    }

    // Añadir tortilla de trigo si existe
    const tortilla = await findFoodByName('Pan');
    if (tortilla) {
      await prisma.recipeItem.create({
        data: {
          recipeId: burritoPollo.id,
          foodId: tortilla.id,
          quantity: 60,
          unit: 'g'
        }
      });
    }

    // 13. Risotto de champiñones
    await prisma.recipe.create({
      data: {
        name: 'Risotto de champiñones',
        description: 'Risotto cremoso con champiñones y queso parmesano',
        instructions: '1. Sofreír cebolla picada en aceite de oliva. 2. Añadir el arroz arborio y tostar ligeramente. 3. Añadir caldo caliente poco a poco, removiendo constantemente. 4. Saltear los champiñones por separado. 5. Cuando el arroz esté casi listo, añadir los champiñones y el queso parmesano. 6. Remover hasta que quede cremoso.',
        prepTime: 15,
        cookTime: 30,
        servings: 1,
        calories: 520,
        protein: 15,
        carbs: 70,
        fat: 20
      }
    });

    // 14. Poke bowl de salmón
    await prisma.recipe.create({
      data: {
        name: 'Poke bowl de salmón',
        description: 'Bowl hawaiano con salmón crudo, arroz y vegetales',
        instructions: '1. Cocinar el arroz y dejarlo enfriar. 2. Cortar el salmón fresco en cubos. 3. Preparar la salsa con soja, sésamo y lima. 4. Cortar los vegetales (pepino, aguacate, zanahoria). 5. Montar el bowl con el arroz como base, añadir el salmón, los vegetales y la salsa.',
        prepTime: 20,
        cookTime: 15,
        servings: 1,
        calories: 550,
        protein: 35,
        carbs: 60,
        fat: 22
      }
    });

    console.log(`✅ ${await prisma.recipe.count()} recetas en total`);

    console.log('🎉 Seed de recetas adicionales completado exitosamente!');
  } catch (error) {
    console.error('❌ Error durante el seed de recetas adicionales:', error);
    throw error;
  }
}

// Ejecutar el seed si este archivo se ejecuta directamente
if (require.main === module) {
  seedMoreRecipes()
    .then(() => {
      console.log('Seed de recetas adicionales ejecutado exitosamente');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Error ejecutando seed de recetas adicionales:', error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}