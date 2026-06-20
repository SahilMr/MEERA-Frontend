export const deptAdminContext = {
  office: 'Central Office',
  department: 'Department Of Supervision',
};

// Initialize from localStorage if it exists
try {
  const saved = localStorage.getItem('deptAdminContext');
  if (saved) {
    Object.assign(deptAdminContext, JSON.parse(saved));
  }
} catch {}

export const offices = ['Central Office', 'Regional Office — North', 'Regional Office — South'];

export const departmentsByOffice = {
  'Central Office': [
    'Department Of Supervision',
    'Department of Regulations',
  ],
  'Regional Office — North': ['Department Of Supervision'],
  'Regional Office — South': ['Department of Regulations'],
};

export const divisionsByDepartment = {
  'Department Of Supervision': ['Supervision Division 1', 'Supervision Division 2'],
  'Department of Regulations': ['Regulations Division 1', 'Regulations Division 2'],
};

export const subSectionsByDivision = {
  'Supervision Division 1': ['On-site Inspection', 'Off-site Monitoring'],
  'Supervision Division 2': ['Risk Assessment', 'Compliance Audit'],
  'Regulations Division 1': ['Policy Formulation', 'Drafting guidelines'],
  'Regulations Division 2': ['Interpretation & Clarification', 'Legal advisory'],
};

export const departmentUsers = [
  'Rohan.Mishra@rbi.org.in',
  'Amit.Patel@rbi.org.in',
  'Sarita.Mukherjee@rbi.org.in',
  'Dainik.Bhaskar@rbi.org.in',
  'Atique.Syed@rbi.org.in',
  'Sahil.T@rbi.org.in',
];

export const initialUserMappings = [
  {
    id: 'MAP-001',
    office: 'Central Office',
    department: 'Department Of Supervision',
    division: 'Supervision Division 1',
    subSection: 'On-site Inspection',
    departmentUser: 'Rohan.Mishra@rbi.org.in',
  },
  {
    id: 'MAP-002',
    office: 'Central Office',
    department: 'Department of Regulations',
    division: 'Regulations Division 1',
    subSection: 'Policy Formulation',
    departmentUser: 'Atique.Syed@rbi.org.in',
  },
];

export const bulkUploadTemplateHeaders = [
  'Office',
  'Division/Section',
  'Sub-Section',
  'Department User',
];

export const bulkUploadTemplateExample = [
  'Central Office',
  'Supervision Division 1',
  'On-site Inspection',
  'Rohan.Mishra@rbi.org.in',
];
