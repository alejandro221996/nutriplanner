'use client';

import { useState } from 'react';
import { useMenu } from '@/app/contexts/MenuContext';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { exportShoppingListToPDF } from '@/app/services/pdfService';
import { ShoppingListItem } from '@/app/types';

export default function ShoppingList() {
  const { shoppingList, updateShoppingListItem, currentMenu, favoriteMenus } = useMenu();
  const [filter, setFilter] = useState<'all' | 'pending' | 'purchased'>('all');

  if (!shoppingList) {
    return (
      <Card>
        <Card.Content className="text-center py-8">
          <p className="text-gray-500">No hay lista de compras disponible.</p>
          <p className="text-gray-500 mt-2">Genera una lista desde un menú.</p>
        </Card.Content>
      </Card>
    );
  }

  const handleToggleItem = (itemId: string, purchased: boolean) => {
    updateShoppingListItem(itemId, purchased);
  };

  const filteredItems = shoppingList.items.filter(item => {
    if (filter === 'all') return true;
    if (filter === 'pending') return !item.purchased;
    if (filter === 'purchased') return item.purchased;
    return true;
  });

  // Agrupar por categorías (simuladas)
  const categories = {
    'Frutas y Verduras': ['lechuga', 'tomate', 'manzana', 'plátano', 'zanahoria'],
    'Carnes y Pescados': ['pollo', 'carne', 'pescado', 'atún', 'salmón'],
    'Lácteos': ['leche', 'queso', 'yogur'],
    'Cereales y Pasta': ['arroz', 'pasta', 'avena', 'pan'],
    'Otros': [],
  };

  const itemsByCategory: Record<string, ShoppingListItem[]> = {};
  
  // Clasificar items por categoría
  filteredItems.forEach(item => {
    let assigned = false;
    
    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some(keyword => item.name.toLowerCase().includes(keyword.toLowerCase()))) {
        if (!itemsByCategory[category]) itemsByCategory[category] = [];
        itemsByCategory[category].push(item);
        assigned = true;
        break;
      }
    }
    
    if (!assigned) {
      if (!itemsByCategory['Otros']) itemsByCategory['Otros'] = [];
      itemsByCategory['Otros'].push(item);
    }
  });

  const completedCount = shoppingList.items.filter(item => item.purchased).length;
  const progress = Math.round((completedCount / shoppingList.items.length) * 100) || 0;

  const handleExportToPDF = () => {
    // Encontrar el menú asociado
    const associatedMenu = currentMenu && currentMenu.id === shoppingList.menuId 
      ? currentMenu 
      : favoriteMenus.find(menu => menu.id === shoppingList.menuId);
    
    const menuName = associatedMenu?.name || 'Menú Desconocido';
    exportShoppingListToPDF(shoppingList, menuName);
  };

  return (
    <Card>
      <Card.Header>
        <h2 className="text-xl font-semibold text-gray-800">Lista de Compras</h2>
        <div className="mt-2">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-green-600 h-2.5 rounded-full" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {completedCount} de {shoppingList.items.length} items comprados ({progress}%)
          </p>
        </div>
      </Card.Header>
      
      <div className="px-6 py-3 border-b border-gray-200 bg-gray-50">
        <div className="flex space-x-2">
          <Button 
            variant={filter === 'all' ? 'primary' : 'outline'} 
            size="sm"
            onClick={() => setFilter('all')}
          >
            Todos
          </Button>
          <Button 
            variant={filter === 'pending' ? 'primary' : 'outline'} 
            size="sm"
            onClick={() => setFilter('pending')}
          >
            Pendientes
          </Button>
          <Button 
            variant={filter === 'purchased' ? 'primary' : 'outline'} 
            size="sm"
            onClick={() => setFilter('purchased')}
          >
            Comprados
          </Button>
        </div>
      </div>
      
      <Card.Content>
        {Object.entries(itemsByCategory).map(([category, items]) => {
          if (items.length === 0) return null;
          
          return (
            <div key={category} className="mb-6 last:mb-0">
              <h3 className="font-medium text-gray-800 mb-3">{category}</h3>
              <ul className="space-y-2">
                {items.map(item => (
                  <li 
                    key={item.id} 
                    className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50"
                  >
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={item.purchased}
                        onChange={() => handleToggleItem(item.id, !item.purchased)}
                        className="h-5 w-5 text-green-600 rounded focus:ring-green-500"
                      />
                      <span 
                        className={`ml-3 ${item.purchased ? 'line-through text-gray-400' : 'text-gray-700'}`}
                      >
                        {item.name}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {item.quantity} {item.unit}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
        
        {filteredItems.length === 0 && (
          <div className="text-center py-6">
            <p className="text-gray-500">No hay items en esta categoría.</p>
          </div>
        )}
      </Card.Content>
      
      <Card.Footer className="flex justify-between">
        <Button variant="outline">
          Compartir Lista
        </Button>
        <Button onClick={handleExportToPDF}>
          Exportar PDF
        </Button>
      </Card.Footer>
    </Card>
  );
}