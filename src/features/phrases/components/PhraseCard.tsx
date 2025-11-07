// components/PhraseCard.tsx

import React, { memo, useCallback, useState } from 'react';
import { Edit2, Trash2, Check, X } from 'lucide-react';
import type { Phrase } from '../types';
import { usePhraseContext } from '../hooks';

interface PhraseCardProps {
  phrase: Phrase;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
}

export const PhraseCard: React.FC<PhraseCardProps> = memo(({ phrase, onDelete, onEdit }) => {
  const { state } = usePhraseContext();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(phrase.text);
  const [isHovered, setIsHovered] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = useCallback(() => {
    onDelete(phrase.id);
  }, [phrase.id, onDelete]);

  const handleEdit = useCallback(() => {
    setIsEditing(true);
    setEditText(phrase.text);
    setError('');
  }, [phrase.text]);

  const handleSave = useCallback(() => {
    const trimmedText = editText.trim();
    
    // Validaciones
    if (!trimmedText) {
      setError('La frase no puede estar vacía');
      return;
    }
    
    if (trimmedText.length < 3) {
      setError('La frase debe tener al menos 3 caracteres');
      return;
    }
    
    if (trimmedText.length > 200) {
      setError('La frase debe tener menos de 200 caracteres');
      return;
    }

    // Validar duplicados (excluyendo la frase actual)
    const normalizedInput = trimmedText.toLowerCase();
    const isDuplicate = state.phrases.some(
      p => p.id !== phrase.id && p.text.trim().toLowerCase() === normalizedInput
    );
    
    if (isDuplicate) {
      setError('Esta frase ya existe');
      return;
    }

    onEdit(phrase.id, trimmedText);
    setIsEditing(false);
    setError('');
  }, [phrase.id, editText, onEdit, state.phrases]);

  const handleCancel = useCallback(() => {
    setIsEditing(false);
    setEditText(phrase.text);
    setError('');
  }, [phrase.text]);

  return (
    <article 
      className="relative bg-gradient-to-br from-white to-blue-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border-2 border-blue-100 dark:border-blue-900 hover:border-blue-300 dark:hover:border-blue-700 group overflow-hidden"
      aria-label={`Phrase: ${phrase.text}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Decorative gradient overlay */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-orange-400/10 rounded-full blur-3xl -z-0 transition-opacity duration-300" 
           style={{ opacity: isHovered ? 1 : 0 }}></div>
      
      {/* Content */}
      <div className="relative z-10">
        {isEditing ? (
          <div className="mb-4">
            <textarea
              value={editText}
              onChange={(e) => {
                setEditText(e.target.value);
                setError('');
              }}
              className="w-full p-3 border-2 border-blue-300 dark:border-blue-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-gray-100 text-gray-800 resize-none"
              rows={3}
              autoFocus
              maxLength={200}
            />
            {error && (
              <p className="text-red-500 dark:text-red-400 text-xs mt-2 font-medium">{error}</p>
            )}
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 text-right">
              {editText.length}/200
            </p>
          </div>
        ) : (
          <p className="text-gray-800 dark:text-gray-100 mb-4 break-words leading-relaxed text-base font-medium min-h-[60px]">
            {phrase.text}
          </p>
        )}

        <footer className="flex justify-between items-center">
          <time 
            className="text-xs text-gray-500 dark:text-gray-400 font-semibold tracking-wide flex items-center gap-1"
            dateTime={new Date(phrase.createdAt).toISOString()}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {new Date(phrase.createdAt).toLocaleDateString('es-PE', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </time>
          
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold p-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-200 shadow-md hover:shadow-lg"
                  aria-label="Save changes"
                  title="Guardar cambios"
                >
                  <Check size={16} />
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-bold p-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-200 shadow-md hover:shadow-lg"
                  aria-label="Cancel editing"
                  title="Cancelar"
                >
                  <X size={16} />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleEdit}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold p-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 shadow-md hover:shadow-lg opacity-0 group-hover:opacity-100"
                  aria-label="Edit phrase"
                  title="Editar frase"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold p-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-400 transition-all duration-200 shadow-md hover:shadow-lg opacity-0 group-hover:opacity-100"
                  aria-label={`Delete phrase: ${phrase.text}`}
                  title="Eliminar frase"
                >
                  <Trash2 size={16} />
                </button>
              </>
            )}
          </div>
        </footer>
      </div>
    </article>
  );
});

PhraseCard.displayName = 'PhraseCard';