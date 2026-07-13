# Test Plan — AutomationExercise.com (Auth / Cart / Checkout)
> Đối tượng test: [automationexercise.com](https://automationexercise.com) — website demo public dành cho luyện QA. Test plan này scope lại 3 module chính: **Auth (Signup/Login)**, **Cart**, **Checkout**.
## 1. Scope
### Test gì (In scope)
- **Auth**: Đăng ký (Signup), Đăng nhập đúng/sai, Đăng xuất, Đăng ký email đã tồn tại
- **Cart**: Thêm sản phẩm vào giỏ, xem giỏ, thay đổi số lượng, xóa sản phẩm khỏi giỏ
- **Checkout**: Proceed to Checkout, xác nhận địa chỉ giao hàng, review order, nhập thông tin thanh toán, đặt hàng thành công
- **API tương ứng**: `verifyLogin`, `createAccount`, `deleteAccount` (đối chiếu hành vi UI với response API)
### Không test (Out of scope)
- Contact Us form, Product Review, Subscription (footer/home/cart)
- Category/Brand browsing, Search Product
- Download Invoice, Scroll up/down UI
- Cross-device (mobile responsive), Accessibility, Load/Performance testing
## 2. Approach
Test theo 2 phase:
- **Phase 1 — Manual (exploratory)**: đi thủ công qua từng flow trên site để xác nhận actual behavior, làm căn cứ viết/hiệu chỉnh test case (vì site không công bố spec).
- **Phase 2 — Automation (Playwright + TypeScript)**: automate các test case trong `test-cases.md` bằng framework của repo này (POM, fixtures, multi-env). Đây là mục tiêu chính của dự án.
- **Browser**: chạy trên **Chromium và Firefox** theo cấu hình `playwright.config.ts` (project `chromium`/`firefox`, `testMatch: tests/ui`); bộ `smoke` chạy trên cả 2, `regression` ưu tiên Chromium.
- **API**: verify độc lập với UI qua các endpoint REST tại `automationexercise.com/api_list` — phase 1 dùng Postman/curl, phase 2 automate bằng Playwright request context (`services/` layer). Chạy ở project riêng `api` (`testMatch: tests/api`, không cần browser) — `npx playwright test --project=api`.
## 3. Env
 | Môi trường | URL | Ghi chú |
|---|---|---|
| Production (duy nhất) | `https://automationexercise.com` | Site demo public, không có staging/sandbox riêng — **test trực tiếp trên production** |

> ⚠️ Vì không có môi trường riêng, dữ liệu test (account, order) là **thật trên hệ thống chung** với các QA khác đang luyện tập. Luôn dọn dữ liệu sau khi test
## 4. Entry Criteria

- Site truy cập được, không lỗi 5xx ở trang chủ
- Có sẵn danh sách email test **chưa từng đăng ký** (dùng email random/timestamp để tránh trùng)
- Đã có checklist test case (`test-cases.md`) được review
## 5. Exit Criteria

- **100%** test case mức `smoke` pass
- **≥ 95%** test case `regression` pass
- Không còn bug mức **Critical/Blocker** (chặn luồng Auth → Cart → Checkout) chưa fix hoặc chưa có workaround
- Toàn bộ account test đã được xóa (`Delete Account`) sau khi chạy xong
## 6. Risks

- **Dữ liệu dùng chung**: site public, email/account có thể bị trùng hoặc bị QA khác thao tác cùng lúc → cần email unique mỗi lần chạy
- **Không có spec chính thức**: các rule validate (độ dài password, format email...) không được công bố → test case boundary/equivalence phải ghi rõ là **giả định**, cần đối chiếu với actual behavior khi chạy
- **Payment giả lập**: cổng thanh toán không phải thật, không đại diện chính xác cho hành vi payment gateway thật (Stripe, VNPay...)
- **Site có thể thay đổi** bất kỳ lúc nào vì là site luyện tập công khai (UI, message lỗi có thể khác so với ghi nhận trong tài liệu này)
- **Không có test account cố định**: mỗi lần chạy full flow đều phải tạo mới rồi xóa, tốn thời gian setup/teardown
