import React, { memo, useCallback, useState } from 'react';
import { Edit2, Trash2, Check, X } from 'lucide-react';
import { usePhraseContext } from '../hooks';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';

export const PhraseCard: React.FC<{
  phrase: Phrase;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
}> = memo(({ phrase, onDelete, onEdit }) => {
  const { state } = usePhraseContext();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(phrase.text);
  const [isHovered, setIsHovered] = useState(false);
  const [error, setError] = useState('');
  const cardRef = React.useRef<HTMLElement>(null);

  const handleDelete = useCallback(async () => {
    const result = await Swal.fire({
      title: '¿Eliminar frase?',
      text: `¿Estás seguro de eliminar: "${phrase.text}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
    });

    if (result.isConfirmed) {
      onDelete(phrase.id);
      toast.success('Frase eliminada correctamente');

      // ✅ Focus management
      setTimeout(() => {
        const nextCard = cardRef.current?.parentElement?.nextElementSibling?.querySelector('button');
        const prevCard = cardRef.current?.parentElement?.previousElementSibling?.querySelector('button');
        const addButton = document.querySelector('button[aria-label="Add phrase"]');

        if (nextCard instanceof HTMLElement) {
          nextCard.focus();
        } else if (prevCard instanceof HTMLElement) {
          prevCard.focus();
        } else if (addButton instanceof HTMLElement) {
          addButton.focus();
        }
      }, 100);
    }
  }, [phrase.id, phrase.text, onDelete]);

  const handleEdit = useCallback(() => {
    setIsEditing(true);
    setEditText(phrase.text);
    setError('');
  }, [phrase.text]);

  const handleSave = useCallback(() => {
    const trimmedText = editText.trim();

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
    toast.success('Frase actualizada correctamente');
  }, [phrase.id, editText, onEdit, state.phrases]);

  const handleCancel = useCallback(() => {
    setIsEditing(false);
    setEditText(phrase.text);
    setError('');
  }, [phrase.text]);

  return (
    <article
      ref={cardRef}
      className="relative bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border-2 border-blue-100 hover:border-blue-300 group overflow-hidden"
      aria-label={`Phrase: ${phrase.text}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-orange-400/10 rounded-full blur-3xl -z-0 transition-opacity duration-300"
        style={{ opacity: isHovered ? 1 : 0 }}
      ></div>

      <div className="relative z-10">
        {isEditing ? (
          <div className="mb-4">
            <textarea
              value={editText}
              onChange={(e) => {
                setEditText(e.target.value);
                setError('');
              }}
              className="w-full p-3 border-2 border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 resize-none"
              rows={3}
              autoFocus
              maxLength={200}
              aria-label="Edit phrase text"
            />
            {error && (
              <p className="text-red-500 text-xs mt-2 font-medium" role="alert">{error}</p>
            )}
            <p className="text-xs text-gray-400 mt-1 text-right" aria-live="polite">
              {editText.length}/200
            </p>
          </div>
        ) : (
          <p
            className="text-gray-800 mb-4 leading-relaxed text-base font-medium h-[80px]"
            style={{
              overflowWrap: 'anywhere',
              wordBreak: 'break-word',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {phrase.text}
          </p>
        )}

        <footer className="flex justify-between items-center">
          <time
            className="text-xs text-gray-500 font-semibold tracking-wide flex items-center gap-1"
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
