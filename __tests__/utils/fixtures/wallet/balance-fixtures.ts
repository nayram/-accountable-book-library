import { faker } from '@faker-js/faker/locale/en';
import { Balance } from '@modules/wallets/domain/wallet/balance';

export const balanceFixtures = {
  create(): Balance {
    return faker.number.int({ min: 50, max: 300 });
  },
  invalid() {
    const invalidValues = ['1234567', 'random-value'];
    return faker.helpers.arrayElement(invalidValues) as unknown as Balance;
  },
};
