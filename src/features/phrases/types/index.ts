interface Phrase {
  id: string;
  text: string;
  createdAt: number;
}

interface State {
  phrases: Phrase[];
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
}

type Action =
  | { type: 'ADD_PHRASE'; payload: Phrase }
  | { type: 'DELETE_PHRASE'; payload: string }
  | { type: 'EDIT_PHRASE'; payload: { id: string; text: string } }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'LOAD_PHRASES'; payload: Phrase[] };

interface PhraseContextType {
  state: State;
  addPhrase: (text: string) => Promise<void>;
  deletePhrase: (id: string) => void;
  editPhrase: (id: string, text: string) => void;
  setSearchQuery: (query: string) => void;
}

interface FormValues {
  phrase: string;
}