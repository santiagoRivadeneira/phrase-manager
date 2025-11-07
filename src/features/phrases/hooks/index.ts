import { useContext, useMemo } from 'react';
import PhraseContext from '../store/PhraseContext';

export const usePhraseContext = () => {
  const context = useContext(PhraseContext);
  if (!context) {
    throw new Error('usePhraseContext must be used within PhraseProvider');
  }
  return context;
};


export const useFilteredPhrases = () => {
  const { state } = usePhraseContext();
  
  return useMemo(() => {
    return state.phrases.filter((phrase) =>
      phrase.text.toLowerCase().includes(state.searchQuery.toLowerCase())
    );
  }, [state.phrases, state.searchQuery]);
};