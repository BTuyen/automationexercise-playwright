# Test Cases — AutomationExercise.com

> Nguồn đối chiếu: các flow thực tế đã đi qua thủ công trên `automationexercise.com` (trang Signup/Login, Cart, Checkout).

**Ghi chú về BVA & EP trên form Signup:**
Site demo này **không công bố spec validate chính thức** cho field password/email. Boundary dưới đây dùng giả định phổ biến trong thực tế (password 6–20 ký tự). Khi chạy thật, nếu site chấp nhận giá trị ngoài giả định (do validate lỏng), **ghi lại actual behavior** và note lại là gap giữa "kỳ vọng chuẩn" và "hành vi thực tế của site" — đây cũng là một finding đáng báo cáo.

Quy ước: `Type` = `smoke` \| `regression` (viết thường). Kỹ thuật test design được ghi chú trong Title: **(EP)** = equivalence partitioning, **(BVA)** = boundary value analysis.

---

## Module: Auth (Signup / Login)

| ID | Title | Precondition | Steps | Expected | Priority | Type |
|---|---|---|---|---|---|---|
| TC_AUTH_01 | Đăng ký tài khoản mới hợp lệ — (EP: email valid class) | Chưa đăng nhập; email chưa từng đăng ký | 1. Vào trang chủ → Click **Signup/Login**<br>2. Nhập Name và Email address → Click **Signup**<br>3. Điền đủ thông tin bắt buộc ở form **Account Information** (name, email, password) và **Address Information** (first name, last name, address, country, state, city, zipcode, mobile number) → Click **Create Account** | Hiển thị **ACCOUNT CREATED!**<br>Sau khi click **Continue**, hiển thị **Logged in as [username]** ở header | High | smoke |
| TC_AUTH_02 | Đăng ký bằng email đã tồn tại | Chưa đăng nhập; email đã được đăng ký trước đó | 1. Vào trang chủ → Click **Signup/Login**<br>2. Nhập Name và Email address (đã tồn tại) → Click **Signup** | Hiển thị **Email Address already exist!**<br>Không chuyển sang bước điền thông tin | High | regression |
| TC_AUTH_03 | Đăng nhập đúng email và password | Đã có tài khoản hợp lệ | 1. Vào trang chủ → Click **Signup/Login**<br>2. Nhập đúng Email address và Password → Click **Login** | Hiển thị **Logged in as [username]** ở header | High | smoke |
| TC_AUTH_04 | Đăng nhập sai email hoặc password | Không cần account tồn tại | 1. Vào trang chủ → Click **Signup/Login**<br>2. Nhập Email address hoặc Password sai → Click **Login** | Hiển thị **Your email or password is incorrect!** | High | smoke |
| TC_AUTH_05 | Đăng xuất | Đã login | 1. Ở trang chủ → Click **Logout** | Điều hướng về trang Login; session bị clear (header không còn **Logged in as**) | Medium | smoke |
| TC_AUTH_06 | Đăng ký với email có subdomain / dấu cộng — (EP: valid class khác) | Chưa đăng nhập; email chưa từng đăng ký | 1. Signup với email dạng `ten+tag@mail.sub.com`<br>2. Hoàn tất form → **Create Account** | Account tạo thành công — hệ thống chấp nhận các format email hợp lệ ít gặp | Medium | regression |
| TC_AUTH_07 | Đăng ký bằng email thiếu ký tự @ — (EP: invalid class) | Chưa đăng nhập | 1. Signup với email `hathibichtuyengmail.com` (không có @) | Hệ thống từ chối / báo lỗi format email (hoặc HTML5 validation chặn submit) | Medium | regression |
| TC_AUTH_08 | Đăng ký bằng email thiếu domain — (EP: invalid class) | Chưa đăng nhập | 1. Signup với email `hathibichtuyen@` | Hệ thống từ chối / báo lỗi format email (hoặc HTML5 validation chặn submit) | Medium | regression |
| TC_AUTH_09 | Password đúng boundary dưới, 6 ký tự — (BVA: min) | Đã qua bước nhập name + email, đang ở form **Account Information** | 1. Nhập password đúng 6 ký tự (vd `abc123`)<br>2. Hoàn tất form → **Create Account** | Account tạo thành công (boundary min hợp lệ) | Medium | regression |
| TC_AUTH_10 | Password dưới boundary min, 5 ký tự — (BVA: min−1) | Đã qua bước nhập name + email, đang ở form **Account Information** | 1. Nhập password 5 ký tự (vd `abc12`)<br>2. Hoàn tất form → **Create Account** | Bị từ chối / báo lỗi độ dài tối thiểu.<br>Nếu site vẫn cho qua (validate lỏng) → ghi lại actual behavior làm finding | Medium | regression |
| TC_AUTH_11 | Password đúng boundary trên, 20 ký tự — (BVA: max) | Đã qua bước nhập name + email, đang ở form **Account Information** | 1. Nhập password đúng 20 ký tự<br>2. Hoàn tất form → **Create Account** | Account tạo thành công (boundary max hợp lệ) | Low | regression |
| TC_AUTH_12 | Password vượt boundary trên, 21 ký tự — (BVA: max+1) | Đã qua bước nhập name + email, đang ở form **Account Information** | 1. Nhập password 21 ký tự<br>2. Hoàn tất form → **Create Account** | Bị từ chối / báo lỗi độ dài tối đa.<br>Nếu site vẫn cho qua (validate lỏng) → ghi lại actual behavior làm finding | Low | regression |

## Module: Cart

| ID | Title | Precondition | Steps | Expected | Priority | Type |
|---|---|---|---|---|---|---|
| TC_CART_01 | Thêm 1 sản phẩm vào giỏ hàng | Đã đăng nhập; ở trang Products | 1. Hover sản phẩm bất kỳ → Click **Add to cart**<br>2. Click **View Cart** trên popup | Popup **Added!** hiển thị; sản phẩm trong cart đúng tên, giá, quantity = 1, total = giá sản phẩm | High | smoke |
| TC_CART_02 | Thêm nhiều sản phẩm vào giỏ hàng | Đã đăng nhập; ở trang Products | 1. **Add to cart** sản phẩm 1 → **Continue Shopping**<br>2. **Add to cart** sản phẩm 2 → **View Cart** | Cả 2 sản phẩm hiển thị trong giỏ; giá, quantity, total từng dòng khớp thông tin sản phẩm | High | regression |
| TC_CART_03 | Tăng số lượng sản phẩm trước khi add to cart | Ở trang chi tiết sản phẩm; giỏ hàng rỗng | 1. Nhập/click tăng quantity thành 5<br>2. Click **Add to cart** → **View Cart** | Giỏ hàng hiển thị đúng quantity = 5 cho sản phẩm đó | Medium | smoke |
| TC_CART_04 | Add sản phẩm đã có sẵn trong giỏ (cộng dồn quantity) | Giỏ đã có sản phẩm A với quantity = 2 | 1. Vào trang chi tiết sản phẩm A, nhập quantity = 3<br>2. **Add to cart** → **View Cart** | Giỏ hàng hiển thị sản phẩm A với quantity = 5 (cộng dồn 2+3), không tạo dòng trùng | Medium | regression |
| TC_CART_05 | Xoá sản phẩm khỏi giỏ | Ở trang Cart, có ít nhất 1 sản phẩm | 1. Click nút **X** ở dòng sản phẩm cần xoá | Sản phẩm bị remove khỏi giỏ hàng; các dòng còn lại giữ nguyên | High | regression |
| TC_CART_06 | Add to cart từ mục Recommended Items | Ở trang chủ | 1. Cuộn tới phần **RECOMMENDED ITEMS**<br>2. Click **Add to cart** trên 1 sản phẩm gợi ý<br>3. **View Cart** | Sản phẩm từ khu Recommended Items hiển thị đúng trong giỏ hàng | Medium | regression |
| TC_CART_07 | Giỏ hàng giữ nguyên sau khi login | Chưa login; đã add sản phẩm vào giỏ | 1. Add sản phẩm vào giỏ khi chưa login<br>2. Login với account có sẵn<br>3. **View Cart** | Sản phẩm đã add trước khi login vẫn còn trong giỏ | Low | regression |

## Module: Checkout

| ID | Title | Precondition | Steps | Expected | Priority | Type |
|---|---|---|---|---|---|---|
| TC_CHECKOUT_01 | Đặt hàng — đăng ký ngay lúc checkout | Chưa login; giỏ đã có sản phẩm | 1. Ở trang Cart → **Proceed To Checkout**<br>2. Click **Register / Login** → tạo account mới<br>3. Vào lại Cart → **Proceed To Checkout**<br>4. Nhập comment → **Place Order**<br>5. Nhập Name on Card, Card Number, CVC, Expiration → **Pay and Confirm Order** | Hiển thị **Your order has been placed successfully!** | High | smoke |
| TC_CHECKOUT_02 | Đặt hàng — đăng ký trước khi checkout | Chưa login | 1. **Signup/Login** → tạo account, verify **ACCOUNT CREATED!**<br>2. Add sản phẩm → Cart → **Proceed To Checkout**<br>3. Review order → **Place Order** → nhập payment → **Pay and Confirm Order** | Đặt hàng thành công, hiển thị success message | Medium | regression |
| TC_CHECKOUT_03 | Đặt hàng — login trước khi checkout | Đã có account | 1. **Signup/Login** → login bằng account có sẵn<br>2. Add sản phẩm → Cart → **Proceed To Checkout**<br>3. Review order → **Place Order** → nhập payment → **Pay and Confirm Order** | Đặt hàng thành công, hiển thị success message | High | smoke |
| TC_CHECKOUT_04 | Verify địa chỉ giao hàng / billing khớp thông tin đăng ký | Đã login | 1. Add sản phẩm vào giỏ → **Proceed To Checkout** | **Delivery Address** và **Billing Address** khớp đúng thông tin đã điền lúc đăng ký (address, city, state, country, zipcode) | Medium | regression |
| TC_CHECKOUT_05 | Nhập comment ở bước review order | Đang ở bước Review Order | 1. Nhập nội dung vào ô comment (vd "Giao giờ hành chính")<br>2. Click **Place Order** | Chuyển sang bước payment bình thường, không lỗi (dù có hay không có comment) | Low | regression |
| TC_CHECKOUT_06 | Checkout với giỏ hàng rỗng | Giỏ hàng rỗng | 1. Vào trực tiếp trang Cart | Hiển thị **Cart is empty!**; không có nút **Proceed To Checkout** khả dụng | Medium | regression |

---

**Tổng: 25 test case** — Auth: 12 · Cart: 7 · Checkout: 6
**Coverage kỹ thuật**: EP (TC_AUTH_01, 06, 07, 08) · BVA (TC_AUTH_09–12)
