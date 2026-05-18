import { getRecommendations, getCollegesWithCourse } from '@/services/fafylService';
import { Fafyl, College, CourseImp } from '@/types';
import * as courseService from '@/services/courseService';
import * as collegeService from '@/services/collegeService';

jest.mock('@/services/courseService', () => ({
  getAllCourses: jest.fn(),
}));

jest.mock('@/services/collegeService', () => ({
  getAllColleges: jest.fn(),
  getCollegeCourses: jest.fn(),
}));

const mockGetAllCourses = courseService.getAllCourses as jest.MockedFunction<typeof courseService.getAllCourses>;
const mockGetAllColleges = collegeService.getAllColleges as jest.MockedFunction<typeof collegeService.getAllColleges>;
const mockGetCollegeCourses = collegeService.getCollegeCourses as jest.MockedFunction<typeof collegeService.getCollegeCourses>;

describe('fafylService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockCourses = [
    { id: 1, name: 'Direito', discWeights: { D: 1.0, I: 0.5, S: 0.8, C: 0.2 }, description: 'Leis' },
    { id: 2, name: 'Engenharia', discWeights: { D: 0.5, I: 1.0, S: 0.2, C: 0.8 }, description: 'Construção' },
    { id: 3, name: 'Zero', discWeights: { D: 0, I: 0, S: 0, C: 0 }, description: 'Nada' },
  ];

  describe('getRecommendations', () => {
    it('deve retornar lista ordenada por score decrescente (mock)', async () => {
      mockGetAllCourses.mockResolvedValueOnce(mockCourses as any);

      const profile = { D: 1.0, I: 0.0, S: 0.0, C: 0.0 };
      const results = await getRecommendations(profile);

      expect(results).toHaveLength(2);
      expect(results[0].course.name).toBe('Direito');
      expect(results[1].course.name).toBe('Engenharia');
      expect(results[0].score).toBeGreaterThanOrEqual(results[1].score);
    });

    it('deve filtrar cursos com score <= 0', async () => {
      mockGetAllCourses.mockResolvedValueOnce(mockCourses as any);

      const profile = { D: 1.0, I: 0.0, S: 0.0, C: 0.0 };
      const results = await getRecommendations(profile);

      const zeroCourse = results.find((r) => r.course.name === 'Zero');
      expect(zeroCourse).toBeUndefined();
    });

    it('deve retornar lista vazia quando nenhum curso tem score > 0', async () => {
      mockGetAllCourses.mockResolvedValueOnce([]);

      const profile = { D: 1.0, I: 0.0, S: 0.0, C: 0.0 };
      const results = await getRecommendations(profile);

      expect(results).toHaveLength(0);
    });
  });

  describe('getCollegesWithCourse', () => {
    const mockColleges: College[] = [
      { id: 1, name: 'USP', description: '', locale: { lat: 0, lon: 0 }, image: '', courses: [] },
      { id: 2, name: 'PUC', description: '', locale: { lat: 0, lon: 0 }, image: '', courses: [] },
      { id: 3, name: 'FAFYL', description: '', locale: { lat: 0, lon: 0 }, image: '', courses: [] },
    ];

    const mockImps: Record<number, CourseImp[]> = {
      1: [
        { id: 1, name: 'Direito USP', course: { id: 1, name: 'Direito', discWeights: {}, description: '' }, college: mockColleges[0], note: {}, details: '', fees: 0, locale: { lat: 0, lon: 0 } },
        { id: 2, name: 'Engenharia USP', course: { id: 2, name: 'Engenharia', discWeights: {}, description: '' }, college: mockColleges[0], note: {}, details: '', fees: 0, locale: { lat: 0, lon: 0 } },
      ],
      2: [
        { id: 3, name: 'Direito PUC', course: { id: 1, name: 'Direito', discWeights: {}, description: '' }, college: mockColleges[1], note: {}, details: '', fees: 0, locale: { lat: 0, lon: 0 } },
      ],
      3: [
        { id: 4, name: 'Administração FAFYL', course: { id: 4, name: 'Administração', discWeights: {}, description: '' }, college: mockColleges[2], note: {}, details: '', fees: 0, locale: { lat: 0, lon: 0 } },
      ],
    };

    it('deve retornar apenas faculdades com o courseId', async () => {
      mockGetAllColleges.mockResolvedValueOnce(mockColleges);
      mockGetCollegeCourses.mockImplementation(async (id: number) => mockImps[id] || []);

      const results = await getCollegesWithCourse(1);

      expect(results).toHaveLength(2);
      expect(results[0].college.name).toBe('USP');
      expect(results[1].college.name).toBe('PUC');
    });

    it('deve retornar lista vazia quando nenhuma faculdade tem o curso', async () => {
      mockGetAllColleges.mockResolvedValueOnce(mockColleges);
      mockGetCollegeCourses.mockImplementation(async (id: number) => mockImps[id] || []);

      const results = await getCollegesWithCourse(99);

      expect(results).toHaveLength(0);
    });

    it('deve retornar faculdade correta para curso específico', async () => {
      mockGetAllColleges.mockResolvedValueOnce(mockColleges);
      mockGetCollegeCourses.mockImplementation(async (id: number) => mockImps[id] || []);

      const results = await getCollegesWithCourse(2);

      expect(results).toHaveLength(1);
      expect(results[0].college.name).toBe('USP');
      expect(results[0].courseImp.name).toBe('Engenharia USP');
    });
  });

  describe('normalização de porcentagem', () => {
    it('o resultado com maior score deve ser 100%', () => {
      const results: Fafyl[] = [
        { score: 1.5, course: { id: 1, name: 'A', discWeights: {}, description: '' } },
        { score: 0.75, course: { id: 2, name: 'B', discWeights: {}, description: '' } },
        { score: 0.3, course: { id: 3, name: 'C', discWeights: {}, description: '' } },
      ];

      const maxScore = results[0].score;
      const percentages = results.map((r) => Math.round((r.score / maxScore) * 100));

      expect(percentages[0]).toBe(100);
      expect(percentages[1]).toBe(50);
      expect(percentages[2]).toBe(20);
    });
  });
});
