import { apiEndpoints } from '../config/apiEndpoints';
import { apiGet, apiPost, buildQueryString } from './apiClient';

/**
 * @typedef {Object} RtiQueryListItem
 * @property {string} rti_query_id
 * @property {string} inward_id
 * @property {string} query
 * @property {number} department_id
 * @property {string} status
 * @property {string} assigned_to
 * @property {string} assigned_at
 */

/**
 * @typedef {Object} RtiQueryListResponse
 * @property {RtiQueryListItem[]} data
 * @property {string} [message]
 * @property {string | null} error
 */

/**
 * @typedef {Object} RtiQueryCountData
 * @property {number} total_count
 * @property {number} pending_count
 * @property {number} resolved_count
 * @property {number} not_in_scope_count
 * @property {number} active_sessions_count
 */

/**
 * @typedef {Object} RtiQueryCountResponse
 * @property {RtiQueryCountData | null} data
 * @property {string} [message]
 * @property {string | null} error
 */

/**
 * @typedef {Object} OfficeNote
 * @property {string} office_note_id
 * @property {string} office_note
 * @property {string} created_at
 * @property {string} created_by
 */

/**
 * @typedef {Object} RtiQueryDetail
 * @property {string} rti_query_id
 * @property {string} inward_id
 * @property {string} query_text
 * @property {number} department_id
 * @property {string} status
 * @property {string} assigned_to
 * @property {string} assigned_at
 * @property {string[]} supporting_documents
 * @property {OfficeNote[]} office_notes
 */

/**
 * @typedef {Object} RtiQueryDetailResponse
 * @property {RtiQueryDetail | null} data
 * @property {string} [message]
 * @property {string | null} error
 */

/**
 * @typedef {Object} FetchRtiQueryParams
 * @property {number} [status_id]
 * @property {number} [limit]
 * @property {number} [offset]
 * @property {string} [rti_query_id]
 * @property {string} [assigned_to]
 * @property {boolean} [unassigned_only]
 */

/**
 * GET fetch_rti_query
 * @param {FetchRtiQueryParams} [params]
 * @returns {Promise<RtiQueryListResponse>}
 */
export function fetchRtiQuery(params = {}) {
  const query = buildQueryString(params);
  return apiGet(`${apiEndpoints.rtiQuery.fetchList}${query}`);
}

/**
 * GET fetch_rti_query_count
 * @returns {Promise<RtiQueryCountResponse>}
 */
export function fetchRtiQueryCount() {
  return apiGet(apiEndpoints.rtiQuery.fetchCount);
}

/**
 * GET fetch_rti_query_detail
 * @param {string} rtiQueryId
 * @returns {Promise<RtiQueryDetailResponse>}
 */
export function fetchRtiQueryDetail(rtiQueryId) {
  const path = `${apiEndpoints.rtiQuery.fetchDetail}/${encodeURIComponent(rtiQueryId)}`;
  return apiGet(path);
}

/**
 * GET get_session
 * @param {Object} params
 * @param {string} params.rti_query_id
 * @param {string} params.user_id
 * @returns {Promise<any>}
 */
export function fetchAssistantSession(params) {
  const query = buildQueryString(params);
  return apiGet(`${apiEndpoints.assistant.getSession}${query}`);
}

/**
 * POST get_suggestion
 * @param {Object} body
 * @param {string} body.rti_query_id
 * @param {string} body.user_id
 * @returns {Promise<any>}
 */
export function fetchAssistantSuggestion(body) {
  return apiPost(apiEndpoints.assistant.getSuggestion, body);
}

/**
 * POST user_query
 * @param {Object} body
 * @param {string} body.user_query
 * @param {string} body.user_id
 * @param {string} body.rti_query_id
 * @returns {Promise<any>}
 */
export function sendUserQuery(body) {
  return apiPost(apiEndpoints.assistant.userQuery, body);
}
