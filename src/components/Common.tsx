import React from 'react';
import { RefreshCw, AlertCircle, Info, CheckCircle2 } from 'lucide-react';

// 1. Customized Bouncing/Spinning AI Loader
interface LoaderProps {
  message?: string;
}

export const Loader: React.FC<LoaderProps> = ({ message = 'AI Agent analyzing records...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center space-y-4">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-4 border-indigo-500/10 border-t-indigo-500 border-r-cyan-400 animate-spin" />
        <div className="absolute inset-2 bg-slate-900 rounded-full flex items-center justify-center">
          <RefreshCw className="w-6 h-6 text-indigo-400 animate-pulse" />
        </div>
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-300">{message}</p>
        <p className="text-xs text-slate-500 mt-1">Our algorithms are computing optimal allocations...</p>
      </div>
    </div>
  );
};

// 2. Alert Box
interface AlertProps {
  type: 'success' | 'error' | 'info';
  message: string;
}

export const Alert: React.FC<AlertProps> = ({ type, message }) => {
  const styles = {
    success: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    error: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
    info: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'
  };

  const Icons = {
    success: CheckCircle2,
    error: AlertCircle,
    info: Info
  };

  const Icon = Icons[type];

  return (
    <div className={`p-4 border rounded-2xl flex items-start gap-3 text-xs font-medium ${styles[type]}`}>
      <Icon className="w-4 h-4 shrink-0 mt-0.5" />
      <div>{message}</div>
    </div>
  );
};

// 3. Section Header
interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle, action }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800/80 mb-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">{title}</h1>
        {subtitle && <p className="text-xs sm:text-sm text-slate-400 mt-1">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};
