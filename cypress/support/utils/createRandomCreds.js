import { faker } from "@faker-js/faker";

export const randomCreds = {
  username: `${faker.random.word()}${faker.random.numeric(5)}`,
  email: `${faker.random.word()}@${faker.lorem.word()}.com`,
  password: `${faker.random.word()}${faker.random.numeric(5)}`,
};
