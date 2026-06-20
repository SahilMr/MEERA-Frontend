import { apiEndpoints } from '../config/apiEndpoints';
import { apiGet, apiPost, buildQueryString } from './apiClient';

/**
 * GET get_department_master
 * Fetches department mapping master based on department.
 * @param {string} department - Filters based on department.
 * @returns {Promise<{ data: { records: Array<{ office: string, division_section: string, sub_section: string, department: string, user: string }> }, message: string, error: any }>}
 */
export function fetchDepartmentMaster(department) {
  const query = buildQueryString({ department });
  return apiGet(`${apiEndpoints.departmentMaster.get}${query}`);
}

/**
 * POST upload_department_master
 * Uploads a list of department mappings (bulk upload or single wrapped).
 * @param {Object} body
 * @param {Array<{ office: string, division_section: string, sub_section: string, user: string }>} body.records
 * @param {string} body.department
 * @returns {Promise<{ data: Array<{ upload_status: string, total_records_uploaded: string }>, message: string, error: any }>}
 */
export function uploadDepartmentMaster(body) {
  return apiPost(apiEndpoints.departmentMaster.upload, body);
}
