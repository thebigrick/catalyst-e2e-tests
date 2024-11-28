import { getChannelIdFromLocale } from '~/channels.config';
import { defaultLocale } from '~/i18n/routing';
import { Page } from '@playwright/test';
import { ITestContext } from './test-context';

/**
 * Get the test context for the current page
 * @param page
 */
const getContext = (page: Page): ITestContext => {
  const path = new URL(page.url()).pathname;

  const defaultChannelId = process.env.BIGCOMMERCE_CHANNEL_ID ?? '1';

  const m = path.match(/^\/\w{2}\//);
  if (m) {
    const locale = m[0].replace(/\//g, '');
    const channelId = getChannelIdFromLocale(locale) ?? defaultChannelId;

    return {
      locale,
      channelId,
    };
  }

  return {
    locale: defaultLocale,
    channelId: defaultChannelId,
  };
};

export default getContext;
