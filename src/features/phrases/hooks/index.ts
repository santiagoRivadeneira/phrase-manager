import { useContext, useEffect, useMemo, useState } from 'react';
import PhraseContext from '../store/PhraseContext';

export const usePhraseContext = () => {
  const context = useContext(PhraseContext);
  if (!context) {
    throw new Error('usePhraseContext must be used within PhraseProvider');
  }
  return context;
};

// ✅ Hook de debounce (300ms)
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

// ✅ Función para escapar caracteres especiales en regex
const escapeRegExp = (str: string): string => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

// ✅ Hook optimizado con todas las validaciones requeridas
export const useFilteredPhrases = () => {
  const { state } = usePhraseContext();
  
  // ✅ Debounce del searchQuery (300ms)
  const debouncedQuery = useDebounce(state.searchQuery, 300);
  
  return useMemo(() => {
    // ✅ Normalización: trim y espacios múltiples
    const normalized = debouncedQuery.trim().replace(/\s+/g, ' ');
    
    // ✅ No filtrar si es menor a 2 caracteres
    if (normalized.length < 2) {
      return state.phrases;
    }
    
    // ✅ Crear regex escapada y memoizada
    try {
      const regex = new RegExp(escapeRegExp(normalized), 'i');
      
      return state.phrases.filter((phrase) => {
        // Normalizar también el texto de la frase
        const phraseNormalized = phrase.text.trim().replace(/\s+/g, ' ');
        return regex.test(phraseNormalized);
      });
    } catch (error) {
      // Si hay error en la regex, retornar todas las frases
      console.error('Error en regex:', error);
      return state.phrases;
    }
  }, [state.phrases, debouncedQuery]);
};