import { RecipeWithNutrition } from '@/app/services/nutritionServiceClient';
import Card from '../ui/Card';

interface RecipeDetailProps {
  recipe: RecipeWithNutrition;
  showNutrition?: boolean;
}

export default function RecipeDetail({ recipe, showNutrition = true }: RecipeDetailProps) {
  // Formatear las instrucciones si vienen como string
  const instructions = typeof recipe.instructions === 'string'
    ? recipe.instructions.split(/\d+\./).filter(step => step.trim().length > 0)
    : [];

  return (
    <Card className="w-full">
      <Card.Header>
        <h3 className="text-xl font-semibold text-gray-800">{recipe.name}</h3>
        {recipe.description && (
          <p className="text-sm text-gray-600 mt-1">{recipe.description}</p>
        )}
      </Card.Header>

      <Card.Content>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Columna izquierda: Ingredientes */}
          <div>
            <h4 className="font-medium text-green-600 mb-3">Ingredientes</h4>
            <ul className="space-y-2">
              {recipe.items.map((item, index) => (
                <li key={index} className="flex justify-between items-center">
                  <span className="text-gray-700">{item.food.name}</span>
                  <span className="text-gray-500 font-medium">
                    {item.quantity} {item.unit}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna derecha: Instrucciones */}
          <div>
            <h4 className="font-medium text-green-600 mb-3">Instrucciones</h4>
            {instructions.length > 0 ? (
              <ol className="list-decimal list-inside space-y-2">
                {instructions.map((step, index) => (
                  <li key={index} className="text-gray-700">{step.trim()}</li>
                ))}
              </ol>
            ) : (
              <p className="text-gray-500">No hay instrucciones disponibles.</p>
            )}
          </div>
        </div>

        {/* Tiempos de preparación */}
        <div className="flex justify-between mt-6 text-sm text-gray-600">
          <div>
            <span className="font-medium">Tiempo de preparación:</span> {recipe.prepTime || 0} min
          </div>
          <div>
            <span className="font-medium">Tiempo de cocción:</span> {recipe.cookTime || 0} min
          </div>
          <div>
            <span className="font-medium">Porciones:</span> {recipe.servings}
          </div>
        </div>
      </Card.Content>

      {/* Información nutricional */}
      {showNutrition && (
        <Card.Footer>
          <h4 className="font-medium text-green-600 mb-3">Información Nutricional (por porción)</h4>
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-green-50 p-3 rounded-md text-center">
              <p className="text-sm text-gray-500">Calorías</p>
              <p className="text-lg font-bold text-green-600">{Math.round(recipe.calories / recipe.servings)}</p>
              <p className="text-xs text-gray-500">kcal</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-md text-center">
              <p className="text-sm text-gray-500">Proteínas</p>
              <p className="text-lg font-bold text-blue-600">{Math.round(recipe.protein / recipe.servings)}</p>
              <p className="text-xs text-gray-500">g</p>
            </div>
            <div className="bg-yellow-50 p-3 rounded-md text-center">
              <p className="text-sm text-gray-500">Carbohidratos</p>
              <p className="text-lg font-bold text-yellow-600">{Math.round(recipe.carbs / recipe.servings)}</p>
              <p className="text-xs text-gray-500">g</p>
            </div>
            <div className="bg-red-50 p-3 rounded-md text-center">
              <p className="text-sm text-gray-500">Grasas</p>
              <p className="text-lg font-bold text-red-600">{Math.round(recipe.fat / recipe.servings)}</p>
              <p className="text-xs text-gray-500">g</p>
            </div>
          </div>
        </Card.Footer>
      )}
    </Card>
  );
}