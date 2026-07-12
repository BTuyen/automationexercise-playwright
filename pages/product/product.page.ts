import { BasePage } from "../base.page";

export class ProductPage extends BasePage {
  readonly allProductsHeading = this.page.getByRole("heading", {
    name: "All Products",
  });

  readonly productList = this.page.locator(
    ".features_items .product-image-wrapper",
  );

  readonly viewProductButton = this.page
    .locator(".features_items .product-image-wrapper .choose a")
    .getByText("View Product");

  readonly addToCartButton = this.page.locator(
    ".features_items .productinfo a.add-to-cart",
  );

  readonly productPrice = this.page.locator(".features_items .productinfo h2");
  readonly productName = this.page.locator(".features_items .productinfo p");

  async goto() {
    await this.page.goto("/products");
  }

  async viewProductByName(productName: string) {
    const product = this.productList.filter({ hasText: productName });
    await product.locator(".choose a").getByText("View Product").click();
  }

  async addProductToCartByName(productName: string) {
    const product = this.productList.filter({ hasText: productName });
    await product.locator(".productinfo a.add-to-cart").click();
  }

  async getProductPrice(productName: string): Promise<number> {
    const product = this.productList.filter({ hasText: productName });
    const priceText = await product.locator(".productinfo h2").textContent();
    if (!priceText) {
      throw new Error(`Price not found for product: ${productName}`);
    }
    // Giá luôn là "Rs. <số nguyên>" - regex phải bỏ luôn dấu "." của "Rs." (không phải phân cách thập phân)
    return parseInt(priceText.replace(/[^0-9]/g, ""), 10);
  }
}
