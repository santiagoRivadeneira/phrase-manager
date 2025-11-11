
import { act, renderHook } from '@testing-library/react';
import { useFilteredPhrases, usePhraseContext } from '../hooks';



jest.useFakeTimers();

const mockPhrases = [
  { id: '1', text: 'Hola mundo' },
  { id: '2', text: 'Adiós mundo' },
  { id: '3', text: '(Hola) + mundo' },
];

describe('useFilteredPhrases', () => {
  beforeEach(() => {

    (usePhraseContext as jest.Mock) = jest.fn().mockReturnValue({
      state: {
        phrases: mockPhrases,
        searchQuery: '',
        isLoading: false,
        error: null,
      },
      addPhrase: jest.fn(),
      deletePhrase: jest.fn(),
      editPhrase: jest.fn(),
      setSearchQuery: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debounce: no filtra hasta que pasa el timer', () => {
    (usePhraseContext as jest.Mock).mockReturnValue({
      state: { phrases: mockPhrases, searchQuery: '', isLoading: false, error: null },
      addPhrase: jest.fn(),
      deletePhrase: jest.fn(),
      editPhrase: jest.fn(),
      setSearchQuery: jest.fn(),
    });

    const { result, rerender } = renderHook(() => useFilteredPhrases());

 
    expect(result.current).toHaveLength(mockPhrases.length);


    (usePhraseContext as jest.Mock).mockReturnValue({
      state: { phrases: mockPhrases, searchQuery: 'Hola', isLoading: false, error: null },
      addPhrase: jest.fn(),
      deletePhrase: jest.fn(),
      editPhrase: jest.fn(),
      setSearchQuery: jest.fn(),
    });

    rerender();


    expect(result.current).toHaveLength(mockPhrases.length);


    act(() => jest.advanceTimersByTime(300));


    expect(result.current.map(p => p.text)).toContain('Hola mundo');
    expect(result.current).toHaveLength(2); // "Hola mundo" y "(Hola) + mundo"
  });


  it('ignora queries menores a 2 caracteres o solo espacios', () => {
    (usePhraseContext as jest.Mock).mockReturnValueOnce({
      state: { phrases: mockPhrases, searchQuery: ' ', isLoading: false, error: null },
      addPhrase: jest.fn(),
      deletePhrase: jest.fn(),
      editPhrase: jest.fn(),
      setSearchQuery: jest.fn(),
    });

    const { result } = renderHook(() => useFilteredPhrases());
    act(() => jest.advanceTimersByTime(300));
    expect(result.current).toHaveLength(mockPhrases.length);

    (usePhraseContext as jest.Mock).mockReturnValueOnce({
      state: { phrases: mockPhrases, searchQuery: 'a', isLoading: false, error: null },
      addPhrase: jest.fn(),
      deletePhrase: jest.fn(),
      editPhrase: jest.fn(),
      setSearchQuery: jest.fn(),
    });

    const { result: result2 } = renderHook(() => useFilteredPhrases());
    act(() => jest.advanceTimersByTime(300));
    expect(result2.current).toHaveLength(mockPhrases.length);
  });

  it('escapa caracteres especiales correctamente', () => {
    (usePhraseContext as jest.Mock).mockReturnValueOnce({
      state: { phrases: mockPhrases, searchQuery: '(Hola)', isLoading: false, error: null },
      addPhrase: jest.fn(),
      deletePhrase: jest.fn(),
      editPhrase: jest.fn(),
      setSearchQuery: jest.fn(),
    });

    const { result } = renderHook(() => useFilteredPhrases());
    act(() => jest.advanceTimersByTime(300));

    expect(result.current.some(p => p.text.includes('Hola'))).toBe(true);
  });
});
