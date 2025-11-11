import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PhraseForm } from '../components/PhraseForm';
import { usePhraseContext } from '../hooks';

jest.mock('../hooks', () => ({
  usePhraseContext: jest.fn(),
}));

const mockUsePhraseContext = usePhraseContext as jest.MockedFunction<typeof usePhraseContext>;

describe('PhraseForm', () => {
  const mockAddPhrase = jest.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    jest.clearAllMocks();

    mockUsePhraseContext.mockReturnValue({
      addPhrase: mockAddPhrase,
      state: {
        isLoading: false,
        phrases: [
          { id: '1', text: 'Hola mundo', createdAt: Date.now() },
          { id: '2', text: 'Frase duplicada', createdAt: Date.now() },
        ],
      },
    } as any);
  });

  it('renderiza el campo de entrada y el botón', () => {
    render(<PhraseForm />);
    expect(screen.getByLabelText('Phrase input')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add phrase/i })).toBeInTheDocument();
  });

  it('muestra error si la frase es muy corta', async () => {
    render(<PhraseForm />);
    const input = screen.getByLabelText('Phrase input');
    fireEvent.change(input, { target: { value: 'Hi' } });
    fireEvent.blur(input);
    fireEvent.click(screen.getByRole('button', { name: /add phrase/i }));

    await waitFor(() => {
      expect(screen.getByText('La frase debe tener al menos 3 caracteres')).toBeInTheDocument();
    });
  });

  it('muestra error si la frase es demasiado larga', async () => {
    render(<PhraseForm />);
    const input = screen.getByLabelText('Phrase input');
    fireEvent.change(input, { target: { value: 'a'.repeat(201) } });
    fireEvent.blur(input);
    fireEvent.click(screen.getByRole('button', { name: /add phrase/i }));

    await waitFor(() => {
      expect(screen.getByText('La frase debe tener menos de 200 caracteres')).toBeInTheDocument();
    });
  });

  it('muestra error si la frase ya existe', async () => {
    render(<PhraseForm />);
    const input = screen.getByLabelText('Phrase input');
    fireEvent.change(input, { target: { value: ' Frase duplicada ' } });
    fireEvent.blur(input);
    fireEvent.click(screen.getByRole('button', { name: /add phrase/i }));

    await waitFor(() => {
      expect(
        screen.getByText('Esta frase ya existe. Por favor, ingresa una frase diferente.')
      ).toBeInTheDocument();
    });
  });

  it('envía la frase correctamente y limpia el campo', async () => {
    render(<PhraseForm />);
    const input = screen.getByLabelText('Phrase input');
    fireEvent.change(input, { target: { value: 'Nueva frase' } });
    fireEvent.click(screen.getByRole('button', { name: /add phrase/i }));

    await waitFor(() => {
      expect(mockAddPhrase).toHaveBeenCalledWith('Nueva frase');
    });
  });

  it('deshabilita el botón si está cargando', () => {
    mockUsePhraseContext.mockReturnValue({
      addPhrase: mockAddPhrase,
      state: { isLoading: true, phrases: [] },
    } as any);

    render(<PhraseForm />);
    expect(screen.getByRole('button', { name: /add phrase/i })).toBeDisabled();
  });
});
