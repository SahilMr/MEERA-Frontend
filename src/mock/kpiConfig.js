export const kpiConfig = {
  admin: [
    'Total RTI Queries',
    'Total Resolved',
    'Total Pending',
    'Total RTI Not In Scope',
    'Total Active Sessions',
  ],
  deptAdmin: ['Total RTI Queries', 'Total Resolved', 'Total Pending'],
  user: ['Total RTI Queries', 'Total Resolved', 'Total Pending'],
};

export const kpiMockValues = {
  user: {
    'Total RTI Queries': 142,
    'Total Resolved': 98,
    'Total Pending': 31,
  },
  deptAdmin: {
    'Total RTI Queries': 0,
    'Total Resolved': 0,
    'Total Pending': 0,
  },
  admin: {
    'Total RTI Queries': 0,
    'Total Resolved': 0,
    'Total Pending': 0,
    'Total RTI Not In Scope': 0,
    'Total Active Sessions': 0,
  },
};
