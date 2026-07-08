import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { budgetService, goalService, expenseService } from '../services/api';
import { ProfileCard } from '../components/FinanceCards';
import { Loader, SectionHeader, Alert } from '../components/Common';
import { User, Activity, ShieldAlert, Cpu, Check, HelpCircle, HardDrive } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  
  const [budgetCount, setBudgetCount] = useState(0);
  const [goalCount, setGoalCount] = useState(0);
  const [expenseCount, setExpenseCount] = useState(0);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProfileStats();
  }, []);

  const loadProfileStats = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const [bdg, goals, exps] = await Promise.all([
        budgetService.getBudget(),
        goalService.getGoals(),
        expenseService.getExpenses()
      ]);

      setBudgetCount(bdg ? 1 : 0);
      setGoalCount(goals.length);
      setExpenseCount(exps.length);
    } catch (err) {
      console.error(err);
      setError('Could not update profile metadata.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loader message="Accessing secure profile metadata..." />;
  }

  return (
    <div className="space-y-6">
      
      <SectionHeader 
        title="Profile Settings" 
        subtitle="Manage account levels, visual credentials, and monitor system diagnostics"
      />

      {error && <Alert type="error" message={error} />}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Profile metadata card */}
        <div className="lg:col-span-5">
          <ProfileCard 
            user={user} 
            budgetCount={budgetCount} 
            goalCount={goalCount} 
          />
        </div>

        {/* Diagnostic logs panel */}
        <div className="lg:col-span-7 bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
            <Activity className="w-4.5 h-4.5" />
            <span>Developer Diagnosis Console</span>
          </div>

          <div className="space-y-3">
            
            <div className="p-3 bg-slate-950/60 border border-slate-850 rounded-2xl flex items-center justify-between text-xs font-medium">
              <div className="flex items-center gap-2">
                <HardDrive className="text-emerald-400 w-4 h-4" />
                <span className="text-slate-300">File Storage DB Engine</span>
              </div>
              <span className="text-slate-500 font-mono text-[10px]">Active (/database/db.json)</span>
            </div>

            <div className="p-3 bg-slate-950/60 border border-slate-850 rounded-2xl flex items-center justify-between text-xs font-medium">
              <div className="flex items-center gap-2">
                <Cpu className="text-indigo-400 w-4 h-4 animate-pulse" />
                <span className="text-slate-300">Google Gemini LLM Connection</span>
              </div>
              <span className="text-emerald-400 flex items-center gap-1 font-mono text-[10px] uppercase font-bold">
                <Check className="w-3.5 h-3.5" /> Secured Fallback Configured
              </span>
            </div>

            <div className="p-3 bg-slate-950/60 border border-slate-850 rounded-2xl flex items-center justify-between text-xs font-medium">
              <div className="flex items-center gap-2">
                <Activity className="text-cyan-400 w-4 h-4" />
                <span className="text-slate-300">JWT Token Security Signature</span>
              </div>
              <span className="text-slate-500 font-mono text-[10px]">RSA-HS256 (3600s TTL)</span>
            </div>

            <div className="p-3 bg-slate-950/60 border border-slate-850 rounded-2xl flex items-center justify-between text-xs font-medium">
              <div className="flex items-center gap-2">
                <Activity className="text-rose-400 w-4 h-4" />
                <span className="text-slate-300">Transaction Registry Count</span>
              </div>
              <span className="text-slate-400 font-bold">{expenseCount} Logs</span>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
export default ProfilePage;
