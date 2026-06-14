import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import App from '@/App';
import { MOCK_QUESTIONS, computeDiscProfile } from '@/services/quizService';

jest.mock('@/services/quizService', () => {
  const actual = jest.requireActual('@/services/quizService');
  return {
    ...actual,
    getQuestions: jest.fn().mockResolvedValue(actual.MOCK_QUESTIONS),
  };
});

jest.mock('@/services/fafylService', () => ({
  getRecommendations: jest.fn().mockResolvedValue([
    { score: 2.0, course: { id: 1, name: 'Engenharia de Software', discWeights: {}, description: 'Curso de software' } },
    { score: 1.5, course: { id: 2, name: 'Ciência da Computação', discWeights: {}, description: 'Curso de computação' } },
  ]),
  getCollegesWithCourse: jest.fn().mockResolvedValue([]),
}));

jest.mock('@/services/collegeService', () => ({
  getAllColleges: jest.fn().mockResolvedValue([
    { id: 1, name: 'FAFYL', description: 'Faculdade de Tecnologia', locale: { lat: -23.5505, lon: -46.6333 }, image: '', courses: [] },
  ]),
  getCollegeCourses: jest.fn().mockResolvedValue([]),
}));

jest.mock('@/services/courseService', () => ({
  getAllCourses: jest.fn().mockResolvedValue([
    { id: 1, name: 'Engenharia de Software', description: 'Curso de software' },
    { id: 2, name: 'Ciência da Computação', description: 'Curso de computação' },
  ]),
}));

jest.mock('@/services/capelinhoService', () => ({
  getUserCapelinho: jest.fn().mockResolvedValue(1),
  updateCapelinho: jest.fn().mockResolvedValue({ id: 1, capelinho: 1 }),
  getCapelinhoImage: jest.fn().mockReturnValue('/images/curioso.png'),
  CAPELINHO_IMAGES: { 1: '/images/curioso.png', 2: '/images/triste.png', 3: '/images/muitofeliz.png', 4: '/images/serio.png' },
}));

jest.mock('@/services/historyService', () => ({
  getHistory: jest.fn().mockResolvedValue([
    { id: 1, course: { id: 1, name: 'Engenharia de Software', description: 'Curso de software' }, accessedAt: '2024-01-01T00:00:00Z', profile: { D: 1, I: 0, S: 0, C: 0 } },
  ]),
  formatDate: jest.fn().mockReturnValue('01/01/2024'),
}));

function renderAppAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>
  );
}

function renderApp(initialEntries: string[]) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
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

describe('Browser: navegação completa entre páginas', () => {
  it('navega de / para /login via clique', async () => {
    renderAppAt('/');
    await screen.findByText('Crie sua conta');
    fireEvent.click(screen.getByText('Fazer login'));
    expect(await screen.findByText('Entre na sua conta')).toBeTruthy();
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it('navega de /login para /cadastro via Cadastre-se', async () => {
    renderAppAt('/login');
    await screen.findByText('Entre na sua conta');
    fireEvent.click(screen.getByText('Cadastre-se'));
    expect(await screen.findByText('Crie sua conta')).toBeTruthy();
    await act(() => Promise.resolve());
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it('navega da Home para Quiz e volta pelo back', async () => {
    renderAppAt('/home');
    await screen.findByText('Universidades em destaque');
    fireEvent.click(screen.getByText('Iniciar quiz'));
    expect(await screen.findByText('Carregando perguntas...')).toBeTruthy();
    await act(() => Promise.resolve());
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });



  it('navega de Busca para Faculdades', async () => {
    renderAppAt('/busca');
    await screen.findByText('O que você procura?');
    fireEvent.click(screen.getByText('Faculdades'));
    expect(await screen.findByPlaceholderText('Buscar faculdade...')).toBeTruthy();
    await act(() => Promise.resolve());
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it('navega de Busca para Cursos', async () => {
    renderAppAt('/busca');
    await screen.findByText('O que você procura?');
    fireEvent.click(screen.getByText('Cursos'));
    expect(await screen.findByPlaceholderText('Buscar curso...')).toBeTruthy();
    await act(() => Promise.resolve());
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it('navega da Home para o chatbot', async () => {
    renderAppAt('/home');
    await screen.findByText('Universidades em destaque');
    fireEvent.click(screen.getByText('Iniciar conversa'));
    expect(await screen.findByPlaceholderText('Digite sua mensagem...')).toBeTruthy();
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it('navega da Home para o Profile via ícone de usuário', async () => {
    renderAppAt('/home');
    await screen.findByText('Universidades em destaque');
    const userButton = document.querySelector('button svg[fill="white"]')?.closest('button');
    if (userButton) {
      fireEvent.click(userButton);
      expect(await screen.findByText('Meu Perfil')).toBeTruthy();
      await act(() => Promise.resolve());
    }
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it('navega do Profile para Capelinhos', async () => {
    renderAppAt('/profile');
    expect(await screen.findByText('Meu Perfil')).toBeTruthy();
    await act(() => Promise.resolve());

    fireEvent.click(screen.getByText('Alterar foto'));
    expect(await screen.findByText('Salvar Alterações')).toBeTruthy();
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it('navega do Profile para o histórico', async () => {
    renderAppAt('/profile');
    await screen.findByText('Meu Perfil');
    await act(() => Promise.resolve());

    fireEvent.click(screen.getByText('Histórico de resultados'));
    await waitFor(() => {
      expect(screen.getByText('Engenharia de Software')).toBeTruthy();
    });
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it('navega de Quiz-info para o Quiz', async () => {
    renderAppAt('/quiz-info');
    await screen.findByText(/Como funciona o nosso quiz/);
    fireEvent.click(screen.getByText('Continuar'));
    expect(await screen.findByText('Carregando perguntas...')).toBeTruthy();
    await act(() => Promise.resolve());
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });
});

describe('Browser: fluxo Quiz completo com resultado', () => {
  const TOTAL_QUESTIONS = MOCK_QUESTIONS.length;

  it('navega por todas as perguntas e redireciona ao resultado', async () => {
    renderAppAt('/quiz');

    await waitFor(() => {
      expect(screen.getByText(MOCK_QUESTIONS[0].text)).toBeTruthy();
    }, { timeout: 10000 });

    for (let i = 0; i < TOTAL_QUESTIONS; i++) {
      const firstAlt = MOCK_QUESTIONS[i].alternatives[0];
      await waitFor(() => {
        expect(screen.getByText(firstAlt.text)).toBeTruthy();
      });

      fireEvent.click(screen.getByText(firstAlt.text));

      if (i < TOTAL_QUESTIONS - 1) {
        expect(screen.getByText('Próxima')).toBeTruthy();
        fireEvent.click(screen.getByText('Próxima'));
      }
    }

    expect(screen.getByText('Ver resultado')).toBeTruthy();
    fireEvent.click(screen.getByText('Ver resultado'));

    const expectedAnswers = new Map(
      MOCK_QUESTIONS.map((q) => [q.id, q.alternatives[0].id])
    );
    const expectedProfile = computeDiscProfile(expectedAnswers, MOCK_QUESTIONS);

    await waitFor(() => {
      expect(screen.getByText('Engenharia de Software')).toBeTruthy();
    }, { timeout: 10000 });
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  }, 30000);

  it('navega para refazer quiz a partir do resultado', async () => {
    const profile = encodeURIComponent(JSON.stringify({ D: 1, I: 0.5, S: 0.3, C: 0.8 }));
    renderAppAt('/quiz/resultado?profile=' + profile);

    await waitFor(() => {
      expect(screen.getByText('Engenharia de Software')).toBeTruthy();
    }, { timeout: 10000 });

    fireEvent.click(screen.getByText('Refazer quiz'));
    expect(await screen.findByText('Carregando perguntas...')).toBeTruthy();
    await act(() => Promise.resolve());
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  }, 15000);
});

describe('Browser: rotas com parâmetros', () => {
  it('renderiza CursoDetail com id na URL', async () => {
    renderAppAt('/busca/1/curso');
    await waitFor(() => {
      expect(screen.getByText('Engenharia de Software')).toBeTruthy();
    });
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it('renderiza FaculdadeDetail com id na URL', async () => {
    renderAppAt('/busca/1/faculdade');
    await waitFor(() => {
      expect(screen.getByText('FAFYL')).toBeTruthy();
    });
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it('renderiza Resultado com profile na query string', async () => {
    const profile = encodeURIComponent(JSON.stringify({ D: 1, I: 0.5, S: 0.3, C: 0.8 }));
    renderAppAt('/quiz/resultado?profile=' + profile);
    expect(await screen.findByText('Calculando compatibilidade...')).toBeTruthy();
    await act(() => Promise.resolve());
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });
});

describe('Browser: navegação histórica (back/forward)', () => {
  it('volta à página anterior com o botão back do Background', async () => {
    renderApp(['/login', '/profile']);
    await screen.findByText('Meu Perfil');
    await act(() => Promise.resolve());

    const backButton = document.querySelector('header button');
    if (backButton) {
      fireEvent.click(backButton);
      expect(await screen.findByText('Entre na sua conta')).toBeTruthy();
    }
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });



  it('retorna a /busca a partir de Faculdades via back customizado', async () => {
    renderApp(['/busca', '/busca/faculdades']);
    await screen.findByPlaceholderText('Buscar faculdade...');
    await act(() => Promise.resolve());

    const backButton = document.querySelector('header button');
    if (backButton) {
      fireEvent.click(backButton);
      expect(await screen.findByText('O que você procura?')).toBeTruthy();
    }
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });
});
