import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import App from '@/App';

jest.mock('@/services/quizService', () => ({
  getQuestions: jest.fn().mockResolvedValue([]),
  MOCK_QUESTIONS: [],
  computeDiscProfile: jest.fn().mockReturnValue({ D: 0, I: 0, S: 0, C: 0 }),
}));

jest.mock('@/services/fafylService', () => ({
  getRecommendations: jest.fn().mockResolvedValue([]),
  getCollegesWithCourse: jest.fn().mockResolvedValue([]),
}));

jest.mock('@/services/collegeService', () => ({
  getAllColleges: jest.fn().mockResolvedValue([]),
  getCollegeCourses: jest.fn().mockResolvedValue([]),
}));

jest.mock('@/services/courseService', () => ({
  getAllCourses: jest.fn().mockResolvedValue([]),
}));

jest.mock('@/services/capelinhoService', () => ({
  getUserCapelinho: jest.fn().mockResolvedValue(1),
  updateCapelinho: jest.fn().mockResolvedValue({ id: 1, capelinho: 1 }),
  getCapelinhoImage: jest.fn().mockReturnValue('/images/curioso.png'),
  CAPELINHO_IMAGES: { 1: '/images/curioso.png', 2: '/images/triste.png', 3: '/images/muitofeliz.png', 4: '/images/serio.png' },
}));

jest.mock('@/services/historyService', () => ({
  getHistory: jest.fn().mockResolvedValue([]),
  formatDate: jest.fn().mockReturnValue('01/01/2024'),
}));

function renderAppAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>
  );
}

let consoleErrorSpy: jest.SpyInstance;

beforeEach(() => {
  consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  consoleErrorSpy.mockRestore();
});

describe('AppRouter', () => {
  it('renderiza Register na rota /', async () => {
    renderAppAt('/');
    expect(await screen.findByText('Crie sua conta')).toBeTruthy();
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it('renderiza Login na rota /login', async () => {
    renderAppAt('/login');
    expect(await screen.findByText('Entre na sua conta')).toBeTruthy();
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it('renderiza Home na rota /home', async () => {
    renderAppAt('/home');
    expect(await screen.findByText('Universidades em destaque')).toBeTruthy();
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it('renderiza Busca na rota /busca', async () => {
    renderAppAt('/busca');
    expect(await screen.findByText('O que você procura?')).toBeTruthy();
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it('renderiza QuizInfo na rota /quiz-info', async () => {
    renderAppAt('/quiz-info');
    await screen.findByText('Como funciona o nosso quiz');
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it('renderiza Sobre na rota /sobre', async () => {
    renderAppAt('/sobre');
    expect(await screen.findByText('Sobre nós')).toBeTruthy();
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it('renderiza Quiz na rota /quiz', async () => {
    renderAppAt('/quiz');
    expect(await screen.findByText('Carregando perguntas...')).toBeTruthy();
    await act(() => Promise.resolve());
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it('renderiza Resultado na rota /quiz/resultado com profile', async () => {
    const profile = encodeURIComponent(JSON.stringify({ D: 1, I: 0.5, S: 0.3, C: 0.8 }));
    renderAppAt('/quiz/resultado?profile=' + profile);
    expect(await screen.findByText('Calculando compatibilidade...')).toBeTruthy();
    await act(() => Promise.resolve());
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it('renderiza Faculdades na rota /busca/faculdades', async () => {
    renderAppAt('/busca/faculdades');
    expect(await screen.findByPlaceholderText('Buscar faculdade...')).toBeTruthy();
    await act(() => Promise.resolve());
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it('renderiza Cursos na rota /busca/cursos', async () => {
    renderAppAt('/busca/cursos');
    expect(await screen.findByPlaceholderText('Buscar curso...')).toBeTruthy();
    await act(() => Promise.resolve());
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it('renderiza Profile na rota /profile', async () => {
    renderAppAt('/profile');
    expect(await screen.findByText('Meu Perfil')).toBeTruthy();
    await act(() => Promise.resolve());
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it('renderiza Capelinhos na rota /profile/capelinhos', async () => {
    renderAppAt('/profile/capelinhos');
    expect(await screen.findByText('Salvar Alterações')).toBeTruthy();
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it('renderiza Histórico na rota /profile/historico', async () => {
    renderAppAt('/profile/historico');
    await waitFor(() => {
      expect(screen.getByText('Nenhum resultado ainda')).toBeTruthy();
    });
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it('renderiza Editar na rota /profile/editar', async () => {
    renderAppAt('/profile/editar');
    expect(await screen.findByText('Nome')).toBeTruthy();
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });
});
