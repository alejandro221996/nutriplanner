'use client';

import { useState, useEffect } from 'react';
import { getInvitationCodeStats } from '../services/invitationService';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

export default function InvitationCodes() {
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    expired: 0,
    exhausted: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const invitationStats = await getInvitationCodeStats();
        setStats(invitationStats);
      } catch (error) {
        console.error('Error fetching invitation stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const availableCodes = [
    {
      code: 'NUTRI2024',
      description: 'Código general para nuevos usuarios',
      maxUses: 100,
      status: 'Activo'
    },
    {
      code: 'HEALTH123',
      description: 'Código para entusiastas de la salud',
      maxUses: 50,
      status: 'Activo'
    },
    {
      code: 'PLANNER2024',
      description: 'Código para planificadores de comidas',
      maxUses: 25,
      status: 'Activo'
    },
    {
      code: 'BETA2024',
      description: 'Código exclusivo para beta testers',
      maxUses: 10,
      status: 'Activo'
    },
    {
      code: 'WELCOME',
      description: 'Código de bienvenida para todos',
      maxUses: 1000,
      status: 'Activo'
    }
  ];

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    // Aquí podrías agregar una notificación de que se copió
    alert(`Código ${code} copiado al portapapeles`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Cargando estadísticas...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Códigos de Invitación
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          NutriPlaner utiliza códigos de invitación para controlar el acceso a la plataforma. 
          Usa uno de los códigos disponibles para crear tu cuenta.
        </p>
      </div>

      {/* Estadísticas */}
      <Card>
        <Card.Header>
          <h2 className="text-xl font-semibold text-gray-800">Estadísticas de Códigos</h2>
        </Card.Header>
        <Card.Content>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-md text-center">
              <p className="text-sm text-gray-500">Total</p>
              <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-md text-center">
              <p className="text-sm text-gray-500">Activos</p>
              <p className="text-2xl font-bold text-green-600">{stats.active}</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-md text-center">
              <p className="text-sm text-gray-500">Agotados</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.exhausted}</p>
            </div>
            <div className="bg-red-50 p-4 rounded-md text-center">
              <p className="text-sm text-gray-500">Expirados</p>
              <p className="text-2xl font-bold text-red-600">{stats.expired}</p>
            </div>
          </div>
        </Card.Content>
      </Card>

      {/* Códigos Disponibles */}
      <Card>
        <Card.Header>
          <h2 className="text-xl font-semibold text-gray-800">Códigos Disponibles</h2>
          <p className="text-sm text-gray-500 mt-1">
            Haz clic en cualquier código para copiarlo al portapapeles
          </p>
        </Card.Header>
        <Card.Content>
          <div className="space-y-4">
            {availableCodes.map((codeInfo, index) => (
              <div 
                key={index}
                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <code 
                        className="bg-gray-100 px-3 py-1 rounded font-mono text-lg cursor-pointer hover:bg-gray-200 transition-colors"
                        onClick={() => copyToClipboard(codeInfo.code)}
                        title="Haz clic para copiar"
                      >
                        {codeInfo.code}
                      </code>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        codeInfo.status === 'Activo' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {codeInfo.status}
                      </span>
                    </div>
                    <p className="text-gray-600 mt-2">{codeInfo.description}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Máximo de usos: {codeInfo.maxUses}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(codeInfo.code)}
                  >
                    Copiar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card.Content>
      </Card>

      {/* Instrucciones */}
      <Card>
        <Card.Header>
          <h2 className="text-xl font-semibold text-gray-800">Cómo usar un código</h2>
        </Card.Header>
        <Card.Content>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="bg-green-100 text-green-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">1</div>
              <div>
                <h3 className="font-medium">Copia un código</h3>
                <p className="text-gray-600 text-sm">Selecciona y copia uno de los códigos disponibles arriba.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-green-100 text-green-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">2</div>
              <div>
                <h3 className="font-medium">Ve a la página de registro</h3>
                <p className="text-gray-600 text-sm">Dirígete a la página de registro de NutriPlaner.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-green-100 text-green-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">3</div>
              <div>
                <h3 className="font-medium">Pega y valida el código</h3>
                <p className="text-gray-600 text-sm">Pega el código en el campo correspondiente y haz clic en "Validar".</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-green-100 text-green-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">4</div>
              <div>
                <h3 className="font-medium">Completa tu registro</h3>
                <p className="text-gray-600 text-sm">Una vez validado el código, completa el resto del formulario de registro.</p>
              </div>
            </div>
          </div>
        </Card.Content>
      </Card>
    </div>
  );
}