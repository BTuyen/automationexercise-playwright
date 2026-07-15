# Kiến trúc project

> Cập nhật: 13/07/2026 (cuối Ngày 6) — vá thêm **15/07/2026 (cuối Ngày 9)**: `fixtures/user.fixture.ts`, `schemas/`, tagging `@smoke`/`@regression`, Allure. Phần nào mới/đổi so với bản gốc được đánh dấu **🆕**.

File nào chứa gì, import/export gì, và cách thêm code mới đúng chuẩn. Đọc file này 5 phút là hiểu toàn bộ cách repo vận hành.

## Mục lục

1. [Sơ đồ tầng (ai import ai)](#1-sơ-đồ-tầng-ai-import-ai)
2. [Từng file chứa gì / export gì](#2-từng-file-chứa-gì--export-gì)
3. [Ví dụ: 1 test chạy xuyên các tầng như thế nào](#3-ví-dụ-1-test-chạy-xuyên-các-tầng-như-thế-nào)
4. [Công thức thêm code mới](#4-công-thức-thêm-code-mới)
5. [Lệnh thường dùng](#5-lệnh-thường-dùng)
6. [Tra cứu nhanh khi quên](#6-tra-cứu-nhanh-khi-quên)

## 1. Sơ đồ tầng (ai import ai)

```
tests/ (ui + api)
  │ chỉ import từ: fixtures, helpers, models, utils
  ▼
fixtures/pages.fixture.ts ──── inject page objects + services vào test
  │
  ├──▶ pages/ (UI layer - POM) ──▶ kế thừa pages/base.page.ts
  └──▶ services/ (API layer)   ──▶ dùng helpers/api-client.ts
        │
        ▼
     models/ (interfaces dùng chung cho cả pages lẫn services)

utils/env.ts ◀── playwright.config.ts (load .env theo TEST_ENV)

🆕 fixtures/user.fixture.ts ── extend từ test của pages.fixture.ts, thêm fixture apiUser
  │   (dùng userService đã có sẵn ở pages.fixture, KHÔNG tự dựng lại ApiClient)
  ▼
tests/ui/cart.spec.ts, checkout.spec.ts import test từ ĐÂY thay vì từ pages.fixture.ts thẳng

🆕 schemas/*.schema.json ── JSON Schema (draft-07), validate bằng helpers/schema-validator.ts (ajv)
  ▲
  │ dùng bởi
tests/api/product.api.spec.ts
```

Quy tắc hướng import (một chiều, từ trên xuống):

| Tầng | Được import từ | KHÔNG được import từ |
|---|---|---|
| `tests/` | fixtures, helpers, models, utils | pages trực tiếp (đi qua fixture) |
| `fixtures/` | pages, services, helpers, utils, **🆕 fixtures khác** (`user.fixture.ts` extend `pages.fixture.ts`) | tests |
| `pages/`, `services/` | models, helpers | tests, fixtures |
| `models/`, `utils/`, 🆕 `schemas/` | (không import nội bộ) | tất cả các tầng trên |

## 2. Từng file chứa gì / export gì

### Config & môi trường

| File | Chứa gì | Export |
|---|---|---|
| `playwright.config.ts` | testDir, retries/workers/timeout đọc từ ENV, 3 projects: `api` (không browser), `chromium`, `firefox` (UI). 🆕 reporter giờ có cả `html` lẫn `allure-playwright` (resultsDir `allure-results`) | default config |
| `utils/env.ts` | `dotenv.config()` top-level — load `.env.${TEST_ENV}` ngay khi module được import lần đầu | `TEST_ENV` (string), `ENV` (object: BASE_URL, API_BASE_URL, USER_EMAIL, RETRIES…) |
| `.env.staging/.uat/.prod` | Secrets + config theo env — gitignored. 3 file cùng trỏ `BASE_URL=https://automationexercise.com` (site demo dùng chung, không có 3 environment tách biệt thật) | — |
| `.env.example` | Template đã commit, không chứa giá trị thật | — |

```ts
// Cách dùng ENV ở bất kỳ đâu:
import { ENV } from './utils/env';
console.log(ENV.BASE_URL); // https://automationexercise.com
```

### pages/ — Page Object Model (UI)

| File | Class | Export chính |
|---|---|---|
| `base.page.ts` | `BasePage` (abstract) | Element header mọi trang: `loggedInAs`, `cartLink`, `logoutLink`, `deleteAccountLink`, modal `cartModal`/`modalViewCartLink`/`modalContinueShoppingButton`. Action `goto(path)`, `deleteAccount()`, 🆕 `waitForPageReady()` (chờ `load` — dùng khi thao tác tiếp ngay sau 1 navigate, tránh race click trước khi JS handler kịp bind) |
| `home.page.ts` | `HomePage` | slider, recommendedItems, `visibleRecommendedProduct()`, `addProductToCartByName()` |
| `auth/login.page.ts` | `LoginPage` | loginForm, errorMessage, emailExistsError, `login()`, `signup()`, `getSignupEmailValidity()` |
| `auth/signup.page.ts` | `SignupPage` | accountCreatedHeading, `fillAccountInfo()`, `fillAddressInfo()`, `createAccount()` |
| `product/product.page.ts` | `ProductPage` | productList, `addProductToCartByName()`, `viewProductByName()`, `getProductPrice()` |
| `product/product-detail.page.ts` | `ProductDetailPage` | quantityInput, `addToCart(quantity)` |
| `cart/cart.page.ts` | `CartPage` | rowByProductName(), `getProductQuantity/Price/TotalPrice()`, `removeProductByName()`, 🆕 `proceedToCheckout()` (click "Proceed To Checkout" — tự `waitForPageReady()` trước khi click vì trang cart luôn được vào ngay sau 1 navigate khác; chờ `checkoutModal.or(".checkout-information")` vì đích đến khác nhau tuỳ đã login hay chưa) |
| `checkout/checkout.page.ts` | `CheckoutPage` | addressReviewSection, commentInput, placeOrderButton |
| `checkout/payment.page.ts` | `PaymentPage` | form payment (nameOnCardInput…), payAndConfirmOrderButton, orderPlacedMessage |

**3 quy tắc bất di bất dịch của page object:**
1. **Không chứa `expect`** — chỉ expose locator (public readonly) + action. Cần chờ element trong flow thì dùng `locator.waitFor()`, không dùng `expect`.
2. Locator mà test cần assert → **public**; input đã bọc trong method fill → **private**.
3. Method đặt tên theo **hành vi user**: `login(email, password)`, không phải `fillEmailAndClickButton()`.

```ts
// Mẫu chuẩn 1 page object:
import { BasePage } from "../base.page";

export class LoginPage extends BasePage {
  readonly loginForm = this.page.locator(".login-form"); // public - test assert được
  private readonly emailInput = this.page.locator("..."); // private - đã bọc trong login()

  async login(email: string, password: string) { /* fill + click */ }
}
```

### services/ — "POM cho API"

| File | Export | Endpoint |
|---|---|---|
| `user.service.ts` | `UserService`: `createAccount(user)`, `verifyLogin(email, pw)`, `deleteAccount(email, pw)` | `POST /createAccount`, `POST /verifyLogin`, `DELETE /deleteAccount` |
| `product.service.ts` | `ProductService`: `getAllProducts()`, `searchProduct(name)` | `GET /productsList`, `POST /searchProduct` |

- Service nhận `ApiClient` qua constructor, method trả body đã parse (`res.json()`), **không assert** (giống page object).
- ⚠ Đặc sản site này: API luôn trả HTTP 200 — kết quả thật ở `body.responseCode`. Test phải assert body.

### models/ — Interfaces dùng chung

| File | Export | Ai dùng |
|---|---|---|
| `user.model.ts` | `AccountDetails`, `AddressInfo`, `User` (extends cả 2), `ApiMessageResponse` | signup.page.ts (form types), user.service.ts (payload/response), 🆕 `fixtures/user.fixture.ts` (type `apiUser: User`) |
| `product.model.ts` | `Product`, `ProductsListResponse` | product.service.ts, test API, 🆕 khuôn cho `schemas/product-list.schema.json` |

Đây là lý do models tách riêng: 1 interface phục vụ cả UI lẫn API — sửa 1 chỗ, cả 2 tầng cập nhật.

### 🆕 schemas/ — JSON Schema contract

| File | Mô tả |
|---|---|
| `product-list.schema.json` | JSON Schema draft-07 cho response `/productsList`. Required: `responseCode`, `products[].id/name/price/brand/category`. `additionalProperties: true` ở mọi cấp — chỉ ràng buộc field bắt buộc, không fail nếu site thêm field mới không liên quan. |

Validate bằng `helpers/schema-validator.ts`, dùng trong `tests/api/product.api.spec.ts` để bắt breaking change ở API contract (đổi field/type response) mà 2 test cũ (chỉ check `responseCode` + độ dài list) không bắt được.

### helpers/ — Common services

| File | Export | Vai trò |
|---|---|---|
| `api-client.ts` | `ApiClient`: `get/post/delete` | Wrap `APIRequestContext`; dùng option `form:` vì API nhận form-urlencoded (không phải JSON) |
| `signup-flow.ts` | `completeSignupForm()`, `signupNewUser()` | Flow đăng ký qua UI dùng chung cho auth/checkout spec (TC_CHECKOUT_01 vẫn cần luồng UI thật vì đó chính là cái test đó kiểm tra) — nguồn duy nhất, không copy vào spec |
| `csv-handler.ts` | `CSVHandling.readCSVFile(path)` | Đọc CSV → array object (`csv-parse`) |
| 🆕 `schema-validator.ts` | `validateSchema(schema, data): { valid, errors }` | Wrap `ajv` (`allErrors: true`), compile + validate 1 schema với 1 payload, trả về kết quả + list lỗi để test in ra khi assert fail |

### utils/ — Common functions

| File | Export | Ghi chú |
|---|---|---|
| `data-generator.ts` | `generateUniqueEmail()`, `generatePlusTagEmail()`, `generateUser()` | Suffix = timestamp + random 3 số → không trùng khi chạy parallel |
| `env.ts` | `TEST_ENV`, `ENV` | Nơi DUY NHẤT load dotenv |

### fixtures/pages.fixture.ts — Dependency injection

```ts
// Export: test (đã extend), expect (re-export từ @playwright/test)
export const test = base.extend<PageFixtures>({
  loginPage: async ({ page }, use) => { await use(new LoginPage(page)); },
  userService: async ({ request }, use) => {
    await use(new UserService(new ApiClient(request, ENV.API_BASE_URL)));
  },
  // ... homePage, signupPage, productPage, productDetailPage, cartPage, checkoutPage, paymentPage, productService
});
```

Test **luôn** import test/expect từ 1 trong 2 fixture file (không import thẳng từ `@playwright/test`):

```ts
import { expect, test } from '../../fixtures/pages.fixture';   // auth.spec.ts, home.spec.ts, api specs
```

### 🆕 fixtures/user.fixture.ts — API-seeded data (Ngày 7)

```ts
// extend TỪ test của pages.fixture.ts (không dựng lại ApiClient/UserService từ đầu)
export const testUser = base.extend<{ apiUser: User }>({
  apiUser: async ({ userService }, use) => {
    const user = generateUser();
    await userService.createAccount(user);   // Arrange qua API - nhanh hơn UI ~10 lần
    try {
      await use(user);
    } finally {
      await userService.deleteAccount(user.email, user.password); // cleanup tự động, kể cả khi test fail
    }
  },
});
export { expect } from '@playwright/test';
```

**Vì sao có fixture riêng thay vì thêm thẳng vào `pages.fixture.ts`**: tách để test nào cần account có sẵn (không test luồng signup) mới trả giá seed-qua-API; test nào chính là để kiểm tra luồng signup UI (TC_AUTH_01-08, TC_CHECKOUT_01) thì vẫn import `pages.fixture.ts` như cũ, không đổi.

```ts
import { expect, testUser as test } from '../../fixtures/user.fixture';   // cart.spec.ts, checkout.spec.ts

test('TC_CART_01 | ...', { tag: '@smoke' }, async ({ apiUser, loginPage, productPage, cartPage }) => {
  await loginPage.goto();
  await loginPage.login(apiUser.email, apiUser.password);   // chỉ login qua UI, account đã tồn tại sẵn
  // ...
});
```

**Lưu ý quan trọng khi dùng**: `apiUser` chỉ tạo account qua API — **không** đăng nhập session trên browser. Test vẫn phải tự `loginPage.login(apiUser.email, apiUser.password)` qua UI để `page` có cookie session.

### resources/ — Test data

| Folder/File | Chứa gì |
|---|---|
| `testdata/users.csv` | Data TĨNH cho negative case (TC_AUTH_04/07/08). Quy tắc: case cần account tồn tại hoặc tạo account mới → data ĐỘNG bằng generator, không để trong CSV |
| `img/`, `media/`, `documents/` | Test data file (upload…) — chưa dùng |

### tests/ — Test specs

| File | Test | Import test từ | Data từ đâu |
|---|---|---|---|
| `ui/auth.spec.ts` | TC_AUTH_01→08 | `pages.fixture.ts` | `generateUser()` (positive), CSV (negative) |
| `ui/cart.spec.ts` | TC_CART_01→07 | 🆕 `user.fixture.ts` (`testUser`) | `apiUser` (account) + `PRODUCT_NAMES` |
| `ui/checkout.spec.ts` | TC_CHECKOUT_01 (UI signup thật), TC_CHECKOUT_03 | TC_CHECKOUT_01: `pages.fixture.ts` · TC_CHECKOUT_03: 🆕 `user.fixture.ts` | `generateUser()` / `apiUser` + CARD const |
| `ui/home.spec.ts` | TC-001, 002 | `pages.fixture.ts` | — |
| `api/user.api.spec.ts` | 5 case createAccount/verifyLogin/deleteAccount | `pages.fixture.ts` | `generateUser()` |
| `api/product.api.spec.ts` | 🆕 3 case: productsList, searchProduct, 🆕 schema validation productsList | `pages.fixture.ts` | — |

Cấu trúc 1 test chuẩn trong repo: **Arrange → Act → Assert → Cleanup**, tên test = `TC_ID | mô tả`, 🆕 tham số thứ 2 = `{ tag: '@smoke' }` hoặc `{ tag: '@regression' }` (bắt buộc, khớp cột `Type` trong `docs/test-cases.md`).

### 🆕 docs/bugs/ — Bug report

Không phải code, nhưng là 1 tầng "output" của repo: mỗi bug tìm được trên site thật được ghi thành `BUG_00X.md` (severity/priority, steps to reproduce, expected/actual, evidence screenshot trong `docs/bugs/evidence/`). Xem `docs/bugs/BUG_001.md` làm mẫu.

## 3. Ví dụ: 1 test chạy xuyên các tầng như thế nào

Lấy TC_AUTH_03 | login thành công (luồng UI signup gốc, chưa dùng apiUser):

1. `npm run test:staging`
   └─▶ package.json script: `TEST_ENV=staging playwright test`
2. `playwright.config.ts` import `{ ENV }` từ `./utils/env`
   └─▶ `utils/env.ts` chạy `dotenv.config({ path: '.env.staging' })`
   └─▶ baseURL = `ENV.BASE_URL`, retries/workers/timeout từ `.env.staging`
3. `auth.spec.ts`: `test('TC_AUTH_03...', async ({ loginPage, signupPage }) => ...`
   └─▶ `fixtures/pages.fixture.ts` thấy test cần `loginPage` + `signupPage`
   └─▶ `new LoginPage(page)`, `new SignupPage(page)` (lazy - chỉ tạo khi test cần)
4. Arrange: `signupNewUser(loginPage, signupPage, user)` ← `helpers/signup-flow.ts`
   └─▶ `user = generateUser()` ← `utils/data-generator.ts`
   └─▶ `loginPage.signup()` → `signupPage.fillAccountInfo()` ← `pages/auth/*`
   └─▶ `fillAccountInfo` nhận type `AccountDetails` ← `models/user.model.ts`
5. Act: `loginPage.login(user.email, user.password)` ← `pages/auth/login.page.ts`
6. Assert: `expect(loginPage.loggedInAs).toContainText()` ← locator kế thừa từ `BasePage`
7. Cleanup: `loginPage.deleteAccount()` ← `pages/base.page.ts`

Và 1 test API (createAccount 201):

```
test → fixture (userService) → UserService.createAccount(user)
  → ApiClient.post('/createAccount', {form}) → trả body.json()
  → test assert body.responseCode === 201 (KHÔNG tin HTTP status)
  → cleanup: userService.deleteAccount()
```

### 🆕 Ví dụ: TC_CART_01 dùng `apiUser` (Ngày 7 — API-seeded)

```
test('TC_CART_01...', { tag: '@smoke' }, async ({ apiUser, loginPage, productPage, cartPage }) => ...
  └─▶ fixtures/user.fixture.ts: apiUser fixture chạy TRƯỚC khi test body bắt đầu
        └─▶ generateUser() ← utils/data-generator.ts
        └─▶ userService.createAccount(user) ← service inherit từ pages.fixture.ts
              → ApiClient.post('/createAccount', {form}) — KHÔNG qua UI, không tốn thời gian điền form
        └─▶ use(user) → test body nhận được user đã tồn tại sẵn trên server

  Act: loginPage.goto() → loginPage.login(apiUser.email, apiUser.password)
       (chỉ login qua UI để page có session — account đã tồn tại từ bước trên)
  ... productPage.addProductToCartByName() → cartPage.getProductPrice()/getProductQuantity() ...

  Cleanup: fixture tự chạy userService.deleteAccount() trong finally, KHÔNG cần gọi trong test body
```

## 4. Công thức thêm code mới

**Thêm 1 page object mới**
1. Tạo `pages/<domain>/<ten>.page.ts`, class `XxxPage extends BasePage`.
2. Locator public cho element test cần assert, private cho input nội bộ. **Inspect DOM thật trước khi viết** — không đoán.
3. Đăng ký vào `fixtures/pages.fixture.ts`: thêm vào type `PageFixtures` + thêm block `xxxPage: async ({ page }, use) => ...`.
4. Element xuất hiện ở nhiều trang (header, modal) → đặt ở `BasePage`, không lặp ở từng page.

**Thêm 1 service API mới**
1. Định nghĩa request/response interface ở `models/<ten>.model.ts`.
2. Tạo `services/<ten>.service.ts` — constructor nhận `ApiClient`, method trả `res.json()`, không assert.
3. Đăng ký vào fixture với `new XxxService(new ApiClient(request, ENV.API_BASE_URL))`.

**🆕 Thêm 1 JSON Schema mới**
1. Tạo `schemas/<ten>.schema.json` — JSON Schema draft-07, chỉ khai `required` cho field thật sự bắt buộc, để `additionalProperties: true` trừ khi cố tình muốn fail lúc site thêm field lạ.
2. Test load bằng `fs.readFileSync` + `JSON.parse` (không dùng `import ... from '*.json'` — repo không có `tsconfig.json`/`resolveJsonModule`).
3. Validate bằng `validateSchema(schema, data)` từ `helpers/schema-validator.ts`, assert `valid === true` kèm `JSON.stringify(errors)` làm message để fail có thông tin ngay, không cần mở debugger.

**Thêm 1 test mới**
1. Viết test case vào `docs/test-cases.md` TRƯỚC (ID, steps, expected, 🆕 cột `Type`: `smoke`/`regression`) — code sau.
2. Spec đặt ở `tests/ui/` hoặc `tests/api/` (config tự route vào đúng project).
3. Import test/expect từ fixture (`pages.fixture.ts`, hoặc 🆕 `user.fixture.ts` nếu chỉ cần account có sẵn, không test luồng signup). Tên test bắt đầu bằng `TC_ID`, 🆕 tham số thứ 2 là `{ tag: '@smoke' }` hoặc `{ tag: '@regression' }` khớp đúng cột `Type`.
4. Data: cần unique → generator; negative tĩnh → CSV + `dataFor()`; chỉ cần account có sẵn → 🆕 `apiUser`.
5. Test tạo state trên server (account, order) → bắt buộc có Cleanup (hoặc dùng `apiUser` để cleanup tự động).

**Thêm 1 biến môi trường mới**
1. Thêm vào cả 4 file: `.env.example` (commit) + `.env.staging/.uat/.prod` (local).
2. Khai báo trong `ENV` object ở `utils/env.ts` (nhớ ép kiểu nếu là số).
3. Dùng qua `ENV.TEN_BIEN`, không đọc `process.env` rải rác.

## 5. Lệnh thường dùng

```bash
npm run test:staging               # full suite theo env staging
npm run test:uat                   # theo env uat
npm run test:smoke                 # 🆕 chỉ test @smoke (tất cả project)
npm run test:regression            # 🆕 chỉ test @regression
npx playwright test --project=api        # chỉ API tests
npx playwright test --project=chromium   # chỉ UI trên chromium
npx playwright test tests/ui/auth.spec.ts --headed   # 1 file, có UI
npm run test:ui-mode               # UI mode để debug
npm run report                     # mở HTML report
npm run report:allure              # 🆕 generate + mở Allure report
npx playwright show-trace <path>   # mổ xẻ trace khi fail
```

## 6. Tra cứu nhanh khi quên

| Muốn… | Xem file |
|---|---|
| Biết test case gốc + expected + Type (smoke/regression) | `docs/test-cases.md` |
| Biết config env nào đang chạy | `utils/env.ts` + `.env.<TEST_ENV>` |
| Thêm element header/modal | `pages/base.page.ts` |
| Sửa flow đăng ký dùng chung | `helpers/signup-flow.ts` (1 nơi duy nhất) |
| Hiểu shape API request/response | `models/*.model.ts` |
| 🆕 Seed account qua API thay vì UI | `fixtures/user.fixture.ts` (`apiUser`) |
| 🆕 Validate response API khớp contract | `schemas/*.schema.json` + `helpers/schema-validator.ts` |
| 🆕 Xem bug đã tìm thấy trên site thật | `docs/bugs/` |
| 🆕 Xem chiến lược CI (khi nào chạy smoke, khi nào full) | `.github/workflows/playwright.yml` |
| Xem lỗi đã từng gặp + cách fix | `notes/mistakes-log.md` (gitignored) |
