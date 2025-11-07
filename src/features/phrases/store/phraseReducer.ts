import type { Action, State } from "../types";

/**
 * Reducer principal para gestionar el estado de las frases.
 * 
 * Implementa el patrón Reducer de React para gestión de estado predecible.
 * Todas las operaciones son inmutables.
 * 
 * @function phraseReducer
 * @param {State} state - Estado actual de la aplicación
 * @param {Action} action - Acción a ejecutar
 * @returns {State} Nuevo estado de la aplicación
 * 
 * @example
 * const newState = phraseReducer(currentState, {
 *   type: 'ADD_PHRASE',
 *   payload: { id: '1', text: 'Nueva frase', createdAt: Date.now() }
 * });
 * 
 * @description
 * ## Acciones soportadas:
 * 
 * ### ADD_PHRASE
 * Agrega una nueva frase al inicio del array.
 * - **Payload:** `Phrase` - Objeto con la nueva frase
 * - **Cambios:** Agrega frase al inicio, limpia error
 * 
 * ### DELETE_PHRASE
 * Elimina una frase por su ID.
 * - **Payload:** `string` - ID de la frase a eliminar
 * - **Cambios:** Filtra el array, limpia error
 * 
 * ### EDIT_PHRASE
 * Actualiza el texto de una frase existente.
 * - **Payload:** `{id: string, text: string}` - ID y nuevo texto
 * - **Cambios:** Actualiza texto de la frase, limpia error
 * 
 * ### SET_SEARCH_QUERY
 * Actualiza el query de búsqueda.
 * - **Payload:** `string` - Query de búsqueda
 * - **Cambios:** Actualiza searchQuery
 * 
 * ### SET_LOADING
 * Controla el estado de carga.
 * - **Payload:** `boolean` - Estado de carga
 * - **Cambios:** Actualiza isLoading
 * 
 * ### SET_ERROR
 * Establece un mensaje de error.
 * - **Payload:** `string` - Mensaje de error
 * - **Cambios:** Actualiza error, desactiva loading
 * 
 * ### LOAD_PHRASES
 * Carga frases desde almacenamiento persistente.
 * - **Payload:** `Phrase[]` - Array de frases
 * - **Cambios:** Reemplaza phrases, desactiva loading
 */
export const phraseReducer = (state: State, action: Action): State => {
  switch (action.type) {
    /**
     * Agrega una nueva frase al inicio del array.
     * Las frases nuevas aparecen primero (orden cronológico inverso).
     * 
     * @case ADD_PHRASE
     */
    case 'ADD_PHRASE':
      return {
        ...state,
        phrases: [action.payload, ...state.phrases],
        error: null,
      };
    
    /**
     * Elimina una frase filtrando por ID.
     * Si el ID no existe, el array no se modifica.
     * 
     * @case DELETE_PHRASE
     */
    case 'DELETE_PHRASE':
      return {
        ...state,
        phrases: state.phrases.filter((p) => p.id !== action.payload),
        error: null,
      };
    
    /**
     * Edita el texto de una frase existente.
     * Mantiene todas las demás propiedades (id, createdAt).
     * 
     * @case EDIT_PHRASE
     */
    case 'EDIT_PHRASE':
      return {
        ...state,
        phrases: state.phrases.map((p) => 
          p.id === action.payload.id 
            ? { ...p, text: action.payload.text } 
            : p
        ),
        error: null,
      };
    
    /**
     * Actualiza el query de búsqueda.
     * Se usa para filtrar frases en la UI.
     * 
     * @case SET_SEARCH_QUERY
     */
    case 'SET_SEARCH_QUERY':
      return {
        ...state,
        searchQuery: action.payload,
      };
    
    /**
     * Controla el estado de carga de la aplicación.
     * Se usa durante operaciones asíncronas.
     * 
     * @case SET_LOADING
     */
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    
    /**
     * Establece un mensaje de error.
     * Automáticamente desactiva el estado de carga.
     * 
     * @case SET_ERROR
     */
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    
    /**
     * Carga un array de frases desde almacenamiento.
     * Reemplaza el array actual y desactiva loading.
     * 
     * @case LOAD_PHRASES
     */
    case 'LOAD_PHRASES':
      return {
        ...state,
        phrases: action.payload,
        isLoading: false,
      };
    
    /**
     * Caso por defecto: retorna el estado sin cambios.
     * Previene errores con acciones desconocidas.
     * 
     * @default
     */
    default:
      return state;
  }
};