import { expect, test } from '../../fixtures/pages.fixture';
import { CSVHandling } from '../../helpers/csv-handler';
import { LoginPage } from '../../pages/auth/login.page';
import { SignupPage } from '../../pages/auth/signup.page';
import { generatePlusTagEmail, generateUser } from '../../utils/data-generator';

// CSV chỉ chứa data TĨNH cho negative case (user không tồn tại, email sai format).
// Data cho signup thành công phải sinh ĐỘNG bằng generateUser() để không trùng.
const csvFilePath = 'resources/testdata/users.csv';
const testData = CSVHandling.readCSVFile(csvFilePath);
const dataFor = (id: string) => testData.find((row) => row.testcaseID === id);

// Flow đăng ký đầy đủ, dùng lại cho các test cần account tồn tại (Arrange trong test)
async function signupNewUser(loginPage: LoginPage, signupPage: SignupPage, user: ReturnType<typeof generateUser>) {
  await loginPage.goto();
  await loginPage.signup(user.name, user.email);
  await signupPage.fillAccountInfo({
    title: user.title,
    password: user.password,
    day: user.day,
    month: user.month,
    year: user.year,
    newsletter: user.newsletter,
    optin: user.optin
  });
  await signupPage.fillAddressInfo({
    firstName: user.firstName,
    lastName: user.lastName,
    company: user.company,
    address1: user.address1,
    address2: user.address2,
    country: user.country,
    state: user.state,
    city: user.city,
    zipcode: user.zipcode,
    mobileNumber: user.mobileNumber
  });
  await signupPage.createAccount();
}

test.describe('Auth', () => {
  test('TC_AUTH_01 | should signup successfully with valid email', async ({ loginPage, signupPage }) => {
    const user = generateUser();
    await signupNewUser(loginPage, signupPage, user);

    // Expected theo docs: hiển thị ACCOUNT CREATED! rồi mới Continue
    await expect(signupPage.accountCreatedHeading).toBeVisible();
    await signupPage.continueAfterAccountCreated();
    await expect(loginPage.loggedInAs).toContainText(user.name);

    // Cleanup: xoá account vừa tạo để không tích luỹ user rác trên site demo dùng chung
    await loginPage.deleteAccount();
  });

  test('TC_AUTH_02 | should show error when signup with an already existing email', async ({ loginPage, signupPage }) => {
    // Arrange: account phải được tạo động ngay trong test để chắc chắn email "đã tồn tại"
    const user = generateUser();
    await signupNewUser(loginPage, signupPage, user);
    await expect(signupPage.accountCreatedHeading).toBeVisible();
    await signupPage.continueAfterAccountCreated();
    await loginPage.logoutLink.click();

    // Act: signup lại với đúng email đó
    await loginPage.signup(user.name, user.email);

    // Assert
    await expect(loginPage.emailExistsError).toBeVisible();

    // Cleanup: login lại để xoá account
    await loginPage.login(user.email, user.password);
    await loginPage.deleteAccount();
  });

  test('TC_AUTH_03 | should login successfully with valid credentials', async ({ loginPage, signupPage }) => {
    // Arrange: tự tạo account rồi logout
    const user = generateUser();
    await signupNewUser(loginPage, signupPage, user);
    await expect(signupPage.accountCreatedHeading).toBeVisible();
    await signupPage.continueAfterAccountCreated();
    await loginPage.logoutLink.click();

    // Act
    await loginPage.login(user.email, user.password);

    // Assert
    await expect(loginPage.loggedInAs).toContainText(user.name);

    // Cleanup
    await loginPage.deleteAccount();
  });

  test('TC_AUTH_04 | should show error with non-existent credentials', async ({ loginPage }) => {
    const data = dataFor('TC_AUTH_04');
    await loginPage.goto();
    await loginPage.login(data.email, data.password);
    await expect(loginPage.errorMessage).toBeVisible();
  });

  test('TC_AUTH_05 | should logout and clear session', async ({ loginPage, signupPage }) => {
    // Arrange: tạo account (sau signup đã ở trạng thái logged in)
    const user = generateUser();
    await signupNewUser(loginPage, signupPage, user);
    await expect(signupPage.accountCreatedHeading).toBeVisible();
    await signupPage.continueAfterAccountCreated();

    // Act
    await loginPage.logoutLink.click();

    // Assert: về trang login, session clear (header không còn "Logged in as")
    await expect(loginPage.loginForm).toBeVisible();
    await expect(loginPage.loggedInAs).toBeHidden();

    // Cleanup
    await loginPage.login(user.email, user.password);
    await loginPage.deleteAccount();
  });

  test('TC_AUTH_06 | should signup successfully with plus-tag/subdomain email (EP valid class)', async ({ loginPage, signupPage }) => {
    const user = { ...generateUser(), email: generatePlusTagEmail() };
    await signupNewUser(loginPage, signupPage, user);

    await expect(signupPage.accountCreatedHeading).toBeVisible();
    await signupPage.continueAfterAccountCreated();
    await expect(loginPage.loggedInAs).toContainText(user.name);

    // Cleanup
    await loginPage.deleteAccount();
  });

  test('TC_AUTH_07 | should reject signup email missing @ (EP invalid class)', async ({ loginPage }) => {
    const data = dataFor('TC_AUTH_07');
    await loginPage.goto();
    await loginPage.signup(data.name, data.email);

    // HTML5 validation chặn submit → vẫn ở trang login, input ở trạng thái invalid
    expect(await loginPage.getSignupEmailValidity()).toBe(false);
    await expect(loginPage.signupForm).toBeVisible();
  });

  test('TC_AUTH_08 | should reject signup email missing domain (EP invalid class)', async ({ loginPage }) => {
    const data = dataFor('TC_AUTH_08');
    await loginPage.goto();
    await loginPage.signup(data.name, data.email);

    expect(await loginPage.getSignupEmailValidity()).toBe(false);
    await expect(loginPage.signupForm).toBeVisible();
  });
});
