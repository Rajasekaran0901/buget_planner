import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Cpu, Mail, Lock, LogIn, ArrowRight } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, error, setError } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide your email and password.');
      return;
    }
    setIsSubmitting(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      // error set in context
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePreFill = (role: 'test' | 'admin') => {
    if (role === 'admin') {
      setEmail('admin@budgetagent.com');
      setPassword('adminpassword');
    } else {
      setEmail('test@budgetagent.com');
      setPassword('userpassword');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 font-sans text-slate-100">
      
      {/* Brand logo header */}
      <Link to="/" className="flex items-center gap-2 mb-8">
        <div className="p-2.5 bg-gradient-to-tr from-indigo-600 to-cyan-500 rounded-xl shadow-lg shadow-indigo-500/20">
          <Cpu className="w-5 h-5 text-white" />
        </div>
        <span className="font-bold text-lg bg-gradient-to-r from-indigo-400 to-cyan-300 bg-clip-text text-transparent">
          Budget Planning Agent
        </span>
      </Link>

      <div className="w-full max-w-md bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        
        {/* Glow effects */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl" />

        <div className="text-center space-y-2 mb-8">
          <h2 className="text-2xl font-black text-slate-100">Welcome Back</h2>
          <p className="text-xs text-slate-400">Securely authenticate to access your financial profiles</p>
        </div>

        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-xs text-rose-400 mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Mail className="w-4 h-4" /></span>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-slate-850 border border-slate-800 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Secret Password
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Lock className="w-4 h-4" /></span>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-850 border border-slate-800 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-2xl py-3.5 text-sm shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/30 transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? 'Authenticating...' : (
              <>
                Sign In to Dashboard <LogIn className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo accounts picker */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 text-center space-y-3">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Quick Demo Logins</span>
          <div className="flex gap-2 justify-center">
            <button 
              id="prefill-user"
              onClick={() => handlePreFill('test')}
              className="text-xs bg-slate-800 hover:bg-slate-750 text-slate-300 px-3.5 py-1.5 rounded-xl border border-slate-700/60 transition"
            >
              Test User
            </button>
            <button 
              id="prefill-admin"
              onClick={() => handlePreFill('admin')}
              className="text-xs bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 px-3.5 py-1.5 rounded-xl border border-indigo-500/20 transition"
            >
              Admin User
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-slate-400">
          New to the Agent?{' '}
          <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-semibold transition">
            Create an Account <ArrowRight className="w-3 h-3 inline" />
          </Link>
        </div>

      </div>
    </div>
  );
};
export default LoginPage;
