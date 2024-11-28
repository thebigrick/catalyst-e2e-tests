import { test, expect } from '@playwright/test';
import getNavCategories from '../../utils/remote/get-nav-categories';
import addLocalePath from '../../utils/add-locale-path';
import isNotFound from '../../utils/is-not-found';
import normalizePath from '../../utils/normalize-path';

test.describe.configure({ mode: 'parallel' });

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test.describe('Mobile navigation', () => {
  test.use({
    viewport: { width: 414, height: 896 },
  });

  test('should be closed at page load', async ({ page }) => {
    await expect(page.getByRole('dialog')).toBeVisible({ visible: false });
  });

  test('should open the mobile navigation', async ({ page }) => {
    await page.getByRole('button', { name: 'Toggle navigation' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
  });

  test('navbar should contain all the categories', async ({ page }) => {
    const navCategories = await getNavCategories(page);
    await page.getByRole('button', { name: 'Toggle navigation' }).click();

    for (const category of navCategories) {
      const dialog = page.getByRole('dialog');
      const navBar = dialog.getByRole('navigation', { name: 'Main' });
      const link = navBar.getByRole('link', { name: category.name });

      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute('href', addLocalePath(page, category.path));
    }
  });

  test('all the links in the navbar should be browsable', async ({ page }) => {
    const navCategories = await getNavCategories(page);

    for (const category of navCategories) {
      await page.getByRole('button', { name: 'Toggle navigation' }).click();

      const dialog = page.getByRole('dialog');
      const navBar = dialog.getByRole('navigation', { name: 'Main' });
      const link = navBar.getByRole('link', { name: category.name });

      await link.click();
      await page.waitForURL(normalizePath(page, category.path));

      expect(await isNotFound(page)).toBe(false);

      await page.goBack();
    }
  });
});

test.describe('Desktop navigation', () => {
  test.use({
    viewport: { width: 1920, height: 1080 },
  });

  test('should show the desktop navigation', async ({ page }) => {
    await expect(page.getByRole('navigation', { name: 'Main' })).toBeVisible();
  });

  test('navbar should contain all the categories', async ({ page }) => {
    const navCategories = await getNavCategories(page);

    for (const category of navCategories) {
      const navBar = page.getByRole('navigation', { name: 'Main' });
      const link = navBar.getByRole('link', { name: category.name });

      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute('href', addLocalePath(page, category.path));
    }
  });

  test('all the links in the navbar should be browsable', async ({ page }) => {
    const navCategories = await getNavCategories(page);

    for (const category of navCategories) {
      const navBar = page.getByRole('navigation', { name: 'Main' });
      const link = navBar.getByRole('link', { name: category.name });

      await link.click();
      await page.waitForURL(normalizePath(page, category.path));

      expect(await isNotFound(page)).toBe(false);

      await page.goBack();
    }
  });
});
