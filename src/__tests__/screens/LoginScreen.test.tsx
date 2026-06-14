import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useParams: () => ({}),
  useSearchParams: () => [new URLSearchParams(), jest.fn()],
}));

import LoginScreen from '@/app/login';

describe('LoginScreen', () => {
  it('renderiza descrição "Entre na sua conta"', () => {
    render(<LoginScreen />);
    expect(screen.getByText('Entre na sua conta')).toBeTruthy();
  });

  it('renderiza campos de email e senha', () => {
    render(<LoginScreen />);
    expect(screen.getByText('E-mail')).toBeTruthy();
    expect(screen.getByText('Senha')).toBeTruthy();
  });

  it('renderiza botão "Entrar"', () => {
    render(<LoginScreen />);
    expect(screen.getByText('Entrar')).toBeTruthy();
  });

  it('navega para home ao pressionar "Cadastre-se"', () => {
    render(<LoginScreen />);
    fireEvent.click(screen.getByText('Cadastre-se'));
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
