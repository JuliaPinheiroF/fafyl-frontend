import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useParams: () => ({}),
  useSearchParams: () => [new URLSearchParams(), jest.fn()],
}));

import ProfileScreen from '@/app/profile/index';

describe('ProfileScreen', () => {
  it('renderiza campos de input com placeholders', () => {
    render(<ProfileScreen />);
    expect(screen.getByPlaceholderText('User')).toBeTruthy();
    expect(screen.getByPlaceholderText('Nome')).toBeTruthy();
    expect(screen.getByPlaceholderText('E-mail')).toBeTruthy();
    expect(screen.getByPlaceholderText('CEP')).toBeTruthy();
  });

  it('renderiza botão "Alterar foto"', () => {
    render(<ProfileScreen />);
    expect(screen.getByText('Alterar foto')).toBeTruthy();
  });

  it('navega para capelinhos ao pressionar "Alterar foto"', () => {
    render(<ProfileScreen />);
    fireEvent.click(screen.getByText('Alterar foto'));
    expect(mockNavigate).toHaveBeenCalledWith('/profile/capelinhos');
  });
});
