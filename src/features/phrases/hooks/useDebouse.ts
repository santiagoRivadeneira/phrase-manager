import { useEffect, useState } from 'react';

/**
 * Hook personalizado para debounce
 * Demuestra: Custom hooks, closures, cleanup, performance optimization
 * @param value - Valor a hacer debounce
 * @param delay - Delay en milisegundos
 * @returns Valor con debounce aplicado
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Crear timeout (closure sobre value y delay)
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup function - demuestra gestión de memoria
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}