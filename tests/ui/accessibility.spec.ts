import AxeBuilder from '@axe-core/playwright';
import { test, expect } from '../../fixtures/pageFixtures';

/**
 * Accessibility smoke tests using axe-core. Fails the build on
 * WCAG2A/AA violations so regressions are caught the same way
 * functional bugs are.
 */
test.describe('Accessibility', () => {
  test('login page has no critical a11y violations', async ({ loginPage, page }) => {
    await loginPage.open();
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test('inventory page has no critical a11y violations', async ({
    authenticatedPage,
    page,
  }) => {
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    expect(results.violations).toEqual([]);
  });
});
