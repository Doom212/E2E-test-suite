import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutPage extends BasePage {
  // Step one: information
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly errorMessage: Locator;

  // Step two: overview
  readonly finishButton: Locator;
  readonly summaryTotal: Locator;
  readonly summarySubtotal: Locator;
  readonly summaryTax: Locator;

  // Step three: complete
  readonly completeHeader: Locator;

  constructor(page: Page) {
    super(page);
    this.firstNameInput = page.locator('#first-name');
    this.lastNameInput = page.locator('#last-name');
    this.postalCodeInput = page.locator('#postal-code');
    this.continueButton = page.locator('#continue');
    this.errorMessage = page.locator('[data-test="error"]');

    this.finishButton = page.locator('#finish');
    this.summarySubtotal = page.locator('.summary_subtotal_label');
    this.summaryTax = page.locator('.summary_tax_label');
    this.summaryTotal = page.locator('.summary_total_label');

    this.completeHeader = page.locator('.complete-header');
  }

  async fillInformation(firstName: string, lastName: string, postalCode: string) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
    await this.continueButton.click();
  }

  async finish() {
    await this.finishButton.click();
  }

  async expectOrderComplete() {
    await expect(this.completeHeader).toHaveText(/thank you for your order/i);
  }

  async getSubtotal(): Promise<number> {
    const text = await this.summarySubtotal.textContent();
    return parseFloat(text!.replace('Item total: $', ''));
  }

  async getTax(): Promise<number> {
    const text = await this.summaryTax.textContent();
    return parseFloat(text!.replace('Tax: $', ''));
  }

  async getTotal(): Promise<number> {
    const text = await this.summaryTotal.textContent();
    return parseFloat(text!.replace('Total: $', ''));
  }
}
