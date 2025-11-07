import React, { memo } from 'react';
import { Form, Field } from 'react-final-form';
import { usePhraseContext } from '../hooks';

interface FormValues {
  phrase: string;
}

export const PhraseForm: React.FC = memo(() => {
  const { addPhrase, state } = usePhraseContext();

  const validateForm = (values: FormValues) => {
    const errors: Partial<Record<keyof FormValues, string>> = {};
    
    if (!values.phrase) {
      errors.phrase = 'La frase es requerida';
    } else if (values.phrase.trim().length < 3) {
      errors.phrase = 'La frase debe tener al menos 3 caracteres';
    } else if (values.phrase.length > 200) {
      errors.phrase = 'La frase debe tener menos de 200 caracteres';
    } else {
      // Validar si la frase ya existe (case insensitive y sin espacios extra)
      const normalizedInput = values.phrase.trim().toLowerCase();
      const isDuplicate = state.phrases.some(
        p => p.text.trim().toLowerCase() === normalizedInput
      );
      
      if (isDuplicate) {
        errors.phrase = 'Esta frase ya existe. Por favor, ingresa una frase diferente.';
      }
    }
    
    return errors;
  };

  const onSubmit = async (values: FormValues, form: any) => {
    await addPhrase(values.phrase);
    form.restart();
  };

  return (
    <Form
      onSubmit={onSubmit}
      validate={validateForm}
      render={({ handleSubmit, submitting, pristine, hasValidationErrors }) => (
        <div className="mb-6">
          <label className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-3 tracking-wide">
            Agregar Nueva Frase
          </label>
          
          <Field name="phrase">
            {({ input, meta }) => (
              <div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    {...input}
                    type="text"
                    placeholder="Escribe tu frase aquí..."
                    disabled={state.isLoading}
                    onKeyPress={(e: React.KeyboardEvent) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSubmit();
                      }
                    }}
                    className="flex-1 shadow-sm border-2 border-gray-200 dark:border-gray-600 rounded-xl py-3 px-5 text-gray-700 dark:text-gray-100 dark:bg-slate-700 leading-tight focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 disabled:bg-gray-100 dark:disabled:bg-slate-800 disabled:cursor-not-allowed transition-all duration-200"
                    aria-label="Phrase input"
                    aria-invalid={!!(meta.error && meta.touched)}
                    aria-describedby={meta.error && meta.touched ? "phrase-error" : undefined}
                  />
                  <button
                    type="button"
                    onClick={() => handleSubmit()}
                    disabled={submitting || pristine || state.isLoading || hasValidationErrors}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 px-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-xl flex items-center justify-center gap-2 w-full sm:w-auto"
                    aria-label="Add phrase"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    {state.isLoading ? 'Agregando...' : 'Agregar'}
                  </button>
                </div>
                
                {meta.error && meta.touched && (
                  <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded">
                    <p 
                      id="phrase-error" 
                      className="text-red-600 dark:text-red-400 text-sm font-medium flex items-center gap-2"
                      role="alert"
                    >
                      <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      {meta.error}
                    </p>
                  </div>
                )}
              </div>
            )}
          </Field>
        </div>
      )}
    />
  );
});

PhraseForm.displayName = 'PhraseForm';