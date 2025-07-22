'use client';

import { useAuth } from './contexts/AuthContext';
import Link from 'next/link';
import Button from './components/ui/Button';
import Card from './components/ui/Card';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Planifica tu alimentación de forma inteligente
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          NutriPlaner te ayuda a crear menús personalizados según tus objetivos nutricionales, 
          preferencias y restricciones alimentarias.
        </p>
        {!user ? (
          <div className="space-y-4">
            <div className="flex justify-center space-x-4">
              <Link href="/register">
                <Button size="lg">
                  Comenzar Gratis
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg">
                  Iniciar Sesión
                </Button>
              </Link>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-2">
                ¿Necesitas un código de invitación?
              </p>
              <Link href="/invitation-codes" className="text-green-600 hover:text-green-700 text-sm font-medium">
                Ver códigos disponibles
              </Link>
            </div>
          </div>
        ) : (
          <Link href="/dashboard">
            <Button size="lg">
              Ir a mi Dashboard
            </Button>
          </Link>
        )}
      </section>

      {/* Features Section */}
      <section>
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
          Características Principales
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <Card.Content className="text-center py-6">
              <div className="text-green-600 text-4xl mb-4">🔥</div>
              <h3 className="text-xl font-semibold mb-2">Cálculo Nutricional</h3>
              <p className="text-gray-600">
                Cálculo automático de calorías y macronutrientes según tu perfil y objetivos.
              </p>
            </Card.Content>
          </Card>
          
          <Card>
            <Card.Content className="text-center py-6">
              <div className="text-green-600 text-4xl mb-4">🧠</div>
              <h3 className="text-xl font-semibold mb-2">Menús Personalizados</h3>
              <p className="text-gray-600">
                Generación inteligente de menús adaptados a tus necesidades y preferencias.
              </p>
            </Card.Content>
          </Card>
          
          <Card>
            <Card.Content className="text-center py-6">
              <div className="text-green-600 text-4xl mb-4">🛒</div>
              <h3 className="text-xl font-semibold mb-2">Lista de Compras</h3>
              <p className="text-gray-600">
                Creación automática de listas de compras basadas en tus menús semanales.
              </p>
            </Card.Content>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section>
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
          Cómo Funciona
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="bg-green-100 text-green-600 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
            <h3 className="font-semibold mb-2">Crea tu Perfil</h3>
            <p className="text-gray-600 text-sm">
              Configura tu perfil con tus datos personales y objetivos nutricionales.
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-green-100 text-green-600 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
            <h3 className="font-semibold mb-2">Personaliza Preferencias</h3>
            <p className="text-gray-600 text-sm">
              Indica tus preferencias alimentarias y restricciones dietéticas.
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-green-100 text-green-600 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
            <h3 className="font-semibold mb-2">Genera tu Menú</h3>
            <p className="text-gray-600 text-sm">
              Obtén menús personalizados diarios o semanales con un solo clic.
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-green-100 text-green-600 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">4</div>
            <h3 className="font-semibold mb-2">Organiza tus Compras</h3>
            <p className="text-gray-600 text-sm">
              Genera automáticamente tu lista de compras basada en tu menú.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-green-50 rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          ¿Listo para mejorar tu alimentación?
        </h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Comienza a planificar tus comidas de forma inteligente y alcanza tus objetivos nutricionales.
        </p>
        {!user ? (
          <Link href="/register">
            <Button size="lg">
              Comenzar Ahora
            </Button>
          </Link>
        ) : (
          <Link href="/dashboard">
            <Button size="lg">
              Ir a mi Dashboard
            </Button>
          </Link>
        )}
      </section>
    </div>
  );
}