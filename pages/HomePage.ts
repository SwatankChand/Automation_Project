import { Page, Locator, expect } from '@playwright/test';

export class HomePage {
  readonly page: Page;

  readonly productsLink: Locator;
  readonly cartLink: Locator;
  readonly contactLink: Locator;
  readonly productCards: Locator;

  constructor(page: Page) {
    this.page = page;

    this.productsLink = page.getByRole('link', { name: 'Products' });
    this.cartLink = page.getByRole('link', { name: 'Cart' });
    this.contactLink = page.getByRole('link', { name: 'Contact' });
    this.productCards = page.locator('.card-body');
  }

  async openProducts() {
    await this.productsLink.click();
    await expect(this.productCards.first()).toBeVisible({ timeout: 10000 });
  }

  async addItemToCart(itemName: string) {
    const productCard = this.productCards.filter({ hasText: itemName }).first();
    await expect(productCard).toBeVisible();
    await productCard.getByRole('button', { name: 'Add to cart' }).click();
  }

  async verifyItemAddedPopup() {
    await expect(this.page.getByText('Item added successfully', { exact: false }).first()).toBeVisible();
  }

  async closeAddToCartPopup() {
    const closeBtn = this.page.locator('button:has-text("Close")').first();
    if (await closeBtn.isVisible()) {
      await closeBtn.dispatchEvent('click');
    }
  }

  async openCart() {
    await this.cartLink.click();
    await expect(this.page).toHaveURL(/.*cart/);
  }

  async openContact() {
    await this.contactLink.click();
    await expect(this.page).toHaveURL(/.*contact/);
  }

  async verifyItemInCart(itemName: string) {
    const itemLocator = this.page.getByText(itemName, { exact: false });
    await expect(itemLocator.first()).toBeVisible();
  }
}