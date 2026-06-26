import { buildApiUrl } from '../config/apiEndpoints';

export class ApiError extends Error {
  constructor(status, body) {
    super(body?.error || body?.message || `Request failed with status ${status}`);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

/**
 * @template T
 * @param {string} path - Path relative to baseUrl (from apiEndpoints).
 * @param {RequestInit} [options]
 * @returns {Promise<T>}
 */
export async function apiGet(path, options = {}) {
  const url = buildApiUrl(path);
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      ...options.headers,
    },
    ...options,
  });

  let body;
  try {
    body = await response.json();
  } catch {
    throw new ApiError(response.status, {
      error: 'INVALID_JSON_RESPONSE',
      message: 'Server returned a non-JSON response',
      data: null,
    });
  }

  if (!response.ok) {
    throw new ApiError(response.status, body);
  }

  return body;
}

/**
 * @template T
 * @param {string} path - Path relative to baseUrl.
 * @param {any} body - JSON request body.
 * @param {RequestInit} [options]
 * @returns {Promise<T>}
 */
export async function apiPost(path, body, options = {}) {
  const url = buildApiUrl(path);
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...options.headers,
    },
    body: JSON.stringify(body),
    ...options,
  });

  let responseBody;
  try {
    responseBody = await response.json();
  } catch {
    throw new ApiError(response.status, {
      error: 'INVALID_JSON_RESPONSE',
      message: 'Server returned a non-JSON response',
      data: null,
    });
  }

  if (!response.ok) {
    throw new ApiError(response.status, responseBody);
  }

  return responseBody;
}

/**
 * @template T
 * @param {string} path - Path relative to baseUrl.
 * @param {any} body - JSON request body.
 * @param {RequestInit} [options]
 * @returns {Promise<T>}
 */
export async function apiPut(path, body, options = {}) {
  const url = buildApiUrl(path);
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...options.headers,
    },
    body: JSON.stringify(body),
    ...options,
  });

  let responseBody;
  try {
    responseBody = await response.json();
  } catch {
    throw new ApiError(response.status, {
      error: 'INVALID_JSON_RESPONSE',
      message: 'Server returned a non-JSON response',
      data: null,
    });
  }

  if (!response.ok) {
    throw new ApiError(response.status, responseBody);
  }

  return responseBody;
}

/**
 * @template T
 * @param {string} path - Path relative to baseUrl.
 * @param {FormData} formData - FormData object.
 * @param {RequestInit} [options]
 * @returns {Promise<T>}
 */
export async function apiPutForm(path, formData, options = {}) {
  const url = buildApiUrl(path);
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      ...options.headers,
    },
    body: formData,
    ...options,
  });

  let responseBody;
  try {
    responseBody = await response.json();
  } catch {
    throw new ApiError(response.status, {
      error: 'INVALID_JSON_RESPONSE',
      message: 'Server returned a non-JSON response',
      data: null,
    });
  }

  if (!response.ok) {
    throw new ApiError(response.status, responseBody);
  }

  return responseBody;
}

/**
 * @param {Record<string, string | number | boolean | undefined | null>} params
 * @returns {string}
 */
export function buildQueryString(params) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.set(key, String(value));
    }
  });

  const query = searchParams.toString();
  return query ? `?${query}` : '';
}
