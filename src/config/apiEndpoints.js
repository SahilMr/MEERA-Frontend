/**
 * API endpoint configuration.
 * Update baseUrl and paths here when backend routes change.
 *
 * Environment override: set VITE_API_BASE_URL in .env (see .env.example).
 */
export const apiEndpoints = {
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',

  rtiQuery: {
    /** GET fetch_rti_query — list / filter / single-record by query param */
    fetchList: '/api/v1/rti-queries',
    /** GET fetch_rti_query_count — aggregate counts */
    fetchCount: '/api/v1/rti-queries/count',
    /** GET fetch_rti_query_detail — append /{rti_query_id} */
    fetchDetail: '/api/v1/rti-queries',
  },

  assistant: {
    /** POST user_query — Ask query to assistant */
    userQuery: '/api/v1/user_query',
    /** POST get_suggestion — Trigger suggestion */
    getSuggestion: '/api/v1/get-suggestion',
    /** GET get_session — Fetch session history */
    getSession: '/api/v1/get-session',
  },

  departmentMaster: {
    /** POST upload_department_master — Bulk upload department master */
    upload: '/api/v1/upload/department-mapping-master',
    /** GET get_department_master — Fetch department mapping master */
    get: '/api/v1/department-mapping-master',
  },
};

export function buildApiUrl(path) {
  const base = apiEndpoints.baseUrl.replace(/\/$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalizedPath}`;
}
