import { graphql } from '@bigcommerce/catalyst-core/client/graphql';
import { Page } from '@playwright/test';
import getClient from './get-client';

const BrandsQuery = graphql(`
  query Brands {
    site {
      brands {
        edges {
          node {
            entityId
            name
            path
            products {
              edges {
                node {
                  entityId
                  sku
                }
              }
            }
          }
        }
      }
    }
  }
`);

/**
 * Get all brands
 * @param page
 */
const getBrands = async (page: Page): Promise<any[]> => {
  const client = await getClient(page);
  const { data } = await client.fetch({
    document: BrandsQuery,
  });

  return data.site.brands.edges.map(({ node }) => node);
};

export default getBrands;
