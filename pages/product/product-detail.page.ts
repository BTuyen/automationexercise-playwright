import { BasePage } from "../base.page";

export class ProductDetailPage extends BasePage {
  readonly detailProductPage = this.page.locator(".product-details");
  readonly quantityInput = this.page.locator("#quantity");
  readonly addToCartButton = this.detailProductPage.getByRole("button", {
    name: "Add to cart",
  });

  async addToCart(quantity: number) {
    await this.quantityInput.fill(quantity.toString());
    await this.addToCartButton.click();
    await this.modalViewCartLink.waitFor({ state: "visible" });
  }
}
