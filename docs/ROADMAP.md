# 🗓 Roadmap 10 ngày — hoàn thành repo cho CV (QA/Automation Engineer)

> Cường độ: ~3h/ngày. Mỗi ngày kết thúc bằng 1-2 commit + push.
> Cách làm việc: tự code trước → gặp lỗi hỏi mentor → mentor review như PR thật.

## Ngày 1 — Multi-env config ✅ nền móng
- [x] Cài `dotenv`, code `playwright.config.ts` đọc `TEST_ENV` → load `.env.staging/.uat/.prod`
- [x] Config chung: baseURL, retries, workers, timeout, screenshot/video on failure
- [x] Verify: `npm run test:staging` chạy example.spec pass
- Commit: `feat: multi-env config with dotenv`

## Ngày 2 — Test plan + test cases (điểm nhấn QA)
- [x] Viết `docs/test-plan.md`: scope, approach, env, entry/exit criteria
- [x] Viết 25 test case dạng bảng cho Auth + Cart + Checkout (`docs/test-cases.md`) — vượt mục tiêu ~20
- [x] Áp dụng boundary value + equivalence partitioning cho form signup
- Commit: `docs: test plan and test cases`

## Ngày 3 — BasePage + POM đầu tiên
- [x] `pages/base.page.ts`: navigate, common waits, helpers
- [x] `HomePage`, `LoginPage`, `SignupPage` — locator ưu tiên `getByRole/getByLabel`
- [x] Custom fixtures (`fixtures/pages.fixture.ts`) inject page objects
- Commit: `feat: base page, auth page objects, fixtures`

## Ngày 4 — Test UI Auth
- [x] TC: register thành công, login đúng/sai, logout, delete account
- [x] Test data tách vào `resources/testdata/users.csv` (đổi từ json → csv lúc code, dùng `csv-parse`)
- [x] Map tên test theo ID test case (TC_AUTH_01...)
- Commit: `test: auth UI test suite (TC_AUTH_01-08)`

## Ngày 5 — POM + test flow mua hàng
- [x] `ProductPage`, `CartPage`, `CheckoutPage`
- [x] Test E2E: add to cart → checkout → verify order (không dùng search trong flow E2E — search có test API riêng ở Ngày 6)
- Commit: `feat: product/cart/checkout pages` + `test: cart & checkout suites`

## Ngày 6 — API layer
- [x] `helpers/api-client.ts` (wrap request context), `models/`, `services/user.service.ts`, `services/product.service.ts`
- [x] Test API: createAccount, verifyLogin, productsList, searchProduct
- Commit: `feat: api services layer, project split api/ui`

## Ngày 7 — API seed data cho UI (pattern production)
- [x] UI test dùng `apiUser` fixture tạo account qua API thay vì qua UI (~35% nhanh hơn)
- [x] Schema validation cho response (`schemas/`, ajv)
- Commit: `feat: api-seeded user fixture, schema validation, perf +35%`

## Ngày 8 — CI/CD GitHub Actions
- [x] Sửa `playwright.yml`: chạy trên push/PR/workflow_dispatch, upload report artifact — bỏ matrix env: cả 3 `.env.*` cùng trỏ về `automationexercise.com`, không phải 3 environment tách biệt thật, nên staging đại diện đủ cho CI
- [x] Thêm badge CI vào README
- Commit: `chore: ci github actions`

## Ngày 9 — Allure report + tagging
- [x] Tích hợp `allure-playwright` (chưa publish lên GitHub Pages — để ngoài scope 10 ngày)
- [x] Tag `@smoke` / `@regression`, script `test:smoke` / `test:regression`
- [x] Tìm + viết 3 bug report thật của site vào `docs/bugs/` (BUG_001–003, kèm evidence screenshot)
- Commit: `feat: allure report, test tagging, smoke-on-PR ci strategy + docs: bug reports`

## Ngày 10 — Polish & đóng gói cho CV
- [x] README hoàn chỉnh: badge, kiến trúc, screenshot report (Playwright HTML + Allure), hướng dẫn chạy
- [x] Dọn code: quét rác — 0 `console.log`, 0 `TODO/FIXME`, 0 test thừa (`--list` = đúng 46), 0 import/export không dùng
- [ ] Viết 3 bullet mô tả project để bỏ vào CV
- Commit: `docs: final readme polish`

---

## Định nghĩa "xong" (Definition of Done)
1. CI badge xanh trên README
2. ≥ 15 UI test + ≥ 8 API test pass ở cả 3 env
3. Test plan + test cases + bug reports trong `docs/`
4. Allure/HTML report xem được
5. README đọc 2 phút hiểu toàn bộ kiến trúc

## Song song mỗi ngày (30 phút, ngoài 3h code)
- Đọc ISTQB Foundation syllabus — chuẩn bị kiến thức QA cho phỏng vấn
