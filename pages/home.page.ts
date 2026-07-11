import { BasePage } from "./base.page";

export class HomePage extends BasePage {
  readonly slider = this.page.locator("#slider-carousel"); // carousel trang chủ - dấu hiệu nhận biết "đang ở home"

  private readonly signupLoginLink = this.page.getByRole('link', {name: 'Signup / Login'});

  async goto() {
    await this.page.goto("/");
  }

  async gotoSignupLogin() {
    await this.signupLoginLink.click();
  }
}
