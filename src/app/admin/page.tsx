'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import {
  getAllUsers,
  getUserStats,
  changeUserRole,
  deleteUser,
  createAdminUser
} from '../services/authService';
import { UserPublic, UserRole } from '../types';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';

export default function AdminPanel() {
  const router = useRouter();
  const { user, loading: authLoading, isAdmin } = useAuth();

  const [users, setUsers] = useState<UserPublic[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    adminUsers: 0,
    regularUsers: 0,
    recentUsers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserPublic | null>(null);
  const [showCreateAdmin, setShowCreateAdmin] = useState(false);
  const [newAdminData, setNewAdminData] = useState({
    name: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    // Redirigir si no hay usuario autenticado o no es admin
    if (!authLoading && (!user || !isAdmin)) {
      router.push('/dashboard');
    }
  }, [user, isAdmin, authLoading, router]);

  useEffect(() => {
    if (user && isAdmin) {
      fetchData();
    }
  }, [user, isAdmin]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersData, statsData] = await Promise.all([
        getAllUsers(),
        getUserStats()
      ]);

      setUsers(usersData);
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    if (!user) return;

    try {
      const result = await changeUserRole(user.id, userId, newRole);
      if (result.success) {
        await fetchData(); // Refrescar datos
        alert(`Rol cambiado exitosamente a ${newRole}`);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Error changing role:', error);
      alert('Error al cambiar el rol');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      return;
    }

    try {
      const result = await deleteUser(userId);
      if (result.success) {
        await fetchData(); // Refrescar datos
        alert('Usuario eliminado exitosamente');
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Error al eliminar el usuario');
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await createAdminUser(
        newAdminData.name,
        newAdminData.email,
        newAdminData.password
      );

      if (result.success) {
        await fetchData(); // Refrescar datos
        setShowCreateAdmin(false);
        setNewAdminData({ name: '', email: '', password: '' });
        alert('Administrador creado exitosamente');
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Error creating admin:', error);
      alert('Error al crear el administrador');
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Cargando panel de administración...</p>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null; // Redirigiendo
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Panel de Administración
        </h1>
        <Button onClick={() => setShowCreateAdmin(true)}>
          Crear Administrador
        </Button>
      </div>

      {/* Estadísticas */}
      <Card>
        <Card.Header>
          <h2 className="text-xl font-semibold text-gray-800">Estadísticas de Usuarios</h2>
        </Card.Header>
        <Card.Content>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-md text-center">
              <p className="text-sm text-gray-500">Total de Usuarios</p>
              <p className="text-2xl font-bold text-blue-600">{stats.totalUsers}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-md text-center">
              <p className="text-sm text-gray-500">Administradores</p>
              <p className="text-2xl font-bold text-green-600">{stats.adminUsers}</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-md text-center">
              <p className="text-sm text-gray-500">Usuarios Regulares</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.regularUsers}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-md text-center">
              <p className="text-sm text-gray-500">Nuevos (7 días)</p>
              <p className="text-2xl font-bold text-purple-600">{stats.recentUsers}</p>
            </div>
          </div>
        </Card.Content>
      </Card>

      {/* Lista de Usuarios */}
      <Card>
        <Card.Header>
          <h2 className="text-xl font-semibold text-gray-800">Gestión de Usuarios</h2>
        </Card.Header>
        <Card.Content>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rol
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha de Registro
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((userData) => (
                  <tr key={userData.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {userData.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {userData.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${userData.role === 'ADMIN'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-green-100 text-green-800'
                        }`}>
                        {userData.role === 'ADMIN' ? 'Administrador' : 'Usuario'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(userData.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      {userData.id !== user.id && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRoleChange(
                              userData.id,
                              userData.role === 'ADMIN' ? 'USER' : 'ADMIN'
                            )}
                          >
                            {userData.role === 'ADMIN' ? 'Hacer Usuario' : 'Hacer Admin'}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteUser(userData.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            Eliminar
                          </Button>
                        </>
                      )}
                      {userData.id === user.id && (
                        <span className="text-gray-400 text-sm">Tú mismo</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card.Content>
      </Card>

      {/* Modal para crear administrador */}
      {showCreateAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Crear Nuevo Administrador</h3>
            <form onSubmit={handleCreateAdmin} className="space-y-4">
              <Input
                label="Nombre"
                value={newAdminData.name}
                onChange={(e) => setNewAdminData({ ...newAdminData, name: e.target.value })}
                required
                fullWidth
              />
              <Input
                label="Email"
                type="email"
                value={newAdminData.email}
                onChange={(e) => setNewAdminData({ ...newAdminData, email: e.target.value })}
                required
                fullWidth
              />
              <Input
                label="Contraseña"
                type="password"
                value={newAdminData.password}
                onChange={(e) => setNewAdminData({ ...newAdminData, password: e.target.value })}
                required
                fullWidth
              />
              <div className="flex space-x-4">
                <Button type="submit" fullWidth>
                  Crear Administrador
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  fullWidth
                  onClick={() => {
                    setShowCreateAdmin(false);
                    setNewAdminData({ name: '', email: '', password: '' });
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}