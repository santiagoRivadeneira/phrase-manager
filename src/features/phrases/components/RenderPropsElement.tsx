import React, { useState, useEffect } from 'react';

interface MousePosition {
  x: number;
  y: number;
}

interface MouseTrackerProps {
  render: (position: MousePosition) => React.ReactNode;
}

/**
 * Componente que usa Render Props pattern
 * Demuestra: Render Props, event handling, performance
 */
export const MouseTracker: React.FC<MouseTrackerProps> = ({ render }) => {
  const [position, setPosition] = useState<MousePosition>({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return <>{render(position)}</>;
};

// Ejemplo de uso con tooltip interactivo
export const InteractiveTooltip: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative">
      <button
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg"
      >
        Hover para ver coordenadas
      </button>

      {showTooltip && (
        <MouseTracker
          render={({ x, y }) => (
            <div
              className="fixed bg-black/80 text-white px-4 py-2 rounded-lg text-sm pointer-events-none z-50"
              style={{
                left: x + 10,
                top: y + 10,
              }}
            >
              X: {x}, Y: {y}
            </div>
          )}
        />
      )}
    </div>
  );
};