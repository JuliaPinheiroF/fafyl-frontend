import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useParams: () => ({}),
  useSearchParams: () => [new URLSearchParams(), jest.fn()],
}));

import RegisterScreen from '@/app/index';

describe('RegisterScreen', () => {
  it('renderiza descrição "Crie sua conta"', () => {
    render(<RegisterScreen />);
    expect(screen.getByText('Crie sua conta')).toBeTruthy();
  });

  it('renderiza campos de formulário', () => {
    render(<RegisterScreen />);
    expect(screen.getByText('Nome')).toBeTruthy();
    expect(screen.getByText('E-mail')).toBeTruthy();
    expect(screen.getByText('Senha')).toBeTruthy();
    expect(screen.getByText('CEP')).toBeTruthy();
  });

  it('renderiza botão "Cadastrar"', () => {
    render(<RegisterScreen />);
    expect(screen.getByText('Cadastrar')).toBeTruthy();
  });

  it('navega para /login ao pressionar "Fazer login"', () => {
    render(<RegisterScreen />);
    fireEvent.click(screen.getByText('Fazer login'));
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});
