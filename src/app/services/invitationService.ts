// Servicio para manejar códigos de invitación

type InvitationCode = {
  id: string;
  code: string;
  isUsed: boolean;
  usedBy?: string;
  createdAt: Date;
  expiresAt?: Date;
  maxUses: number;
  currentUses: number;
};

// Simulación de códigos de invitación válidos
// En una implementación real, estos estarían en la base de datos
const validInvitationCodes: InvitationCode[] = [
  {
    id: '1',
    code: 'NUTRI2024',
    isUsed: false,
    createdAt: new Date(),
    maxUses: 100,
    currentUses: 0,
  },
  {
    id: '2',
    code: 'HEALTH123',
    isUsed: false,
    createdAt: new Date(),
    maxUses: 50,
    currentUses: 0,
  },
  {
    id: '3',
    code: 'PLANNER2024',
    isUsed: false,
    createdAt: new Date(),
    maxUses: 25,
    currentUses: 0,
  },
  {
    id: '4',
    code: 'BETA2024',
    isUsed: false,
    createdAt: new Date(),
    maxUses: 10,
    currentUses: 0,
  },
  {
    id: '5',
    code: 'WELCOME',
    isUsed: false,
    createdAt: new Date(),
    maxUses: 1000,
    currentUses: 0,
  },
];

// Validar código de invitación
export const validateInvitationCode = async (code: string): Promise<{ valid: boolean; message: string }> => {
  try {
    const response = await fetch('/api/invitation-codes/validate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error validating invitation code:', error);
    return {
      valid: false,
      message: 'Error de conexión al validar el código'
    };
  }
};

// Usar código de invitación
export const useInvitationCode = async (code: string, userId: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch('/api/invitation-codes/use', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code, userId }),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error using invitation code:', error);
    return {
      success: false,
      message: 'Error de conexión al usar el código'
    };
  }
};

// Generar nuevo código de invitación (para administradores)
export const generateInvitationCode = async (
  maxUses: number = 1,
  expiresAt?: Date
): Promise<{ success: boolean; code?: string; message: string }> => {
  try {
    // Generar código aleatorio
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    // Verificar que el código no exista ya
    const existingCode = validInvitationCodes.find(invCode => invCode.code === code);
    if (existingCode) {
      // Si existe, generar uno nuevo recursivamente
      return generateInvitationCode(maxUses, expiresAt);
    }

    // Crear nuevo código de invitación
    const newInvitationCode: InvitationCode = {
      id: Date.now().toString(),
      code,
      isUsed: false,
      createdAt: new Date(),
      expiresAt,
      maxUses,
      currentUses: 0,
    };

    // Agregar a la lista (en una implementación real, se guardaría en la base de datos)
    validInvitationCodes.push(newInvitationCode);

    return {
      success: true,
      code,
      message: 'Código de invitación generado exitosamente'
    };
  } catch (error) {
    console.error('Error generating invitation code:', error);
    return {
      success: false,
      message: 'Error al generar el código de invitación'
    };
  }
};

// Obtener estadísticas de códigos de invitación
export const getInvitationCodeStats = async (): Promise<{
  total: number;
  active: number;
  expired: number;
  exhausted: number;
}> => {
  try {
    const now = new Date();

    const stats = {
      total: validInvitationCodes.length,
      active: 0,
      expired: 0,
      exhausted: 0,
    };

    validInvitationCodes.forEach(code => {
      if (code.expiresAt && code.expiresAt < now) {
        stats.expired++;
      } else if (code.currentUses >= code.maxUses) {
        stats.exhausted++;
      } else {
        stats.active++;
      }
    });

    return stats;
  } catch (error) {
    console.error('Error getting invitation code stats:', error);
    return {
      total: 0,
      active: 0,
      expired: 0,
      exhausted: 0,
    };
  }
};

// Listar todos los códigos de invitación (para administradores)
export const listInvitationCodes = async (): Promise<InvitationCode[]> => {
  try {
    return validInvitationCodes.map(code => ({
      ...code,
      // No exponer información sensible si es necesario
    }));
  } catch (error) {
    console.error('Error listing invitation codes:', error);
    return [];
  }
};