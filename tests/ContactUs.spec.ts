import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { HomePage } from '../pages/HomePage';
import { ContactUs, ContactDetails } from '../pages/ContactUs';

test.describe('Contact Us Form Tests', () => {
  let loginPage: LoginPage;
  let homePage: HomePage;
  let contactUs: ContactUs;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    homePage = new HomePage(page);
    contactUs = new ContactUs(page);

    // 1. Navigate to Login page and log in
    await loginPage.navigateToLoginPage();
    await loginPage.login('sagesyntaxacademy', 'BuildingExcellence@111');
    await loginPage.verifyLoginSuccess();

    // 2. Navigate to Contact Us page from navbar after login
    await homePage.openContact();
  });

  test('Verify Contact Us page elements are displayed', async ({ page }) => {
    await contactUs.verifyFormElementsVisible();
    await expect(contactUs.heading).toBeVisible();
    await page.waitForTimeout(1000);
  });

  test('Submit Contact Us form with Gender: Male', async ({ page }) => {
    const contactData: ContactDetails = {
      name: 'Alex Johnson',
      email: 'alex.johnson@example.com',
      message: 'Hello, I have an inquiry regarding your products.',
      gender: 'male',
      report: true
    };

    // Fill form details
    await contactUs.fillName(contactData.name);
    await contactUs.fillEmail(contactData.email);
    await contactUs.fillMessage(contactData.message);
    await contactUs.selectGender(contactData.gender);
    await contactUs.checkReportCheckbox();

    // Assert values and states before submission
    await expect(contactUs.nameInput).toHaveValue(contactData.name);
    await expect(contactUs.emailInput).toHaveValue(contactData.email);
    await expect(contactUs.messageInput).toHaveValue(contactData.message);
    await expect(contactUs.genderDropdown).toHaveValue('male');
    await expect(contactUs.reportCheckbox).toBeChecked();

    // Submit form and verify success
    await contactUs.clickSubmit();
    await contactUs.verifySubmissionSuccess();
    await page.waitForTimeout(1000);
  });

  test('Submit Contact Us form with Gender: Female', async ({ page }) => {
    const contactData: ContactDetails = {
      name: 'Sophia Williams',
      email: 'sophia.williams@example.com',
      message: 'Inquiry regarding shipping and bulk order discounts.',
      gender: 'female',
      report: true
    };

    // Fill form details
    await contactUs.fillName(contactData.name);
    await contactUs.fillEmail(contactData.email);
    await contactUs.fillMessage(contactData.message);
    await contactUs.selectGender(contactData.gender);
    await contactUs.checkReportCheckbox();

    // Assert values and states before submission
    await expect(contactUs.nameInput).toHaveValue(contactData.name);
    await expect(contactUs.emailInput).toHaveValue(contactData.email);
    await expect(contactUs.messageInput).toHaveValue(contactData.message);
    await expect(contactUs.genderDropdown).toHaveValue('female');
    await expect(contactUs.reportCheckbox).toBeChecked();

    // Submit form and verify success
    await contactUs.clickSubmit();
    await contactUs.verifySubmissionSuccess();
    await page.waitForTimeout(1000);
  });

  test('Submit Contact Us form with Gender: Other', async ({ page }) => {
    const contactData: ContactDetails = {
      name: 'Taylor Reed',
      email: 'taylor.reed@example.com',
      message: 'Requesting partnership and customer support details.',
      gender: 'other',
      report: true
    };

    // Fill form details using high-level helper method
    await contactUs.submitContactForm(contactData);

    // Verify submission success banner is displayed
    await contactUs.verifySubmissionSuccess();
    await page.waitForTimeout(1000);
  });
});

test.describe('Contact Us - Parameterized Tests for All Three Genders', () => {
  const genderTestCases: Array<{ gender: 'male' | 'female' | 'other'; name: string; email: string }> = [
    { gender: 'male', name: 'James Miller', email: 'james.miller@example.com' },
    { gender: 'female', name: 'Emma Davis', email: 'emma.davis@example.com' },
    { gender: 'other', name: 'Jordan Lee', email: 'jordan.lee@example.com' }
  ];

  for (const testCase of genderTestCases) {
    test(`Data-driven submission for Gender: ${testCase.gender}`, async ({ page }) => {
      const loginPage = new LoginPage(page);
      const homePage = new HomePage(page);
      const contactUs = new ContactUs(page);

      // Login
      await loginPage.navigateToLoginPage();
      await loginPage.login('sagesyntaxacademy', 'BuildingExcellence@111');
      await loginPage.verifyLoginSuccess();

      // Navigate to Contact Us
      await homePage.openContact();

      // Fill and submit form
      await contactUs.submitContactForm({
        name: testCase.name,
        email: testCase.email,
        message: `Testing submission with gender option ${testCase.gender}.`,
        gender: testCase.gender,
        report: true
      });

      // Assert success
      await contactUs.verifySubmissionSuccess();
    });
  }
});
