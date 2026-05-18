import { getQuestions, computeDiscProfile, MOCK_QUESTIONS } from '@/services/quizService';
import { Question } from '@/types';

jest.mock('@/api', () => ({
  request: jest.fn(),
}));

import * as api from '@/api';

const mockRequest = api.request as jest.MockedFunction<typeof api.request>;

describe('quizService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getQuestions', () => {
    it('deve retornar perguntas da API quando disponível', async () => {
      const mockQuestions: Question[] = [
        {
          id: 99,
          text: 'Pergunta da API',
          alternatives: [
            { id: 1, text: 'Sim', dimension: 'D', weight: 1.0 },
          ],
        },
      ];
      mockRequest.mockResolvedValueOnce(mockQuestions);

      const result = await getQuestions();

      expect(result).toEqual(mockQuestions);
      expect(mockRequest).toHaveBeenCalledWith('/data/questions');
    });

    it('deve retornar mock quando API falha', async () => {
      mockRequest.mockRejectedValueOnce(new Error('API error'));

      const result = await getQuestions();

      expect(result).toEqual(MOCK_QUESTIONS);
      expect(result.length).toBeGreaterThan(0);
    });

    it('mock deve ter 12 perguntas', () => {
      expect(MOCK_QUESTIONS).toHaveLength(12);
    });

    it('cada pergunta mock deve ter 4 alternativas', () => {
      MOCK_QUESTIONS.forEach((q) => {
        expect(q.alternatives).toHaveLength(4);
      });
    });

    it('cada alternativa deve ter dimension e weight válidos', () => {
      MOCK_QUESTIONS.forEach((q) => {
        q.alternatives.forEach((a) => {
          expect(['D', 'I', 'S', 'C']).toContain(a.dimension);
          expect(a.weight).toBeGreaterThanOrEqual(0);
          expect(a.weight).toBeLessThanOrEqual(1);
        });
      });
    });
  });

  describe('computeDiscProfile', () => {
    const mockQuestions: Question[] = [
      {
        id: 1,
        text: 'Pergunta 1',
        alternatives: [
          { id: 1, text: 'D alto', dimension: 'D', weight: 1.0 },
          { id: 2, text: 'I alto', dimension: 'I', weight: 0.8 },
          { id: 3, text: 'S alto', dimension: 'S', weight: 0.6 },
          { id: 4, text: 'C alto', dimension: 'C', weight: 0.4 },
        ],
      },
      {
        id: 2,
        text: 'Pergunta 2',
        alternatives: [
          { id: 1, text: 'D médio', dimension: 'D', weight: 0.5 },
          { id: 2, text: 'I alto', dimension: 'I', weight: 1.0 },
          { id: 3, text: 'S baixo', dimension: 'S', weight: 0.2 },
          { id: 4, text: 'C alto', dimension: 'C', weight: 0.9 },
        ],
      },
    ];

    it('deve calcular perfil com respostas todas em D', () => {
      const answers = new Map<number, number>([
        [1, 1],
        [2, 1],
      ]);

      const profile = computeDiscProfile(answers, mockQuestions);

      expect(profile.D).toBeCloseTo(1.5);
      expect(profile.I).toBe(0);
      expect(profile.S).toBe(0);
      expect(profile.C).toBe(0);
    });

    it('deve calcular perfil com respostas mistas', () => {
      const answers = new Map<number, number>([
        [1, 1],
        [2, 2],
      ]);

      const profile = computeDiscProfile(answers, mockQuestions);

      expect(profile.D).toBeCloseTo(1.0);
      expect(profile.I).toBeCloseTo(1.0);
      expect(profile.S).toBe(0);
      expect(profile.C).toBe(0);
    });

    it('deve retornar exatamente 4 chaves (D, I, S, C)', () => {
      const answers = new Map<number, number>([[1, 1]]);
      const profile = computeDiscProfile(answers, mockQuestions);

      expect(Object.keys(profile)).toHaveLength(4);
      expect(profile).toHaveProperty('D');
      expect(profile).toHaveProperty('I');
      expect(profile).toHaveProperty('S');
      expect(profile).toHaveProperty('C');
    });

    it('deve ignorar respostas para perguntas inexistentes', () => {
      const answers = new Map<number, number>([
        [999, 1],
      ]);

      const profile = computeDiscProfile(answers, mockQuestions);

      expect(profile.D).toBe(0);
      expect(profile.I).toBe(0);
      expect(profile.S).toBe(0);
      expect(profile.C).toBe(0);
    });

    it('deve ignorar alternativas inexistentes', () => {
      const answers = new Map<number, number>([
        [1, 999],
      ]);

      const profile = computeDiscProfile(answers, mockQuestions);

      expect(profile.D).toBe(0);
      expect(profile.I).toBe(0);
      expect(profile.S).toBe(0);
      expect(profile.C).toBe(0);
    });

    it('deve somar pesos corretamente para perfil balanceado', () => {
      const answers = new Map<number, number>([
        [1, 1],
        [2, 2],
      ]);

      const profile = computeDiscProfile(answers, mockQuestions);

      expect(profile.D).toBeCloseTo(1.0);
      expect(profile.I).toBeCloseTo(1.0);
    });
  });
});
