import { phraseService } from "../api/phrases.service";

beforeEach(() => {
  localStorage.clear();
  jest.spyOn(global.Math, 'random').mockReturnValue(0.5); // Evita errores aleatorios
});

afterAll(() => {
  jest.spyOn(global.Math, 'random').mockRestore();
});

describe('phraseService', () => {
  it('getAllPhrases devuelve array vacío si no hay nada', async () => {
    const phrases = await phraseService.getAllPhrases();
    expect(phrases).toEqual([]);
  });

  it('addPhrase agrega una nueva frase', async () => {
    const newPhrase = await phraseService.addPhrase('Hola test');

    expect(newPhrase.text).toBe('Hola test');

    const phrases = await phraseService.getAllPhrases();
    expect(phrases[0]).toEqual(newPhrase);
  });

  it('updatePhrase actualiza una frase existente', async () => {
    const phrase = await phraseService.addPhrase('Original');
    const updated = await phraseService.updatePhrase(phrase.id, 'Editado');

    expect(updated.text).toBe('Editado');

    const phrases = await phraseService.getAllPhrases();
    expect(phrases[0].text).toBe('Editado');
  });

  it('deletePhrase elimina una frase', async () => {
    const phrase = await phraseService.addPhrase('Eliminar');
    await phraseService.deletePhrase(phrase.id);

    const phrases = await phraseService.getAllPhrases();
    expect(phrases.find(p => p.id === phrase.id)).toBeUndefined();
  });

  it('searchPhrases filtra correctamente', async () => {
    await phraseService.addPhrase('Hola mundo');
    await phraseService.addPhrase('Adiós mundo');

    const result = await phraseService.searchPhrases('hola');
    expect(result).toHaveLength(1);
    expect(result[0].text).toBe('Hola mundo');
  });
});
