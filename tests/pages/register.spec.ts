import { test, expect } from '@playwright/test';
import getTranslations from '../../utils/get-translations';
import { faker } from '@faker-js/faker';
import getCustomer from '../../utils/remote/get-customer';
import deleteCustomer from '../../utils/remote/delete-customer';

test.describe.configure({ mode: 'parallel' });

test.beforeEach(async ({ page }) => {
  await page.goto('/register/');
});

test.describe('Register', () => {
  test.describe('Form', () => {
    test('should validate empty form', async ({ page }) => {
      const t = await getTranslations(page, 'Register.Form');
      const vt = await getTranslations(page, 'Components.FormFields.Validation');

      await page.getByRole('button', { name: t('submit') }).click();

      await expect(page.getByText(vt('firstName'))).toBeVisible();
      await expect(page.getByText(vt('lastName'))).toBeVisible();
      await expect(page.getByText(vt('email'))).toBeVisible();
      await expect(page.getByText(vt('password')).first()).toBeVisible();
    });

    test('should validate password confirmation', async ({ page }) => {
      const t = await getTranslations(page, 'Register.Form');
      const vt = await getTranslations(page, 'Components.FormFields.Validation');

      // TODO: Refactor to not use selectors
      await page.locator('[name=customer-password]').fill('password');
      await page.locator('[name=customer-confirmPassword]').fill('another-password');

      await page.getByRole('button', { name: t('submit') }).click();

      await expect(page.getByText(vt('confirmPassword')).first()).toBeVisible();
    });

    test('should validate email', async ({ page }) => {
      const t = await getTranslations(page, 'Register.Form');
      const vt = await getTranslations(page, 'Components.FormFields.Validation');

      // TODO: Refactor to not use selectors
      await page.locator('[name=customer-email]').fill('some-invalid-email');

      await page.getByRole('button', { name: t('submit') }).click();

      await expect(page.getByText(vt('email')).first()).toBeVisible();
    });
  });

  test.describe('Customer registration', () => {
    const testUserEmail = faker.internet.email({ provider: 'test.bigcommerce.com' });
    const testUserPassword = faker.internet.password({ pattern: /[a-zA-Z0-9]/, prefix: 'A1', length: 10 });
    const testUserFirstName = faker.person.firstName();
    const testUserLastName = faker.person.lastName();

    test.afterEach(async () => {
      const customer = await getCustomer(testUserEmail);
      await deleteCustomer(customer.id);
    });

    test('should register customer', async ({ page }) => {
      const t = await getTranslations(page, 'Register.Form');
      const accountT = await getTranslations(page, 'Account.Home');

      await page.locator('[name=customer-address-firstName]').fill(testUserFirstName);
      await page.locator('[name=customer-address-lastName]').fill(testUserLastName);
      await page.locator('[name=customer-email]').fill(testUserEmail);
      await page.locator('[name=customer-password]').fill(testUserPassword);
      await page.locator('[name=customer-confirmPassword]').fill(testUserPassword);

      await page.getByRole('button', { name: t('submit') }).click();

      await expect(page).toHaveURL('/account/');
      await expect(page.getByRole('heading', { name: accountT('heading') })).toBeVisible();
      await expect(page.getByText(accountT('successMessage'))).toBeVisible();

      const customer = await getCustomer(testUserEmail);

      expect(customer).toMatchObject({
        email: testUserEmail,
        first_name: testUserFirstName,
        last_name: testUserLastName,
      });
    });
  });
});
