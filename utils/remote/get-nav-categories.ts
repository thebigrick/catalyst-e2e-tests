import { graphql } from '@bigcommerce/catalyst-core/client/graphql';
import getClient from './get-client';
import { Page } from '@playwright/test';

const CategoryTreeQuery = graphql(`
  query CategoryTree {
    site {
      categoryTree {
        entityId
        name
        path
        productCount
      }
    }
  }
`);

const getNavCategories = async (page: Page) => {
  const client = await getClient(page);

  const { data } = await client.fetch({
    document: CategoryTreeQuery,
  });

  return data.site.categoryTree;
};

export default getNavCategories;
