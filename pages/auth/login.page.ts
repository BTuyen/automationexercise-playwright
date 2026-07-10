import { BasePage } from "../base.page";

export class LoginPage extends BasePage {
  readonly loginForm = this.page.locator("#login-form"); // form đăng nhập - dấu hiệu nhận biết "đang ở login"
  readonly errorMessage = this.page.getByText("Your email or password is incorrect!");
  readonly signupForm = this.page.locator("#signup-form"); // form đăng ký

  private readonly emailInput = this.page.locator("#login-form input[data-qa='login-email']");
  private readonly passwordInput = this.page.locator("#login-form input[data-qa='login-password']");
  private readonly loginButton = this.page.locator("[data-qa='login-button']");
  private readonly signupNameInput = this.page.locator("#signup-form input[data-qa='signup-name']");
  private readonly signupEmailInput = this.page.locator("#signup-form input[data-qa='signup-email']");
  private readonly signupButton = this.page.locator("[data-qa='signup-button']");

  async goto() {
    await this.page.goto("/login");
  }

  async loginWith(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async signup(name: string, email: string) {
    await this.signupNameInput.fill(name);
    await this.signupEmailInput.fill(email);
    await this.signupButton.click();
  }
}
