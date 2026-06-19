import { Link, useLocation } from 'react-router-dom';

export default function AppLayout({ currentRole, onLogout, children }) {
  const location = useLocation();

  const navItems =
    currentRole === 'user'
      ? [
          { to: '/dashboard', label: 'Dashboard' },
          { to: '/rti-queries', label: 'Queries' },
        ]
      : [];

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-8 py-4">
          <div className="flex items-center gap-8">
            <Link to="/dashboard" className="text-xl font-semibold tracking-tight text-brand-700">
              MEERA
            </Link>
            {navItems.length > 0 && (
              <nav className="flex gap-1">
                {navItems.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`rounded-lg px-3 py-1.5 text-sm transition ${
                      location.pathname === item.to
                        ? 'bg-brand-50 font-medium text-brand-700'
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            )}
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="rounded-lg px-3 py-1.5 text-sm text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
          >
            Logout
          </button>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-8 py-10">{children}</main>
    </div>
  );
}
