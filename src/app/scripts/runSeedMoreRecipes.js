// Script para ejecutar el seed de recetas adicionales
const { execSync } = require('child_process');

try {
  console.log('Ejecutando seed de recetas adicionales...');
  execSync('npx ts-node --project tsconfig.json -r tsconfig-paths/register src/app/scripts/seedMoreRecipes.ts', { stdio: 'inherit' });
  console.log('Seed ejecutado correctamente');
} catch (error) {
  console.error('Error ejecutando el seed:', error);
  process.exit(1);
}