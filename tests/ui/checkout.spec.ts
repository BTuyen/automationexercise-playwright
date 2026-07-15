import { expect, testUser as test } from '../../fixtures/user.fixture';
import { generateUser } from '../../utils/data-generator';
import { completeSignupForm } from '../../helpers/signup-flow';
import type { PaymentPage } from '../../pages/checkout/payment.page';

const PRODUCT_NAME = 'Blue Top';
const CARD = {
  nameOnCard: 'Test User',
  cardNumber: '4111111111111111',
  cvc: '123',
  expirationMonth: '12',
  expirationYear: '2030'
};

async function payWithCard(paymentPage: PaymentPage) {
  await paymentPage.nameOnCardInput.fill(CARD.nameOnCard);
  await paymentPage.cardNumberInput.fill(CARD.cardNumber);
  await paymentPage.cvcInput.fill(CARD.cvc);
  await paymentPage.expirationMonthInput.fill(CARD.expirationMonth);
  await paymentPage.expirationYearInput.fill(CARD.expirationYear);
  await paymentPage.payAndConfirmOrderButton.click();
}

test.describe('Checkout', () => {
  test('TC_CHECKOUT_01 | Place order - register during checkout', { tag: '@smoke' }, async ({ loginPage, signupPage, productPage, cartPage, checkoutPage, paymentPage }) => {
    // Arrange: precondition "Chưa login; giỏ đã có sản phẩm"
    const user = generateUser();
    await productPage.goto();
    await productPage.addProductToCartByName(PRODUCT_NAME);
    await expect(productPage.addedToCartHeading).toBeVisible();
    await productPage.modalViewCartLink.click();

    // Act: Ở trang Cart -> Proceed To Checkout khi chưa login -> modal hiện ra -> Register / Login
    await cartPage.proceedToCheckout();
    await expect(cartPage.registerLoginButton).toBeVisible();
    await cartPage.registerLoginButton.click();

    // Tạo account mới ngay tại đây
    await loginPage.signup(user.name, user.email);
    await completeSignupForm(signupPage, user);
    await expect(signupPage.accountCreatedHeading).toBeVisible();
    await signupPage.continueAfterAccountCreated();
    await expect(loginPage.loggedInAs).toContainText(user.name);

    // Vào lại Cart -> Proceed To Checkout (đã login, không còn modal)
    await productPage.cartLink.click();
    await cartPage.proceedToCheckout();

    // Nhập comment -> Place Order
    await checkoutPage.commentInput.fill('Giao trong giờ hành chính');
    await checkoutPage.placeOrderButton.click();

    // Nhập payment -> Pay and Confirm Order
    await payWithCard(paymentPage);

    // Assert: hiển thị success message
    await expect(paymentPage.orderPlacedMessage).toBeVisible();

    // Cleanup: xoá account vừa tạo để không tích luỹ user rác trên site demo dùng chung
    await loginPage.deleteAccount();
  });

  test('TC_CHECKOUT_03 | Place order - login before checkout', { tag: '@smoke' }, async ({ apiUser, loginPage, productPage, cartPage, checkoutPage, paymentPage }) => {
    // Arrange: precondition "Đã có account" - account tạo sẵn qua API, chỉ cần login qua UI
    await loginPage.goto();
    await loginPage.login(apiUser.email, apiUser.password);
    await expect(loginPage.loggedInAs).toContainText(apiUser.name);

    // Add sản phẩm -> Cart -> Proceed To Checkout
    await productPage.goto();
    await productPage.addProductToCartByName(PRODUCT_NAME);
    await expect(productPage.addedToCartHeading).toBeVisible();
    await productPage.modalViewCartLink.click();
    await cartPage.proceedToCheckout();

    // Review order -> Place Order
    await expect(checkoutPage.addressReviewSection).toBeVisible();
    await checkoutPage.placeOrderButton.click();

    // Nhập payment -> Pay and Confirm Order
    await payWithCard(paymentPage);

    // Assert: hiển thị success message
    await expect(paymentPage.orderPlacedMessage).toBeVisible();

    // Cleanup: fixture apiUser tự xoá account qua API sau test, không cần thao tác UI
  });
});
