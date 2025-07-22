'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';

export default function Register() {
  const router = useRouter();
  const { register, validateInvitation } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    invitationCode: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [invitationValidated, setInvitationValidated] = useState(false);
  const [validatingInvitation, setValidatingInvitation] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Reset invitation validation when code changes
    if (name === 'invitationCode') {
      setInvitationValidated(false);
    }
  };

  const handleValidateInvitation = async () => {
    if (!formData.invitationCode.trim()) {
      setError('Por favor, ingresa un código de invitación');
      return;
    }

    setValidatingInvitation(true);
    setError('');

    try {
      const result = await validateInvitation(formData.invitationCode);
      if (result.valid) {
        setInvitationValidated(true);
        setError('');
      } else {
        setError(result.message);
        setInvitationValidated(false);
      }
    } catch (error) {
      console.error('Invitation validation error:', error);
      setError('Error al validar el código de invitación');
      setInvitationValidated(false);
    } finally {
      setValidatingInvitation(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validaciones
    if (!formData.invitationCode.trim()) {
      setError('El código de invitación es requerido');
      return;
    }
    
    if (!invitationValidated) {
      setError('Por favor, valida tu código de invitación primero');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    
    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await register(formData.name, formData.email, formData.password, formData.invitationCode);
      router.push('/profile');
    } catch (error) {
      console.error('Register error:', error);
      setError(error instanceof Error ? error.message : 'Error al registrar. Por favor, inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <Card.Header>
          <h1 className="text-2xl font-bold text-center text-gray-900">
            Crear Cuenta
          </h1>
        </Card.Header>
        
        <Card.Content>
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Nombre"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Tu nombre"
              required
              fullWidth
            />
            
            <Input
              label="Correo Electrónico"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="tu@email.com"
              required
              fullWidth
            />
            
            <Input
              label="Contraseña"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="********"
              required
              fullWidth
            />
            
            <Input
              label="Confirmar Contraseña"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="********"
              required
              fullWidth
            />
            
            <div className="space-y-2">
              <div className="flex space-x-2">
                <Input
                  label="Código de Invitación"
                  name="invitationCode"
                  type="text"
                  value={formData.invitationCode}
                  onChange={handleChange}
                  placeholder="Ingresa tu código"
                  required
                  fullWidth
                />
                <div className="flex items-end">
                  <Button
                    type="button"
                    variant="outline"
                    size="md"
                    onClick={handleValidateInvitation}
                    disabled={validatingInvitation || !formData.invitationCode.trim()}
                  >
                    {validatingInvitation ? 'Validando...' : 'Validar'}
                  </Button>
                </div>
              </div>
              
              {invitationValidated && (
                <div className="bg-green-50 text-green-600 p-2 rounded-md text-sm flex items-center">
                  <span className="mr-2">✓</span>
                  Código de invitación válido
                </div>
              )}
            </div>
            
            <Button 
              type="submit" 
              fullWidth 
              disabled={isLoading || !invitationValidated}
            >
              {isLoading ? 'Registrando...' : 'Registrarse'}
            </Button>
          </form>
        </Card.Content>
        
        <Card.Footer className="text-center">
          <p className="text-sm text-gray-600">
            ¿Ya tienes una cuenta?{' '}
            <Link href="/login" className="text-green-600 hover:text-green-700 font-medium">
              Inicia Sesión
            </Link>
          </p>
        </Card.Footer>
      </Card>
    </div>
  );
}