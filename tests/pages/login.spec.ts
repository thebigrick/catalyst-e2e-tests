import { test, expect, Page } from '@playwright/test';
import getTranslations from '../../utils/get-translations';
import normalizePath from '../../utils/normalize-path';
import createCustomer from '../../utils/remote/create-customer';
import deleteCustomer from '../../utils/remote/delete-customer';
import getCustomer from '../../utils/remote/get-customer';
import { faker } from '@faker-js/faker';

test.describe.configure({ mode: 'parallel' });

test.beforeEach(async ({ page }) => {
  await page.goto('/login/');
});

test.describe('Login', () => {
  test.describe('Form', () => {
    test('should validate form', async ({ page }) => {
      const t = await getTranslations(page, 'Login.Form');

      const loginButton = page.getByRole('button', { name: t('logIn') });
      await loginButton.click();

      const emailError = page.getByText(t('enterEmailMessage'));
      await expect(emailError).toBeVisible();

      const passwordError = page.getByText(t('entePasswordMessage')); // Typo in the translation key
      await expect(passwordError).toBeVisible();
    });

    test('should contain a valid link to the registration page', async ({ page }) => {
      const t = await getTranslations(page, 'Login.CreateAccount');

      const createLink = page.getByRole('link', { name: t('createLink') });
      await createLink.click();

      const registerButton = page.getByRole('button', { name: t('createLink') });
      await expect(registerButton).toBeVisible();

      await registerButton.click();
      expect(page.waitForURL(normalizePath(page, '/register/')));
    });
  });

  test.describe('Customer registration and login', () => {
    const testUserEmail = faker.internet.email({ provider: 'test.bigcommerce.com' });
    const testUserPassword = faker.internet.password({ pattern: /[a-zA-Z0-9]/, prefix: 'A1', length: 10 });
    const testUserFirstName = faker.person.firstName();
    const testUserLastName = faker.person.lastName();

    test.beforeEach(async () => {
      await createCustomer({
        email: testUserEmail,
        first_name: testUserFirstName,
        last_name: testUserLastName,
        authentication: {
          force_password_reset: false,
          new_password: testUserPassword,
        },
      });
    });

    test.afterEach(async () => {
      await deleteCustomer(testUserEmail);
    });

    test('should login with valid credentials', async ({ page }) => {
      const t = await getTranslations(page, 'Login.Form');
      const aht = await getTranslations(page, 'Account.Home');

      await page.getByLabel(t('emailLabel')).fill(testUserEmail);
      await page.getByLabel(t('passwordLabel')).fill(testUserPassword);

      const loginButton = page.getByRole('button', { name: t('logIn') });
      await loginButton.click();

      expect(page.waitForURL(normalizePath(page, '/account/')));

      await expect(page.getByRole('heading', { name: aht('heading') })).toBeVisible();
    });

    test('should fail with invalid credentials', async ({ page }) => {
      const t = await getTranslations(page, 'Login.Form');

      await page.getByLabel(t('emailLabel')).fill(testUserEmail);
      await page.getByLabel(t('passwordLabel')).fill('wrongpasswordhere!');

      const loginButton = page.getByRole('button', { name: t('logIn') });
      await loginButton.click();

      const errorMessage = page.getByText(t('error'));
      await expect(errorMessage).toBeVisible();
    });
  });
});
