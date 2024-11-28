import { graphql } from '~/client/graphql';
import { ProductFragment } from './fragments/product';
import getClient from './get-client';
import { Page } from '@playwright/test';

const FeaturedProductsQuery = graphql(
  `
    query FeaturedProducts($limit: Int!) {
      site {
        featuredProducts(first: $limit) {
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

const getFeaturedProducts = async (page: Page, limit = 10): Promise<any[]> => {
  const client = await getClient(page);
  const { data } = await client.fetch({
    document: FeaturedProductsQuery,
    variables: {
      limit,
    },
  });

  return data.site.featuredProducts.edges.map(({ node }) => node);
};

export default getFeaturedProducts;
