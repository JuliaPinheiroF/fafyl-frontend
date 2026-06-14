import { formatDate } from '@/services/historyService';

describe('historyService', () => {
  describe('formatDate', () => {
    it('deve formatar data corretamente em pt-BR', () => {
      const result = formatDate('2024-05-16T14:30:00Z');
      expect(result).toContain('2024');
      expect(result).toContain('05');
      expect(result).toContain('16');
    });

    it('deve formatar data com hora e minuto', () => {
      const result = formatDate('2024-01-01T10:45:00Z');
      expect(result).toContain('/2024');
      expect(result).toMatch(/\d{2}:\d{2}/);
    });

    it('deve lidar com data atual', () => {
      const now = new Date().toISOString();
      const result = formatDate(now);
      expect(result.length).toBeGreaterThan(0);
    });
  });
});
