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
    'Total RTI Queries': 156,
    'Total Resolved': 108,
    'Total Pending': 34,
  },
  admin: {
    'Total RTI Queries': 486,
    'Total Resolved': 312,
    'Total Pending': 89,
    'Total RTI Not In Scope': 42,
    'Total Active Sessions': 17,
  },
};
