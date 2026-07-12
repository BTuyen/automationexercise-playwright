import { BasePage } from "./base.page";

export class HomePage extends BasePage {
  readonly slider = this.page.locator("#slider-carousel"); // carousel trang chủ - dấu hiệu nhận biết "đang ở home"

  readonly recommendedItems = this.page.locator(".recommended_items #recommended-item-carousel");

  private readonly signupLoginLink = this.page.getByRole('link', {name: 'Signup / Login'});

  async goto() {
    await this.page.goto("/");
  }

  async gotoSignupLogin() {
    await this.signupLoginLink.click();
  }

  // Carousel: sản phẩm ở slide không active bị ẩn (display:none) -> chỉ thao tác với sản phẩm
  // đang hiển thị, tránh click nhầm phần tử ẩn (timeout dù element tồn tại trong DOM)
  visibleRecommendedProduct() {
    return this.recommendedItems.locator(".product-image-wrapper:visible").first();
  }

  async addProductToCartByName(productName: string) {
    const product = this.recommendedItems.locator(".product-image-wrapper:visible").filter({ hasText: productName });
    await product.locator(".productinfo a.add-to-cart").click();
  }
}
