import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scale, Eye, EyeOff, LogIn } from 'lucide-react';
import { Button, Input } from '../../components/ui/index.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { getApiError } from '../../services/api.js';
import usePageMeta from '../../hooks/usePageMeta.js';

export default function AdminLoginPage() {
  usePageMeta('Admin Login');
  const { login } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back.');
      navigate('/admin');
    } catch (err) {
      toast.error(getApiError(err, 'Login failed.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy-950 px-4">
      <div className="w-full max-w-md">
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent-500 text-2xl font-bold text-white">H</span>
          <h1 className="mt-4 text-2xl font-bold text-white">Admin Console</h1>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-navy-300">
            <Scale className="h-4 w-4" /> Human Rights Council of Pakistan – Twin City
          </p>
        </div>

        <form onSubmit={submit} className="card space-y-4 p-6 sm:p-8">
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@example.org" required autoComplete="username" />
          <div className="relative">
            <Input
              label="Password"
              type={show ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
            <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-3 top-9 text-gray-500 hover:text-gray-700" aria-label={show ? 'Hide password' : 'Show password'}>
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <Button type="submit" variant="accent" loading={loading} className="w-full">
            <LogIn className="h-4 w-4" /> Sign In
          </Button>
        </form>

        <p className="mt-4 text-center text-xs text-navy-400">Authorized personnel only. All access is logged.</p>
      </div>
    </div>
  );
}
