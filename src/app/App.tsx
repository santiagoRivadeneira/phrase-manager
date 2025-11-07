import './App.css';
import { PhraseForm } from '../features/phrases/components/PhraseForm';
import { PhraseGrid } from '../features/phrases/components/PhraseGrid';
import { SearchBar } from '../features/phrases/components/SearchBar';
import { Stats } from '../features/phrases/components/Stats';
import { PhraseProvider } from '../features/phrases/store/PhraseContext';
import { withErrorBoundary } from '../shared/hoc/withErrorBoundary';


const AppContent = withErrorBoundary(() => {

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 dark:from-gray-900 dark:via-slate-900 dark:to-gray-900 py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-500">
      <div className="max-w-7xl mx-auto">

        <header className="mb-10 text-center relative overflow-visible">

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold
            bg-gradient-to-r from-blue-600 via-blue-500 to-orange-500
            bg-clip-text text-transparent mb-4 tracking-tight
            leading-normal inline-block px-4 pb-4 break-words">
            Phrase Manager
          </h1>

          <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg font-medium px-4">
            Crea, edita y gestiona tus frases
          </p>
        </header>

        {/* ✅ Agregado: main para contenido principal */}
        <main>
          {/* ✅ Agregado: section con aria-label para accesibilidad */}
          <section aria-label="Formulario de gestión de frases" className="bg-gradient-to-br from-white to-blue-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl shadow-2xl p-6 sm:p-8 mb-8 border-2 border-blue-100 dark:border-blue-900">
            <PhraseForm />
            <SearchBar />
            <Stats />
          </section>

          {/* ✅ Agregado: section para el grid */}
          <section aria-label="Lista de frases">
            <PhraseGrid />
          </section>
        </main>

        {/* ✅ Opcional: footer si quieres agregar uno */}
        <footer className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>© 2025 Phrase Manager. Todos los derechos reservados.</p>
        </footer>
      </div>
    </div>
  );
});

export default function App() {
  return (
    <PhraseProvider>
      <AppContent />
    </PhraseProvider>
  );
}