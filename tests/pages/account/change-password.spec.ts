import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import normalizePath from '../../../utils/normalize-path';
import getTranslations from '../../../utils/get-translations';
import { doLogin, ICustomerData } from '../../../utils/do-login';
import deleteCustomer from '../../../utils/remote/delete-customer';

test.describe.configure({ mode: 'parallel' });

test.describe('Change password', async () => {
  let customerData: ICustomerData = undefined;

  test.beforeEach(async ({ page }) => {
    const t = await getTranslations(page, 'Account.Settings');
    customerData = await doLogin(page);

    expect(page.goto(normalizePath(page, '/account/settings/change-password/')));
    await expect(page.getByRole('heading', { name: t('title') })).toBeVisible();
  });

  test.afterEach(async () => {
    await deleteCustomer(customerData.email);
  });

  test('should validate password confirmation', async ({ page }) => {
    const t = await getTranslations(page, 'Account.Settings.ChangePassword');

    await page.getByLabel(t('currentPasswordLabel')).fill(customerData.password);
    await page.getByLabel(t('newPasswordLabel')).fill('password');
    await page.getByLabel(t('confirmPasswordLabel')).fill('another-password');

    await page.getByRole('button', { name: t('submitText') }).click();

    await expect(page.getByText(t('confirmPasswordValidationMessage'))).toBeVisible();
  });

  test('should update password', async ({ page }) => {
    const newPassword = faker.internet.password({ pattern: /[a-zA-Z0-9]/, prefix: 'A1', length: 10 });

    const t = await getTranslations(page, 'Account.Settings.ChangePassword');
    const lft = await getTranslations(page, 'Login.Form');
    const aht = await getTranslations(page, 'Account.Home');

    await page.getByLabel(t('currentPasswordLabel')).fill(customerData.password);
    await page.getByLabel(t('newPasswordLabel')).fill(newPassword);
    await page.getByLabel(t('confirmPasswordLabel')).fill(newPassword);

    await page.getByRole('button', { name: t('submitText') }).click();

    expect(page.waitForURL(normalizePath(page, '/login/')));
    await expect(page.getByText(t('confirmChangePassword'))).toBeVisible();

    await page.getByLabel(lft('emailLabel')).fill(customerData.email);
    await page.getByLabel(lft('passwordLabel')).fill(newPassword);

    const loginButton = page.getByRole('button', { name: lft('logIn') });
    await loginButton.click();

    expect(page.waitForURL(normalizePath(page, '/account/')));
    await expect(page.getByRole('heading', { name: aht('heading') })).toBeVisible();
  });
});
