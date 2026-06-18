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
    <div className="flex min-h-screen items-center justify-center bg-[#fafaf9] px-6">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-light tracking-tight text-[#1a1a1a]">
            RTI Compliance
          </h1>
          <p className="mt-2 text-sm text-[#6b6b6b]">
            Right to Information management portal
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-lg border border-neutral-200 bg-white p-8 shadow-sm"
        >
          <div className="mb-5">
            <label htmlFor="username" className="mb-1.5 block text-sm font-medium text-[#1a1a1a]">
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
              className="w-full rounded-md border border-neutral-200 px-3 py-2.5 text-sm outline-none transition focus:border-neutral-400 focus:ring-1 focus:ring-neutral-400"
              placeholder="Enter username"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-[#1a1a1a]">
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
              className="w-full rounded-md border border-neutral-200 px-3 py-2.5 text-sm outline-none transition focus:border-neutral-400 focus:ring-1 focus:ring-neutral-400"
              placeholder="Enter password"
            />
          </div>

          <div className="mb-6">
            <span className="mb-2 block text-sm font-medium text-[#1a1a1a]">Role</span>
            <div className="flex gap-2">
              {ROLES.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setRole(r.value)}
                  className={`flex-1 rounded-md border px-3 py-2 text-xs font-medium transition ${
                    role === r.value
                      ? 'border-[#1a1a1a] bg-[#1a1a1a] text-white'
                      : 'border-neutral-200 bg-white text-[#6b6b6b] hover:border-neutral-300'
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
            className="w-full rounded-md bg-[#1a1a1a] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
