import { test as base } from "../fixtures/pages.fixture"
import { generateUser } from '../utils/data-generator';
import { User } from "../models/user.model";

type UserFixture = {
  apiUser: User;
};

export const testUser = base.extend<UserFixture>({
  apiUser: async ({ userService }, use) => {
    const user = generateUser();
    await userService.createAccount(user);   // Arrange qua API - nhanh hơn UI ~10 lần
    try {
      await use(user);                          // test nhận user đã tồn tại sẵn
    }
    finally {
      await userService.deleteAccount(user.email, user.password); // cleanup tự động sau test
    }
  },
});
export { expect } from '@playwright/test';
