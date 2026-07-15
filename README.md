# AutomationExercise – Playwright + TypeScript

![Playwright Tests](https://github.com/BTuyen/automationexercise-playwright/actions/workflows/playwright.yml/badge.svg)

Automation test framework cho [automationexercise.com](https://automationexercise.com) theo mô hình **Page Object Model (POM)**, hỗ trợ **UI + API testing**, chạy đa môi trường **Staging / UAT / Prod**.

> Trạng thái: đã dựng cấu trúc, chưa code.

## Cấu trúc thư mục

```
automationexercise-playwright/
├── pages/                  # Page Objects (POM) – mỗi page 1 class
├── tests/
│   ├── ui/                 # UI test specs
│   └── api/                # API test specs
├── fixtures/               # Playwright custom fixtures (page objects, auth state...)
├── helpers/                # Common services (api client, auth service, db...)
├── utils/                  # Common functions (random data, date, string, file...)
├── resources/
│   ├── testdata/           # Test data (json, csv...)
│   ├── img/                # Test data dạng hình ảnh
│   ├── media/              # Test data dạng video, audio
│   └── documents/          # Test data files còn lại (pdf, docx, xlsx...)
├── config/                 # Config theo môi trường: staging / uat / prod
├── reports/                # Kết quả run tạm (gitignored)
├── .github/workflows/      # CI/CD – GitHub Actions
├── .env.example            # Template biến môi trường (file .env thật bị gitignore)
├── .gitignore
└── README.md
```

## Môi trường

Chọn môi trường qua biến `TEST_ENV`:

```bash
TEST_ENV=staging npx playwright test   # default
TEST_ENV=uat npx playwright test
TEST_ENV=prod npx playwright test
```

Secrets (account, token) đặt trong `.env` — copy từ `.env.example`, không commit.

## Git ignore

- **Config & env**: `.env`, `.env.*` — mọi thông tin bí mật.
- **Test results**: `reports/`, `test-results/`, `playwright-report/`, `allure-results/`.

## Roadmap

- [ ] Init Playwright + TypeScript (`npm init playwright@latest`)
- [ ] Base page + page objects (Home, Login, Product, Cart, Checkout)
- [ ] Custom fixtures
- [ ] API helpers (seed data qua API)
- [ ] Multi-env config
- [ ] CI GitHub Actions + Allure report
