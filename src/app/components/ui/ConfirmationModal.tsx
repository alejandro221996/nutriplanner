import { ReactNode } from 'react';
import Button from './Button';
import Modal from './Modal';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: ReactNode;
  icon?: ReactNode;
  type?: 'success' | 'error' | 'warning' | 'info';
  confirmText?: string;
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  title,
  message,
  icon,
  type = 'success',
  confirmText = 'Aceptar'
}: ConfirmationModalProps) {
  // Configuración de colores según el tipo
  const typeConfig = {
    success: {
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
      iconColor: 'text-green-500',
      defaultIcon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      )
    },
    error: {
      bgColor: 'bg-red-100',
      textColor: 'text-red-600',
      iconColor: 'text-red-500',
      defaultIcon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      )
    },
    warning: {
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-600',
      iconColor: 'text-yellow-500',
      defaultIcon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      )
    },
    info: {
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
      iconColor: 'text-blue-500',
      defaultIcon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  };

  const config = typeConfig[type];
  const displayIcon = icon || config.defaultIcon;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="text-center">
        <div className={`mx-auto flex items-center justify-center h-20 w-20 rounded-full ${config.bgColor} ${config.iconColor} mb-4`}>
          {displayIcon}
        </div>

        <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>

        <div className="mt-2 text-sm text-gray-600">
          {message}
        </div>

        <div className="mt-6">
          <Button
            onClick={onClose}
            fullWidth
            variant={type === 'success' ? 'primary' : type === 'error' ? 'secondary' : 'outline'}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}