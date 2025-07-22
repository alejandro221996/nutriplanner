import { prisma } from '../lib/prisma';

// Datos de alimentos básicos
const foods = [
  // Proteínas
  { name: 'Pechuga de pollo', calories: 165, protein: 31, carbs: 0, fat: 3.6, category: 'protein', commonPortionSize: 100, commonPortionUnit: 'g', alternativesIds: [], tags: [], isVegetarian: false, isVegan: false, isGlutenFree: true, isLactoseFree: true, isNutFree: true },
  { name: 'Salmón', calories: 208, protein: 20, carbs: 0, fat: 13, category: 'protein', commonPortionSize: 100, commonPortionUnit: 'g', alternativesIds: [], tags: [], isVegetarian: false, isVegan: false, isGlutenFree: true, isLactoseFree: true, isNutFree: true },
  { name: 'Atún en agua', calories: 132, protein: 28, carbs: 0, fat: 1.3, category: 'protein', commonPortionSize: 100, commonPortionUnit: 'g', alternativesIds: [], tags: [], isVegetarian: false, isVegan: false, isGlutenFree: true, isLactoseFree: true, isNutFree: true },
  { name: 'Huevos', calories: 155, protein: 13, carbs: 1.1, fat: 11, category: 'protein', commonPortionSize: 100, commonPortionUnit: 'g', alternativesIds: [], tags: [], isVegetarian: true, isVegan: false, isGlutenFree: true, isLactoseFree: true, isNutFree: true },
  { name: 'Tofu', calories: 76, protein: 8, carbs: 1.9, fat: 4.8, category: 'protein', commonPortionSize: 100, commonPortionUnit: 'g', alternativesIds: [], tags: [], isVegetarian: true, isVegan: true, isGlutenFree: true, isLactoseFree: true, isNutFree: true },

  // Carbohidratos
  { name: 'Arroz integral', calories: 111, protein: 2.6, carbs: 23, fat: 0.9, category: 'carb', commonPortionSize: 100, commonPortionUnit: 'g', alternativesIds: [], tags: [], isVegetarian: true, isVegan: true, isGlutenFree: true, isLactoseFree: true, isNutFree: true },
  { name: 'Pasta integral', calories: 124, protein: 5, carbs: 25, fat: 1.1, category: 'carb', commonPortionSize: 100, commonPortionUnit: 'g', alternativesIds: [], tags: [], isVegetarian: true, isVegan: true, isGlutenFree: false, isLactoseFree: true, isNutFree: true },
  { name: 'Avena', calories: 389, protein: 16.9, carbs: 66.3, fat: 6.9, category: 'carb', commonPortionSize: 100, commonPortionUnit: 'g', alternativesIds: [], tags: [], isVegetarian: true, isVegan: true, isGlutenFree: true, isLactoseFree: true, isNutFree: true },
  { name: 'Quinoa', calories: 120, protein: 4.4, carbs: 22, fat: 1.9, category: 'carb', commonPortionSize: 100, commonPortionUnit: 'g', alternativesIds: [], tags: [], isVegetarian: true, isVegan: true, isGlutenFree: true, isLactoseFree: true, isNutFree: true },
  { name: 'Pan integral', calories: 247, protein: 13, carbs: 41, fat: 4.2, category: 'carb', commonPortionSize: 100, commonPortionUnit: 'g', alternativesIds: [], tags: [], isVegetarian: true, isVegan: true, isGlutenFree: false, isLactoseFree: true, isNutFree: true },

  // Verduras
  { name: 'Brócoli', calories: 34, protein: 2.8, carbs: 7, fat: 0.4, category: 'vegetable', commonPortionSize: 100, commonPortionUnit: 'g', alternativesIds: [], tags: [], isVegetarian: true, isVegan: true, isGlutenFree: true, isLactoseFree: true, isNutFree: true },
  { name: 'Espinacas', calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, category: 'vegetable', commonPortionSize: 100, commonPortionUnit: 'g', alternativesIds: [], tags: [], isVegetarian: true, isVegan: true, isGlutenFree: true, isLactoseFree: true, isNutFree: true },
  { name: 'Lechuga', calories: 15, protein: 1.4, carbs: 2.9, fat: 0.2, category: 'vegetable', commonPortionSize: 100, commonPortionUnit: 'g', alternativesIds: [], tags: [], isVegetarian: true, isVegan: true, isGlutenFree: true, isLactoseFree: true, isNutFree: true },
  { name: 'Tomate', calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, category: 'vegetable', commonPortionSize: 100, commonPortionUnit: 'g', alternativesIds: [], tags: [], isVegetarian: true, isVegan: true, isGlutenFree: true, isLactoseFree: true, isNutFree: true },
  { name: 'Zanahoria', calories: 41, protein: 0.9, carbs: 10, fat: 0.2, category: 'vegetable', commonPortionSize: 100, commonPortionUnit: 'g', alternativesIds: [], tags: [], isVegetarian: true, isVegan: true, isGlutenFree: true, isLactoseFree: true, isNutFree: true },

  // Frutas
  { name: 'Manzana', calories: 52, protein: 0.3, carbs: 14, fat: 0.2, category: 'fruit', commonPortionSize: 100, commonPortionUnit: 'g', alternativesIds: [], tags: [], isVegetarian: true, isVegan: true, isGlutenFree: true, isLactoseFree: true, isNutFree: true },
  { name: 'Plátano', calories: 89, protein: 1.1, carbs: 23, fat: 0.3, category: 'fruit', commonPortionSize: 100, commonPortionUnit: 'g', alternativesIds: [], tags: [], isVegetarian: true, isVegan: true, isGlutenFree: true, isLactoseFree: true, isNutFree: true },
  { name: 'Naranja', calories: 47, protein: 0.9, carbs: 12, fat: 0.1, category: 'fruit', commonPortionSize: 100, commonPortionUnit: 'g', alternativesIds: [], tags: [], isVegetarian: true, isVegan: true, isGlutenFree: true, isLactoseFree: true, isNutFree: true },
  { name: 'Fresas', calories: 32, protein: 0.7, carbs: 7.7, fat: 0.3, category: 'fruit', commonPortionSize: 100, commonPortionUnit: 'g', alternativesIds: [], tags: [], isVegetarian: true, isVegan: true, isGlutenFree: true, isLactoseFree: true, isNutFree: true },

  // Lácteos
  { name: 'Leche descremada', calories: 34, protein: 3.4, carbs: 5, fat: 0.1, category: 'dairy', commonPortionSize: 100, commonPortionUnit: 'ml', alternativesIds: [], tags: [], isVegetarian: true, isVegan: false, isGlutenFree: true, isLactoseFree: false, isNutFree: true },
  { name: 'Yogur griego', calories: 59, protein: 10, carbs: 3.6, fat: 0.4, category: 'dairy', commonPortionSize: 100, commonPortionUnit: 'g', alternativesIds: [], tags: [], isVegetarian: true, isVegan: false, isGlutenFree: true, isLactoseFree: false, isNutFree: true },
  { name: 'Queso cottage', calories: 98, protein: 11, carbs: 3.4, fat: 4.3, category: 'dairy', commonPortionSize: 100, commonPortionUnit: 'g', alternativesIds: [], tags: [], isVegetarian: true, isVegan: false, isGlutenFree: true, isLactoseFree: false, isNutFree: true },

  // Grasas saludables
  { name: 'Aguacate', calories: 160, protein: 2, carbs: 9, fat: 15, category: 'fat', commonPortionSize: 100, commonPortionUnit: 'g', alternativesIds: [], tags: [], isVegetarian: true, isVegan: true, isGlutenFree: true, isLactoseFree: true, isNutFree: true },
  { name: 'Almendras', calories: 579, protein: 21, carbs: 22, fat: 50, category: 'fat', commonPortionSize: 100, commonPortionUnit: 'g', alternativesIds: [], tags: [], isVegetarian: true, isVegan: true, isGlutenFree: true, isLactoseFree: true, isNutFree: false },
  { name: 'Aceite de oliva', calories: 884, protein: 0, carbs: 0, fat: 100, category: 'fat', commonPortionSize: 100, commonPortionUnit: 'ml', alternativesIds: [], tags: [], isVegetarian: true, isVegan: true, isGlutenFree: true, isLactoseFree: true, isNutFree: true },
];

// Recetas básicas
const recipes = [
  {
    name: 'Ensalada de pollo a la parrilla',
    description: 'Ensalada fresca con pechuga de pollo a la parrilla, perfecta para almorzar',
    instructions: '1. Cocinar la pechuga de pollo a la parrilla. 2. Mezclar lechuga, tomate y zanahoria. 3. Agregar el pollo cortado en tiras. 4. Aliñar con aceite de oliva.',
    prepTime: 15,
    cookTime: 10,
    servings: 1,
    calories: 320,
    protein: 35,
    carbs: 12,
    fat: 15,
    items: [
      { foodName: 'Pechuga de pollo', quantity: 120, unit: 'g' },
      { foodName: 'Lechuga', quantity: 100, unit: 'g' },
      { foodName: 'Tomate', quantity: 80, unit: 'g' },
      { foodName: 'Zanahoria', quantity: 50, unit: 'g' },
      { foodName: 'Aceite de oliva', quantity: 10, unit: 'ml' },
    ]
  },
  {
    name: 'Salmón con quinoa y brócoli',
    description: 'Plato completo y nutritivo con salmón, quinoa y verduras',
    instructions: '1. Cocinar el salmón al horno. 2. Preparar la quinoa según instrucciones del paquete. 3. Cocinar el brócoli al vapor. 4. Servir todo junto.',
    prepTime: 10,
    cookTime: 25,
    servings: 1,
    calories: 450,
    protein: 32,
    carbs: 35,
    fat: 18,
    items: [
      { foodName: 'Salmón', quantity: 120, unit: 'g' },
      { foodName: 'Quinoa', quantity: 80, unit: 'g' },
      { foodName: 'Brócoli', quantity: 150, unit: 'g' },
      { foodName: 'Aceite de oliva', quantity: 5, unit: 'ml' },
    ]
  },
  {
    name: 'Batido de proteínas con avena',
    description: 'Batido nutritivo perfecto para el desayuno o post-entrenamiento',
    instructions: '1. Mezclar todos los ingredientes en la licuadora. 2. Licuar hasta obtener consistencia cremosa. 3. Servir inmediatamente.',
    prepTime: 5,
    cookTime: 0,
    servings: 1,
    calories: 280,
    protein: 18,
    carbs: 35,
    fat: 8,
    items: [
      { foodName: 'Avena', quantity: 40, unit: 'g' },
      { foodName: 'Leche descremada', quantity: 250, unit: 'ml' },
      { foodName: 'Plátano', quantity: 100, unit: 'g' },
      { foodName: 'Fresas', quantity: 80, unit: 'g' },
    ]
  },
  {
    name: 'Pasta integral con pollo y verduras',
    description: 'Pasta integral con pechuga de pollo y verduras salteadas',
    instructions: '1. Cocinar la pasta según instrucciones. 2. Saltear el pollo cortado en cubos. 3. Agregar las verduras y cocinar. 4. Mezclar con la pasta.',
    prepTime: 15,
    cookTime: 20,
    servings: 1,
    calories: 520,
    protein: 38,
    carbs: 55,
    fat: 12,
    items: [
      { foodName: 'Pasta integral', quantity: 80, unit: 'g' },
      { foodName: 'Pechuga de pollo', quantity: 120, unit: 'g' },
      { foodName: 'Brócoli', quantity: 100, unit: 'g' },
      { foodName: 'Tomate', quantity: 100, unit: 'g' },
      { foodName: 'Aceite de oliva', quantity: 10, unit: 'ml' },
    ]
  },
  {
    name: 'Tostadas de aguacate con huevo',
    description: 'Desayuno saludable con pan integral, aguacate y huevo',
    instructions: '1. Tostar el pan integral. 2. Machacar el aguacate y extender sobre el pan. 3. Cocinar el huevo como prefieras. 4. Servir el huevo sobre las tostadas.',
    prepTime: 10,
    cookTime: 5,
    servings: 1,
    calories: 380,
    protein: 16,
    carbs: 28,
    fat: 24,
    items: [
      { foodName: 'Pan integral', quantity: 60, unit: 'g' },
      { foodName: 'Aguacate', quantity: 80, unit: 'g' },
      { foodName: 'Huevos', quantity: 60, unit: 'g' },
      { foodName: 'Tomate', quantity: 50, unit: 'g' },
    ]
  },
  {
    name: 'Bowl de yogur con frutas y almendras',
    description: 'Desayuno o merienda saludable con yogur griego y frutas',
    instructions: '1. Servir el yogur en un bowl. 2. Agregar las frutas cortadas. 3. Espolvorear con almendras picadas. 4. Disfrutar inmediatamente.',
    prepTime: 5,
    cookTime: 0,
    servings: 1,
    calories: 250,
    protein: 15,
    carbs: 25,
    fat: 12,
    items: [
      { foodName: 'Yogur griego', quantity: 150, unit: 'g' },
      { foodName: 'Fresas', quantity: 100, unit: 'g' },
      { foodName: 'Plátano', quantity: 80, unit: 'g' },
      { foodName: 'Almendras', quantity: 20, unit: 'g' },
    ]
  }
];

export async function seedDatabase() {
  try {
    console.log('🌱 Iniciando seed de la base de datos...');

    // Crear códigos de invitación
    console.log('🎫 Creando códigos de invitación...');
    const invitationCodes = [
      { code: 'NUTRI2024', maxUses: 100, currentUses: 0 },
      { code: 'HEALTH123', maxUses: 50, currentUses: 0 },
      { code: 'PLANNER2024', maxUses: 25, currentUses: 0 },
      { code: 'BETA2024', maxUses: 10, currentUses: 0 },
      { code: 'WELCOME', maxUses: 1000, currentUses: 0 },
    ];

    for (const invCode of invitationCodes) {
      await prisma.invitationCode.upsert({
        where: { code: invCode.code },
        update: {},
        create: invCode
      });
    }
    console.log(`✅ ${invitationCodes.length} códigos de invitación creados`);

    // Limpiar datos existentes (opcional)
    console.log('🧹 Limpiando datos existentes...');
    await prisma.recipeItem.deleteMany();
    await prisma.recipe.deleteMany();
    await prisma.food.deleteMany();

    // Crear alimentos
    console.log('🥗 Creando alimentos...');
    const createdFoods = await Promise.all(
      foods.map(food =>
        prisma.food.create({
          data: food
        })
      )
    );
    console.log(`✅ ${createdFoods.length} alimentos creados`);

    // Crear recetas con sus ingredientes
    console.log('🍳 Creando recetas...');
    for (const recipe of recipes) {
      const { items, ...recipeData } = recipe;

      const createdRecipe = await prisma.recipe.create({
        data: recipeData
      });

      // Crear los ingredientes de la receta
      for (const item of items) {
        const food = createdFoods.find(f => f.name === item.foodName);
        if (food) {
          await prisma.recipeItem.create({
            data: {
              recipeId: createdRecipe.id,
              foodId: food.id,
              quantity: item.quantity,
              unit: item.unit
            }
          });
        }
      }
    }
    console.log(`✅ ${recipes.length} recetas creadas`);

    console.log('🎉 Seed completado exitosamente!');
  } catch (error) {
    console.error('❌ Error durante el seed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el seed si este archivo se ejecuta directamente
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('Seed ejecutado exitosamente');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Error ejecutando seed:', error);
      process.exit(1);
    });
}