import { BasePage } from "../base.page";
import type { AccountDetails, AddressInfo } from "../../models/user.model";

export class SignupPage extends BasePage {
  readonly accountInfoForm = this.page.locator(".login-form"); // form "Enter Account Information" - dấu hiệu nhận biết "đang ở signup" (chỉ tới được qua flow LoginPage.signup(), không có URL riêng)
  readonly accountCreatedHeading = this.page.locator("[data-qa='account-created']"); // heading "Account Created!" - test assert trước khi Continue

  private readonly titleMr = this.page.locator("#id_gender1");
  private readonly titleMrs = this.page.locator("#id_gender2");
  private readonly passwordInput = this.page.locator("input[data-qa='password']");
  private readonly daysSelect = this.page.locator("select[data-qa='days']");
  private readonly monthsSelect = this.page.locator("select[data-qa='months']");
  private readonly yearsSelect = this.page.locator("select[data-qa='years']");
  private readonly newsletterCheckbox = this.page.locator("#newsletter");
  private readonly optinCheckbox = this.page.locator("#optin");
  private readonly firstNameInput = this.page.locator("input[data-qa='first_name']");
  private readonly lastNameInput = this.page.locator("input[data-qa='last_name']");
  private readonly companyInput = this.page.locator("input[data-qa='company']");
  private readonly address1Input = this.page.locator("input[data-qa='address']");
  private readonly address2Input = this.page.locator("input[data-qa='address2']");
  private readonly countrySelect = this.page.locator("select[data-qa='country']");
  private readonly stateInput = this.page.locator("input[data-qa='state']");
  private readonly cityInput = this.page.locator("input[data-qa='city']");
  private readonly zipcodeInput = this.page.locator("input[data-qa='zipcode']");
  private readonly mobileNumberInput = this.page.locator("input[data-qa='mobile_number']");
  private readonly createAccountButton = this.page.locator("[data-qa='create-account']");

  async fillAccountInfo(info: AccountDetails) {
    if (info.title) {
      await (info.title === "Mr" ? this.titleMr : this.titleMrs).check();
    }
    await this.passwordInput.fill(info.password);
    if (info.day) {
      await this.daysSelect.selectOption(info.day);
    }
    if (info.month) {
      await this.monthsSelect.selectOption(info.month);
    }
    if (info.year) {
      await this.yearsSelect.selectOption(info.year);
    }

    if (info.newsletter) {
      await this.newsletterCheckbox.check();
    }
    if (info.optin) {
      await this.optinCheckbox.check();
    }
  }

  async fillAddressInfo(info: AddressInfo) {
    await this.firstNameInput.fill(info.firstName);
    await this.lastNameInput.fill(info.lastName);
    if (info.company) {
      await this.companyInput.fill(info.company);
    }
    await this.address1Input.fill(info.address1);
    if (info.address2) {
      await this.address2Input.fill(info.address2);
    }
    await this.countrySelect.selectOption(info.country);
    await this.stateInput.fill(info.state);
    await this.cityInput.fill(info.city);
    await this.zipcodeInput.fill(info.zipcode);
    await this.mobileNumberInput.fill(info.mobileNumber);
  }

  async createAccount() {
    await this.createAccountButton.click();
  }

  async continueAfterAccountCreated() {
    await this.continueButton.click();
  }
}
