import { faker } from '@faker-js/faker/locale/en';

import { walletFixtures } from '@tests/utils/fixtures/wallet/wallet-fixtures';
import { FieldValidationError } from '@modules/shared/core/domain/field-validation-error';

import { credit, debit } from './wallet';

describe('Wallet', () => {
  const systemDateTime = faker.date.recent();
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(systemDateTime);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('debit', () => {
    it('should throw FieldValidationError when amount is negative', () => {
      const wallet = walletFixtures.create();
      const negativeAmount = -100;

      expect(() => {
        debit({ wallet, amount: negativeAmount });
      }).toThrow(FieldValidationError);

      expect(() => {
        debit({ wallet, amount: negativeAmount });
      }).toThrow('amount must be a positive integer');
    });

    it('should throw FieldValidationError when amount is not a number', () => {
      const wallet = walletFixtures.create();

      expect(() => {
        // @ts-expect-error - Testing runtime type checking
        debit({ wallet, amount: 'not a number' });
      }).toThrow(FieldValidationError);

      expect(() => {
        // @ts-expect-error - Testing runtime type checking
        debit({ wallet, amount: 'not a number' });
      }).toThrow('amount must be an integer');
    });

    it('should increase wallet balance by the specified amount', () => {
      const initialBalance = 1000;
      const debitAmount = 500;
      const wallet = walletFixtures.create({ balance: initialBalance });
      const updatedWallet = debit({ wallet, amount: debitAmount });

      expect(updatedWallet.balance).toBe(initialBalance + debitAmount);
    });

    it('should update the updatedAt timestamp', () => {
      const wallet = walletFixtures.create({
        updatedAt: faker.date.recent(),
      });
      const updatedWallet = debit({ wallet, amount: 100 });

      expect(updatedWallet.updatedAt).toEqual(systemDateTime);
      expect(updatedWallet.updatedAt).not.toEqual(wallet.updatedAt);
    });
  });

  describe('credit', () => {
    it('should throw FieldValidationError when amount is negative', () => {
      const wallet = walletFixtures.create({ balance: 1000 });
      const negativeAmount = -100;

      expect(() => {
        credit({ wallet, amount: negativeAmount });
      }).toThrow(FieldValidationError);

      expect(() => {
        credit({ wallet, amount: negativeAmount });
      }).toThrow('amount must be a positive integer');
    });

    it('should throw FieldValidationError when amount is not a number', () => {
      const wallet = walletFixtures.create({ balance: 1000 });

      expect(() => {
        // @ts-expect-error - Testing runtime type checking
        credit({ wallet, amount: 'not a number' });
      }).toThrow(FieldValidationError);

      expect(() => {
        // @ts-expect-error - Testing runtime type checking
        credit({ wallet, amount: 'not a number' });
      }).toThrow('amount must be an integer');
    });

    it('should decrease wallet balance by the specified amount', () => {
      const initialBalance = 1000;
      const creditAmount = 500;
      const wallet = walletFixtures.create({ balance: initialBalance });

      const updatedWallet = credit({ wallet, amount: creditAmount });

      expect(updatedWallet.balance).toBe(initialBalance - creditAmount);
    });

    it('should update the updatedAt timestamp', () => {
      const wallet = walletFixtures.create({
        updatedAt: faker.date.past(),
      });

      const updatedWallet = credit({ wallet, amount: 100 });

      expect(updatedWallet.updatedAt).toEqual(systemDateTime);
      expect(updatedWallet.updatedAt).not.toEqual(wallet.updatedAt);
    });

    it('should allow balance to go negative', () => {
      const initialBalance = 100;
      const creditAmount = 500;
      const wallet = walletFixtures.create({ balance: initialBalance });

      const updatedWallet = credit({ wallet, amount: creditAmount });

      expect(updatedWallet.balance).toBe(-400);
    });
  });
});
