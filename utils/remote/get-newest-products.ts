import { graphql } from '~/client/graphql';
import { ProductFragment } from './fragments/product';
import getClient from './get-client';
import { Page } from '@playwright/test';

const NewestProductsQuery = graphql(
  `
    query NewestProducts($limit: Int!) {
      site {
        newestProducts(first: $limit) {
          edges {
            node {
              ...ProductFragment
            }
          }
        }
      }
    }
  `,
  [ProductFragment]
);

const getNewestProducts = async (page: Page, limit = 10): Promise<any[]> => {
  const client = await getClient(page);
  const { data } = await client.fetch({
    document: NewestProductsQuery,
    variables: {
      limit,
    },
  });

  return data.site.newestProducts.edges.map(({ node }) => node);
};

export default getNewestProducts;
