import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useLocation: () => ({ pathname: '/home' }),
  useParams: () => ({}),
  useSearchParams: () => [new URLSearchParams(), jest.fn()],
}));

import HomeScreen from '@/app/(tabs)/home';

describe('Fluxo: Home e Navegação', () => {
  it('renderiza todas as seções da home', () => {
    render(<HomeScreen />);

    expect(screen.getByText('Universidades em destaque')).toBeTruthy();
    expect(screen.getByText('Faça nosso Quiz Indicador')).toBeTruthy();
    expect(screen.getByText('Iniciar quiz')).toBeTruthy();
  });

  it('navega para o quiz ao pressionar "Iniciar quiz"', () => {
    render(<HomeScreen />);
    fireEvent.click(screen.getByText('Iniciar quiz'));
    expect(mockNavigate).toHaveBeenCalledWith('/quiz');
  });

  it('navega para o chatbot', () => {
    render(<HomeScreen />);
    fireEvent.click(screen.getByText('Iniciar conversa'));
    expect(mockNavigate).toHaveBeenCalledWith('/busca/chatbot');
  });
});
