import { BasePage } from "../base.page";

export class PaymentPage extends BasePage {
  readonly paymentSection = this.page.locator(".payment-information");
  readonly formPayment = this.page.locator("#payment-form");
  readonly nameOnCardInput = this.formPayment.locator("input[data-qa='name-on-card']");
  readonly cardNumberInput = this.formPayment.locator("input[data-qa='card-number']");
  readonly cvcInput = this.formPayment.locator("input[data-qa='cvc']");
  readonly expirationMonthInput = this.formPayment.locator("input[data-qa='expiry-month']");
  readonly expirationYearInput = this.formPayment.locator("input[data-qa='expiry-year']");
  readonly payAndConfirmOrderButton = this.page.getByRole("button", { name: "Pay and Confirm Order" });
  readonly orderPlacedMessage = this.page.getByRole("heading", { name: "Order Placed!" });
}
