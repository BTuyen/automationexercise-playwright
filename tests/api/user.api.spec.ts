import { expect, test } from '../../fixtures/pages.fixture';
import { generateUser } from '../../utils/data-generator';

// Bẫy của API site này: HTTP status luôn 200 dù thành công hay thất bại -
// kết quả thật nằm trong body.responseCode (201/200/400/404), không phải res.status()

test.describe('User API', () => {
  test('createAccount trả responseCode 201 khi email chưa tồn tại', { tag: '@smoke' }, async ({ userService }) => {
    const user = generateUser();
    const res = await userService.createAccount(user);

    expect(res.responseCode).toBe(201);
    expect(res.message).toBe('User created!');

    // Cleanup
    await userService.deleteAccount(user.email, user.password);
  });

  test('createAccount trả responseCode 400 khi email đã tồn tại', { tag: '@smoke' }, async ({ userService }) => {
    const user = generateUser();
    await userService.createAccount(user);

    const duplicateRes = await userService.createAccount(user);
    expect(duplicateRes.responseCode).toBe(400);
    expect(duplicateRes.message).toBe('Email already exists!');

    // Cleanup
    await userService.deleteAccount(user.email, user.password);
  });

  test('verifyLogin trả responseCode 200 khi đúng email/password', { tag: '@smoke' }, async ({ userService }) => {
    const user = generateUser();
    await userService.createAccount(user);

    const res = await userService.verifyLogin(user.email, user.password);
    expect(res.responseCode).toBe(200);
    expect(res.message).toBe('User exists!');

    // Cleanup
    await userService.deleteAccount(user.email, user.password);
  });

  test('verifyLogin trả responseCode 404 khi sai password', { tag: '@smoke' }, async ({ userService }) => {
    const user = generateUser();
    await userService.createAccount(user);

    const res = await userService.verifyLogin(user.email, 'wrong-password');
    expect(res.responseCode).toBe(404);
    expect(res.message).toBe('User not found!');

    // Cleanup
    await userService.deleteAccount(user.email, user.password);
  });

  test('deleteAccount trả responseCode 200 sau khi xoá thành công', { tag: '@smoke' }, async ({ userService }) => {
    const user = generateUser();
    await userService.createAccount(user);

    const res = await userService.deleteAccount(user.email, user.password);
    expect(res.responseCode).toBe(200);
    expect(res.message).toBe('Account deleted!');
  });
});
