import type { Page } from "@playwright/test";

export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  get cartLink() {
    return this.page.getByRole('link', { name: 'Cart' });
  }

  get logoutLink() {
    return this.page.getByRole('link', { name: 'Logout' });
  }

  get deleteAccountLink() {
    return this.page.getByRole('link', { name: 'Delete Account' });
  }

  async goto(path: string) {
    await this.page.goto(path, { waitUntil: "domcontentloaded" });
  }
}
