import { Page, Locator, expect } from '@playwright/test';

export class AllProductsToCart {
  readonly page: Page;

  readonly productsLink: Locator;
  readonly cartLink: Locator;
  readonly productCards: Locator;
  readonly checkoutBtn: Locator;

  readonly emptyCartMsg: Locator;

  constructor(page: Page) {
    this.page = page;

    this.productsLink = page.getByRole('link', { name: 'Products' });
    this.cartLink = page.getByRole('link', { name: 'Cart' });
    this.productCards = page.locator('.card-body');
    this.checkoutBtn = page.getByRole('button', { name: 'Checkout' });
    this.emptyCartMsg = page.getByText(/Your cart is Empty/i);
  }

  // Open Products page
  async openProducts() {
    await this.productsLink.click();
    await expect(this.productCards.first()).toBeVisible({ timeout: 10000 });
  }

  // Get only product cards that contain 'Available' status within their own container
  getAvailableProductCards(): Locator {
    return this.productCards.filter({
      has: this.page.getByText('Available', { exact: true })
    });
  }

  // Count all available products
  async getAvailableProductCount(): Promise<number> {
    const availableCards = this.getAvailableProductCards();
    return await availableCards.count();
  }

  // Add all available products to cart while skipping out-of-stock items
  async addAllAvailableItems() {
    const availableCards = this.getAvailableProductCards();
    const count = await availableCards.count();

    for (let i = 0; i < count; i++) {
      const product = availableCards.nth(i);
      await product.getByRole('button', { name: 'Add to cart' }).click();

      // Verify success popup
      await this.verifyItemAddedPopup();

      // Close popup
      await this.closeAddToCartPopup();
    }
  }

  // Verify "Item added successfully" popup
  async verifyItemAddedPopup() {
    await expect(this.page.getByText('Item added successfully', { exact: false }).first()).toBeVisible({ timeout: 5000 });
  }

  // Close popup
  async closeAddToCartPopup() {
    const closeBtn = this.page.locator('button:has-text("Close")').first();
    if (await closeBtn.isVisible()) {
      await closeBtn.dispatchEvent('click');
      await expect(this.page.getByText('Item added successfully', { exact: false })).toBeHidden({ timeout: 5000 }).catch(() => {});
    }
  }

  // Open Cart
  async openCart() {
    await this.cartLink.click();
    await expect(this.page).toHaveURL(/.*cart/);
    await this.page.waitForLoadState('domcontentloaded');
  }

  // Click Checkout button in Cart page
  async clickCheckout() {
    await expect(this.checkoutBtn).toBeVisible();
    await this.checkoutBtn.click();
  }

  // Count items in Cart
  async getCartItemCount(): Promise<number> {
    const removeButtons = this.page.locator('button:has-text("Remove"), .btn-error');
    await this.page.waitForLoadState('domcontentloaded');
    await removeButtons.first().waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
    const count = await removeButtons.count();
    return count;
  }

  // Remove first item from cart
  async removeFirstItem() {
    const removeBtn = this.page.locator('button:has-text("Remove"), .btn-error').first();
    await expect(removeBtn).toBeVisible();
    await removeBtn.click();
  }

  // Verify empty cart state
  async verifyEmptyCart() {
    await expect(this.emptyCartMsg).toBeVisible({ timeout: 10000 });
  }

  // Verify cart count with auto-retrying assertion
  async verifyCartCount(expectedCount: number) {
    const removeButtons = this.page.locator('button:has-text("Remove"), .btn-error');
    if (expectedCount > 0) {
      await expect(removeButtons.first()).toBeVisible({ timeout: 10000 });
    }
    await expect(removeButtons).toHaveCount(expectedCount, { timeout: 10000 });
  }
}

// Support alias name if imported as AllProductToCart
export { AllProductsToCart as AllProductToCart };
