# /config

Chứa config cho từng môi trường: `staging.config.ts`, `uat.config.ts`, `prod.config.ts` (sẽ code sau).

- Giá trị **không bí mật** (baseURL, timeout, retries) → để trong file config, commit bình thường.
- Giá trị **bí mật** (account, token, API key) → đọc từ `.env` (đã gitignore), tham khảo `.env.example` ở root.
- Chọn môi trường khi run: `TEST_ENV=uat npx playwright test`
