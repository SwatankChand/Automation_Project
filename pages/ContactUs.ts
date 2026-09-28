import { Page, Locator, expect } from '@playwright/test';

export interface ContactDetails {
  name: string;
  email: string;
  message: string;
  gender: 'male' | 'female' | 'other' | string;
  report?: boolean;
}

export class ContactUs {
  readonly page: Page;

  // Header navigation
  readonly contactNavLink: Locator;

  // Form elements
  readonly heading: Locator;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly messageInput: Locator;
  readonly genderDropdown: Locator;
  readonly adminRadio: Locator;
  readonly reportCheckbox: Locator;
  readonly submitBtn: Locator;

  // Feedback / result elements
  readonly successMessage: Locator;

  constructor(page: Page) {
    this.page = page;

    this.contactNavLink = page.getByRole('link', { name: 'Contact' });
    this.heading = page.getByText('Contact Us').first();
    this.nameInput = page.locator('#username');
    this.emailInput = page.locator('#email');
    this.messageInput = page.locator('#message');
    this.genderDropdown = page.locator('select');
    this.adminRadio = page.locator('#disable');
    this.reportCheckbox = page.locator('#report');
    this.submitBtn = page.getByRole('button', { name: 'Submit' });
    this.successMessage = page.getByText('Successfully submitted', { exact: false });
  }

  /**
   * Navigate directly to the Contact Us page URL
   */
  async navigateToContactPage() {
    await this.page.goto('https://automationpracticehub.com/contact/');
    await expect(this.heading).toBeVisible();
  }

  /**
   * Navigate to Contact Us page via the navigation bar link
   */
  async openContactFromNav() {
    await this.contactNavLink.click();
    await expect(this.page).toHaveURL(/.*contact/);
    await expect(this.heading).toBeVisible();
  }

  /**
   * Verify all Contact Us form controls are visible
   */
  async verifyFormElementsVisible() {
    await expect(this.nameInput).toBeVisible();
    await expect(this.emailInput).toBeVisible();
    await expect(this.messageInput).toBeVisible();
    await expect(this.genderDropdown).toBeVisible();
    await expect(this.reportCheckbox).toBeVisible();
    await expect(this.submitBtn).toBeVisible();
  }

  /**
   * Fill the name field
   */
  async fillName(name: string) {
    await this.nameInput.fill(name);
  }

  /**
   * Fill the email field
   */
  async fillEmail(email: string) {
    await this.emailInput.fill(email);
  }

  /**
   * Fill the message field
   */
  async fillMessage(message: string) {
    await this.messageInput.fill(message);
  }

  /**
   * Select a gender option from the dropdown ('male', 'female', or 'other')
   */
  async selectGender(gender: 'male' | 'female' | 'other' | string) {
    const value = gender.toLowerCase();
    await this.genderDropdown.selectOption(value);
  }

  /**
   * Check the "Check me if you want to report!" checkbox
   */
  async checkReportCheckbox() {
    await this.reportCheckbox.check();
  }

  /**
   * Uncheck the "Check me if you want to report!" checkbox
   */
  async uncheckReportCheckbox() {
    await this.reportCheckbox.uncheck();
  }

  /**
   * Click the Submit button
   */
  async clickSubmit() {
    await this.submitBtn.click();
  }

  /**
   * Fill all contact details and optionally check the report checkbox
   */
  async fillContactForm(details: ContactDetails) {
    await this.fillName(details.name);
    await this.fillEmail(details.email);
    await this.fillMessage(details.message);
    await this.selectGender(details.gender);

    if (details.report !== false) {
      await this.checkReportCheckbox();
    } else {
      await this.uncheckReportCheckbox();
    }
  }

  /**
   * Complete flow: fill details and submit form
   */
  async submitContactForm(details: ContactDetails) {
    await this.fillContactForm(details);
    await this.clickSubmit();
  }

  /**
   * Verify success alert banner "Successfully submitted 🎉" is displayed
   */
  async verifySubmissionSuccess() {
    await expect(this.successMessage).toBeVisible({ timeout: 10000 });
  }
}
