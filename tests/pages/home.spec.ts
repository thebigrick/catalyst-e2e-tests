import { test, expect } from '@playwright/test';
import getNewestProducts from '../../utils/remote/get-newest-products';
import getTranslations from '../../utils/get-translations';
import getFeaturedProducts from '../../utils/remote/get-featured-products';

test.describe.configure({ mode: 'parallel' });

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test.describe('Home slider', () => {
  test('should have home slider', async ({ page }) => {
    await expect(page.getByRole('region', { name: 'Interactive slide show', exact: true })).toBeVisible();
  });

  test('should have slides', async ({ page }) => {
    const slider = page.getByRole('region', { name: 'Interactive slide show', exact: true });

    const slides = slider.locator('[aria-roledescription="slide"]');
    expect(await slides.count()).toBeGreaterThanOrEqual(1);
  });

  test('should scroll right and display another slide', async ({ page }) => {
    const slider = page.getByRole('region', { name: 'Interactive slide show', exact: true });
    const nextButton = slider.getByRole('button', { name: 'Next slide' });

    const slides = slider.locator('[aria-roledescription="slide"]');
    const slidesCount = await slides.count();

    if (slidesCount <= 1) {
      test.skip();
      return;
    }

    await nextButton.click();
    const slide = slider.getByLabel(`2 of ${slidesCount}`);
    await expect(slide).toBeVisible();
  });

  test('should scroll left and display another slide', async ({ page }) => {
    const slider = page.getByRole('region', { name: 'Interactive slide show', exact: true });
    const prevButton = slider.getByRole('button', { name: 'Previous slide' });

    const slides = slider.locator('[aria-roledescription="slide"]');
    const slidesCount = await slides.count();

    if (slidesCount <= 1) {
      test.skip();
      return;
    }

    await prevButton.click();
    const slide = slider.getByLabel(`${slidesCount - 1} of ${slidesCount}`);
    await expect(slide).toBeVisible();
  });
});

for (const carouselName of ['featuredProducts', 'newestProducts']) {
  const getCarouselProducts = carouselName === 'featuredProducts' ? getFeaturedProducts : getNewestProducts;

  test.describe(`${carouselName} carousel`, () => {
    const productsCount = 12;
    const productsPerSlide = 4;

    test('should have home newest products carousel', async ({ page }) => {
      const t = await getTranslations(page, 'Home.Carousel');
      const carouselProducts = await getCarouselProducts(page, productsCount);

      const carousel = page.getByRole('region', { name: t(carouselName), exact: true });

      if (carouselProducts.length === 0) {
        await expect(carousel).not.toBeVisible();
      } else {
        await expect(carousel).toBeVisible();
      }
    });

    test('should display the correct newest products', async ({ page }) => {
      const t = await getTranslations(page, 'Home.Carousel');

      const carouselProducts = await getCarouselProducts(page, productsCount);
      if (carouselProducts.length === 0) {
        test.skip();
        return;
      }

      const carousel = page.getByRole('region', { name: t(carouselName), exact: true });

      for (let i = 0; i < carouselProducts.length; i++) {
        const product = carouselProducts[i];
        const productElement = carousel.getByRole('link', { name: product.name, exact: true });

        if (i < productsPerSlide) {
          await expect(productElement).toBeVisible();
        } else {
          await expect(productElement).not.toBeVisible();
        }
      }
    });

    test('should scroll right and display other products', async ({ page }) => {
      const t = await getTranslations(page, 'Home.Carousel');

      const carouselProducts = await getCarouselProducts(page, productsCount);
      if (carouselProducts.length === 0) {
        test.skip();
        return;
      }

      const carousel = page.getByRole('region', { name: t(carouselName), exact: true });
      const nextButton = carousel.getByRole('button', { name: 'Next products' });

      if (carouselProducts.length <= productsPerSlide) {
        await expect(nextButton).not.toBeVisible();
        return;
      }

      await nextButton.click();

      for (let i = 0; i < carouselProducts.length; i++) {
        const product = carouselProducts[i];

        const productElement = carousel.getByRole('link', { name: product.name, exact: true });

        if (i >= productsPerSlide && i < productsPerSlide * 2) {
          await expect(productElement).toBeVisible();
        } else {
          await expect(productElement).not.toBeVisible();
        }
      }
    });

    test('should scroll left and display other products', async ({ page }) => {
      const t = await getTranslations(page, 'Home.Carousel');

      const carouselProducts = await getCarouselProducts(page, productsCount);
      if (carouselProducts.length === 0) {
        test.skip();
        return;
      }

      const carousel = page.getByRole('region', { name: t(carouselName), exact: true });
      const prevButton = carousel.getByRole('button', { name: 'Previous products' });

      if (carouselProducts.length <= productsPerSlide) {
        await expect(prevButton).not.toBeVisible();
        return;
      }

      await prevButton.click();

      for (let i = 0; i < carouselProducts.length; i++) {
        const product = carouselProducts[i];
        const productElement = carousel.getByRole('link', { name: product.name, exact: true });

        const prevSlideProductsCount = carouselProducts.length % productsPerSlide || productsPerSlide;
        if (i >= carouselProducts.length - prevSlideProductsCount) {
          await expect(productElement).toBeVisible();
        } else {
          await expect(productElement).not.toBeVisible();
        }
      }
    });

    test('should loop back to the first products set', async ({ page }) => {
      const t = await getTranslations(page, 'Home.Carousel');

      const carouselProducts = await getCarouselProducts(page, productsCount);
      if (carouselProducts.length === 0) {
        test.skip();
        return;
      }

      const carousel = page.getByRole('region', { name: t(carouselName), exact: true });
      const nextButton = carousel.getByRole('button', { name: 'Next products' });

      if (carouselProducts.length <= productsPerSlide) {
        await expect(nextButton).not.toBeVisible();
        return;
      }

      const slidesCount = Math.ceil(carouselProducts.length / productsPerSlide);
      for (let i = 0; i < slidesCount; i++) {
        await nextButton.click();
      }

      for (let i = 0; i < carouselProducts.length; i++) {
        const product = carouselProducts[i];
        const productElement = carousel.getByRole('link', { name: product.name, exact: true });

        if (i < productsPerSlide) {
          await expect(productElement).toBeVisible();
        } else {
          await expect(productElement).not.toBeVisible();
        }
      }
    });
  });
}
