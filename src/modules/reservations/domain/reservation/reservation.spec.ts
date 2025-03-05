import { canAfford } from './reservation';

describe('reservation', () => {
  describe('canAffor()', () => {
    it('should return true if balance is above or equal to reservation cost', () => {
      const balance = 10;
      expect(canAfford(balance)).toBe(true);
    });

    it('should return false if balace is below reservation cost', () => {
      const balance = 1;
      expect(canAfford(balance)).toBe(false);
    });
  });
});
