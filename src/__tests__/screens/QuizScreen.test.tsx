import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useParams: () => ({}),
  useSearchParams: () => [new URLSearchParams(), jest.fn()],
}));

import QuizScreen from '@/app/quiz/index';
import { MOCK_QUESTIONS } from '@/services/quizService';

jest.mock('@/services/quizService', () => {
  const actual = jest.requireActual('@/services/quizService');
  return {
    ...actual,
    getQuestions: jest.fn().mockResolvedValue(actual.MOCK_QUESTIONS),
  };
});

describe('QuizScreen', () => {
  it('exibe loading enquanto carrega perguntas', () => {
    render(<QuizScreen />);
    expect(screen.getByText('Carregando perguntas...')).toBeTruthy();
  });

  it('renderiza perguntas e alternativas após carregar', async () => {
    render(<QuizScreen />);

    await waitFor(() => {
      expect(screen.getByText(MOCK_QUESTIONS[0].text)).toBeTruthy();
    }, { timeout: 10000 });

    MOCK_QUESTIONS[0].alternatives.forEach((alt) => {
      expect(screen.getByText(alt.text)).toBeTruthy();
    });
  }, 15000);

  it('mostra progresso após carregar', async () => {
    render(<QuizScreen />);

    await waitFor(() => {
      expect(screen.getByText(/Pergunta 1/)).toBeTruthy();
    }, { timeout: 10000 });
  }, 15000);

  it('permite selecionar alternativa e navegar para próxima', async () => {
    render(<QuizScreen />);

    await waitFor(() => {
      expect(screen.getByText(MOCK_QUESTIONS[0].alternatives[0].text)).toBeTruthy();
    }, { timeout: 10000 });

    fireEvent.click(screen.getByText(MOCK_QUESTIONS[0].alternatives[0].text));
    fireEvent.click(screen.getByText('Próxima'));
  }, 15000);
});
