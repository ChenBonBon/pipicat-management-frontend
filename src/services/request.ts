export interface RequestParams {
  [key: string]: any;
}

const convertParams = (params: RequestParams) => {
  const resultArr: string[] = [];
  if (params) {
    Object.keys(params).forEach((key) => {
      const value = params[key];
      resultArr.push(`${key}=${value}`);
    });
  }

  if (resultArr.length > 0) {
    return '?' + resultArr.join('&');
  }

  return '';
};

export async function Get(url: string, params: RequestParams) {
  const convertedParams = convertParams(params);
  const response = await fetch(`${url}${convertedParams}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return await response.json();
}

const request = (url: string, method: string, params?: RequestParams) => {
  return fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });
};

export function Post(url: string, params: RequestParams) {
  return request(url, 'POST', params);
}

export function Put(url: string, params: RequestParams) {
  return request(url, 'PUT', params);
}

export function Delete(url: string) {
  return request(url, 'DELETE');
}
