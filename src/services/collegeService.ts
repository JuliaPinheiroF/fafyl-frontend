import { College, CourseImp, CollegeFilters, PageResponse } from '@/types';
import { request, buildQuery } from './api';
import { getAllCourseImps } from './courseService';
import { cached } from './cache';

const TTL = 5 * 60_000;

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
  return cached('college-all', async () => {
    try {
      const response: any = await request('/college?size=500');
      return response.content || response;
    } catch {
      return MOCK_COLLEGES;
    }
  }, TTL);
}

export async function getCollegesFiltered(filters: CollegeFilters): Promise<PageResponse<College>> {
  try {
    const qs = buildQuery({
      page: filters.page ?? 0,
      size: filters.size ?? 20,
      sortBy: filters.sortBy ?? 'name',
      direction: filters.direction ?? 'asc',
      lat: filters.lat,
      lon: filters.lon,
      maxDistance: filters.maxDistance,
    });
    const response: any = await request(`/college${qs}`);
    return response;
  } catch {
    let filtered = [...MOCK_COLLEGES];
    if (filters.maxDistance && filters.lat && filters.lon) {
      filtered = filtered.filter((c) => {
        if (!c.locale) return false;
        const R = 6371000;
        const dLat = ((c.locale.lat - filters.lat!) * Math.PI) / 180;
        const dLon = ((c.locale.lon - filters.lon!) * Math.PI) / 180;
        const a =
          Math.sin(dLat / 2) ** 2 +
          Math.cos(filters.lat! * Math.PI / 180) * Math.cos(c.locale.lat * Math.PI / 180) *
          Math.sin(dLon / 2) ** 2;
        const dist = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return dist <= filters.maxDistance!;
      });
    }
    const page = filters.page ?? 0;
    const size = filters.size ?? 20;
    const start = page * size;
    const content = filtered.slice(start, start + size);
    return {
      content,
      totalPages: Math.ceil(filtered.length / size),
      totalElements: filtered.length,
      size,
      number: page,
    };
  }
}

export async function getCollegeCourses(id: number): Promise<CourseImp[]> {
  return cached(`college-courses-${id}`, async () => {
    try {
      const response: any = await request(`/college/${id}/course`);
      return response.content || response;
    } catch {
      const allImps = await getAllCourseImps();
      return allImps.filter((imp) => imp.college.id === id);
    }
  }, TTL);
}
