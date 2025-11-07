import React, { memo, useState } from 'react';
import { useFilteredPhrases, usePhraseContext } from '../hooks';

export const Stats: React.FC = memo(() => {
  const { state } = usePhraseContext();
  const filteredPhrases = useFilteredPhrases();
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-4 mb-4">
        <div className="flex-1 min-w-[200px] bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white shadow-lg hover:shadow-xl transition-all duration-300">
          <p className="text-sm opacity-90 font-semibold uppercase tracking-wide">Total de Frases</p>
          <p className="text-4xl font-bold mt-2">{state.phrases.length}</p>
        </div>
        
        {state.searchQuery && (
          <div className="flex-1 min-w-[200px] bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-5 text-white shadow-lg hover:shadow-xl transition-all duration-300">
            <p className="text-sm opacity-90 font-semibold uppercase tracking-wide">Resultados</p>
            <p className="text-4xl font-bold mt-2">{filteredPhrases.length}</p>
          </div>
        )}

        <button
          onClick={() => setShowDetails(!showDetails)}
          className="bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3 font-semibold"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          {showDetails ? 'Ocultar' : 'Ver'} Detalles
        </button>
      </div>

      {showDetails && (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border-2 border-gray-100 dark:border-gray-700">
          <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-4 text-lg">Información Detallada</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 dark:bg-slate-700 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold">Frases Totales</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{state.phrases.length}</p>
            </div>
            <div className="bg-green-50 dark:bg-slate-700 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold">En Búsqueda</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{filteredPhrases.length}</p>
            </div>
            <div className="bg-purple-50 dark:bg-slate-700 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold">Promedio/Día</p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {state.phrases.length > 0 ? Math.round(state.phrases.length / 7) : 0}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

Stats.displayName = 'Stats';