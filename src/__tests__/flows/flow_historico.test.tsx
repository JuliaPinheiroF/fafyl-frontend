import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useParams: () => ({}),
  useSearchParams: () => [new URLSearchParams(), jest.fn()],
}));

import HistoricoScreen from '@/app/profile/historico';

jest.mock('@/services/historyService', () => ({
  getHistory: jest.fn().mockResolvedValue([]),
  formatDate: jest.fn((d: string) => {
    const date = new Date(d);
    return date.toLocaleDateString('pt-BR');
  }),
}));

describe('Fluxo: Histórico Vazio → Quiz', () => {
  it('exibe estado vazio e navega para quiz', async () => {
    render(<HistoricoScreen />);

    await waitFor(() => {
      expect(screen.getByText('Nenhum resultado ainda')).toBeTruthy();
    }, { timeout: 10000 });

    expect(screen.getByText('Faça o quiz para receber recomendações de cursos.')).toBeTruthy();

    const quizButton = screen.getByText('Fazer quiz');
    expect(quizButton).toBeTruthy();

    fireEvent.click(quizButton);
    expect(mockNavigate).toHaveBeenCalledWith('/quiz');
  }, 15000);
});
