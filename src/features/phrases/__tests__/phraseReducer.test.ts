import { phraseReducer } from '../store/phraseReducer';

describe('phraseReducer', () => {
    const initialState: State = {
        phrases: [
            { id: '1', text: 'Hola mundo', createdAt: 1 },
            { id: '2', text: 'Frase vieja', createdAt: 2 },
        ],
        searchQuery: '',
        isLoading: false,
        error: null,
    };

    it('agrega una nueva frase al inicio con ADD_PHRASE', () => {
        const newPhrase: Phrase = { id: '3', text: 'Nueva frase', createdAt: 3 };
        const result = phraseReducer(initialState, { type: 'ADD_PHRASE', payload: newPhrase });

        expect(result.phrases[0]).toEqual(newPhrase);
        expect(result.phrases).toHaveLength(3);
        expect(result.error).toBeNull();
    });

    it('elimina una frase con DELETE_PHRASE', () => {
        const result = phraseReducer(initialState, { type: 'DELETE_PHRASE', payload: '1' });

        expect(result.phrases).toHaveLength(1);
        expect(result.phrases.find(p => p.id === '1')).toBeUndefined();
    });

    it('edita una frase existente con EDIT_PHRASE', () => {
        const result = phraseReducer(initialState, {
            type: 'EDIT_PHRASE',
            payload: { id: '1', text: 'Hola editado' },
        });

        expect(result.phrases.find(p => p.id === '1')?.text).toBe('Hola editado');
    });

    it('actualiza el searchQuery con SET_SEARCH_QUERY', () => {
        const result = phraseReducer(initialState, {
            type: 'SET_SEARCH_QUERY',
            payload: 'buscar',
        });

        expect(result.searchQuery).toBe('buscar');
    });

    it('actualiza isLoading con SET_LOADING', () => {
        const result = phraseReducer(initialState, {
            type: 'SET_LOADING',
            payload: true,
        });

        expect(result.isLoading).toBe(true);
    });

    it('setea error y desactiva loading con SET_ERROR', () => {
        const result = phraseReducer(
            { ...initialState, isLoading: true },
            { type: 'SET_ERROR', payload: 'Algo salió mal' }
        );

        expect(result.error).toBe('Algo salió mal');
        expect(result.isLoading).toBe(false);
    });

    it('reemplaza frases con LOAD_PHRASES', () => {
        const newPhrases: Phrase[] = [
            { id: '9', text: 'Frase nueva', createdAt: 9 },
        ];

        const result = phraseReducer(initialState, {
            type: 'LOAD_PHRASES',
            payload: newPhrases,
        });

        expect(result.phrases).toEqual(newPhrases);
        expect(result.isLoading).toBe(false);
    });

    it('devuelve el mismo estado si la acción es desconocida', () => {
        const result = phraseReducer(initialState, { type: 'UNKNOWN_ACTION' } as any);
        expect(result).toBe(initialState); // debe devolver exactamente el mismo objeto
    });

    it('no muta el estado original', () => {
        const prevState = JSON.parse(JSON.stringify(initialState));
        phraseReducer(initialState, { type: 'SET_SEARCH_QUERY', payload: 'test' });
        expect(initialState).toEqual(prevState);
    });
});
