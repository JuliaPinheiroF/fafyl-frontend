import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useParams: () => ({}),
  useSearchParams: () => [new URLSearchParams('profile=' + encodeURIComponent(JSON.stringify({ D: 1, I: 0.5, S: 0.3, C: 0.8 }))), jest.fn()],
}));

import ResultadoScreen from '@/app/quiz/resultado';

jest.mock('@/services/fafylService', () => ({
  getRecommendations: jest.fn().mockResolvedValue([
    { score: 1.5, course: { id: 1, name: 'Engenharia de Software', discWeights: {}, description: 'Curso de software' } },
    { score: 0.8, course: { id: 2, name: 'Ciência da Computação', discWeights: {}, description: 'Curso de computação' } },
  ]),
}));

describe('ResultadoScreen', () => {
  it('exibe loading inicialmente', () => {
    render(<ResultadoScreen />);
    expect(screen.getByText('Calculando compatibilidade...')).toBeTruthy();
  });

  it('renderiza resultados após carregar', async () => {
    render(<ResultadoScreen />);

    await waitFor(() => {
      expect(screen.getByText('Engenharia de Software')).toBeTruthy();
    }, { timeout: 10000 });
  }, 15000);

  it('renderiza botão "Ver faculdades"', async () => {
    render(<ResultadoScreen />);

    await waitFor(() => {
      expect(screen.getByText('Engenharia de Software')).toBeTruthy();
    }, { timeout: 10000 });

    expect(screen.getAllByText('Ver faculdades')).toHaveLength(2);
  }, 15000);
});
