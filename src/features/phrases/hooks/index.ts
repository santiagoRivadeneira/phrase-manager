import { useContext, useEffect, useMemo, useState } from 'react';
import PhraseContext from '../store/PhraseContext';

export const usePhraseContext = () => {
  const context = useContext(PhraseContext);
  if (!context) {
    throw new Error('usePhraseContext must be used within PhraseProvider');
  }
  return context;
};


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


const escapeRegExp = (str: string): string => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};


export const useFilteredPhrases = () => {
  const { state } = usePhraseContext();


  const debouncedQuery = useDebounce(state.searchQuery, 300);

  return useMemo(() => {

    const normalized = debouncedQuery.trim().replace(/\s+/g, ' ');


    if (normalized.length < 2) {
      return state.phrases;
    }


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