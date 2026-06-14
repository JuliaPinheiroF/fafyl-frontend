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

describe('HomeScreen', () => {
  it('renderiza seção de universidades em destaque', () => {
    render(<HomeScreen />);
    expect(screen.getByText('Universidades em destaque')).toBeTruthy();
  });

  it('renderiza seção do quiz', () => {
    render(<HomeScreen />);
    expect(screen.getByText('Faça nosso Quiz Indicador')).toBeTruthy();
  });

  it('renderiza botão "Iniciar quiz"', () => {
    render(<HomeScreen />);
    expect(screen.getByText('Iniciar quiz')).toBeTruthy();
  });

  it('navega para /quiz ao pressionar "Iniciar quiz"', () => {
    render(<HomeScreen />);
    fireEvent.click(screen.getByText('Iniciar quiz'));
    expect(mockNavigate).toHaveBeenCalledWith('/quiz');
  });
});
