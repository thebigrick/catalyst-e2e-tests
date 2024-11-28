import adminRestFetch from './admin-rest-fetch';
import getCustomer from './get-customer';

/**
 * Delete a customer by ID or email
 * @param customerKey
 */
const deleteCustomer = async (customerKey: string | number) => {
  const customer = await getCustomer(customerKey);

  await adminRestFetch('DELETE', '/v3/customers', {}, { 'id:in': customer.id.toString() });
};

export default deleteCustomer;
