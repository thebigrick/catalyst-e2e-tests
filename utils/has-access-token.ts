/**
 * Check if the environment has a BigCommerce access token for advanced testing
 */
const hasAccessToken = (): boolean => {
  return !!process.env.BIGCOMMERCE_ACCESS_TOKEN;
};

export default hasAccessToken;
