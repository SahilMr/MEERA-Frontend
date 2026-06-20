import { useState } from 'react';
import usersConfig from '../config/usersConfig.json';
import { deptAdminContext } from '../mock/departmentMaster';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showError, setShowError] = useState(false);

  const isValid = username.trim() !== '' && password.trim() !== '';

  function handleSubmit(e) {
    e.preventDefault();
    if (!isValid) {
      setErrorMessage('Please enter both username and password.');
      setShowError(true);
      return;
    }

    // Find user in usersConfig
    const user = usersConfig.users.find(
      (u) => u.email.toLowerCase() === username.trim().toLowerCase()
    );

    if (!user || password !== usersConfig.password) {
      setErrorMessage('Invalid username or password.');
      setShowError(true);
      return;
    }

    // Save to localStorage
    localStorage.setItem('currentUser', JSON.stringify(user));

    // Update deptAdminContext if user is department admin
    if (user.role === 'deptAdmin') {
      const newCtx = {
        office: user.office || 'Central Office',
        department: user.department,
      };
      localStorage.setItem('deptAdminContext', JSON.stringify(newCtx));
      Object.assign(deptAdminContext, newCtx);
    }

    onLogin(user.role);
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
              Username (Email)
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
              placeholder="e.g. dos.admin@rbi.org.in"
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
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-[#1a1a1a] transition placeholder:text-slate-400"
              placeholder="Enter password"
            />
          </div>

          {showError && (
            <p className="mb-4 text-sm text-red-600">
              {errorMessage}
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
