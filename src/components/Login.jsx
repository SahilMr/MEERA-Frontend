import { useState } from 'react';

const ROLES = [
  { value: 'admin', label: 'Admin' },
  { value: 'deptAdmin', label: 'Department Admin' },
  { value: 'user', label: 'Department User' },
];

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [showError, setShowError] = useState(false);

  const isValid = username.trim() !== '' && password.trim() !== '';

  function handleSubmit(e) {
    e.preventDefault();
    if (!isValid) {
      setShowError(true);
      return;
    }
    onLogin(role);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-slate-50 to-brand-50 px-6">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900">
            MEERA
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Query management portal
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-slate-200/80 bg-white p-8 shadow-lg shadow-slate-200/50"
        >
          <div className="mb-5">
            <label htmlFor="username" className="mb-1.5 block text-sm font-medium text-slate-700">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setShowError(false);
              }}
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-900 transition placeholder:text-slate-400"
              placeholder="Enter username"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setShowError(false);
              }}
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-900 transition placeholder:text-slate-400"
              placeholder="Enter password"
            />
          </div>

          <div className="mb-6">
            <span className="mb-2 block text-sm font-medium text-slate-700">Role</span>
            <div className="flex gap-2">
              {ROLES.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setRole(r.value)}
                  className={`flex-1 rounded-lg border px-3 py-2 text-xs font-medium transition ${
                    role === r.value
                      ? 'border-brand-600 bg-brand-600 text-white shadow-sm'
                      : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {showError && (
            <p className="mb-4 text-sm text-red-600">
              Please enter both username and password.
            </p>
          )}

          <button
            type="submit"
            disabled={!isValid}
            className="w-full rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
