import React, { useState, useEffect } from 'react';
import { adminService } from '../services/api';
import { Loader, SectionHeader, Alert } from '../components/Common';
import { 
  Users, 
  Trash2, 
  Database, 
  Activity, 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Cpu, 
  ShieldCheck,
  RotateCcw
} from 'lucide-react';

export const AdminPage: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadAdminConsole();
  }, []);

  const loadAdminConsole = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const [systemStats, systemUsers] = await Promise.all([
        adminService.getStats(),
        adminService.getUsers()
      ]);

      setStats(systemStats);
      setUsers(systemUsers);
    } catch (err) {
      console.error(err);
      setError('Access Denied or Database Error. Ensure you are signed in as Admin.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this user profile? All transactions and savings models will be wiped.')) {
      return;
    }
    try {
      setError('');
      setSuccess('');
      await adminService.deleteUser(id);
      setSuccess('User successfully wiped from database.');
      await loadAdminConsole();
    } catch (err) {
      setError('Failed to purge user record.');
    }
  };

  const handleResetDatabase = async () => {
    if (!window.confirm('Wipe system and restore original demo accounts? This is useful for testing.')) {
      return;
    }
    try {
      setError('');
      setSuccess('');
      setIsLoading(true);
      await adminService.resetDatabase();
      setSuccess('System databases reset to default testing state!');
      await loadAdminConsole();
    } catch (err) {
      setError(' Purge failed. DB locked.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loader message="Accessing secure administrative indexes..." />;
  }

  return (
    <div className="space-y-6">
      
      <SectionHeader 
        title="Admin Console" 
        subtitle="Review global system statistics, purge inactive users, and reset demo datasets"
        action={
          <button 
            id="admin-reset-db-btn"
            onClick={handleResetDatabase}
            className="text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white px-4 py-2.5 rounded-xl transition flex items-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4" /> Reset System DB
          </button>
        }
      />

      {error && <Alert type="error" message={error} />}
      {success && <Alert type="success" message={success} />}

      {/* Global aggregates row */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 shadow-xl relative overflow-hidden">
            <div className="absolute top-4 right-4 text-indigo-500/10"><Users className="w-10 h-10" /></div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Global User Directory</span>
            <span className="text-xl font-bold text-slate-200 mt-1 block">{stats.totalUsers} Active Profiles</span>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 shadow-xl relative overflow-hidden">
            <div className="absolute top-4 right-4 text-emerald-500/10"><DollarSign className="w-10 h-10" /></div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Global Managed Income</span>
            <span className="text-xl font-bold text-slate-200 mt-1 block">${stats.globalInflow.toLocaleString()}</span>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 shadow-xl relative overflow-hidden">
            <div className="absolute top-4 right-4 text-rose-500/10"><TrendingDown className="w-10 h-10" /></div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Global Expenditures</span>
            <span className="text-xl font-bold text-slate-200 mt-1 block">${stats.globalExpenditure.toLocaleString()}</span>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 shadow-xl relative overflow-hidden">
            <div className="absolute top-4 right-4 text-cyan-500/10"><Database className="w-10 h-10" /></div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Global Savings Targets</span>
            <span className="text-xl font-bold text-slate-200 mt-1 block">{stats.totalSavingsGoals} Active Goals</span>
          </div>

        </div>
      )}

      {/* System Users directory */}
      <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-3xl p-6 shadow-xl">
        <h3 className="font-bold text-slate-200 text-sm mb-4 uppercase tracking-wider">System User Directory</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-850 text-slate-400 font-semibold">
                <th className="py-2.5 px-4">User Name</th>
                <th className="py-2.5 px-4">Email Credentials</th>
                <th className="py-2.5 px-4">Role Designation</th>
                <th className="py-2.5 px-4">Joined Timestamp</th>
                <th className="py-2.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850/60">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-800/10 transition">
                  <td className="py-3 px-4 font-semibold text-slate-200">{u.name}</td>
                  <td className="py-3 px-4 text-slate-400">{u.email}</td>
                  <td className="py-3 px-4">
                    <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                      u.isAdmin ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {u.isAdmin ? 'Admin' : 'Planner'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="py-3 px-4 text-right">
                    {!u.isAdmin && (
                      <button 
                        onClick={() => handleDeleteUser(u.id)}
                        className="text-rose-500 hover:text-white p-1.5 rounded-lg bg-rose-500/5 hover:bg-rose-500/20 border border-rose-500/10 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
export default AdminPage;
