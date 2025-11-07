// types.ts

export interface Phrase {
  id: string;
  text: string;
  createdAt: number;
}

export interface State {
  phrases: Phrase[];
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
}

export type Action =
  | { type: 'ADD_PHRASE'; payload: Phrase }
  | { type: 'DELETE_PHRASE'; payload: string }
  | { type: 'EDIT_PHRASE'; payload: { id: string; text: string } }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LOAD_PHRASES'; payload: Phrase[] };
