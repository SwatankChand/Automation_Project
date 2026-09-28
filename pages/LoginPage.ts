import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly usernameField: Locator;
  readonly passwordField: Locator;
  readonly tncCheckbox: Locator;
  readonly signBtn: Locator;
  readonly loginmsg: Locator;
  readonly logoutLink: Locator;
  readonly loginFailedMsg: Locator;
  readonly invalidCredentialsMsg: Locator;

  constructor(page: Page) {
    this.page = page;

    this.usernameField = page.locator('#username');
    this.passwordField = page.locator('#password');
    this.tncCheckbox = page.locator('#terms');
    this.signBtn = page.getByRole('button', { name: /Sign In|Signing/i });
    this.loginmsg = page.getByText('Login Successful', { exact: false });
    this.logoutLink = page.getByRole('link', { name: 'Logout' });
    this.loginFailedMsg = page.getByText('Login Failed', { exact: false });
    this.invalidCredentialsMsg = page.getByText('Invalid Credentials', { exact: false });
  }

  async navigateToLoginPage() {
    await this.page.goto('https://automationpracticehub.com/login/');
    await expect(this.usernameField).toBeVisible();
  }

  async enterUsername(username: string) {
    await this.usernameField.click();
    await this.usernameField.fill(username);
  }

  async enterPassword(password: string) {
    await this.passwordField.fill(password);
  }

  async acceptTerms() {
    await this.tncCheckbox.check();
  }

  async clickSignIn() {
    await this.signBtn.click();
  }

  async login(username: string, password: string) {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.acceptTerms();
    await this.clickSignIn();
  }

  async verifyLoginSuccess() {
    // Assert either login success banner or user header state with logout is visible
    await expect(this.loginmsg.or(this.logoutLink)).toBeVisible({ timeout: 10000 });
  }

  async verifyLoginFailure() {
    await expect(this.loginFailedMsg.or(this.invalidCredentialsMsg)).toBeVisible({ timeout: 10000 });
  }
}