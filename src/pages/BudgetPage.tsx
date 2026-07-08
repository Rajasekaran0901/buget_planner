import React, { useState, useEffect } from 'react';
import { budgetService, incomeService, expenseService } from '../services/api';
import { Budget, Income, Expense } from '../types';
import { IncomeCard } from '../components/FinanceCards';
import { AddIncomeModal, EditBudgetModal } from '../components/Modals';
import { Loader, SectionHeader, Alert } from '../components/Common';
import { Plus, Wallet, DollarSign, TrendingUp, Calendar, Coins } from 'lucide-react';

export const BudgetPage: React.FC = () => {
  const [budget, setBudget] = useState<Budget | null>(null);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [isBudgetOpen, setIsBudgetOpen] = useState(false);
  const [isIncomeOpen, setIsIncomeOpen] = useState(false);

  useEffect(() => {
    loadBudgetData();
  }, []);

  const loadBudgetData = async () => {
    try {
      setIsLoading(true);
      setError('');
      const [bdg, incs, exps] = await Promise.all([
        budgetService.getBudget(),
        incomeService.getIncomes(),
        expenseService.getExpenses(),
      ]);
      setBudget(bdg);
      setIncomes(incs);
      setExpenses(exps);
    } catch (err: any) {
      console.error(err);
      setError('Could not update active budget fields.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateBudget = async (data: { monthlyIncome: number; budgetLimit: number }) => {
    await budgetService.updateBudget(data);
    await loadBudgetData();
  };

  const handleAddIncome = async (data: { source: string; amount: number; date: string }) => {
    await incomeService.addIncome(data);
    await loadBudgetData();
  };

  if (isLoading) {
    return <Loader message="Compiling budget configurations..." />;
  }

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const limit = budget?.budgetLimit || 0;
  const income = budget?.monthlyIncome || 0;
  const remainingLimit = Math.max(0, limit - totalExpenses);
  const savingsPotential = Math.max(0, income - totalExpenses);

  return (
    <div className="space-y-6">
      
      <SectionHeader 
        title="Budget & Income" 
        subtitle="Configure your income allocations, monitor spending ceilings, and log cash inflows"
        action={
          <div className="flex gap-2">
            <button 
              id="budget-edit-config-btn"
              onClick={() => setIsBudgetOpen(true)}
              className="text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl transition flex items-center gap-1.5"
            >
              <Wallet className="w-4 h-4" /> Configure Limits
            </button>
            <button 
              id="budget-add-income-btn"
              onClick={() => setIsIncomeOpen(true)}
              className="text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Log Inflow
            </button>
          </div>
        }
      />

      {error && <Alert type="error" message={error} />}

      {/* Numerical Stats overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-4 right-4 text-emerald-500/20"><DollarSign className="w-12 h-12" /></div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Target Monthly Income</span>
          <span className="text-2xl font-bold text-slate-200 mt-1 block">${income.toLocaleString()}</span>
          <span className="text-[10px] text-slate-500 mt-2 block">Combined recurring salaries & external inflows</span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-4 right-4 text-indigo-500/20"><Wallet className="w-12 h-12" /></div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Safe Spend Ceiling</span>
          <span className="text-2xl font-bold text-slate-200 mt-1 block">${limit.toLocaleString()}</span>
          <span className="text-[10px] text-slate-500 mt-2 block">Maximum threshold limit before alert triggers</span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-4 right-4 text-cyan-500/20"><Coins className="w-12 h-12" /></div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Calculated Savings Margin</span>
          <span className="text-2xl font-bold text-slate-200 mt-1 block">${savingsPotential.toLocaleString()}</span>
          <span className="text-[10px] text-slate-500 mt-2 block">Net remainder after total monthly expenditures</span>
        </div>

      </div>

      {/* Allocation detail charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Proportional break-downs */}
        <div className="lg:col-span-6 bg-slate-900/60 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          <h3 className="font-bold text-slate-200 text-sm uppercase tracking-wider">Ceiling Allocation Meter</h3>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs text-slate-400 font-medium mb-1">
                <span>Income allocation to fixed expenses</span>
                <span>${(budget?.fixedExpenses || 0).toLocaleString()} (Rent, Bills)</span>
              </div>
              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-500 rounded-full" 
                  style={{ width: `${income > 0 ? Math.min(100, ((budget?.fixedExpenses || 0) / income) * 100) : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-400 font-medium mb-1">
                <span>Income allocation to variable leisure</span>
                <span>${(budget?.variableExpenses || 0).toLocaleString()} (Food, Travel)</span>
              </div>
              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-cyan-400 rounded-full" 
                  style={{ width: `${income > 0 ? Math.min(100, ((budget?.variableExpenses || 0) / income) * 100) : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Income History log */}
        <div className="lg:col-span-6 bg-slate-900/60 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="font-bold text-slate-200 text-sm uppercase tracking-wider">Inflow Log Ledger</h3>

            {incomes.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-2xl">
                No external incomes logged. Use the Log Inflow button above.
              </div>
            ) : (
              <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                {incomes.map(income => (
                  <IncomeCard key={income.id} income={income} />
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Modals */}
      <AddIncomeModal 
        isOpen={isIncomeOpen} 
        onClose={() => setIsIncomeOpen(false)} 
        onSubmit={handleAddIncome} 
      />

      {budget && (
        <EditBudgetModal 
          isOpen={isBudgetOpen} 
          onClose={() => setIsBudgetOpen(false)} 
          onSubmit={handleUpdateBudget} 
          initialIncome={budget.monthlyIncome} 
          initialLimit={budget.budgetLimit} 
        />
      )}

    </div>
  );
};
export default BudgetPage;
