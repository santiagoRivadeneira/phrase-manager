import Swal, { SweetAlertResult } from 'sweetalert2';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PhraseCard } from '../components/PhraseCard'
import toast from 'react-hot-toast';



// ✅ Mock explícito del módulo que exporta el hook
// Ajustado a tu ruta real: "../store/PhraseContext"



// 🔹 Mockeamos librerías externas
jest.mock('sweetalert2', () => ({
  fire: jest.fn(),
}));

jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
}));

// 🔹 Forzamos el tipo correcto de mock
const mockedSwal = Swal.fire as jest.Mock<Promise<SweetAlertResult<any>>>;

const mockPhrase = { id: '1', text: 'Hola mundo' };
const onDelete = jest.fn();
const onEdit = jest.fn();

jest.mock('../hooks', () => {
  return {
    __esModule: true,
    usePhraseContext: () => ({
      state: {
        phrases: [
          { id: '1', text: 'Hola mundo', createdAt: Date.now() },
          { id: '2', text: 'Frase duplicada', createdAt: Date.now() },
        ],
      },
      dispatch: jest.fn(),
    }),
  }
})

describe('PhraseCard', () => {
  const mockPhrase = {
    id: '1',
    text: 'Hola mundo',
    createdAt: Date.now(),
  }

  const onDelete = jest.fn()
  const onEdit = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('debe renderizar el texto de la frase', () => {
    render(<PhraseCard phrase={mockPhrase} onDelete={onDelete} onEdit={onEdit} />)
    expect(screen.getByText('Hola mundo')).toBeInTheDocument()
  })

  it('debe permitir editar una frase', () => {
    render(<PhraseCard phrase={mockPhrase} onDelete={onDelete} onEdit={onEdit} />)

    fireEvent.click(screen.getByTitle('Editar frase'))

    const textarea = screen.getByRole('textbox')
    expect(textarea).toBeInTheDocument()

    fireEvent.change(textarea, { target: { value: 'Frase modificada' } })
    fireEvent.click(screen.getByTitle('Guardar cambios'))

    expect(onEdit).toHaveBeenCalledWith('1', 'Frase modificada')
  })

  it('muestra error si la frase está vacía', () => {
    render(<PhraseCard phrase={mockPhrase} onDelete={onDelete} onEdit={onEdit} />)

    fireEvent.click(screen.getByTitle('Editar frase'))
    const textarea = screen.getByRole('textbox')

    fireEvent.change(textarea, { target: { value: ' ' } })
    fireEvent.click(screen.getByTitle('Guardar cambios'))

    expect(screen.getByText('La frase no puede estar vacía')).toBeInTheDocument()
  })

  it('muestra error si la frase ya existe', () => {
    render(<PhraseCard phrase={mockPhrase} onDelete={onDelete} onEdit={onEdit} />)

    fireEvent.click(screen.getByTitle('Editar frase'))
    const textarea = screen.getByRole('textbox')

    fireEvent.change(textarea, { target: { value: 'Frase duplicada' } })
    fireEvent.click(screen.getByTitle('Guardar cambios'))

    expect(screen.getByText('Esta frase ya existe')).toBeInTheDocument()
  })

  it('debe cancelar la edición', () => {
    render(<PhraseCard phrase={mockPhrase} onDelete={onDelete} onEdit={onEdit} />)

    fireEvent.click(screen.getByTitle('Editar frase'))
    fireEvent.click(screen.getByTitle('Cancelar'))

    expect(screen.getByText('Hola mundo')).toBeInTheDocument()
  })

  it('debe eliminar una frase', async () => {
    // 🔹 Simulamos que el usuario confirma la eliminación
    mockedSwal.mockResolvedValueOnce({
      isConfirmed: true,
      isDenied: false,
      isDismissed: false,
    } as SweetAlertResult<any>);

    render(<PhraseCard phrase={mockPhrase} onDelete={onDelete} onEdit={onEdit} />);

    fireEvent.click(screen.getByTitle('Eliminar frase'));

    await waitFor(() => {
      expect(onDelete).toHaveBeenCalledWith('1');
      expect(toast.success).toHaveBeenCalledWith('Frase eliminada correctamente');
    });
  });
})
