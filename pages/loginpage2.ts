import { Page, Locator } from '@playwright/test';

export class LoginPage2 {

  page: Page;
  username: Locator;
  password: Locator;
  signInBtn: Locator;
  checkTerms: Locator;
  dropdown: Locator;
  loginmsg:Locator;

  constructor(page: Page) {
    this.page = page;

    this.username = page.getByLabel('Username');
    this.password = page.getByLabel('Password');
    this.signInBtn = page.getByRole('button', { name: 'Sign In' });
    this.checkTerms = page.getByLabel('I agree to the terms and conditions');
    this.dropdown = page.getByRole('combobox', { name: 'Student' });
    this.loginmsg = page.getByText('user login successfull',{exact:false});
  }

  async navigateToLoginPage() {
    await this.page.goto('https://automationpracticehub.com/');
  }

  async login(username: string, password: string) {
    await this.username.fill(username);
    await this.password.fill(password);
    await this.checkTerms.check();
    await this.signInBtn.click();
    await this.loginmsg.tobevisible();6
  }
}