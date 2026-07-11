import type { Page } from "@playwright/test";

export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  get loggedInAs() {
    return this.page.getByText(/Logged in as/);
  }

  get cartLink() {
    return this.page.getByRole('link', { name: 'Cart' });
  }

  get logoutLink() {
    return this.page.getByRole('link', { name: 'Logout' });
  }

  get deleteAccountLink() {
    return this.page.getByRole('link', { name: 'Delete Account' });
  }

  // Nút "Continue" dùng chung cho cả trang "Account Created!" và "Account Deleted!"
  get continueButton() {
    return this.page.locator("[data-qa='continue-button']");
  }

  get accountDeletedHeading() {
    return this.page.getByText('Account Deleted!');
  }

  async goto(path: string) {
    await this.page.goto(path, { waitUntil: "domcontentloaded" });
  }

  async deleteAccount() {
    await this.deleteAccountLink.click();
    // waitFor (không phải expect): page object chỉ CHỜ trạng thái để flow đi tiếp,
    // không assert đúng/sai — assertion vẫn là việc của test
    await this.accountDeletedHeading.waitFor({ state: "visible" });
    await this.continueButton.click();
  }
}
