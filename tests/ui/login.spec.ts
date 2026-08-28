import { test, expect } from '../../fixtures/pageFixtures';
import { users } from '../../fixtures/testData';

test.describe('Login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open();
  });

  test('standard user can log in and reach the inventory page', async ({
    loginPage,
    page,
  }) => {
    await loginPage.login(users.standard.username, users.standard.password);
    await expect(page).toHaveURL(/inventory\.html/);
    await expect(page.locator('.inventory_list')).toBeVisible();
  });

  test('locked out user sees a clear error message', async ({ loginPage }) => {
    await loginPage.login(users.lockedOut.username, users.lockedOut.password);
    await loginPage.expectError(/locked out/i);
  });

  test('invalid credentials are rejected', async ({ loginPage }) => {
    await loginPage.login(users.invalid.username, users.invalid.password);
    await loginPage.expectError(/username and password do not match/i);
  });

  test('empty submission prompts for username', async ({ loginPage }) => {
    await loginPage.login('', '');
    await loginPage.expectError(/username is required/i);
  });

  test('password required when username is present', async ({ loginPage }) => {
    await loginPage.login(users.standard.username, '');
    await loginPage.expectError(/password is required/i);
  });
});
