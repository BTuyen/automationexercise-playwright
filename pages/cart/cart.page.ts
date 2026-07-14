import { BasePage } from "../base.page";

export class CartPage extends BasePage {
  readonly cartItems = this.page.locator("#cart_info_table");
  // "Proceed To Checkout" là <a class="check_out"> không có href -> không có role "link" trong accessibility tree
  readonly proceedToCheckoutButton = this.page.getByText("Proceed To Checkout");
  readonly emptyCartMessage = this.page.getByText("Cart is empty!");
  readonly checkoutModal = this.page.locator("#checkoutModal");
  readonly continueOnCartModalButton = this.checkoutModal.getByRole("button", { name: "Continue On Cart" });
  readonly registerLoginButton = this.checkoutModal.getByRole('link', {name: 'Register / Login'});

  // "Proceed To Checkout" không có href, phụ thuộc hoàn toàn vào JS click handler của site.
  async proceedToCheckout() {
    // Hàm này luôn được gọi ngay sau 1 click gây navigate khác (View Cart / Cart link).
    // Đã tận mắt gặp: bỏ wait này thì .click() không hề lỗi (element vẫn actionable), nhưng
    // checkoutModal đứng im "hidden" đủ 30s rồi timeout - tức handler JS của nút chưa kịp bind
    // lúc click, không phải do click bị chặn/che (nếu bị che thì chính .click() đã throw trước).
    // Playwright không tự chờ giúp vì đây là JS handler-binding, nằm ngoài mọi actionability check.
    await this.waitForPageReady();

    await this.proceedToCheckoutButton.click();

    // Đích đến khác nhau tuỳ trạng thái login: chưa login -> mở checkoutModal; đã login -> chuyển
    // thẳng sang /checkout (nhận diện bằng ".checkout-information"). Chờ 1 trong 2 bằng locator.or()
    // thay vì đoán trước sẽ đi nhánh nào.
    await this.checkoutModal.or(this.page.locator(".checkout-information")).waitFor({ state: "visible" });
  }

  rowByProductName(productName: string) {
    return this.cartItems.locator("tr").filter({ hasText: productName });
  }

  async getProductQuantity(productName: string): Promise<number> {
    const row = this.rowByProductName(productName);
    // Quantity trên trang view_cart hiển thị bằng <button disabled>, không phải input
    const quantityText = await row.locator("td.cart_quantity button").textContent();
    if (!quantityText) {
      throw new Error(`Quantity not found for product: ${productName}`);
    }
    return parseInt(quantityText, 10);
  }

  async getProductPrice(productName: string): Promise<number> {
    const row = this.rowByProductName(productName);
    const priceText = await row.locator("td.cart_price").textContent();
    if (!priceText) {
      throw new Error(`Price not found for product: ${productName}`);
    }
    // Giá luôn là "Rs. <số nguyên>" - regex phải bỏ luôn dấu "." của "Rs." (không phải phân cách thập phân)
    return parseInt(priceText.replace(/[^0-9]/g, ""), 10);
  }

  async getProductTotalPrice(productName: string): Promise<number> {
    const row = this.rowByProductName(productName);
    const totalPriceText = await row.locator("td.cart_total").textContent();
    if (!totalPriceText) {
      throw new Error(`Total price not found for product: ${productName}`);
    }
    // Giá luôn là "Rs. <số nguyên>" - regex phải bỏ luôn dấu "." của "Rs." (không phải phân cách thập phân)
    return parseInt(totalPriceText.replace(/[^0-9]/g, ""), 10);
  }

  async removeProductByName(productName: string) {
    const row = this.rowByProductName(productName);
    const deleteButton = row.locator("a.cart_quantity_delete");
    await deleteButton.click();
  }
}
