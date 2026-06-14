import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useParams: () => ({}),
  useSearchParams: () => [new URLSearchParams(), jest.fn()],
}));

import QuizScreen from '@/app/quiz/index';
import { MOCK_QUESTIONS, computeDiscProfile } from '@/services/quizService';

const TOTAL_QUESTIONS = MOCK_QUESTIONS.length;

jest.mock('@/services/quizService', () => {
  const actual = jest.requireActual('@/services/quizService');
  return {
    ...actual,
    getQuestions: jest.fn().mockResolvedValue(actual.MOCK_QUESTIONS),
  };
});

describe('Fluxo: Quiz Completo', () => {
  const advanceToNext = () => {
    fireEvent.click(screen.getByText('Próxima'));
  };

  it('navega por todas as 12 perguntas e redireciona ao resultado', async () => {
    render(<QuizScreen />);

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
        advanceToNext();
      }
    }

    expect(screen.getByText('Ver resultado')).toBeTruthy();
    fireEvent.click(screen.getByText('Ver resultado'));

    const expectedAnswers = new Map(
      MOCK_QUESTIONS.map((q) => [q.id, q.alternatives[0].id])
    );
    const expectedProfile = computeDiscProfile(expectedAnswers, MOCK_QUESTIONS);
    expect(mockNavigate).toHaveBeenCalledWith(
      '/quiz/resultado?profile=' + encodeURIComponent(JSON.stringify(expectedProfile))
    );
  }, 30000);
});
