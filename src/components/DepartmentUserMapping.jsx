import { useEffect, useMemo, useRef, useState } from 'react';
import {
  bulkUploadTemplateExample,
  bulkUploadTemplateHeaders,
  departmentsByOffice,
  divisionsByDepartment,
  deptAdminContext,
  offices,
  subSectionsByDivision,
} from '../mock/departmentMaster';
import { fetchDepartmentMaster, uploadDepartmentMaster } from '../services/departmentMasterApi';
import usersConfig from '../config/usersConfig.json';

const selectClassName =
  'w-full rounded-md border border-neutral-200 px-3 py-2.5 text-sm outline-none transition focus:border-neutral-400 focus:ring-1 focus:ring-neutral-400';

const getInitialForm = () => ({
  office: deptAdminContext.office || 'Central Office',
  department: deptAdminContext.department || 'Department Of Supervision',
  division: '',
  subSection: '',
  departmentUser: '',
});

function FormSelect({ id, label, value, onChange, options, placeholder, disabled }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-[#1a1a1a]">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`${selectClassName} disabled:cursor-not-allowed disabled:bg-neutral-50 disabled:text-[#6b6b6b]`}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function parseCsvLine(line) {
  const values = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }
    if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
      continue;
    }
    current += char;
  }

  values.push(current.trim());
  return values;
}

function parseBulkUploadCsv(text) {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 2) {
    throw new Error('The uploaded file must include a header row and at least one data row.');
  }

  const rows = lines.slice(1).map((line, index) => {
    const [office, division, subSection, departmentUser] = parseCsvLine(line);

    if (!office || !division || !subSection || !departmentUser) {
      throw new Error(`Row ${index + 2} is incomplete. All columns are required.`);
    }

    return { office, division, subSection, departmentUser };
  });

  return rows;
}

function downloadBulkTemplate() {
  const csv = [
    bulkUploadTemplateHeaders.join(','),
    bulkUploadTemplateExample.map((value) => `"${value}"`).join(','),
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'department_user_mapping_template.csv';
  link.click();
  URL.revokeObjectURL(url);
}

export default function DepartmentUserMapping() {
  const fileInputRef = useRef(null);
  const [mappings, setMappings] = useState([]);
  const [form, setForm] = useState(getInitialForm);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [formError, setFormError] = useState('');
  const [bulkError, setBulkError] = useState('');
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const departmentOptions = useMemo(
    () => (form.office ? departmentsByOffice[form.office] || [] : []),
    [form.office],
  );

  const divisionOptions = useMemo(
    () => (form.department ? divisionsByDepartment[form.department] || [] : []),
    [form.department],
  );

  const subSectionOptions = useMemo(
    () => (form.division ? subSectionsByDivision[form.division] || [] : []),
    [form.division],
  );

  const departmentUsersOptions = useMemo(() => {
    return usersConfig.users
      .filter((u) => u.role === 'user' && u.department === deptAdminContext.department)
      .map((u) => u.email);
  }, [deptAdminContext.department]);

  const isFormValid =
    form.office &&
    form.department &&
    form.division &&
    form.subSection &&
    form.departmentUser;

  async function reloadMappings() {
    setApiError('');
    try {
      const response = await fetchDepartmentMaster(deptAdminContext.department);
      if (response.error) {
        setApiError(response.message || 'Failed to reload existing mappings.');
      } else {
        const records = response.data?.records || [];
        const mapped = records.map((rec, idx) => ({
          id: rec.id || `MAP-${String(idx + 1).padStart(3, '0')}`,
          office: rec.office,
          department: rec.department,
          division: rec.division_section,
          subSection: rec.sub_section,
          departmentUser: rec.user,
        }));
        setMappings(mapped);
      }
    } catch (err) {
      setApiError(err.message || 'Failed to reload existing mappings.');
    }
  }

  useEffect(() => {
    let active = true;
    async function loadMappings() {
      setIsLoading(true);
      setApiError('');
      try {
        const response = await fetchDepartmentMaster(deptAdminContext.department);
        if (active) {
          if (response.error) {
            setApiError(response.message || 'Failed to load existing mappings.');
          } else {
            const records = response.data?.records || [];
            const mapped = records.map((rec, idx) => ({
              id: rec.id || `MAP-${String(idx + 1).padStart(3, '0')}`,
              office: rec.office,
              department: rec.department,
              division: rec.division_section,
              subSection: rec.sub_section,
              departmentUser: rec.user,
            }));
            setMappings(mapped);
          }
        }
      } catch (err) {
        if (active) {
          setApiError(err.message || 'Failed to load existing mappings.');
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }
    loadMappings();
    return () => {
      active = false;
    };
  }, []);

  function showToast(message) {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  }

  function updateForm(field, value) {
    setForm((prev) => {
      const next = { ...prev, [field]: value };

      if (field === 'office') {
        next.division = '';
        next.subSection = '';
      } else if (field === 'department') {
        next.division = '';
        next.subSection = '';
      } else if (field === 'division') {
        next.subSection = '';
      }

      return next;
    });
    setFormError('');
  }

  async function handleCreateMapping(e) {
    e.preventDefault();

    if (!isFormValid) {
      setFormError('Please complete all fields before saving the mapping.');
      return;
    }

    setIsSubmitting(true);
    setFormError('');
    try {
      const payload = {
        records: [
          {
            office: form.office,
            division_section: form.division,
            sub_section: form.subSection,
            user: form.departmentUser,
          },
        ],
        department: deptAdminContext.department,
      };
      const response = await uploadDepartmentMaster(payload);
      if (response.error) {
        setFormError(response.message || 'Failed to create mapping.');
      } else {
        setForm(getInitialForm());
        showToast('Department user mapping created successfully.');
        await reloadMappings();
      }
    } catch (err) {
      setFormError(err.message || 'Failed to create mapping.');
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleBulkSubmit(e) {
    e.preventDefault();
    setBulkError('');

    if (!uploadFile) {
      setBulkError('Please select a file to upload.');
      return;
    }

    setIsSubmitting(true);
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const rows = parseBulkUploadCsv(String(reader.result));
        const records = rows.map((row) => ({
          office: row.office,
          division_section: row.division,
          sub_section: row.subSection,
          user: row.departmentUser,
        }));
        const payload = {
          records,
          department: deptAdminContext.department,
        };
        const response = await uploadDepartmentMaster(payload);
        if (response.error) {
          setBulkError(response.message || 'Failed to upload department master.');
        } else {
          setUploadFile(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
          setShowBulkUpload(false);
          showToast(`${rows.length} mapping${rows.length === 1 ? '' : 's'} uploaded successfully.`);
          await reloadMappings();
        }
      } catch (error) {
        setBulkError(error.message);
      } finally {
        setIsSubmitting(false);
      }
    };
    reader.onerror = () => {
      setBulkError('Failed to read the file.');
      setIsSubmitting(false);
    };
    reader.readAsText(uploadFile);
  }

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-light tracking-tight text-[#1a1a1a]">Masters</h1>
          <p className="mt-1 text-sm text-[#6b6b6b]">
            Create and manage department user mappings
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setShowBulkUpload((prev) => !prev);
            setBulkError('');
          }}
          className="rounded-md border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-[#1a1a1a] transition hover:border-neutral-300 hover:bg-neutral-50"
        >
          Bulk Upload
        </button>
      </div>

      {showBulkUpload && (
        <div className="mb-8 rounded-lg border border-neutral-200 bg-white p-6">
          <h2 className="text-lg font-light text-[#1a1a1a]">Bulk Upload</h2>
          <p className="mt-1 text-sm text-[#6b6b6b]">
            Download the template, fill in the mappings, then upload the completed sheet.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={downloadBulkTemplate}
              className="rounded-md border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-[#1a1a1a] transition hover:border-neutral-300 hover:bg-neutral-50"
            >
              Download Template
            </button>
          </div>

          <form onSubmit={handleBulkSubmit} className="mt-6">
            <div>
              <label htmlFor="bulk-upload" className="mb-1.5 block text-sm font-medium text-[#1a1a1a]">
                Upload completed sheet
              </label>
              <input
                ref={fileInputRef}
                id="bulk-upload"
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={(e) => {
                  setUploadFile(e.target.files?.[0] ?? null);
                  setBulkError('');
                }}
                className="block w-full text-sm text-[#6b6b6b] file:mr-4 file:rounded-md file:border file:border-neutral-200 file:bg-white file:px-4 file:py-2 file:text-sm file:font-medium file:text-[#1a1a1a] hover:file:bg-neutral-50"
              />
              <p className="mt-2 text-xs text-[#6b6b6b]">
                Use the downloaded CSV template. Excel-compatible files are supported for upload.
              </p>
            </div>

            {bulkError && (
              <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {bulkError}
              </div>
            )}

            <div className="mt-5 flex gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-md bg-[#1a1a1a] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isSubmitting ? 'Uploading...' : 'Submit Upload'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowBulkUpload(false);
                  setUploadFile(null);
                  setBulkError('');
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                }}
                className="rounded-md border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-[#1a1a1a] transition hover:border-neutral-300 hover:bg-neutral-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <form
        onSubmit={handleCreateMapping}
        className="rounded-lg border border-neutral-200 bg-white p-6"
      >
        <h2 className="text-lg font-light text-[#1a1a1a]">Department User Mapping</h2>
        <p className="mt-1 text-sm text-[#6b6b6b]">
          Map a department user to office, department, and section details.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormSelect
            id="office"
            label="Office"
            value={form.office}
            onChange={(e) => updateForm('office', e.target.value)}
            options={offices}
            placeholder="Select office"
          />
          <FormSelect
            id="department"
            label="Department"
            value={form.department}
            onChange={(e) => updateForm('department', e.target.value)}
            options={[deptAdminContext.department]}
            placeholder="Select department"
            disabled={true}
          />
          <FormSelect
            id="division"
            label="Division/Section"
            value={form.division}
            onChange={(e) => updateForm('division', e.target.value)}
            options={divisionOptions}
            placeholder="Select division/section"
            disabled={!form.department}
          />
          <FormSelect
            id="subSection"
            label="Sub-Section"
            value={form.subSection}
            onChange={(e) => updateForm('subSection', e.target.value)}
            options={subSectionOptions}
            placeholder="Select sub-section"
            disabled={!form.division}
          />
          <FormSelect
            id="departmentUser"
            label="Department User"
            value={form.departmentUser}
            onChange={(e) => updateForm('departmentUser', e.target.value)}
            options={departmentUsersOptions}
            placeholder="Select department user"
          />
        </div>

        {formError && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {formError}
          </div>
        )}

        <div className="mt-6">
          <button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className="rounded-md bg-[#1a1a1a] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isSubmitting ? 'Saving...' : 'Create Mapping'}
          </button>
        </div>
      </form>

      {apiError && (
        <div className="mt-8 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {apiError}
        </div>
      )}

      <div className="mt-8 overflow-hidden rounded-lg border border-neutral-200 bg-white">
        <div className="border-b border-neutral-200 px-5 py-4">
          <h2 className="text-sm font-medium text-[#1a1a1a]">Existing Mappings</h2>
        </div>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-neutral-200 bg-neutral-50">
              {['Office', 'Department', 'Division/Section', 'Sub-Section', 'Department User'].map(
                (label) => (
                  <th
                    key={label}
                    className="px-5 py-3 text-xs font-medium uppercase tracking-wide text-[#6b6b6b]"
                  >
                    {label}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-sm text-[#6b6b6b]">
                  Loading mappings...
                </td>
              </tr>
            ) : mappings.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-sm text-[#6b6b6b]">
                  No mappings found.
                </td>
              </tr>
            ) : (
              mappings.map((mapping) => (
                <tr key={mapping.id} className="border-b border-neutral-100 last:border-0">
                  <td className="px-5 py-4 text-[#1a1a1a]">{mapping.office}</td>
                  <td className="px-5 py-4 text-[#1a1a1a]">{mapping.department}</td>
                  <td className="px-5 py-4 text-[#1a1a1a]">{mapping.division}</td>
                  <td className="px-5 py-4 text-[#1a1a1a]">{mapping.subSection}</td>
                  <td className="px-5 py-4 text-[#1a1a1a]">{mapping.departmentUser}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 rounded-md border border-neutral-200 bg-white px-4 py-3 text-sm text-[#1a1a1a] shadow-sm">
          {toast}
        </div>
      )}
    </div>
  );
}
