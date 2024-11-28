import { Page } from '@playwright/test';
import getTranslations from './get-translations';

/**
 * Check if the page is a 404 page while using a client-side router
 * @param page
 */
const isNotFound = async (page: Page): Promise<boolean> => {
  const t = await getTranslations(page, 'NotFound');

  const locator = page.getByText(t('heading'));
  return await locator.isVisible().catch(() => false);
};

export default isNotFound;
