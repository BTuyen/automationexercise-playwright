import type { Page } from "@playwright/test";

export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  get loggedInAs() {
    return this.page.getByText(/Logged in as/);
  }

  get cartLink() {
    // exact: true - nếu không sẽ match luôn "View Cart" trong modal Added! (dù đã đóng, DOM vẫn còn)
    return this.page.getByRole("link", { name: "Cart", exact: true });
  }

  get cartModal() {
    return this.page.locator("#cartModal");
  }
  get modalViewCartLink() {
    return this.cartModal.getByRole("link", { name: "View Cart" });
  }
  get modalContinueShoppingButton() {
    return this.cartModal.getByRole("button", { name: "Continue Shopping" });
  }
  get addedToCartHeading() {
    return this.cartModal.getByText("Added!");
  }

  get productsLink() {
    return this.page.getByRole("link", { name: "Products" });
  }

  get logoutLink() {
    return this.page.getByRole("link", { name: "Logout" });
  }

  get deleteAccountLink() {
    return this.page.getByRole("link", { name: "Delete Account" });
  }

  get continueButton() {
    return this.page.locator("[data-qa='continue-button']");
  }

  get accountDeletedHeading() {
    return this.page.getByText("Account Deleted!");
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
