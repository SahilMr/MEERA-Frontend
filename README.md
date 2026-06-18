# RTI Compliance App

Frontend v1 for the RTI Compliance portal — Department User experience with mock data.

## Stack

- React (Vite)
- Tailwind CSS v4
- React Router

## Getting started

```bash
cd rti-compliance-app
npm install
npm run dev
```

Open the URL shown in the terminal (typically `http://localhost:5173`).

## Demo login

Use any username and password. Select a role before clicking Login:

| Role | Route |
|------|-------|
| Department User | Full dashboard + RTI query flow |
| Admin | Placeholder page |
| Department Admin | Placeholder page |

## Project structure

```
src/
  components/
    Login.jsx
    Dashboard.jsx
    RtiQueryList.jsx
    RtiQuerySplitView.jsx
    AssistantPanel.jsx
  mock/
    rtiQueries.js
    kpiConfig.js
  App.jsx
```
