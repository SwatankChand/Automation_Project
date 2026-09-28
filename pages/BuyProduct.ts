import { Page, Locator, expect } from '@playwright/test';

export interface CustomerDetails {
  company?: string;
  taxId?: string | number;
  firstName: string;
  lastName: string;
  country: string;
  state: string;
  city: string;
  address1: string;
  address2?: string;
  postalCode: string | number;
  email: string;
  phone: string | number;
}

export class BuyProduct {
  readonly page: Page;

  // Products Page Locators
  readonly productsLink: Locator;
  readonly productCards: Locator;
  readonly buyNowBtn: Locator;

  // Customer Details Form Locators
  readonly customerDetailsHeading: Locator;
  readonly companyInput: Locator;
  readonly taxIdInput: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly countryDropdown: Locator;
  readonly stateDropdown: Locator;
  readonly cityDropdown: Locator;
  readonly address1Input: Locator;
  readonly address2Input: Locator;
  readonly postalCodeInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly differentShippingCheckbox: Locator;
  readonly notifyOffersCheckbox: Locator;
  readonly continueBtn: Locator;

  // Review Order Page Locators
  readonly reviewOrderHeading: Locator;
  readonly shippingName: Locator;
  readonly shippingAddress: Locator;
  readonly shippingStateCountry: Locator;
  readonly shippingPhone: Locator;
  readonly orderSummaryItems: Locator;
  readonly orderSummaryQuantity: Locator;
  readonly orderSummaryTotal: Locator;
  readonly placeOrderBtn: Locator;

  // Order Placed / Success Page Locators
  readonly orderPlacedHeading: Locator;
  readonly orderIdText: Locator;
  readonly browseBtn: Locator;

  constructor(page: Page) {
    this.page = page;

    // Navigation & Catalog
    this.productsLink = page.getByRole('link', { name: 'Products' });
    this.productCards = page.locator('.card-body');
    this.buyNowBtn = page.getByRole('button', { name: 'Buy Now' });

    // Customer Details Modal / Form
    this.customerDetailsHeading = page.getByText('Customer Details', { exact: false });
    this.companyInput = page.getByPlaceholder('Company (Optional)');
    this.taxIdInput = page.getByPlaceholder('Tax ID (Optional)');
    this.firstNameInput = page.getByPlaceholder('First Name');
    this.lastNameInput = page.getByPlaceholder('Last Name');
    this.countryDropdown = page.locator('select').nth(0);
    this.stateDropdown = page.locator('select').nth(1);
    this.cityDropdown = page.locator('select').nth(2);
    this.address1Input = page.getByPlaceholder('Address 1');
    this.address2Input = page.getByPlaceholder('Address 2');
    this.postalCodeInput = page.getByPlaceholder('Postal Code');
    this.emailInput = page.getByPlaceholder('Email Address');
    this.phoneInput = page.getByPlaceholder('Phone');
    this.differentShippingCheckbox = page.getByLabel('Different Shipping Address');
    this.notifyOffersCheckbox = page.getByLabel('Notify me about offers via email');
    this.continueBtn = page.getByRole('button', { name: 'Continue' });

    // Review Order Page
    this.reviewOrderHeading = page.getByRole('heading', { name: 'Review Your Order' });
    this.shippingName = page.locator('p', { hasText: 'Name:' });
    this.shippingAddress = page.locator('p', { hasText: 'Address:' });
    this.shippingStateCountry = page.locator('p', { hasText: 'State/Country:' });
    this.shippingPhone = page.locator('p', { hasText: 'Phone:' });
    this.orderSummaryItems = page.locator('div.flex', { hasText: 'Items:' });
    this.orderSummaryQuantity = page.locator('div.flex', { hasText: 'Quantity:' });
    this.orderSummaryTotal = page.locator('div.flex', { hasText: 'Total:' });
    this.placeOrderBtn = page.getByRole('button', { name: 'Place Order' });

    // Order Placed Page
    this.orderPlacedHeading = page.getByRole('heading', { name: 'Order Placed' });
    this.orderIdText = page.getByText(/Order ID:\s*ORD\d+/i);
    this.browseBtn = page.getByRole('button', { name: 'Browse' });
  }

  // --- Step 1: Product Selection ---
  async openProducts() {
    await this.productsLink.click();
    await expect(this.productCards.first()).toBeVisible();
  }

  async clickBuyNowForProduct(productName: string) {
    const card = this.productCards.filter({ hasText: productName }).first();
    await expect(card).toBeVisible();
    await card.getByRole('button', { name: 'Buy Now' }).click();
  }

  async clickBuyNow() {
    await this.buyNowBtn.first().click();
  }

  // Individual Form Field Methods
  async fillCompany(company: string) {
    await this.companyInput.fill(company);
  }

  async fillTaxID(taxId: string | number) {
    await this.taxIdInput.fill(String(taxId));
  }

  async fillFirstName(firstName: string) {
    await this.firstNameInput.fill(firstName);
  }

  async fillLastName(lastName: string) {
    await this.lastNameInput.fill(lastName);
  }

  async selectCountry(country: string) {
    await this.countryDropdown.selectOption(country);
  }

  async selectState(state: string) {
    await expect(this.stateDropdown).toBeVisible();
    await this.stateDropdown.selectOption(state);
  }

  async selectCity(city: string) {
    await expect(this.cityDropdown).toBeVisible();
    await this.cityDropdown.selectOption(city);
  }

  async fillAddress1(address1: string) {
    await this.address1Input.fill(address1);
  }

  async fillAddress2(address2: string) {
    await this.address2Input.fill(address2);
  }

  async fillPostalCode(postalCode: string | number) {
    await this.postalCodeInput.fill(String(postalCode));
  }

  async fillEmailAddress(email: string) {
    await this.emailInput.fill(email);
  }

  async fillPhone(phone: string | number) {
    await this.phoneInput.fill(String(phone));
  }

  async clickContinueBtn() {
    await this.continueBtn.click();
  }

  // --- Category 1: Customer Details ---
  async verifyCustomerDetailsFormVisible() {
    await expect(this.customerDetailsHeading).toBeVisible();
    await expect(this.firstNameInput).toBeVisible();
    await expect(this.lastNameInput).toBeVisible();
    await expect(this.countryDropdown).toBeVisible();
    await expect(this.address1Input).toBeVisible();
    await expect(this.postalCodeInput).toBeVisible();
    await expect(this.emailInput).toBeVisible();
    await expect(this.phoneInput).toBeVisible();
    await expect(this.continueBtn).toBeVisible();
  }

  async fillCustomerDetails(details: CustomerDetails) {
    if (details.company) await this.fillCompany(details.company);
    if (details.taxId !== undefined) await this.fillTaxID(details.taxId);
    await this.fillFirstName(details.firstName);
    await this.fillLastName(details.lastName);

    await this.selectCountry(details.country);
    await this.selectState(details.state);
    await this.selectCity(details.city);

    await this.fillAddress1(details.address1);
    if (details.address2) await this.fillAddress2(details.address2);
    await this.fillPostalCode(details.postalCode);
    await this.fillEmailAddress(details.email);
    await this.fillPhone(details.phone);
  }

  async clickContinue() {
    await this.clickContinueBtn();
  }

  // --- Category 2: Review Order ---
  async verifyReviewOrderPageDisplayed() {
    await expect(this.reviewOrderHeading).toBeVisible();
  }

  async verifyReviewOrderDetails(productName: string, details: CustomerDetails) {
    // Verify product name displayed
    await expect(this.page.getByRole('heading', { name: productName })).toBeVisible();

    // Verify shipping details match entered details
    await expect(this.shippingName).toContainText(`${details.firstName}${details.lastName}`);
    await expect(this.shippingAddress).toContainText(details.address1);
    await expect(this.shippingStateCountry).toContainText(details.state);
    await expect(this.shippingStateCountry).toContainText(details.country);
    await expect(this.shippingPhone).toContainText(String(details.phone));

    // Verify order summary elements
    await expect(this.orderSummaryItems).toBeVisible();
    await expect(this.orderSummaryQuantity).toBeVisible();
    await expect(this.orderSummaryTotal).toBeVisible();
  }

  async clickPlaceOrder() {
    await this.placeOrderBtn.click();
  }

  // --- Category 3: Order Placed ---
  async verifyOrderPlacedPage(productName: string) {
    await expect(this.orderPlacedHeading).toBeVisible();
    await expect(this.orderIdText).toBeVisible();
    await expect(this.page.getByText(new RegExp(productName, 'i'))).toBeVisible();
    await expect(this.browseBtn).toBeVisible();
  }

  async clickBrowse() {
    await this.browseBtn.click();
    await expect(this.productsLink).toBeVisible();
    await expect(this.page).toHaveURL(/.*products/);
  }
}