import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useParams: () => ({}),
  useSearchParams: () => [new URLSearchParams(), jest.fn()],
}));

import RegisterScreen from '@/app/index';
import LoginScreen from '@/app/login';

describe('Fluxo: Cadastro → Login', () => {
  it('cadastro renderiza formulário e navega para login', () => {
    render(<RegisterScreen />);

    expect(screen.getByText('Crie sua conta')).toBeTruthy();
    expect(screen.getByText('Nome')).toBeTruthy();
    expect(screen.getByText('E-mail')).toBeTruthy();
    expect(screen.getByText('Senha')).toBeTruthy();
    expect(screen.getByText('CEP')).toBeTruthy();
    expect(screen.getByText('Cadastrar')).toBeTruthy();

    fireEvent.click(screen.getByText('Fazer login'));
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('login renderiza formulário', () => {
    render(<LoginScreen />);

    expect(screen.getByText('Entre na sua conta')).toBeTruthy();
    expect(screen.getByText('E-mail')).toBeTruthy();
    expect(screen.getByText('Senha')).toBeTruthy();
    expect(screen.getByText('Entrar')).toBeTruthy();
  });

  it('login navega para cadastro', () => {
    render(<LoginScreen />);

    fireEvent.click(screen.getByText('Cadastre-se'));
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
