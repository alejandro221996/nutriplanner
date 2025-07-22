import { useEffect, useState } from 'react';

interface RecipeIngredientsProps {
  recipeId: string;
}

interface RecipeIngredient {
  id: string;
  foodId: string;
  food: {
    id: string;
    name: string;
    commonPortionUnit: string;
  };
  quantity: number;
  unit: string;
}

export default function RecipeIngredients({ recipeId }: RecipeIngredientsProps) {
  const [ingredients, setIngredients] = useState<RecipeIngredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const response = await fetch(`/api/recipes/${recipeId}/ingredients`);
        if (!response.ok) {
          throw new Error('Error al obtener ingredientes');
        }
        const data = await response.json();
        setIngredients(data);
      } catch (err) {
        console.error('Error fetching ingredients:', err);
        setError('No se pudieron cargar los ingredientes');
      } finally {
        setLoading(false);
      }
    };

    if (recipeId) {
      fetchIngredients();
    }
  }, [recipeId]);

  if (loading) {
    return <p className="text-xs text-gray-500">Cargando ingredientes...</p>;
  }

  if (error) {
    return <p className="text-xs text-red-500">{error}</p>;
  }

  if (ingredients.length === 0) {
    return <p className="text-xs text-gray-500">No hay ingredientes disponibles</p>;
  }

  return (
    <div className="mt-2">
      <p className="text-xs font-medium text-green-600">Ingredientes:</p>
      <ul className="text-xs text-gray-600 mt-1 space-y-1">
        {ingredients.map((ingredient) => (
          <li key={ingredient.id} className="flex justify-between">
            <span>{ingredient.food.name}</span>
            <span className="font-medium">{ingredient.quantity} {ingredient.unit || ingredient.food.commonPortionUnit}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}