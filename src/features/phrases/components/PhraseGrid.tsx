import React, { memo, useCallback } from 'react';
import { PhraseCard } from './PhraseCard';
import { useFilteredPhrases, usePhraseContext } from '../hooks';

export const PhraseGrid: React.FC = memo(() => {
  const { deletePhrase, editPhrase } = usePhraseContext();
  const filteredPhrases = useFilteredPhrases();

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
      <div className="text-center text-gray-500 dark:text-gray-400 py-20 bg-gradient-to-br from-white to-blue-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl shadow-xl border-2 border-dashed border-blue-200 dark:border-blue-800" role="status">
        <svg className="w-20 h-20 mx-auto mb-4 text-blue-300 dark:text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p className="text-2xl font-bold mb-2">No se encontraron frases</p>
        <p className="text-sm">Agrega tu primera frase o ajusta tu búsqueda</p>
      </div>
    );
  }

  return (
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
  );
});

PhraseGrid.displayName = 'PhraseGrid';