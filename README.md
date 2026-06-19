# MEERA Frontend

Frontend v1 for MEERA — Department User experience with mock data.

## Stack

- React (Vite)
- Tailwind CSS v4
- React Router

## Getting started

```bash
cd ~/codingwoding/projects/MEERA-Frontend
npm install
npm run dev
```

Open the URL shown in the terminal (typically `http://localhost:5173`).

## Demo login

Use any username and password. Select a role before clicking Login:

| Role | Route |
|------|-------|
| Department User | Full dashboard + query flow |
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
