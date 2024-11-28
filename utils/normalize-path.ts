import { Page } from '@playwright/test';
import getContext from './get-context';
import collapsePath from './collapse-path';
import addLocalePath from './add-locale-path';

/**
 * Normalize the path as it should appear in the URL bar
 * @param page
 * @param path
 */
const normalizePath = (page: Page, path: string): string => {
  return collapsePath(page, addLocalePath(page, path));
};

export default normalizePath;
