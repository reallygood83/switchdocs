import { useEffect } from 'react';
import { AlertCircle, CheckCircle2, InfoIcon, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose?: () => void;
  autoClose?: boolean;
  duration?: number;
}

const iconMap = {
  success: <CheckCircle2 className="h-5 w-5" />,
  error: <AlertCircle className="h-5 w-5" />,
  info: <InfoIcon className="h-5 w-5" />,
};

const colorMap = {
  success: 'bg-white border-2 border-black text-black',
  error: 'bg-gray-50 border-2 border-black text-black',
  info: 'bg-white border-2 border-black text-black',
};

export function Toast({ message, type = 'info', onClose, autoClose = true, duration = 3000 }: ToastProps) {
  useEffect(() => {
    if (autoClose && onClose) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [autoClose, onClose, duration]);

  return (
    <div className={`rounded-none p-4 flex items-center gap-3 animate-in fade-in slide-in-from-top-2 ${colorMap[type]}`}>
      {iconMap[type]}
      <span className="flex-1 text-sm font-medium">{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="hover:opacity-70 transition-opacity"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
