import type { Page } from "@playwright/test";

export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  get loggedInAs() {
    return this.page.getByText(/Logged in as/);
  }

  get cartLink() {
    // Không dùng exact:true: icon FontAwesome render bằng CSS ::before khiến accessible name
    // có thể lẫn ký tự glyph vô hình, làm so khớp chính xác "Cart" fail không ổn định.
    // Scope theo nav bar để phân biệt với "View Cart" trong modal Added! (dù đã đóng, DOM vẫn còn).
    return this.page.locator("ul.nav.navbar-nav").getByRole("link", { name: "Cart" });
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

  // Site thật đôi khi redirect (login/signup xong) và render nav chậm hơn dưới tải cao
  // (nhiều browser project chạy song song) -> chờ 'load' trước khi thao tác tiếp với nav,
  // tránh race "click ngay sau navigate" gây timeout dù element rồi cũng xuất hiện.
  // Không dùng 'networkidle': site có ad network poll liên tục, dễ treo vô thời hạn.
  async waitForPageReady() {
    await this.page.waitForLoadState("load");
  }

  async deleteAccount() {
    await this.deleteAccountLink.click();
    // waitFor (không phải expect): page object chỉ CHỜ trạng thái để flow đi tiếp,
    // không assert đúng/sai — assertion vẫn là việc của test
    await this.accountDeletedHeading.waitFor({ state: "visible" });
    await this.continueButton.click();
  }
}
