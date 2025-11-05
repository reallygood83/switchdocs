import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium mb-2 text-black">
          {label}
        </label>
      )}
      <input
        {...props}
        className={`input-field ${error ? 'border-red-500 focus:ring-red-500' : ''} ${props.className || ''}`}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
