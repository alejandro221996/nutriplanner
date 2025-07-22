import { prisma } from '../lib/prisma';
import { createTestUsers } from './createTestUsers';
import { seedDatabase } from './seedDatabase';
import { seedFoods } from './seedFoods';
import { seedRecipes } from './seedMeals';
import { seedMoreRecipes } from './seedMoreRecipes';

async function seedAll() {
  try {
    console.log('🌱 Iniciando seed completo de la base de datos...');

    // Ejecutar seed de códigos de invitación
    await seedDatabase();

    // Ejecutar seed de alimentos
    const foods = await seedFoods();
    console.log(`✅ ${foods.length} alimentos creados`);

    // Ejecutar seed de recetas
    await seedRecipes();
    console.log(`✅ Recetas básicas creadas`);

    // Ejecutar seed de recetas adicionales
    await seedMoreRecipes();
    console.log(`✅ Recetas adicionales creadas`);

    // Crear usuarios de prueba
    await createTestUsers();

    console.log('✅ Seed completo finalizado exitosamente!');
  } catch (error) {
    console.error('❌ Error durante el seed completo:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el seed si este archivo se ejecuta directamente
if (require.main === module) {
  seedAll()
    .then(() => {
      console.log('Seed completo ejecutado exitosamente');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Error ejecutando seed completo:', error);
      process.exit(1);
    });
}