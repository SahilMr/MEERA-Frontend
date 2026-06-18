import { Link, useLocation } from 'react-router-dom';

export default function AppLayout({ currentRole, onLogout, children }) {
  const location = useLocation();

  const navItems =
    currentRole === 'user'
      ? [
          { to: '/dashboard', label: 'Dashboard' },
          { to: '/rti-queries', label: 'RTI Queries' },
        ]
      : [];

  return (
    <div className="min-h-screen bg-[#fafaf9]">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-8 py-4">
          <div className="flex items-center gap-8">
            <Link to="/dashboard" className="text-lg font-light tracking-tight text-[#1a1a1a]">
              RTI Compliance
            </Link>
            {navItems.length > 0 && (
              <nav className="flex gap-1">
                {navItems.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`rounded-md px-3 py-1.5 text-sm transition ${
                      location.pathname === item.to
                        ? 'bg-neutral-100 font-medium text-[#1a1a1a]'
                        : 'text-[#6b6b6b] hover:text-[#1a1a1a]'
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
            className="text-sm text-[#6b6b6b] transition hover:text-[#1a1a1a]"
          >
            Logout
          </button>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-8 py-10">{children}</main>
    </div>
  );
}
