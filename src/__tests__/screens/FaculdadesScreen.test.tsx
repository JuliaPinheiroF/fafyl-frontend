import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useParams: () => ({}),
  useSearchParams: () => [new URLSearchParams('courseId=1'), jest.fn()],
}));

import FaculdadesScreen from '@/app/busca/faculdades';

jest.mock('@/services/collegeService', () => ({
  getAllColleges: jest.fn().mockResolvedValue([
    {
      id: 1,
      name: 'FAFYL',
      description: 'Faculdade de Tecnologia',
      locale: { lat: -23.5505, lon: -46.6333 },
      image: '',
      courses: [],
    },
  ]),
  getCollegeCourses: jest.fn().mockResolvedValue([]),
}));

describe('FaculdadesScreen', () => {
  it('renderiza search box', async () => {
    render(<FaculdadesScreen />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Buscar faculdade...')).toBeTruthy();
    });
  });
});
