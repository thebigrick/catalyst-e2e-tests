import adminRestFetch from './admin-rest-fetch';

const createCustomer = async (input: any) => {
  const response = await adminRestFetch('POST', '/v3/customers', [{ ...input }]);
  return response.data;
};

export default createCustomer;
