import React, { useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';
import { designTokens } from '../../design-system/tokens';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); // Auto-close after 3 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  const backgroundColor = type === 'success' ? designTokens.colors.success[600] : designTokens.colors.error[600];
  const icon = type === 'success' ? <CheckCircle size={20} color={designTokens.colors.white} /> : <XCircle size={20} color={designTokens.colors.white} />;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: designTokens.spacing[4],
        right: designTokens.spacing[4],
        backgroundColor: backgroundColor,
        color: designTokens.colors.white,
        padding: `${designTokens.spacing[3]} ${designTokens.spacing[4]}`,
        borderRadius: designTokens.borderRadius.lg,
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
        display: 'flex',
        alignItems: 'center',
        gap: designTokens.spacing[3],
        zIndex: 1000,
        animation: 'fadeIn 0.3s ease-out',
      }}
    >
      {icon}
      <span style={{ fontSize: designTokens.typography.fontSize.base, fontWeight: designTokens.typography.fontWeight.medium }}>{message}</span>
      <button
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          color: designTokens.colors.white,
          cursor: 'pointer',
          marginLeft: designTokens.spacing[2],
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <X size={16} />
      </button>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}