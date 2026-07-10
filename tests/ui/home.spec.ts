import { test, expect } from '../../fixtures/pages.fixture';

test.describe('Home Page', () => {
  test('TC-001 | should have the correct title', async ({ page, homePage }) => {
    await homePage.goto();
    await expect(page).toHaveTitle(/Automation Exercise/);
  });

  test('TC-002 | should navigate to login page from Signup / Login link', async ({ homePage, loginPage }) => {
    await homePage.goto();
    await homePage.gotoSignupLogin();
    await expect(loginPage.loginForm).toBeVisible();
  });
});
