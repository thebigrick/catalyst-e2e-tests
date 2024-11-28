import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import normalizePath from '../../../utils/normalize-path';
import getTranslations from '../../../utils/get-translations';
import getCustomer from '../../../utils/remote/get-customer';
import deleteCustomer from '../../../utils/remote/delete-customer';
import { doLogin, ICustomerData } from '../../../utils/do-login';

test.describe.configure({ mode: 'parallel' });

test.describe('Account settings', async () => {
  let customerData: ICustomerData = undefined;

  test.beforeEach(async ({ page }) => {
    const t = await getTranslations(page, 'Account.Settings');

    customerData = await doLogin(page);

    expect(page.goto(normalizePath(page, '/account/settings/')));
    await expect(page.getByRole('heading', { name: t('title') })).toBeVisible();
  });

  test.afterEach(async () => {
    await deleteCustomer(customerData.email);
  });

  test('should display user information', async ({ page }) => {
    await expect(page.locator('[name=address-customer-firstName]')).toHaveValue(customerData.firstName);
    await expect(page.locator('[name=address-customer-lastName]')).toHaveValue(customerData.lastName);
    await expect(page.locator('[name=customer-email]')).toHaveValue(customerData.email);
  });

  test('should update user information', async ({ page }) => {
    const newFirstName = faker.person.firstName();
    const newLastName = faker.person.lastName();
    const newEmail = faker.internet.email({ provider: 'test.bigcommerce.com' });

    const t = await getTranslations(page, 'Account.Settings');

    await page.locator('[name=address-customer-firstName]').fill(newFirstName);
    await page.locator('[name=address-customer-lastName]').fill(newLastName);
    await page.locator('[name=customer-email]').fill(newEmail);

    await page.getByRole('button', { name: t('submit') }).click();

    await expect(page.getByText(t('successMessage'))).toBeVisible();
    customerData.email = newEmail;

    await expect(page.locator('[name=address-customer-firstName]')).toHaveValue(newFirstName);
    await expect(page.locator('[name=address-customer-lastName]')).toHaveValue(newLastName);
    await expect(page.locator('[name=customer-email]')).toHaveValue(newEmail);

    const customer = await getCustomer(newEmail);

    expect(customer).toMatchObject({
      email: newEmail,
      first_name: newFirstName,
      last_name: newLastName,
    });
  });
});