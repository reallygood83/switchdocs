import { ReactNode } from 'react';

interface CardProps {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function Card({ title, description, children, className = '' }: CardProps) {
  return (
    <div className={`card ${className}`}>
      {title && (
        <div className="mb-4">
          <h2 className="text-lg font-bold text-black uppercase tracking-wide">
            {title}
          </h2>
          {description && (
            <p className="text-sm text-gray-600 mt-2">
              {description}
            </p>
          )}
        </div>
      )}
      {children}
    </div>
  );
}
