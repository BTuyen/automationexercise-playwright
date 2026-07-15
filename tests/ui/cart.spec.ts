import { expect, testUser as test } from '../../fixtures/user.fixture';

const PRODUCT_NAMES = ['Blue Top', 'Men Tshirt', 'Sleeveless Dress', 'Casual Dress', 'Evening Dress', 'Summer Dress'];

test.describe('Cart Functionality', () => {
  test('TC_CART_01 | Add one item to cart', { tag: '@smoke' }, async ({ apiUser, loginPage, productPage, cartPage }) => {
    // Arrange: precondition "đã đăng nhập; ở trang Products" - account tạo sẵn qua API
    // (nhanh hơn UI ~10 lần), chỉ cần login qua UI để browser có session
    await loginPage.goto();
    await loginPage.login(apiUser.email, apiUser.password);
    await expect(loginPage.loggedInAs).toContainText(apiUser.name);

    await productPage.goto();
    const expectedPrice = await productPage.getProductPrice(PRODUCT_NAMES[0]);

    // Act: Hover sản phẩm -> Add to cart -> View Cart trên popup
    await productPage.addProductToCartByName(PRODUCT_NAMES[0]);
    await expect(productPage.addedToCartHeading).toBeVisible();
    await productPage.modalViewCartLink.click();

    // Assert: sản phẩm trong cart đúng tên, giá, quantity = 1, total = giá sản phẩm
    await expect(cartPage.rowByProductName(PRODUCT_NAMES[0])).toBeVisible();
    expect(await cartPage.getProductPrice(PRODUCT_NAMES[0])).toBe(expectedPrice);
    expect(await cartPage.getProductQuantity(PRODUCT_NAMES[0])).toBe(1);
    expect(await cartPage.getProductTotalPrice(PRODUCT_NAMES[0])).toBe(expectedPrice);

    // Cleanup: fixture apiUser tự xoá account qua API sau test, không cần thao tác UI
  });

  test('TC_CART_02 | Add multiple items to cart', { tag: '@regression' }, async ({ apiUser, loginPage, productPage, cartPage }) => {

    await loginPage.goto();
    await loginPage.login(apiUser.email, apiUser.password);
    await expect(loginPage.loggedInAs).toContainText(apiUser.name);

    await productPage.goto();
    const [firstProduct, secondProduct] = PRODUCT_NAMES;
    const firstPrice = await productPage.getProductPrice(firstProduct);
    const secondPrice = await productPage.getProductPrice(secondProduct);

    // Act: Add sản phẩm 1 -> Continue Shopping
    await productPage.addProductToCartByName(firstProduct);
    await expect(productPage.addedToCartHeading).toBeVisible();
    await productPage.modalContinueShoppingButton.click();

    // Add sản phẩm 2 -> View Cart
    await productPage.addProductToCartByName(secondProduct);
    await expect(productPage.addedToCartHeading).toBeVisible();
    await productPage.modalViewCartLink.click();

    // Assert: cả 2 sản phẩm hiển thị trong giỏ; giá, quantity, total từng dòng khớp thông tin sản phẩm
    await expect(cartPage.rowByProductName(firstProduct)).toBeVisible();
    expect(await cartPage.getProductPrice(firstProduct)).toBe(firstPrice);
    expect(await cartPage.getProductQuantity(firstProduct)).toBe(1);
    expect(await cartPage.getProductTotalPrice(firstProduct)).toBe(firstPrice);

    await expect(cartPage.rowByProductName(secondProduct)).toBeVisible();
    expect(await cartPage.getProductPrice(secondProduct)).toBe(secondPrice);
    expect(await cartPage.getProductQuantity(secondProduct)).toBe(1);
    expect(await cartPage.getProductTotalPrice(secondProduct)).toBe(secondPrice);
  });

  test('TC_CART_03 | Increase quantity before add to cart', { tag: '@smoke' }, async ({ apiUser, loginPage, productPage, productDetailPage, cartPage }) => {

    await loginPage.goto();
    await loginPage.login(apiUser.email, apiUser.password);
    await expect(loginPage.loggedInAs).toContainText(apiUser.name);

    await productPage.goto();
    await productPage.viewProductByName(PRODUCT_NAMES[0]);

    // Act: nhập quantity = 5 -> Add to cart -> View Cart
    const quantityToAdd = 5;
    await productDetailPage.addToCart(quantityToAdd);
    await productDetailPage.modalViewCartLink.click();

    // Assert: giỏ hàng hiển thị đúng quantity = 5 cho sản phẩm đó
    expect(await cartPage.getProductQuantity(PRODUCT_NAMES[0])).toBe(quantityToAdd);
    const unitPrice = await cartPage.getProductPrice(PRODUCT_NAMES[0]);
    expect(await cartPage.getProductTotalPrice(PRODUCT_NAMES[0])).toBe(unitPrice * quantityToAdd);
  });

  test('TC_CART_04 | Add existing product to cart accumulates quantity', { tag: '@regression' }, async ({ apiUser, loginPage, productPage, productDetailPage, cartPage }) => {
    // Arrange: precondition "Giỏ đã có sản phẩm A với quantity = 2"
    await loginPage.goto();
    await loginPage.login(apiUser.email, apiUser.password);
    await expect(loginPage.loggedInAs).toContainText(apiUser.name);

    await productPage.goto();
    await productPage.viewProductByName(PRODUCT_NAMES[0]);
    await productDetailPage.addToCart(2);
    await productDetailPage.modalContinueShoppingButton.click();

    // Act: vào lại trang chi tiết sản phẩm A, nhập quantity = 3 -> Add to cart -> View Cart
    await productPage.goto();
    await productPage.viewProductByName(PRODUCT_NAMES[0]);
    await productDetailPage.addToCart(3);
    await productDetailPage.modalViewCartLink.click();

    // Assert: quantity = 5 (cộng dồn 2+3), không tạo dòng trùng
    await expect(cartPage.rowByProductName(PRODUCT_NAMES[0])).toHaveCount(1);
    expect(await cartPage.getProductQuantity(PRODUCT_NAMES[0])).toBe(5);
  });

  test('TC_CART_05 | Remove product from cart', { tag: '@regression' }, async ({ apiUser, loginPage, productPage, cartPage }) => {
    // Arrange: precondition "Ở trang Cart, có ít nhất 1 sản phẩm" -> cần thêm sản phẩm thứ 2
    // để verify đúng expected "các dòng còn lại giữ nguyên" sau khi xoá
    await loginPage.goto();
    await loginPage.login(apiUser.email, apiUser.password);
    await expect(loginPage.loggedInAs).toContainText(apiUser.name);

    await productPage.goto();
    const [productToRemove, productToKeep] = PRODUCT_NAMES;
    const keptPrice = await productPage.getProductPrice(productToKeep);

    await productPage.addProductToCartByName(productToRemove);
    await expect(productPage.addedToCartHeading).toBeVisible();
    await productPage.modalContinueShoppingButton.click();

    await productPage.addProductToCartByName(productToKeep);
    await expect(productPage.addedToCartHeading).toBeVisible();
    await productPage.modalViewCartLink.click();

    // Act: Remove sản phẩm cần xoá khỏi giỏ
    await cartPage.removeProductByName(productToRemove);

    // Assert: sản phẩm bị remove khỏi giỏ; dòng còn lại giữ nguyên
    await expect(cartPage.rowByProductName(productToRemove)).toHaveCount(0);
    await expect(cartPage.rowByProductName(productToKeep)).toBeVisible();
    expect(await cartPage.getProductPrice(productToKeep)).toBe(keptPrice);
    expect(await cartPage.getProductQuantity(productToKeep)).toBe(1);
  });

  test('TC_CART_06 | Add to cart from Recommended Items section', { tag: '@regression' }, async ({ apiUser, homePage, loginPage, cartPage }) => {
    // Arrange: precondition "ở trang chủ"
    await loginPage.goto();
    await loginPage.login(apiUser.email, apiUser.password);
    await expect(loginPage.loggedInAs).toContainText(apiUser.name);

    await homePage.goto();
    // Không hardcode tên sản phẩm: Recommended Items là carousel tự xoay, sản phẩm hiển thị
    // thay đổi theo thời gian -> đọc động sản phẩm đang hiển thị tại thời điểm chạy test
    const recommendedProduct = homePage.visibleRecommendedProduct();
    const recommendedProductName = (await recommendedProduct.locator(".productinfo p").textContent())?.trim() ?? "";
    const priceText = await recommendedProduct.locator(".productinfo h2").textContent();
    const expectedPrice = parseInt((priceText ?? "").replace(/[^0-9]/g, ""), 10);

    // Act: Cuộn tới Recommended Items -> Add to cart -> View Cart
    await homePage.addProductToCartByName(recommendedProductName);
    await expect(homePage.addedToCartHeading).toBeVisible();
    await homePage.modalViewCartLink.click();

    // Assert: sản phẩm hiển thị trong giỏ; giá, quantity = 1, total = giá sản phẩm
    await expect(cartPage.rowByProductName(recommendedProductName)).toBeVisible();
    expect(await cartPage.getProductPrice(recommendedProductName)).toBe(expectedPrice);
    expect(await cartPage.getProductQuantity(recommendedProductName)).toBe(1);
    expect(await cartPage.getProductTotalPrice(recommendedProductName)).toBe(expectedPrice);
  });

  test('TC_CART_07 | Cart persists after login', { tag: '@regression' }, async ({ apiUser, loginPage, productPage, cartPage }) => {
    // Arrange: precondition "chưa login; đã add sản phẩm vào giỏ" -> account tạo qua API
    // (browser chưa từng login, không cần logout để "quay về" trạng thái chưa login)

    // Act: Add sản phẩm vào giỏ khi chưa login
    await productPage.goto();
    const productName = PRODUCT_NAMES[0];
    const expectedPrice = await productPage.getProductPrice(productName);
    await productPage.addProductToCartByName(productName);
    await expect(productPage.addedToCartHeading).toBeVisible();
    await productPage.modalContinueShoppingButton.click();

    // Login với account có sẵn
    await loginPage.goto();
    await loginPage.login(apiUser.email, apiUser.password);
    await expect(loginPage.loggedInAs).toContainText(apiUser.name);

    // View Cart
    await productPage.cartLink.click();

    // Assert: sản phẩm đã add trước khi login vẫn còn trong giỏ
    await expect(cartPage.rowByProductName(productName)).toBeVisible();
    expect(await cartPage.getProductPrice(productName)).toBe(expectedPrice);
    expect(await cartPage.getProductQuantity(productName)).toBe(1);
    expect(await cartPage.getProductTotalPrice(productName)).toBe(expectedPrice);
  });
});
