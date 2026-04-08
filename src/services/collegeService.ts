import { College, CourseImp } from '@/types';
import { request } from './api';
import { getAllCourseImps } from './courseService';

const MOCK_COLLEGES: College[] = [
  {
    id: 1,
    name: 'FAFYL',
    description: 'Centro de Tecnologia e Inovação com foco em computação e engenharia digital.',
    locale: { lat: -23.5505, lon: -46.6333 },
    image: 'https://images.unsplash.com/photo-1562774053-701939374585?w=600&q=80',
    courses: [],
  },
  {
    id: 2,
    name: 'Tech Institute',
    description: 'Instituto especializado em engenharia, design e ciências aplicadas.',
    locale: { lat: -22.9068, lon: -43.1729 },
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&q=80',
    courses: [],
  },
  {
    id: 3,
    name: 'Nova Academy',
    description: 'Referência em ciências da computação e inteligência artificial.',
    locale: { lat: -19.9167, lon: -43.9345 },
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c8f1?w=600&q=80',
    courses: [],
  },
  {
    id: 4,
    name: 'Future School',
    description: 'Focada em negócios digitais, marketing e gestão inovadora.',
    locale: { lat: -30.0346, lon: -51.2177 },
    image: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=600&q=80',
    courses: [],
  },
  {
    id: 5,
    name: 'Smart College',
    description: 'Polo de inteligência artificial, data science e robótica.',
    locale: { lat: -25.4284, lon: -49.2733 },
    image: 'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?w=600&q=80',
    courses: [],
  },
];

export async function getAllColleges(): Promise<College[]> {
  try {
    return await request<College[]>('/college');
  } catch {
    return MOCK_COLLEGES;
  }
}

export async function getCollegeCourses(id: number): Promise<CourseImp[]> {
  try {
    return await request<CourseImp[]>(`/college/${id}/course`);
  } catch {
    const allImps = await getAllCourseImps();
    return allImps.filter((imp) => imp.college.id === id);
  }
}
