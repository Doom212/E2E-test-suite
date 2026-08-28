import { test, expect } from '../../fixtures/pageFixtures';
import { products, checkoutInfo } from '../../fixtures/testData';

test.describe('Cart and checkout end-to-end flow', () => {
  test('user can add items, adjust cart, and complete checkout', async ({
    authenticatedPage: inventoryPage,
    cartPage,
    checkoutPage,
    page,
  }) => {
    // Add two items and verify the badge count updates
    await inventoryPage.addItemToCartByName(products.backpack);
    await inventoryPage.addItemToCartByName(products.bikeLight);
    await inventoryPage.expectCartCount(2);

    // Remove one, confirm badge reflects the change
    await inventoryPage.removeItemFromCartByName(products.bikeLight);
    await inventoryPage.expectCartCount(1);

    // Head to cart, verify contents, proceed to checkout
    await inventoryPage.goToCart();
    await cartPage.expectItemCount(1);
    await cartPage.checkout();

    // Fill shipping info
    await checkoutPage.fillInformation(
      checkoutInfo.valid.firstName,
      checkoutInfo.valid.lastName,
      checkoutInfo.valid.postalCode
    );
    await expect(page).toHaveURL(/checkout-step-two\.html/);

    // Business-logic check: subtotal + tax should equal total
    const subtotal = await checkoutPage.getSubtotal();
    const tax = await checkoutPage.getTax();
    const total = await checkoutPage.getTotal();
    expect(total).toBeCloseTo(subtotal + tax, 2);

    // Complete the order
    await checkoutPage.finish();
    await checkoutPage.expectOrderComplete();
  });

  test('checkout is blocked when required fields are missing', async ({
    authenticatedPage: inventoryPage,
    cartPage,
    checkoutPage,
  }) => {
    await inventoryPage.addItemToCartByName(products.backpack);
    await inventoryPage.goToCart();
    await cartPage.checkout();

    await checkoutPage.fillInformation('', '', '');
    await expect(checkoutPage.errorMessage).toContainText(/first name is required/i);
  });

  test('product list can be sorted by price low to high', async ({
    authenticatedPage: inventoryPage,
  }) => {
    await inventoryPage.sortBy('lohi');
    const prices = await inventoryPage.getPrices();
    const sorted = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sorted);
  });

  test('product list can be sorted by price high to low', async ({
    authenticatedPage: inventoryPage,
  }) => {
    await inventoryPage.sortBy('hilo');
    const prices = await inventoryPage.getPrices();
    const sorted = [...prices].sort((a, b) => b - a);
    expect(prices).toEqual(sorted);
  });
});
