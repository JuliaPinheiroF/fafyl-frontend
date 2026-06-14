import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useLocation: () => ({ pathname: '/busca' }),
  useParams: () => ({}),
  useSearchParams: () => [new URLSearchParams(), jest.fn()],
}));

import BuscaScreen from '@/app/(tabs)/busca';
import FaculdadesScreen from '@/app/busca/faculdades';

jest.mock('@/services/collegeService', () => ({
  getAllColleges: jest.fn().mockResolvedValue([
    { id: 1, name: 'FAFYL', description: 'Faculdade de Tecnologia', locale: { lat: -23.5505, lon: -46.6333 }, image: '', courses: [] },
    { id: 2, name: 'Tech College', description: 'Engenharia e Inovação', locale: { lat: -23.561, lon: -46.656 }, image: '', courses: [] },
    { id: 3, name: 'Nova Academy', description: 'Ciências da Computação', locale: { lat: -23.570, lon: -46.640 }, image: '', courses: [] },
  ]),
  getCollegeCourses: jest.fn().mockResolvedValue([]),
}));

describe('Fluxo: Busca → Faculdades', () => {
  it('navega para faculdades', () => {
    render(<BuscaScreen />);
    expect(screen.getByText('O que você procura?')).toBeTruthy();

    fireEvent.click(screen.getByText('Faculdades'));
    expect(mockNavigate).toHaveBeenCalledWith('/busca/faculdades');
  });
});

describe('Fluxo: Faculdades - busca e filtro', () => {
  it('renderiza lista e filtra por nome', async () => {
    render(<FaculdadesScreen />);

    await waitFor(() => {
      expect(screen.queryByText('Tech College')).not.toBeNull();
    }, { timeout: 15000 });

    await waitFor(() => {
      expect(screen.queryByText('Nova Academy')).not.toBeNull();
    });

    const searchInput = screen.getByPlaceholderText('Buscar faculdade...');
    fireEvent.change(searchInput, { target: { value: 'Tech' } });

    await waitFor(() => {
      expect(screen.queryByText('Nova Academy')).toBeNull();
    });
    expect(screen.getByText('Tech College')).toBeTruthy();

    fireEvent.change(searchInput, { target: { value: '' } });
    await waitFor(() => {
      expect(screen.queryByText('Nova Academy')).not.toBeNull();
    });
  }, 20000);
});
