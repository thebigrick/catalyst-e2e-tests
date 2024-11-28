import { Page } from '@playwright/test';
import getContext from './get-context';

/**
 * Add the locale to the path if it is missing
 * @param page
 * @param path
 */
const addLocalePath = (page: Page, path: string) => {
  const ctx = getContext(page);

  if (path.startsWith(`/${ctx.locale}/`)) {
    return path;
  }

  return `/${ctx.locale}${path}`;
};

export default addLocalePath;
