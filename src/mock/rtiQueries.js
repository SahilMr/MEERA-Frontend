export const rtiColumnConfig = [
  { key: 'id', label: 'RTI Query ID' },
  { key: 'sarthiInward', label: 'Sarthi Inward Number' },
  { key: 'query', label: 'RTI Query' },
  { key: 'status', label: 'Status' },
];

export const rtiQueries = [
  {
    id: 'RTI-2024-001',
    sarthiInward: 'SAR-8821',
    query: 'Request for copies of all tender documents related to road construction in Ward 12 for FY 2023-24.',
    status: 'Pending',
    raisedBy: 'Rajesh Kumar',
    enclosures: 'Copy of RTI application, Aadhaar proof',
    date: '2024-11-05',
  },
  {
    id: 'RTI-2024-002',
    sarthiInward: 'SAR-8834',
    query: 'Details of expenditure on public health camps conducted between January and June 2024.',
    status: 'Resolved',
    raisedBy: 'Priya Sharma',
    enclosures: 'RTI application form',
    date: '2024-10-28',
  },
  {
    id: 'RTI-2024-003',
    sarthiInward: 'SAR-8840',
    query: 'List of employees promoted to Grade A in the Education Department during 2023.',
    status: 'Pending',
    raisedBy: 'Amit Patel',
    enclosures: 'Self-attested ID copy',
    date: '2024-11-12',
  },
  {
    id: 'RTI-2024-004',
    sarthiInward: 'SAR-8855',
    query: 'Information regarding personal assets of the Municipal Commissioner.',
    status: 'Not In Scope',
    raisedBy: 'Suresh Reddy',
    enclosures: 'None',
    date: '2024-11-01',
  },
  {
    id: 'RTI-2024-005',
    sarthiInward: 'SAR-8862',
    query: 'Minutes of all council meetings held in Q3 2024 along with attendance records.',
    status: 'Pending',
    raisedBy: 'Meena Iyer',
    enclosures: 'RTI fee receipt',
    date: '2024-11-15',
  },
  {
    id: 'RTI-2024-006',
    sarthiInward: 'SAR-8870',
    query: 'Status of pending water supply complaints in Sector 7 residential area.',
    status: 'Resolved',
    raisedBy: 'Vikram Singh',
    enclosures: 'Complaint reference numbers',
    date: '2024-10-20',
  },
  {
    id: 'RTI-2024-007',
    sarthiInward: 'SAR-8878',
    query: 'Details of contracts awarded for waste management services in the last fiscal year.',
    status: 'Not In Scope',
    raisedBy: 'Anita Desai',
    enclosures: 'RTI application',
    date: '2024-11-08',
  },
  {
    id: 'RTI-2024-008',
    sarthiInward: 'SAR-8885',
    query: 'Copy of environmental clearance certificates for the new bridge project on River Kaveri.',
    status: 'Pending',
    raisedBy: 'Rahul Menon',
    enclosures: 'Project location map, RTI form',
    date: '2024-11-18',
  },
];

export const assistantSuggestions = [
  {
    id: 'sug-1',
    title: 'Similar tender document request',
    text: 'In response to your RTI application dated [DATE], we hereby provide copies of the tender documents as requested. The documents are enclosed herewith. Please note that certain portions have been redacted as per Section 8(1)(d) of the RTI Act, 2005.',
  },
  {
    id: 'sug-2',
    title: 'Expenditure disclosure template',
    text: 'With reference to your RTI query regarding expenditure details, we submit that the requested information is available and is provided in the enclosed statement. The total expenditure for the period in question amounts to Rs. [AMOUNT].',
  },
  {
    id: 'sug-3',
    title: 'Meeting minutes response',
    text: 'Pursuant to your RTI application, certified copies of the minutes of council meetings for the specified period are enclosed. Attendance records for each meeting are appended as Annexure-A.',
  },
];
