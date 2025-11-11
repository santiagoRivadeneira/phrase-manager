import React, { memo, useCallback } from 'react';
import { useFilteredPhrases, usePhraseContext } from '../hooks';
import { PhraseCard } from './PhraseCard';

export const PhraseGrid: React.FC = memo(() => {
  const { deletePhrase, editPhrase, state } = usePhraseContext();
  const filteredPhrases = useFilteredPhrases();
  const isFiltering = state.searchQuery.trim().length >= 2;

  const handleDelete = useCallback(
    (id: string) => {
      deletePhrase(id);
    },
    [deletePhrase]
  );

  const handleEdit = useCallback(
    (id: string, text: string) => {
      editPhrase(id, text);
    },
    [editPhrase]
  );

  if (filteredPhrases.length === 0) {
    return (
      <div 
        className="text-center text-gray-500 py-20 bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-xl border-2 border-dashed border-blue-200" 
        role="status"
        aria-live="polite"
      >
        <svg className="w-20 h-20 mx-auto mb-4 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p className="text-2xl font-bold mb-2">
          {isFiltering ? 'No se encontraron resultados' : 'No hay frases aún'}
        </p>
        <p className="text-sm">
          {isFiltering ? 'Intenta con otra búsqueda' : 'Agrega tu primera frase arriba'}
        </p>
      </div>
    );
  }

  return (
    <>
      {/* ✅ SR-only feedback con aria-live */}
      <div 
        className="sr-only" 
        role="status" 
        aria-live="polite" 
        aria-atomic="true"
      >
        {isFiltering 
          ? `${filteredPhrases.length} resultados encontrados para "${state.searchQuery}"`
          : `Mostrando ${filteredPhrases.length} frases`
        }
      </div>
      
      <div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        role="list"
        aria-label="Phrase list"
      >
        {filteredPhrases.map((phrase) => (
          <div key={phrase.id} role="listitem">
            <PhraseCard 
              phrase={phrase} 
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          </div>
        ))}
      </div>
    </>
  );
});

PhraseGrid.displayName = 'PhraseGrid';