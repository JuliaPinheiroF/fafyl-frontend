import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useLocation: () => ({ pathname: '/busca' }),
  useParams: () => ({}),
  useSearchParams: () => [new URLSearchParams(), jest.fn()],
}));

import BuscaScreen from '@/app/(tabs)/busca';

describe('BuscaScreen', () => {
  it('renderiza título "O que você procura?"', () => {
    render(<BuscaScreen />);
    expect(screen.getByText('O que você procura?')).toBeTruthy();
  });

  it('navega para /busca/faculdades ao pressionar "Faculdades"', () => {
    render(<BuscaScreen />);
    fireEvent.click(screen.getByText('Faculdades'));
    expect(mockNavigate).toHaveBeenCalledWith('/busca/faculdades');
  });

  it('navega para /busca/cursos ao pressionar "Cursos"', () => {
    render(<BuscaScreen />);
    fireEvent.click(screen.getByText('Cursos'));
    expect(mockNavigate).toHaveBeenCalledWith('/busca/cursos');
  });
});
