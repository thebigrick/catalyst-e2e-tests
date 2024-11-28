import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import normalizePath from '../../../utils/normalize-path';
import getTranslations from '../../../utils/get-translations';
import { doLogin, ICustomerData } from '../../../utils/do-login';
import deleteCustomer from '../../../utils/remote/delete-customer';

test.describe.configure({ mode: 'parallel' });

test.describe('Logout', async () => {
  let customerData: ICustomerData = undefined;

  test.beforeEach(async ({ page }) => {
    customerData = await doLogin(page);
  });

  test.afterEach(async () => {
    await deleteCustomer(customerData.email);
  });

  test('should logout by clicking the logout button', async ({ page, context }) => {
    const t = await getTranslations(page, 'Components.Header.Account');

    expect((await context.cookies()).find((cookie) => cookie.name === 'authjs.session-token')).not.toBeUndefined();

    const accountButton = page.getByRole('button', { name: t('account'), exact: true });
    await accountButton.click();

    const logoutButton = page.getByRole('button', { name: t('logout') });
    await expect(logoutButton).toBeVisible();
    await logoutButton.click();

    expect(page.waitForURL(normalizePath(page, '/login/')));

    await expect(page.getByRole('link', { name: t('login'), exact: true })).toBeVisible();
    expect((await context.cookies()).find((cookie) => cookie.name === 'authjs.session-token')).toBeUndefined();
  });
});
