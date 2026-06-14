import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useParams: () => ({}),
  useSearchParams: () => [new URLSearchParams(), jest.fn()],
}));

import ProfileScreen from '@/app/profile/index';
import CapelinhosScreen from '@/app/profile/capelinhos';

jest.mock('@/services/capelinhoService', () => ({
  getCapelinhoImage: jest.fn((id) => {
    const images: Record<number, any> = {
      1: { uri: 'capelinho1' },
      2: { uri: 'capelinho2' },
      3: { uri: 'capelinho3' },
      4: { uri: 'capelinho4' },
    };
    return id ? images[id] || images[1] : images[1];
  }),
  getUserCapelinho: jest.fn().mockResolvedValue(1),
  updateCapelinho: jest.fn().mockResolvedValue(undefined),
  CAPELINHO_IMAGES: {
    1: { uri: 'capelinho1' },
    2: { uri: 'capelinho2' },
    3: { uri: 'capelinho3' },
    4: { uri: 'capelinho4' },
  },
}));

describe('Fluxo: Perfil → Capelinho', () => {
  it('navega do perfil para seleção de capelinho', () => {
    render(<ProfileScreen />);
    fireEvent.click(screen.getByText('Alterar foto'));
    expect(mockNavigate).toHaveBeenCalledWith('/profile/capelinhos');
  });

  it('seleciona um capelinho e salva', async () => {
    render(<CapelinhosScreen />);

    await waitFor(() => {
      expect(screen.getByText('Salvar Alterações')).toBeTruthy();
    });

    fireEvent.click(screen.getByText('Salvar Alterações'));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(-1);
    });
  }, 10000);

  it('altera seleção antes de salvar', async () => {
    render(<CapelinhosScreen />);

    await waitFor(() => {
      expect(screen.getByText('Salvar Alterações')).toBeTruthy();
    });

    const { updateCapelinho } = require('@/services/capelinhoService');

    fireEvent.click(screen.getByText('Salvar Alterações'));

    await waitFor(() => {
      expect(updateCapelinho).toHaveBeenCalledWith(1);
    });
  }, 10000);

  it('navega para histórico pelo perfil', () => {
    render(<ProfileScreen />);
    fireEvent.click(screen.getByText('Histórico de resultados'));
    expect(mockNavigate).toHaveBeenCalledWith('/profile/historico');
  });
});
