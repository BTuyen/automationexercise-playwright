import { BasePage } from "../base.page";

export class CheckoutPage extends BasePage {
  readonly addressReviewSection = this.page.locator(".checkout-information");
  // textarea không có label/aria-label -> accessible name rỗng, getByRole('textbox', {name}) không match
  readonly commentInput = this.page.locator("textarea[name='message']");
  // "Place Order" là <a href="/payment"> -> role "link", không phải "button"
  readonly placeOrderButton = this.page.getByRole("link", { name: "Place Order" });
}
