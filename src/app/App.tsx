import './App.css';
import { PhraseForm } from '../features/phrases/components/PhraseForm';
import { PhraseGrid } from '../features/phrases/components/PhraseGrid';
import { SearchBar } from '../features/phrases/components/SearchBar';
import { Stats } from '../features/phrases/components/Stats';
import { withErrorBoundary } from '../shared/hoc/withErrorBoundary';
import { PhraseProvider } from '../features/phrases/store/PhraseContext';
import { Toaster } from 'react-hot-toast';


const AppContent = withErrorBoundary(() => {

  return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-500">
         <Toaster position="bottom-left" />
        <div className="max-w-7xl mx-auto">
          <header className="mb-10 text-center relative overflow-visible">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-blue-600 via-blue-500 to-orange-500 bg-clip-text text-transparent mb-4 tracking-tight leading-normal inline-block px-4 pb-4 break-words">
              Phrase Manager
            </h1>
            <p className="text-gray-600 text-base sm:text-lg font-medium px-4">
              Gestiona tus frases con búsqueda optimizada
            </p>
          </header>

          <main>
            <section aria-label="Formulario de gestión de frases" className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-2xl p-6 sm:p-8 mb-8 border-2 border-blue-100">
              <PhraseForm />
              <SearchBar />
              <Stats />
            </section>

            <section aria-label="Lista de frases">
              <PhraseGrid />
            </section>
          </main>

          <footer className="mt-12 text-center text-sm text-gray-500">
            <p>© 2025 Phrase Manager Pro.</p>
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