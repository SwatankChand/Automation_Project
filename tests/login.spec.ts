import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test.describe('Positive Login Tests', () => {
  test('Login page elements should be displayed', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigateToLoginPage();

    await expect(loginPage.usernameField).toBeVisible();
    await expect(loginPage.passwordField).toBeVisible();
    await expect(loginPage.tncCheckbox).toBeVisible();
    await expect(loginPage.signBtn).toBeVisible();

    await page.waitForTimeout(1000);
    await page.pause();
  });

  test('User is able to login successfully with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigateToLoginPage();

    await loginPage.login(
      'sagesyntaxacademy',
      'BuildingExcellence@111'
    );

    // Assert that login success message is visible
    await loginPage.verifyLoginSuccess();

    await page.waitForTimeout(1000);
    await page.pause();
  });
});

test.describe('Negative Login Tests', () => {
  test('Login with invalid username', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigateToLoginPage();

    await loginPage.login(
      'wrongusername',
      'BuildingExcellence@111'
    );

    // Assert that error message is displayed for invalid login
    await loginPage.verifyLoginFailure();

    await page.waitForTimeout(1000);
    await page.pause();
  });

  test('Login with invalid password', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigateToLoginPage();

    await loginPage.login(
      'sagesyntaxacademy',
      'WrongPassword123'
    );

    // Assert that error message is displayed for invalid login
    await loginPage.verifyLoginFailure();

    await page.waitForTimeout(1000);
    await page.pause();
  });

  test('Login with invalid username and password', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigateToLoginPage();

    await loginPage.login(
      'wrongusername',
      'WrongPassword123'
    );

    // Assert that error message is displayed for invalid login
    await loginPage.verifyLoginFailure();

    await page.waitForTimeout(1000);
    await page.pause();
  });
});