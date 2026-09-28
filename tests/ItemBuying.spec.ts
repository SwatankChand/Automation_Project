import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { BuyProduct, CustomerDetails } from '../pages/BuyProduct';

test('End-to-end purchase flow: Customer Details -> Review Order -> Order Placed', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const buyProduct = new BuyProduct(page);

  const testProduct = 'iPhone';
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

  await test.step('Login to application', async () => {
    await loginPage.navigateToLoginPage();
    await loginPage.login('sagesyntaxacademy', 'BuildingExcellence@111');
    await loginPage.verifyLoginSuccess();
    await page.pause();
  });

  // Customer Details
  await test.step('Category 1: Select product and fill Customer Details', async () => {
    await buyProduct.openProducts();
    await page.pause(); // Pause after opening Products page

    await buyProduct.clickBuyNowForProduct(testProduct);
    await page.pause(); // Pause after clicking Buy Now (Customer Details form opened)

    // Verify Customer details form and fields are visible
    await buyProduct.verifyCustomerDetailsFormVisible();

    // Fill customer details
    await buyProduct.fillCustomerDetails(customerData);

    // Verify fields contain entered values where appropriate
    await expect(buyProduct.firstNameInput).toHaveValue(customerData.firstName);
    await expect(buyProduct.lastNameInput).toHaveValue(customerData.lastName);
    await expect(buyProduct.address1Input).toHaveValue(customerData.address1);
    await expect(buyProduct.phoneInput).toHaveValue(customerData.phone);
    await page.pause();


    await buyProduct.clickContinue();
  });

  await test.step('Category 2: Verify Review Order page and place order', async () => {

    await buyProduct.verifyReviewOrderPageDisplayed();
    await expect(page).toHaveURL(/.*review/);


    await buyProduct.verifyReviewOrderDetails(testProduct, customerData);
    await page.pause();

    await buyProduct.clickPlaceOrder();
  });

  await test.step('Category 3: Verify Order Placed page, dynamic Order ID, and Browse return', async () => {
    // Assert Order Placed page is displayed with dynamic Order ID and item details
    await buyProduct.verifyOrderPlacedPage(testProduct);
    await expect(page).toHaveURL(/.*success/);
    await page.pause(); // Pause on Order Placed page to inspect order confirmation & Order ID

    // Click Browse button and verify user is navigated back to Products page
    await buyProduct.clickBrowse();
    await page.pause(); // Pause after clicking Browse button (back on Products page)
  });

  // Final wait and pause at end of test
  await page.waitForTimeout(1000);
  await page.pause();
});