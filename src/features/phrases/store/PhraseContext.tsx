// context/PhraseContext.tsx

import React, { createContext, useReducer, useCallback, useMemo, useEffect } from 'react';
import { phraseReducer } from './phraseReducer';
import type { Phrase, State } from '../types';

/**
 * Interface que define el tipo del contexto de frases.
 * 
 * @interface PhraseContextType
 * @property {State} state - Estado global de la aplicación
 * @property {Function} addPhrase - Función para agregar una nueva frase
 * @property {Function} deletePhrase - Función para eliminar una frase por ID
 * @property {Function} editPhrase - Función para editar una frase existente
 * @property {Function} setSearchQuery - Función para actualizar el query de búsqueda
 * 
 * @example
 * const { state, addPhrase } = usePhrases();
 * await addPhrase("Mi nueva frase");
 */
interface PhraseContextType {
  state: State;
  addPhrase: (text: string) => Promise<void>;
  deletePhrase: (id: string) => void;
  editPhrase: (id: string, text: string) => void;
  setSearchQuery: (query: string) => void;
}

/**
 * Contexto de React para gestionar el estado global de frases.
 * 
 * @type {React.Context<PhraseContextType | undefined>}
 */
const PhraseContext = createContext<PhraseContextType | undefined>(undefined);

/**
 * Provider del contexto de frases.
 * Gestiona el estado global de la aplicación incluyendo:
 * - Lista de frases
 * - Query de búsqueda
 * - Estado de carga
 * - Mensajes de error
 * 
 * Características:
 * - Persistencia automática en localStorage
 * - Carga inicial desde localStorage
 * - Manejo de errores robusto
 * - Operaciones optimizadas con useCallback y useMemo
 * 
 * @component
 * @param {Object} props - Props del componente
 * @param {React.ReactNode} props.children - Componentes hijos
 * 
 * @example
 * // Envolver la app con el provider
 * <PhraseProvider>
 *   <App />
 * </PhraseProvider>
 * 
 * @throws {Error} Si hay un error al cargar desde localStorage
 */
export const PhraseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Inicializar reducer con estado inicial
  const [state, dispatch] = useReducer(phraseReducer, {
    phrases: [],
    searchQuery: '',
    isLoading: true,
    error: null,
  });

  /**
   * Effect: Cargar frases desde localStorage al montar el componente.
   * Se ejecuta una sola vez al inicio.
   * 
   * @fires LOAD_PHRASES - Si hay datos en localStorage
   * @fires SET_LOADING - Si no hay datos en localStorage
   * @fires SET_ERROR - Si ocurre un error al cargar
   */
  useEffect(() => {
    try {
      const saved = localStorage.getItem('phrases');
      if (saved) {
        const phrases = JSON.parse(saved);
        dispatch({ type: 'LOAD_PHRASES', payload: phrases });
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    } catch (error) {
      console.error('Error loading phrases:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Error al cargar las frases' });
    }
  }, []);

  /**
   * Effect: Persistir frases en localStorage cuando cambian.
   * Solo se ejecuta después de la carga inicial.
   * 
   * @listens state.phrases - Cambios en el array de frases
   * @listens state.isLoading - Cambios en el estado de carga
   */
  useEffect(() => {
    if (!state.isLoading) {
      try {
        localStorage.setItem('phrases', JSON.stringify(state.phrases));
      } catch (error) {
        console.error('Error saving to localStorage:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Error al guardar las frases' });
      }
    }
  }, [state.phrases, state.isLoading]);

  /**
   * Agrega una nueva frase a la colección.
   * 
   * Proceso:
   * 1. Activa estado de carga
   * 2. Simula operación asíncrona (300ms)
   * 3. Crea nueva frase con ID único
   * 4. Despacha acción ADD_PHRASE
   * 5. Desactiva estado de carga
   * 
   * @async
   * @function addPhrase
   * @param {string} text - Texto de la frase a agregar (se hace trim automáticamente)
   * @returns {Promise<void>}
   * 
   * @fires SET_LOADING - Al iniciar y finalizar la operación
   * @fires ADD_PHRASE - Al agregar la frase exitosamente
   * @fires SET_ERROR - Si ocurre un error
   * 
   * @example
   * await addPhrase("Esta es mi nueva frase");
   * 
   * @example
   * try {
   *   await addPhrase("  Frase con espacios  "); // Se guarda como "Frase con espacios"
   * } catch (error) {
   *   console.error('Error al agregar:', error);
   * }
   */
  const addPhrase = useCallback(async (text: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      // Simular operación asíncrona (ej: llamada a API)
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const newPhrase: Phrase = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        text: text.trim(),
        createdAt: Date.now(),
      };
      
      dispatch({ type: 'ADD_PHRASE', payload: newPhrase });
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Error al agregar la frase' });
    }
  }, []);

  /**
   * Elimina una frase de la colección por su ID.
   * 
   * @function deletePhrase
   * @param {string} id - ID único de la frase a eliminar
   * @returns {void}
   * 
   * @fires DELETE_PHRASE
   * 
   * @example
   * deletePhrase("1234567890-abc123");
   */
  const deletePhrase = useCallback((id: string) => {
    dispatch({ type: 'DELETE_PHRASE', payload: id });
  }, []);

  /**
   * Edita el texto de una frase existente.
   * 
   * @function editPhrase
   * @param {string} id - ID de la frase a editar
   * @param {string} text - Nuevo texto de la frase
   * @returns {void}
   * 
   * @fires EDIT_PHRASE
   * 
   * @example
   * editPhrase("1234567890-abc123", "Texto actualizado");
   */
  const editPhrase = useCallback((id: string, text: string) => {
    dispatch({ type: 'EDIT_PHRASE', payload: { id, text } });
  }, []);

  /**
   * Actualiza el query de búsqueda para filtrar frases.
   * 
   * @function setSearchQuery
   * @param {string} query - Query de búsqueda
   * @returns {void}
   * 
   * @fires SET_SEARCH_QUERY
   * 
   * @example
   * setSearchQuery("react");
   * 
   * @example
   * setSearchQuery(""); // Limpiar búsqueda
   */
  const setSearchQuery = useCallback((query: string) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
  }, []);

  /**
   * Valor del contexto memoizado.
   * Se recalcula solo cuando cambian las dependencias.
   * 
   * @constant {PhraseContextType} value
   */
  const value = useMemo(
    () => ({ state, addPhrase, deletePhrase, editPhrase, setSearchQuery }),
    [state, addPhrase, deletePhrase, editPhrase, setSearchQuery]
  );

  return <PhraseContext.Provider value={value}>{children}</PhraseContext.Provider>;
};

export default PhraseContext;