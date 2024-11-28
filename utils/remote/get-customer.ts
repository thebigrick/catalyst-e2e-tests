import adminRestFetch from './admin-rest-fetch';

/**
 * Get a customer by ID or email
 * @param searchKey
 */
const getCustomer = async (searchKey: number | string): Promise<any> => {
  const searchParams = ('' + searchKey).match(/^\d+$/) ? { 'id:in': searchKey.toString() } : { 'email:in': searchKey.toString() };

  const response = await adminRestFetch('GET', '/v3/customers', {}, searchParams);
  return response?.[0] ?? null;
};

export default getCustomer;
