import { Page } from '@playwright/test';
import getContext from './get-context';

/**
 * Collapses the path to remove the locale on the default channel
 * @param page
 * @param path
 */
const collapsePath = (page: Page, path: string): string => {
  const ctx = getContext(page);

  if (ctx.channelId === '1') {
    return path.replace(`/${ctx.locale}/`, '/');
  }

  return path;
};

export default collapsePath;
