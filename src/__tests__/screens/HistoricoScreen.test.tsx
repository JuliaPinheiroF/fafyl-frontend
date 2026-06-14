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
}));

describe('HistoricoScreen', () => {
  it('exibe mensagem de vazio quando não há histórico', async () => {
    render(<HistoricoScreen />);

    await waitFor(() => {
      expect(screen.getByText('Nenhum resultado ainda')).toBeTruthy();
    }, { timeout: 10000 });
  }, 15000);

  it('renderiza botão "Fazer quiz" quando vazio', async () => {
    render(<HistoricoScreen />);

    await waitFor(() => {
      expect(screen.getByText('Fazer quiz')).toBeTruthy();
    });
  });

  it('navega para /quiz ao pressionar "Fazer quiz"', async () => {
    render(<HistoricoScreen />);

    await waitFor(() => {
      expect(screen.getByText('Fazer quiz')).toBeTruthy();
    });

    fireEvent.click(screen.getByText('Fazer quiz'));
    expect(mockNavigate).toHaveBeenCalledWith('/quiz');
  });
});
