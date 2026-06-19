// OPEN QUESTIONS FOR V2 (resolve before building Admin/Dept Admin views):
// 1. What does Admin see/do on this screen — same data, all departments, or different UI entirely?
// 2. What does Department Admin see/do here — own department's full list, reassignment, approval step?
// 3. Click behavior for Resolved / Not In Scope rows — currently undefined.
// 4. Confirm split-screen ratio is really 75:25.
// 5. Office Note Editor: plain text or rich text?
// 6. Difference between "Upload Office Note" and "Attach Documents" — purpose, file types, required vs optional.
// 7. Does Submit auto-resolve the query, or is there a review/approval step?
// 8. Is the assistant panel interactive chat, or passive auto-suggestions only?
// 9. Department onboarding/mapping screen — who manages it (Admin vs Dept Admin), and what gets mapped (users, RTI categories, both)?

import { Link } from 'react-router-dom';
import { deptAdminContext } from '../mock/departmentMaster';
import { kpiConfig, kpiMockValues } from '../mock/kpiConfig';

export default function Dashboard({ currentRole }) {
  const cards = kpiConfig[currentRole] || kpiConfig.user;
  const values = kpiMockValues[currentRole] || kpiMockValues.user;
  const isAdmin = currentRole === 'admin';
  const isDeptAdmin = currentRole === 'deptAdmin';
  const gridClass =
    cards.length > 3
      ? 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'
      : 'grid grid-cols-1 gap-6 sm:grid-cols-3';

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-light tracking-tight text-[#1a1a1a]">Dashboard</h1>
        <p className="mt-1 text-sm text-[#6b6b6b]">
          {isAdmin
            ? 'Organization-wide overview of RTI query activity'
            : isDeptAdmin
              ? `Overview of RTI query activity for ${deptAdminContext.department}`
              : 'Overview of RTI query activity'}
        </p>
        {isDeptAdmin && (
          <div className="mt-4 inline-flex items-center rounded-md border border-neutral-200 bg-white px-3 py-1.5 text-sm text-[#1a1a1a]">
            <span className="text-[#6b6b6b]">Department:</span>
            <span className="ml-2 font-medium">{deptAdminContext.department}</span>
          </div>
        )}
      </div>

      <div className={gridClass}>
        {cards.map((label) => (
          <div
            key={label}
            className="rounded-lg border border-neutral-200 bg-white p-6"
          >
            <p className="text-sm text-[#6b6b6b]">{label}</p>
            <p className="mt-2 text-3xl font-light text-[#1a1a1a]">
              {values[label] ?? '—'}
            </p>
          </div>
        ))}
      </div>

      {currentRole === 'user' && (
        <div className="mt-10">
          <Link
            to="/rti-queries"
            className="inline-flex items-center rounded-md border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-[#1a1a1a] transition hover:border-neutral-300 hover:bg-neutral-50"
          >
            View RTI Queries →
          </Link>
        </div>
      )}
    </div>
  );
}
