import { test as base } from '@playwright/test';
import { HomePage } from '../pages/home.page';
import { LoginPage } from '../pages/auth/login.page';
import { SignupPage } from '../pages/auth/signup.page';
import { ProductPage } from '../pages/product/product.page';
import { ProductDetailPage } from '../pages/product/product-detail.page';
import { CheckoutPage } from '../pages/checkout/checkout.page';
import { PaymentPage } from '../pages/checkout/payment.page';
import { CartPage } from '../pages/cart/cart.page';

type PageFixtures = {
  homePage: HomePage;
  loginPage: LoginPage;
  signupPage: SignupPage;
  productPage: ProductPage;
  productDetailPage: ProductDetailPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  paymentPage: PaymentPage;
};

export const test = base.extend<PageFixtures>({
  // automationexercise.com nhúng quảng cáo bên thứ 3 (banner/native ads) render trong iframe,
  // có thể che UI và chặn click -> chặn load bất kỳ iframe cross-origin nào để tránh flaky do ads
  page: async ({ page, baseURL }, use) => {
    await page.route('**/*', (route) => {
      const request = route.request();
      const frame = request.frame();
      const isSubFrameDocument = request.resourceType() === 'document' && frame !== page.mainFrame();
      if (isSubFrameDocument && baseURL && !request.url().startsWith(new URL(baseURL).origin)) {
        return route.abort();
      }
      return route.continue();
    });
    await use(page);
  },
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  signupPage: async ({ page }, use) => {
    await use(new SignupPage(page));
  },
  productPage: async ({ page }, use) => {
    await use(new ProductPage(page));
  },
  productDetailPage: async ({ page }, use) => {
    await use(new ProductDetailPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
  paymentPage: async ({ page }, use) => {
    await use(new PaymentPage(page));
  }
});
export { expect } from '@playwright/test';
