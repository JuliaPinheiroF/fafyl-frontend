import { getCapelinhoImage, CAPELINHO_IMAGES } from '@/services/capelinhoService';

describe('capelinhoService', () => {
  describe('getCapelinhoImage', () => {
    it('deve retornar imagem padrão quando capelinhoId é null', () => {
      const result = getCapelinhoImage(null);
      expect(result).toEqual(CAPELINHO_IMAGES[1]);
    });

    it('deve retornar imagem padrão quando capelinhoId é undefined', () => {
      const result = getCapelinhoImage(undefined);
      expect(result).toEqual(CAPELINHO_IMAGES[1]);
    });

    it('deve retornar imagem correta para capelinhoId 2', () => {
      const result = getCapelinhoImage(2);
      expect(result).toEqual(CAPELINHO_IMAGES[2]);
    });

    it('deve retornar imagem correta para capelinhoId 3', () => {
      const result = getCapelinhoImage(3);
      expect(result).toEqual(CAPELINHO_IMAGES[3]);
    });

    it('deve retornar imagem correta para capelinhoId 4', () => {
      const result = getCapelinhoImage(4);
      expect(result).toEqual(CAPELINHO_IMAGES[4]);
    });

    it('deve retornar imagem padrão para ID inexistente', () => {
      const result = getCapelinhoImage(99);
      expect(result).toEqual(CAPELINHO_IMAGES[1]);
    });
  });

  describe('CAPELINHO_IMAGES', () => {
    it('deve ter exatamente 4 imagens', () => {
      expect(Object.keys(CAPELINHO_IMAGES)).toHaveLength(4);
    });

    it('deve ter chaves 1, 2, 3, 4', () => {
      expect(CAPELINHO_IMAGES).toHaveProperty('1');
      expect(CAPELINHO_IMAGES).toHaveProperty('2');
      expect(CAPELINHO_IMAGES).toHaveProperty('3');
      expect(CAPELINHO_IMAGES).toHaveProperty('4');
    });
  });
});
