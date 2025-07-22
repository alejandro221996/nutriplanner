import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Menu, MenuItem, ShoppingList, ShoppingListItem } from '../types';

// Función para obtener el nombre del tipo de comida
const getMealTypeLabel = (mealType: string): string => {
  switch (mealType) {
    case 'breakfast': return 'Desayuno';
    case 'lunch': return 'Almuerzo';
    case 'dinner': return 'Cena';
    case 'snack': return 'Merienda';
    default: return mealType;
  }
};

// Función para obtener el nombre del día
const getDayLabel = (day: number): string => {
  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  return days[day - 1] || `Día ${day}`;
};

// Exportar menú a PDF
export const exportMenuToPDF = (menu: Menu): void => {
  const doc = new jsPDF();

  // Título
  doc.setFontSize(20);
  doc.text(`Menú: ${menu.name}`, 14, 22);

  // Descripción
  if (menu.description) {
    doc.setFontSize(12);
    doc.text(`${menu.description}`, 14, 32);
  }

  // Tipo de menú
  doc.setFontSize(14);
  doc.text(`Tipo: ${menu.type === 'daily' ? 'Diario' : 'Semanal'}`, 14, 42);

  let yPosition = 52;

  if (menu.type === 'daily') {
    // Agrupar por tipo de comida
    const mealsByType: Record<string, MenuItem[]> = {};
    menu.items.forEach(item => {
      if (!mealsByType[item.mealType]) mealsByType[item.mealType] = [];
      mealsByType[item.mealType].push(item);
    });

    // Mostrar cada tipo de comida
    Object.entries(mealsByType).forEach(([mealType, items]) => {
      doc.setFontSize(16);
      doc.text(getMealTypeLabel(mealType), 14, yPosition);
      yPosition += 10;

      items.forEach(item => {
        const name = item.recipe?.name || 'Sin nombre';
        const calories = item.recipe?.calories || 0;
        const protein = item.recipe?.protein || 0;
        const carbs = item.recipe?.carbs || 0;
        const fat = item.recipe?.fat || 0;

        doc.setFontSize(12);
        doc.text(`• ${name}`, 20, yPosition);
        yPosition += 6;

        doc.setFontSize(10);
        doc.text(`${calories} kcal | Proteínas: ${protein}g | Carbos: ${carbs}g | Grasas: ${fat}g`, 25, yPosition);
        yPosition += 10;

        // Si hay descripción
        if (item.recipe?.description) {
          doc.setFontSize(10);
          doc.text(`${item.recipe.description}`, 25, yPosition);
          yPosition += 10;
        }

        // Verificar si necesitamos una nueva página
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }
      });

      yPosition += 5;
    });
  } else {
    // Menú semanal - agrupar por día
    const itemsByDay: Record<number, MenuItem[]> = {};
    menu.items.forEach(item => {
      const day = item.dayOfWeek || 1;
      if (!itemsByDay[day]) itemsByDay[day] = [];
      itemsByDay[day].push(item);
    });

    // Mostrar cada día
    Object.entries(itemsByDay).forEach(([day, items]) => {
      const dayNumber = parseInt(day);

      doc.setFontSize(16);
      doc.text(getDayLabel(dayNumber), 14, yPosition);
      yPosition += 10;

      // Agrupar por tipo de comida dentro del día
      const mealsByType: Record<string, MenuItem[]> = {};
      items.forEach(item => {
        if (!mealsByType[item.mealType]) mealsByType[item.mealType] = [];
        mealsByType[item.mealType].push(item);
      });

      // Mostrar cada tipo de comida
      Object.entries(mealsByType).forEach(([mealType, mealItems]) => {
        doc.setFontSize(14);
        doc.text(getMealTypeLabel(mealType), 20, yPosition);
        yPosition += 8;

        mealItems.forEach(item => {
          const name = item.recipe?.name || 'Sin nombre';
          const calories = item.recipe?.calories || 0;
          const protein = item.recipe?.protein || 0;
          const carbs = item.recipe?.carbs || 0;
          const fat = item.recipe?.fat || 0;

          doc.setFontSize(12);
          doc.text(`• ${name}`, 25, yPosition);
          yPosition += 6;

          doc.setFontSize(10);
          doc.text(`${calories} kcal | Proteínas: ${protein}g | Carbos: ${carbs}g | Grasas: ${fat}g`, 30, yPosition);
          yPosition += 10;

          // Si hay descripción
          if (item.recipe?.description) {
            doc.setFontSize(10);
            doc.text(`${item.recipe.description}`, 30, yPosition);
            yPosition += 10;
          }
        });

        yPosition += 5;
      });

      yPosition += 10;

      // Verificar si necesitamos una nueva página
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
    });
  }

  // Pie de página
  const date = new Date().toLocaleDateString();
  doc.setFontSize(10);
  doc.text(`Generado por NutriPlaner el ${date}`, 14, 285);

  // Guardar el PDF
  doc.save(`menu-${menu.name.replace(/\s+/g, '-').toLowerCase()}.pdf`);
};

// Exportar lista de compras a PDF
export const exportShoppingListToPDF = (shoppingList: ShoppingList, menuName: string): void => {
  const doc = new jsPDF();

  // Título
  doc.setFontSize(20);
  doc.text('Lista de Compras', 14, 22);

  // Menú asociado
  doc.setFontSize(14);
  doc.text(`Para el menú: ${menuName}`, 14, 32);

  // Fecha
  const date = new Date().toLocaleDateString();
  doc.setFontSize(12);
  doc.text(`Generado el: ${date}`, 14, 42);

  // Agrupar items por categorías (simuladas)
  const categories = {
    'Frutas y Verduras': ['lechuga', 'tomate', 'manzana', 'plátano', 'zanahoria'],
    'Carnes y Pescados': ['pollo', 'carne', 'pescado', 'atún', 'salmón'],
    'Lácteos': ['leche', 'queso', 'yogur'],
    'Cereales y Pasta': ['arroz', 'pasta', 'avena', 'pan'],
    'Otros': [],
  };

  const itemsByCategory: Record<string, ShoppingListItem[]> = {};

  // Clasificar items por categoría
  shoppingList.items.forEach(item => {
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

  let yPosition = 55;

  // Mostrar cada categoría
  Object.entries(itemsByCategory).forEach(([category, items]) => {
    if (items.length === 0) return;

    doc.setFontSize(16);
    doc.text(category, 14, yPosition);
    yPosition += 10;

    // Crear tabla para esta categoría
    const tableData = items.map(item => [
      item.name,
      `${item.quantity} ${item.unit}`,
      item.purchased ? '✓' : '□'
    ]);

    autoTable(doc, {
      startY: yPosition,
      head: [['Producto', 'Cantidad', 'Comprado']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [76, 175, 80] },
      margin: { left: 14 }
    });

    yPosition = (doc as any).lastAutoTable.finalY + 15;

    // Verificar si necesitamos una nueva página
    if (yPosition > 270) {
      doc.addPage();
      yPosition = 20;
    }
  });

  // Estadísticas
  const totalItems = shoppingList.items.length;
  const purchasedItems = shoppingList.items.filter(item => item.purchased).length;
  const progress = Math.round((purchasedItems / totalItems) * 100) || 0;

  doc.setFontSize(14);
  doc.text('Resumen:', 14, yPosition);
  yPosition += 8;

  doc.setFontSize(12);
  doc.text(`Total de productos: ${totalItems}`, 20, yPosition);
  yPosition += 6;

  doc.text(`Productos comprados: ${purchasedItems} (${progress}%)`, 20, yPosition);

  // Guardar el PDF
  doc.save(`lista-compras-${menuName.replace(/\s+/g, '-').toLowerCase()}.pdf`);
};

// Exportar elemento HTML a PDF (para componentes complejos)
export const exportElementToPDF = async (element: HTMLElement, fileName: string): Promise<void> => {
  const canvas = await html2canvas(element, {
    scale: 2,
    logging: false,
    useCORS: true
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const imgProps = pdf.getImageProperties(imgData);
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

  pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
  pdf.save(fileName);
};