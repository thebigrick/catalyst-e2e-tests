export type IMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

const adminRestFetch = async (method: IMethod, path: string, body?: any, searchParams?: Record<string, string>) => {
  const storeHash = process.env.BIGCOMMERCE_STORE_HASH ?? '';
  const accessToken = process.env.BIGCOMMERCE_ACCESS_TOKEN ?? '';

  const apiBaseUrl =
    path.startsWith('/v2/') || path.startsWith('/v3/')
      ? `https://api.bigcommerce.com/stores/${storeHash}`
      : `https://api.bigcommerce.com/stores/${storeHash}/v3`;

  const fetchConfig: RequestInit = {
    method,
    cache: 'force-cache',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-Auth-Token': accessToken,
    },
  };

  if (method === 'POST' || method === 'PUT') {
    fetchConfig.body = JSON.stringify(body);
  }

  const url = new URL(path, 'https://a');
  if (searchParams !== undefined) {
    for (const key in searchParams) {
      url.searchParams.set(key, searchParams[key]);
    }
  }

  const fullUrl = `${apiBaseUrl}${url.pathname}${url.search}`;
  const response = await fetch(fullUrl, fetchConfig);

  let jsRes: any;

  try {
    jsRes = await response.json();
  } catch (e) {
    jsRes = {};
  }

  if (response.status < 200 || response.status >= 300) {
    console.error('Error fetching', fullUrl, JSON.stringify(response), JSON.stringify(jsRes));
    throw new Error(jsRes.title);
  }

  return jsRes.data;
};

export default adminRestFetch;
