import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { HomePage } from '../pages/HomePage';
import { AllProductsToCart } from '../pages/AllProductsToCart';
import { BuyProduct, CustomerDetails } from '../pages/BuyProduct';

test.describe('Positive Cart & Checkout Tests', () => {
  test('Login, add specific items to cart, and verify items in cart', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);

    // 1. Open Login Page & Authenticate
    await loginPage.navigateToLoginPage();
    await loginPage.login('sagesyntaxacademy', 'BuildingExcellence@111');
    await loginPage.verifyLoginSuccess();

    // 2. Open Products Catalog
    await homePage.openProducts();
    await expect(homePage.productsLink).toBeVisible();

    // 3. Add iPhone to Cart & Verify popup
    await homePage.addItemToCart('iPhone');
    await homePage.verifyItemAddedPopup();
    await homePage.closeAddToCartPopup();

    // 4. Add Camera to Cart & Verify popup
    await homePage.addItemToCart('Camera');
    await homePage.verifyItemAddedPopup();
    await homePage.closeAddToCartPopup();

    // 5. Open Cart
    await homePage.openCart();

    // 6. Verify products are visible in cart
    await homePage.verifyItemInCart('iPhone');
    await homePage.verifyItemInCart('Camera');
  });

  test('Checkout From Cart: Add all available items, proceed to checkout, and complete purchase', async ({ page }) => {
    test.setTimeout(90000);
    const loginPage = new LoginPage(page);
    const cartPage = new AllProductsToCart(page);
    const buyProduct = new BuyProduct(page);

    const customerData: CustomerDetails = {
      company: 'Sage Syntax Academy',
      taxId: 'TAX98765',
      firstName: 'Swatank',
      lastName: 'Chand',
      country: 'India',
      state: 'Uttarakhand',
      city: 'Roorkee',
      address1: 'XYZ Street',
      address2: 'XYZ Area',
      postalCode: '247666',
      email: 'swatankABCD@gmail.com',
      phone: '9876543200'
    };

    let availableCount = 0;

    // Step 1: Login
    await test.step('Login to application', async () => {
      await loginPage.navigateToLoginPage();
      await loginPage.login('sagesyntaxacademy', 'BuildingExcellence@111');
      await loginPage.verifyLoginSuccess();
    });

    // Step 2: Add all available items to cart
    await test.step('Open Products and add all available items to cart', async () => {
      await cartPage.openProducts();

      availableCount = await cartPage.getAvailableProductCount();
      expect(availableCount).toBeGreaterThan(0);
      console.log(`Found ${availableCount} available products to add to cart`);

      await cartPage.addAllAvailableItems();
    });

    // Step 3: Open Cart, verify items, and click Checkout
    await test.step('Open Cart, verify item count, and click Checkout', async () => {
      await cartPage.openCart();

      await cartPage.verifyCartCount(availableCount);

      // Click Checkout button in Cart
      await cartPage.clickCheckout();
    });

    // Step 4: Fill Customer Details
    await test.step('Fill Customer Details and continue', async () => {
      await buyProduct.verifyCustomerDetailsFormVisible();

      await buyProduct.fillCustomerDetails(customerData);

      // Verify key fields contain entered values
      await expect(buyProduct.firstNameInput).toHaveValue(customerData.firstName);
      await expect(buyProduct.lastNameInput).toHaveValue(customerData.lastName);
      await expect(buyProduct.address1Input).toHaveValue(customerData.address1);
      await expect(buyProduct.phoneInput).toHaveValue(String(customerData.phone));

      await buyProduct.clickContinue();
    });

    // Step 5: Review Order and Place Order
    await test.step('Verify Review Order page and place order', async () => {
      await buyProduct.verifyReviewOrderPageDisplayed();
      await expect(page).toHaveURL(/.*review/);

      await buyProduct.clickPlaceOrder();
    });

    // Step 6: Verify Order Placed
    await test.step('Verify Order Placed page and navigate back', async () => {
      await expect(buyProduct.orderPlacedHeading).toBeVisible();
      await expect(buyProduct.orderIdText).toBeVisible();
      await expect(page).toHaveURL(/.*success/);

      await buyProduct.clickBrowse();
      await expect(page).toHaveURL(/.*products/);
    });
  });

  test('Remove item from cart and verify updated cart count', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const cartPage = new AllProductsToCart(page);

    // Login
    await loginPage.navigateToLoginPage();
    await loginPage.login('sagesyntaxacademy', 'BuildingExcellence@111');
    await loginPage.verifyLoginSuccess();

    // Add 1 item
    await homePage.openProducts();
    await homePage.addItemToCart('iPhone');
    await homePage.verifyItemAddedPopup();
    await homePage.closeAddToCartPopup();

    // Open Cart and verify count is at least 1
    await cartPage.openCart();
    const initialCount = await cartPage.getCartItemCount();
    expect(initialCount).toBeGreaterThanOrEqual(1);

    // Remove first item
    await cartPage.removeFirstItem();

    // Verify item count decreased by 1
    await cartPage.verifyCartCount(initialCount - 1);
  });
});

test.describe('Negative Cart & Checkout Tests', () => {
  test('Verify Empty Cart state when no items are added', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const cartPage = new AllProductsToCart(page);

    // Login
    await loginPage.navigateToLoginPage();
    await loginPage.login('sagesyntaxacademy', 'BuildingExcellence@111');
    await loginPage.verifyLoginSuccess();

    // Directly open Cart
    await cartPage.openCart();

    // If there are existing items from prior tests, remove them to test empty state
    const currentCount = await cartPage.getCartItemCount();
    for (let i = 0; i < currentCount; i++) {
      await cartPage.removeFirstItem();
    }

    // Verify empty cart message is displayed
    await cartPage.verifyEmptyCart();
  });

  test('Form validation: Prevent proceeding with empty Customer Details', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const cartPage = new AllProductsToCart(page);
    const buyProduct = new BuyProduct(page);

    // Login
    await loginPage.navigateToLoginPage();
    await loginPage.login('sagesyntaxacademy', 'BuildingExcellence@111');
    await loginPage.verifyLoginSuccess();

    // Add item to cart
    await homePage.openProducts();
    await homePage.addItemToCart('iPhone');
    await homePage.verifyItemAddedPopup();
    await homePage.closeAddToCartPopup();

    // Open Cart & Click Checkout
    await cartPage.openCart();
    await cartPage.clickCheckout();

    // Verify Customer Details form is displayed
    await buyProduct.verifyCustomerDetailsFormVisible();

    // Click Continue without entering required customer details
    await buyProduct.clickContinue();

    // Assert that user is NOT navigated to Review Order page and remains on Customer Details form
    await expect(buyProduct.reviewOrderHeading).not.toBeVisible();
    await expect(buyProduct.customerDetailsHeading).toBeVisible();
  });
});