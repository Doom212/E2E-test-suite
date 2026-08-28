import { Page, Locator, expect } from '@playwright/test';

/**
 * BasePage holds behavior shared by every page object:
 * navigation, generic waits, and common assertions.
 * All concrete page objects extend this class.
 */
export class BasePage {
  constructor(protected readonly page: Page) {}

  async goto(path: string = '/') {
    await this.page.goto(path);
  }

  async waitForVisible(locator: Locator, timeout = 10_000) {
    await locator.waitFor({ state: 'visible', timeout });
  }

  async expectTitle(title: string | RegExp) {
    await expect(this.page).toHaveTitle(title);
  }

  async expectUrlContains(fragment: string) {
    await expect(this.page).toHaveURL(new RegExp(fragment));
  }
}
