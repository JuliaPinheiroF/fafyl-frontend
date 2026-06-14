import React from 'react';
import { render, screen } from '@testing-library/react';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useParams: () => ({}),
  useSearchParams: () => [new URLSearchParams(), jest.fn()],
}));

import CapelinhosScreen from '@/app/profile/capelinhos';

describe('CapelinhosScreen', () => {
  it('renderiza botão "Salvar Alterações"', () => {
    render(<CapelinhosScreen />);
    expect(screen.getByText('Salvar Alterações')).toBeTruthy();
  });
});
