import { createClient } from '@bigcommerce/catalyst-client';
import { Page } from '@playwright/test';
import getContext from '../get-context';

const clients: Record<number, any> = {};

const getClient = async (page: Page) => {
  const ctx = getContext(page);

  if (!clients[ctx.channelId]) {
    clients[ctx.channelId] = createClient({
      storefrontToken: process.env.BIGCOMMERCE_STOREFRONT_TOKEN ?? '',
      xAuthToken: process.env.BIGCOMMERCE_ACCESS_TOKEN ?? '',
      storeHash: process.env.BIGCOMMERCE_STORE_HASH ?? '',
      channelId: ctx.channelId,
      backendUserAgentExtensions: 'Playwright',
      logger: true,
    });
  }

  return clients[ctx.channelId];
};

export default getClient;
