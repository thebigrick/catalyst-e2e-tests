import { faker } from '@faker-js/faker';
import getTranslations from './get-translations';
import createCustomer from './remote/create-customer';
import { expect, Page } from '@playwright/test';
import normalizePath from './normalize-path';

export interface ICustomerData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

/**
 * Logs in with a temporary a user and returns the user data
 * @param page
 */
export const doLogin = async (page: Page): Promise<ICustomerData> => {
  const testUserEmail = faker.internet.email({ provider: 'test.bigcommerce.com' });
  const testUserPassword = faker.internet.password({ pattern: /[a-zA-Z0-9]/, prefix: 'A1', length: 10 });
  const testUserFirstName = faker.person.firstName();
  const testUserLastName = faker.person.lastName();

  const t = await getTranslations(page, 'Login.Form');
  const aht = await getTranslations(page, 'Account.Home');

  const res = await createCustomer({
    email: testUserEmail,
    first_name: testUserFirstName,
    last_name: testUserLastName,
    authentication: {
      force_password_reset: false,
      new_password: testUserPassword,
    },
  });

  await page.goto('/login/');

  await page.getByLabel(t('emailLabel')).fill(testUserEmail);
  await page.getByLabel(t('passwordLabel')).fill(testUserPassword);

  const loginButton = page.getByRole('button', { name: t('logIn') });
  await loginButton.click();

  expect(page.waitForURL(normalizePath(page, '/account/')));
  await expect(page.getByRole('heading', { name: aht('heading') })).toBeVisible();

  return {
    email: testUserEmail,
    password: testUserPassword,
    firstName: testUserFirstName,
    lastName: testUserLastName,
  }
}

export default doLogin;
