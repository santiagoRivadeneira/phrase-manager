// services/phraseService.ts

import type { Phrase } from '../types';

/**
 * Servicio para gestionar frases (simulación de API)
 * Demuestra: async/await, promesas, error handling, delays
 */

// Simular latencia de red
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Simular errores aleatorios (10% de probabilidad)
const shouldSimulateError = () => Math.random() < 0.1;

export const phraseService = {
  /**
   * Obtener todas las frases
   */
  async getAllPhrases(): Promise<Phrase[]> {
    await delay(500);
    
    if (shouldSimulateError()) {
      throw new Error('Error al cargar las frases desde el servidor');
    }

    const saved = localStorage.getItem('phrases');
    return saved ? JSON.parse(saved) : [];
  },

  /**
   * Agregar una nueva frase
   */
  async addPhrase(text: string): Promise<Phrase> {
    await delay(300);

    if (shouldSimulateError()) {
      throw new Error('Error al guardar la frase en el servidor');
    }

    const newPhrase: Phrase = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text: text.trim(),
      createdAt: Date.now(),
    };

    const phrases = await this.getAllPhrases();
    const updated = [newPhrase, ...phrases];
    localStorage.setItem('phrases', JSON.stringify(updated));

    return newPhrase;
  },

  /**
   * Actualizar una frase existente
   */
  async updatePhrase(id: string, text: string): Promise<Phrase> {
    await delay(300);

    if (shouldSimulateError()) {
      throw new Error('Error al actualizar la frase en el servidor');
    }

    const phrases = await this.getAllPhrases();
    const index = phrases.findIndex(p => p.id === id);

    if (index === -1) {
      throw new Error('Frase no encontrada');
    }

    phrases[index] = { ...phrases[index], text: text.trim() };
    localStorage.setItem('phrases', JSON.stringify(phrases));

    return phrases[index];
  },

  /**
   * Eliminar una frase
   */
  async deletePhrase(id: string): Promise<void> {
    await delay(200);

    if (shouldSimulateError()) {
      throw new Error('Error al eliminar la frase del servidor');
    }

    const phrases = await this.getAllPhrases();
    const filtered = phrases.filter(p => p.id !== id);
    localStorage.setItem('phrases', JSON.stringify(filtered));
  },

  /**
   * Buscar frases por texto
   */
  async searchPhrases(query: string): Promise<Phrase[]> {
    await delay(200);

    const phrases = await this.getAllPhrases();
    return phrases.filter(p => 
      p.text.toLowerCase().includes(query.toLowerCase())
    );
  },
};