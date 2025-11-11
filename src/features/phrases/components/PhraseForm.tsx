import React, { memo, useState } from 'react';
import { usePhraseContext } from '../hooks';
import DOMPurify from 'dompurify';

export const PhraseForm: React.FC = memo(() => {
  const { addPhrase, state } = usePhraseContext();
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  const maxChars = 200;

  const validate = (text: string) => {
    if (!text) {
      return 'La frase es requerida';
    }
    if (text.trim().length < 3) {
      return 'La frase debe tener al menos 3 caracteres';
    }
    if (text.length > maxChars) {
      return `La frase debe tener menos de ${maxChars} caracteres`;
    }

    const normalizedInput = text.trim().toLowerCase();
    const isDuplicate = state.phrases.some(
      p => p.text.trim().toLowerCase() === normalizedInput
    );

    if (isDuplicate) {
      return 'Esta frase ya existe. Por favor, ingresa una frase diferente.';
    }

    return '';
  };

  const handleSubmit = async () => {
    const validationError = validate(value);
    if (validationError) {
      setError(validationError);
      return;
    }

    // 🧹 Sanitizar antes de guardar o enviar
    const sanitizedValue = DOMPurify.sanitize(value);

    await addPhrase(sanitizedValue);

    setValue('');
    setError('');
  };

  return (
    <div className="mb-6">
      <label className="block text-gray-700 text-sm font-bold mb-3 tracking-wide">
        Agregar Nueva Frase
      </label>

      <div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <input
              type="text"
              value={value}
              minLength={3}
              maxLength={maxChars}
              onChange={(e) => {
                setValue(e.target.value);
                setError('');
              }}
              placeholder="Escribe tu frase aquí..."
              disabled={state.isLoading}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              className="w-full shadow-sm border-2 border-gray-200 rounded-xl py-3 px-5 text-gray-700 leading-tight focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:bg-gray-100 disabled:cursor-not-allowed transition-all duration-200"
              aria-label="Phrase input"
            />

            {/* 🧮 Contador de caracteres debajo del input */}
            <div className="flex justify-end mt-1">
              <span
                className={`text-xs ${
                  value.length > maxChars * 0.9
                    ? 'text-red-500 font-semibold'
                    : 'text-gray-400'
                }`}
                aria-live="polite"
              >
                {value.length}/{maxChars}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={state.isLoading || !value.trim()}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 px-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-xl flex items-center justify-center gap-2 w-full sm:w-auto"
            aria-label="Add phrase"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {state.isLoading ? 'Agregando...' : 'Agregar'}
          </button>
        </div>

        {error && (
          <div className="mt-3 p-3 bg-red-50 border-l-4 border-red-500 rounded">
            <p className="text-red-600 text-sm font-medium flex items-center gap-2" role="alert">
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              {error}
            </p>
          </div>
        )}
      </div>
    </div>
  );
});

PhraseForm.displayName = 'PhraseForm';
