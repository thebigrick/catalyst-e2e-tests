import { test, expect, Page } from '@playwright/test';
import getTranslations from '../../utils/get-translations';
import getNavCategories from '../../utils/remote/get-nav-categories';
import searchProducts from '../../utils/remote/search-products';
import getBrands from '../../utils/remote/get-brands';

test.describe.configure({ mode: 'parallel' });

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

const openSearchPopup = async (page: Page) => {
  const t = await getTranslations(page, 'Components.SearchForm');
  await page.getByRole('button', { name: t('openSearchPopup'), exact: true }).click();
};

test.describe('Searchbar closed', () => {
  test('should be closed at page load', async ({ page }) => {
    await expect(page.getByRole('dialog')).toBeVisible({ visible: false });
  });

  test('should open when clicked', async ({ page }) => {
    await openSearchPopup(page);
    await expect(page.getByRole('dialog')).toBeVisible();
  });
});

test.describe('Searchbar open', () => {
  test.beforeEach(async ({ page }) => {
    await openSearchPopup(page);
  });

  test('should close the search popup', async ({ page }) => {
    const t = await getTranslations(page, 'Components.SearchForm');

    await page.getByRole('button', { name: t('closeSearchPopup'), exact: true }).click();
    await expect(page.getByRole('dialog')).toBeVisible({ visible: false });
  });

  test('should show clear button when input is not empty', async ({ page }) => {
    const t = await getTranslations(page, 'Components.SearchForm');

    await expect(page.getByRole('button', { name: t('clearSearch'), exact: true })).toBeVisible({ visible: false });
    await page.getByPlaceholder(t('searchPlaceholder')).type('a');
    await expect(page.getByRole('button', { name: t('clearSearch'), exact: true })).toBeVisible();
  });

  test('should clear the input when clear button is clicked', async ({ page }) => {
    const t = await getTranslations(page, 'Components.SearchForm');

    await page.getByPlaceholder(t('searchPlaceholder')).type('a');
    await page.getByRole('button', { name: t('clearSearch') }).click();
    await expect(page.getByPlaceholder(t('searchPlaceholder'))).toHaveText('');
  });

  test('should start searching only after 3 characters', async ({ page }) => {
    const t = await getTranslations(page, 'Components.SearchForm');

    await page.getByPlaceholder(t('searchPlaceholder')).type('a');
    await expect(page.getByText(t('processing'))).toBeVisible({ visible: false });
    await page.getByPlaceholder(t('searchPlaceholder')).type('b');
    await expect(page.getByText(t('processing'))).toBeVisible({ visible: false });
    await page.getByPlaceholder(t('searchPlaceholder')).type('c');
    await expect(page.getByText(t('processing'))).toBeVisible({ visible: true });
  });

  test('should display empty results message', async ({ page }) => {
    const t = await getTranslations(page, 'Components.SearchForm');

    await page.getByPlaceholder(t('searchPlaceholder')).type('thisproductdoesnotexist');
    await expect(page.getByText(t('noSearchResults', { term: 'thisproductdoesnotexist' }))).toBeVisible();
  });

  test('should search products', async ({ page }) => {
    const t = await getTranslations(page, 'Components.SearchForm');
    const products = (await searchProducts(page, { price: { minPrice: -1 } })).slice(0, 5);

    for (const product of products) {
      await page.getByPlaceholder('Search').type(product.name);

      const productsListSection = page
        .getByRole('dialog')
        .locator('section') // TODO: Use getByRole with a title
        .filter({ hasText: 'Products' });

      const productLink = productsListSection.getByRole('link', { name: product.name });

      await expect(productLink).toBeVisible();

      await page.waitForTimeout(500);

      await page.getByRole('button', { name: t('clearSearch') }).click();
    }
  });

  test('should display all the categories of a product', async ({ page }) => {
    const t = await getTranslations(page, 'Components.SearchForm');

    const navCategories = await getNavCategories(page);
    const nonEmptyCategories = navCategories.filter((category) => category.productCount > 0).splice(0, 5);

    for (const nonEmptyCategory of nonEmptyCategories) {
      const products = await searchProducts(page, { categoryEntityId: nonEmptyCategory.entityId });
      const productOfCategory = products[0];

      const productCategories = productOfCategory.categories.edges.map(({ node }) => node);

      await page.getByPlaceholder('Search').type(productOfCategory.name);

      const categoriesSection = page
        .getByRole('dialog')
        .locator('section') // TODO: Use getByRole with a title
        .filter({ hasText: 'Categories' });

      for (const productCategory of productCategories) {
        const categoryLink = categoriesSection.getByRole('link', { name: productCategory.name, exact: true });

        await expect(categoryLink).toBeVisible();
      }

      await page.getByRole('button', { name: t('clearSearch') }).click();
    }
  });

  test('should display all the brands of a product', async ({ page }) => {
    const t = await getTranslations(page, 'Components.SearchForm');

    const nonEmptyBrands = (await getBrands(page)).filter((brand) => brand.products.edges.length > 0).splice(0, 5);
    for (const nonEmptyBrand of nonEmptyBrands) {
      const products = await searchProducts(page, { brandEntityIds: [nonEmptyBrand.entityId] });
      const product = products[0];

      await page.getByPlaceholder('Search').type(product.name);

      const brandsSection = page
        .getByRole('dialog')
        .locator('section') // TODO: Use getByRole with a title
        .filter({ hasText: 'Brands' });

      const productBrand = product.brand;

      const brandLink = brandsSection.getByRole('link', { name: productBrand.name, exact: true });
      await expect(brandLink).toBeVisible();

      await page.getByRole('button', { name: t('clearSearch') }).click();
    }
  });
});
