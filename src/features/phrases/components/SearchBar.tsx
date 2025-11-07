import React, { memo } from 'react';
import { usePhraseContext } from '../hooks';

export const SearchBar: React.FC = memo(() => {
  const { setSearchQuery, state } = usePhraseContext();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="mb-6 relative">
      <label htmlFor="search-input" className="sr-only">
        Buscar frases
      </label>
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        id="search-input"
        type="text"
        value={state.searchQuery}
        onChange={handleChange}
        placeholder="Buscar frases..."
        className="w-full pl-12 shadow-sm border-2 border-gray-200 dark:border-gray-600 rounded-xl py-3 px-5 text-gray-700 dark:text-gray-100 dark:bg-slate-700 leading-tight focus:outline-none focus:border-orange-500 dark:focus:border-orange-400 focus:ring-2 focus:ring-orange-200 dark:focus:ring-orange-800 transition-all duration-200"
        aria-label="Search phrases"
      />
    </div>
  );
});

SearchBar.displayName = 'SearchBar';