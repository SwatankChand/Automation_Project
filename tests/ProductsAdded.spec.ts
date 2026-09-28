import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { AllProductsToCart } from '../pages/AllProductsToCart';

test('Add all available products and verify cart count', async ({ page }) => {
  test.setTimeout(60000);
  const loginPage = new LoginPage(page);
  const allProductsToCart = new AllProductsToCart(page);

  // 1. Navigate to Login page
  await loginPage.navigateToLoginPage();

  // 2. Login
  await loginPage.login('sagesyntaxacademy', 'BuildingExcellence@111');

  // 3. Verify login successful
  await loginPage.verifyLoginSuccess();

  // 4. Open Products Catalog
  await allProductsToCart.openProducts();

  // 5. Count available products (checking 'Available' within each card)
  const availableProductCount = await allProductsToCart.getAvailableProductCount();
  expect(availableProductCount).toBeGreaterThan(0);

  // 6. Add all available products (skip Out of Stock)
  await allProductsToCart.addAllAvailableItems();

  // 7. Open Cart
  await allProductsToCart.openCart();

  // 8. Verify cart count equals available product count
  await allProductsToCart.verifyCartCount(availableProductCount);
});