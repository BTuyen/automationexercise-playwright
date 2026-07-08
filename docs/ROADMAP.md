# 🗓 Roadmap 10 ngày — hoàn thành repo cho CV (QA/Automation Engineer)

> Cường độ: ~3h/ngày. Mỗi ngày kết thúc bằng 1-2 commit + push.
> Cách làm việc: tự code trước → gặp lỗi hỏi mentor → mentor review như PR thật.

## Ngày 1 — Multi-env config ✅ nền móng
- [ ] Cài `dotenv`, code `playwright.config.ts` đọc `TEST_ENV` → load `.env.staging/.uat/.prod`
- [ ] Config chung: baseURL, retries, workers, timeout, screenshot/video on failure
- [ ] Verify: `npm run test:staging` chạy example.spec pass
- Commit: `feat: multi-env config with dotenv`

## Ngày 2 — Test plan + test cases (điểm nhấn QA)
- [ ] Viết `docs/test-plan.md`: scope, approach, env, entry/exit criteria
- [ ] Viết ~20 test case dạng bảng cho Auth + Cart + Checkout (`docs/test-cases.md`)
- [ ] Áp dụng boundary value + equivalence partitioning cho form signup
- Commit: `docs: test plan and test cases`

## Ngày 3 — BasePage + POM đầu tiên
- [ ] `pages/base.page.ts`: navigate, common waits, helpers
- [ ] `HomePage`, `LoginPage`, `SignupPage` — locator ưu tiên `getByRole/getByLabel`
- [ ] Custom fixtures (`fixtures/pages.fixture.ts`) inject page objects
- Commit: `feat: base page, auth page objects, fixtures`

## Ngày 4 — Test UI Auth
- [ ] TC: register thành công, login đúng/sai, logout, delete account
- [ ] Test data tách vào `resources/testdata/users.json`
- [ ] Map tên test theo ID test case (TC_AUTH_001...)
- Commit: `test: auth UI test suite`

## Ngày 5 — POM + test flow mua hàng
- [ ] `ProductPage`, `CartPage`, `CheckoutPage`
- [ ] Test E2E: search product → add to cart → checkout → verify order
- Commit: `feat: product/cart/checkout pages` + `test: e2e purchase flow`

## Ngày 6 — API layer
- [ ] `helpers/api-client.ts` (wrap request context), `models/`, `services/user.service.ts`, `services/product.service.ts`
- [ ] Test API: createAccount, verifyLogin, productsList, searchProduct
- Commit: `feat: api services layer` + `test: api test suite`

## Ngày 7 — API seed data cho UI (pattern production)
- [ ] UI test dùng `user.service` tạo account qua API thay vì qua UI
- [ ] Schema validation cho response (`schemas/`)
- Commit: `refactor: seed test data via api`

## Ngày 8 — CI/CD GitHub Actions
- [ ] Sửa `playwright.yml`: chạy trên push/PR, matrix env, upload report artifact
- [ ] Thêm badge CI vào README
- Commit: `ci: github actions with report artifact`

## Ngày 9 — Allure report + tagging
- [ ] Tích hợp `allure-playwright`, publish report (GitHub Pages nếu kịp)
- [ ] Tag `@smoke` / `@regression`, script `test:smoke`
- [ ] Tìm + viết 2-3 bug report thật của site vào `docs/bugs/`
- Commit: `feat: allure report, test tagging` + `docs: bug reports`

## Ngày 10 — Polish & đóng gói cho CV
- [ ] README hoàn chỉnh: badge, kiến trúc, screenshot report, hướng dẫn chạy
- [ ] Dọn code: lint, đặt tên nhất quán, xoá code thừa
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
