export const deptAdminContext = {
  office: 'Municipal Corporation HQ',
  department: 'Public Works Department',
};

export const offices = ['Municipal Corporation HQ', 'Regional Office — North', 'Regional Office — South'];

export const departmentsByOffice = {
  'Municipal Corporation HQ': [
    'Public Works Department',
    'Health Department',
    'Education Department',
  ],
  'Regional Office — North': ['Public Works Department', 'Revenue Department'],
  'Regional Office — South': ['Public Works Department', 'Urban Planning Department'],
};

export const divisionsByDepartment = {
  'Public Works Department': ['Roads Division', 'Water Supply Division', 'Building Division'],
  'Health Department': ['Primary Care Division', 'Sanitation Division'],
  'Education Department': ['Schools Division', 'Scholarships Division'],
  'Revenue Department': ['Assessment Division', 'Collection Division'],
  'Urban Planning Department': ['Zoning Division', 'Permits Division'],
};

export const subSectionsByDivision = {
  'Roads Division': ['Ward Planning', 'Maintenance', 'Tender Management'],
  'Water Supply Division': ['Pipeline Operations', 'Billing'],
  'Building Division': ['Plan Approval', 'Inspection'],
  'Primary Care Division': ['Clinic Operations', 'Immunization'],
  'Sanitation Division': ['Waste Collection', 'Drainage'],
  'Schools Division': ['Primary Schools', 'Secondary Schools'],
  'Scholarships Division': ['Applications', 'Disbursement'],
  'Assessment Division': ['Property Tax', 'Trade License'],
  'Collection Division': ['Recovery', 'Reconciliation'],
  'Zoning Division': ['Residential', 'Commercial'],
  'Permits Division': ['Construction', 'Renovation'],
};

export const departmentUsers = [
  'Rajesh Kumar',
  'Priya Sharma',
  'Amit Patel',
  'Meena Iyer',
  'Suresh Reddy',
  'Kavita Desai',
];

export const initialUserMappings = [
  {
    id: 'MAP-001',
    office: 'Municipal Corporation HQ',
    department: 'Public Works Department',
    division: 'Roads Division',
    subSection: 'Ward Planning',
    departmentUser: 'Rajesh Kumar',
  },
  {
    id: 'MAP-002',
    office: 'Municipal Corporation HQ',
    department: 'Public Works Department',
    division: 'Water Supply Division',
    subSection: 'Pipeline Operations',
    departmentUser: 'Priya Sharma',
  },
];

export const bulkUploadTemplateHeaders = [
  'Office',
  'Department',
  'Division/Section',
  'Sub-Section',
  'Department User',
];

export const bulkUploadTemplateExample = [
  'Municipal Corporation HQ',
  'Public Works Department',
  'Roads Division',
  'Maintenance',
  'Amit Patel',
];
