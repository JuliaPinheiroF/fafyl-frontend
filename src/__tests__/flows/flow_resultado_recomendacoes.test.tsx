import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useParams: () => ({
    profile: JSON.stringify({ D: 1, I: 0.5, S: 0.3, C: 0.8 }),
  }),
  useSearchParams: () => [new URLSearchParams('profile=' + encodeURIComponent(JSON.stringify({ D: 1, I: 0.5, S: 0.3, C: 0.8 }))), jest.fn()],
}));

import ResultadoScreen from '@/app/quiz/resultado';

jest.mock('@/services/fafylService', () => ({
  getRecommendations: jest.fn().mockResolvedValue([
    { score: 2.5, course: { id: 1, name: 'Engenharia de Software', discWeights: { D: 0.8, I: 0.5, S: 0.3, C: 0.9 }, description: 'Curso de engenharia de software' } },
    { score: 1.8, course: { id: 2, name: 'Ciência da Computação', discWeights: { D: 0.6, I: 0.4, S: 0.5, C: 0.8 }, description: 'Curso de ciência da computação' } },
    { score: 0.9, course: { id: 3, name: 'Administração', discWeights: { D: 0.7, I: 0.8, S: 0.6, C: 0.3 }, description: 'Curso de administração' } },
  ]),
}));

describe('Fluxo: Resultado e Recomendações', () => {
  it('carrega resultados, exibe scores corretos e navega para faculdades', async () => {
    render(<ResultadoScreen />);

    expect(screen.getByText('Calculando compatibilidade...')).toBeTruthy();

    await waitFor(() => {
      expect(screen.getByText('Engenharia de Software')).toBeTruthy();
    }, { timeout: 10000 });

    expect(screen.getByText('Ciência da Computação')).toBeTruthy();
    expect(screen.getByText('Administração')).toBeTruthy();

    expect(screen.getByText('100%')).toBeTruthy();
    expect(screen.getByText('72%')).toBeTruthy();
    expect(screen.getByText('36%')).toBeTruthy();

    expect(screen.getByText('Seus cursos recomendados!')).toBeTruthy();
    expect(screen.getByText(/3 cursos compatíveis/)).toBeTruthy();

    const verFaculdadesButtons = screen.getAllByText('Ver faculdades');
    expect(verFaculdadesButtons).toHaveLength(3);

    fireEvent.click(verFaculdadesButtons[0]);
    expect(mockNavigate).toHaveBeenCalledWith('/busca/faculdades?courseId=1');
  }, 15000);

  it('navega para refazer quiz', async () => {
    render(<ResultadoScreen />);
    mockNavigate.mockClear();

    await waitFor(() => {
      expect(screen.getByText('Engenharia de Software')).toBeTruthy();
    }, { timeout: 10000 });

    fireEvent.click(screen.getByText('Refazer quiz'));
    expect(mockNavigate).toHaveBeenCalledWith('/quiz', { replace: true });
  }, 15000);
});
