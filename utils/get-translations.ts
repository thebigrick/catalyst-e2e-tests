import getContext from './get-context';
import { Page } from '@playwright/test';
import { fallbackLocale } from '~/i18n/routing';
import deepmerge from 'deepmerge';

type NestedMessages = {
  [key: string]: string | NestedMessages;
};

type FlattenedMessages = {
  [key: string]: string;
};

/**
 * Flatten the nested messages object
 * @param messages
 * @param prefix
 */
const flattenMessages = (messages: NestedMessages, prefix = ''): FlattenedMessages => {
  return Object.keys(messages).reduce((acc: FlattenedMessages, key: string) => {
    const value = messages[key];
    const newKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === 'string') {
      acc[newKey] = value;
    } else {
      Object.assign(acc, flattenMessages(value, newKey));
    }

    return acc;
  }, {});
};

/**
 * Get the translation for the given key
 * @param page
 * @param namespace
 */
const getTranslations = async (page: Page, namespace: string) => {
  const { locale } = getContext(page);
  const messages = deepmerge(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
    (await import(`@bigcommerce/catalyst-core/messages/${fallbackLocale}.json`, { assert: { type: 'json' } })).default,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
    (await import(`@bigcommerce/catalyst-core/messages/${locale}.json`, { assert: { type: 'json' } })).default
  ) as NestedMessages;

  const flatMessages = flattenMessages(messages);

  return (key: string, variables?: Record<string, string | number>): string => {
    const fullKey = namespace ? `${namespace}.${key}` : key;
    let translation = flatMessages[fullKey];

    if (!translation) {
      console.warn(`Translation key "${fullKey}" not found`);
      return fullKey;
    }

    if (variables) {
      Object.entries(variables).forEach(([key, value]) => {
        translation = translation.replace(new RegExp(`{${key}}`, 'g'), String(value));
      });
    }

    return translation;
  };
};

export default getTranslations;
