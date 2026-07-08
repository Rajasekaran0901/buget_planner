import React, { useState, useEffect } from 'react';
import { 
  budgetService, 
  expenseService, 
  incomeService, 
  goalService, 
  aiService 
} from '../services/api';
import { Budget, Expense, Income, SavingsGoal, AIRecommendation } from '../types';
import { BudgetCard, ExpenseCard, categoryColors, categoryIcons } from '../components/FinanceCards';
import { CategoryPieChart, GoalProgressBar } from '../components/Charts';
import { AddExpenseModal, AddIncomeModal, EditBudgetModal } from '../components/Modals';
import { Loader, SectionHeader, Alert } from '../components/Common';
import { 
  Plus, 
  DollarSign, 
  TrendingDown, 
  TrendingUp, 
  Target, 
  Cpu, 
  Sparkles,
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const [budget, setBudget] = useState<Budget | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Modals state
  const [isExpenseOpen, setIsExpenseOpen] = useState(false);
  const [isIncomeOpen, setIsIncomeOpen] = useState(false);
  const [isBudgetOpen, setIsBudgetOpen] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const [bdg, exps, incs, gls, recs] = await Promise.all([
        budgetService.getBudget(),
        expenseService.getExpenses(),
        incomeService.getIncomes(),
        goalService.getGoals(),
        aiService.getRecommendations()
      ]);

      setBudget(bdg);
      setExpenses(exps);
      setIncomes(incs);
      setGoals(gls);
      setRecommendations(recs);
    } catch (err: any) {
      console.error('Failed to load dashboard:', err);
      setError('Could not update stats. Please check network connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddExpense = async (data: { title: string; category: string; amount: number; date: string }) => {
    await expenseService.addExpense(data);
    await loadDashboardData();
  };

  const handleAddIncome = async (data: { source: string; amount: number; date: string }) => {
    await incomeService.addIncome(data);
    await loadDashboardData();
  };

  const handleUpdateBudget = async (data: { monthlyIncome: number; budgetLimit: number }) => {
    await budgetService.updateBudget(data);
    await loadDashboardData();
  };

  const handleDeleteExpense = async (id: string) => {
    try {
      await expenseService.deleteExpense(id);
      await loadDashboardData();
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) {
    return <Loader message="Loading financial profiles..." />;
  }

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalIncome = incomes.reduce((sum, i) => sum + i.amount, 0);
  const finalIncome = budget?.monthlyIncome || totalIncome;
  const remainingBudget = Math.max(0, finalIncome - totalSpent);

  // Group categories for pie chart
  const categoriesMap: { [key: string]: number } = {};
  expenses.forEach(e => {
    categoriesMap[e.category] = (categoriesMap[e.category] || 0) + e.amount;
  });
  const pieData = Object.entries(categoriesMap).map(([name, value]) => ({
    name,
    value,
    percentage: totalSpent > 0 ? Math.round((value / totalSpent) * 100) : 0
  }));

  // Latest recommendation
  const latestRec = recommendations.length > 0 ? recommendations[recommendations.length - 1] : null;

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">Financial Hub</h1>
          <p className="text-xs text-slate-400 mt-1">Real-time statistics, active budgets, and smart advisories</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button 
            id="dash-add-expense-btn"
            onClick={() => setIsExpenseOpen(true)}
            className="text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white px-4 py-2.5 rounded-xl shadow-lg shadow-rose-600/10 transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Log Expense
          </button>
          <button 
            id="dash-add-income-btn"
            onClick={() => setIsIncomeOpen(true)}
            className="text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-600/10 transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add Income
          </button>
        </div>
      </div>

      {error && <Alert type="error" message={error} />}

      {/* Primary Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Budget Card & Goals block */}
        <div className="lg:col-span-7 space-y-6">
          <BudgetCard 
            budget={budget} 
            totalExpenses={totalSpent} 
            onEditClick={() => setIsBudgetOpen(true)}
          />

          {/* Savings Goals overview */}
          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-slate-200 text-sm uppercase tracking-wider">Active Savings Goals</h3>
              <Link id="view-savings-link" to="/savings" className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-0.5">
                Manage Goals <ChevronRight className="w-4.5 h-4.5" />
              </Link>
            </div>

            {goals.length === 0 ? (
              <div className="p-6 text-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-2xl">
                No savings goals established yet. Start planning for emergency cushions.
              </div>
            ) : (
              <div className="space-y-4">
                {goals.slice(0, 2).map((goal) => (
                  <div key={goal.id} className="p-4 bg-slate-800/20 border border-slate-800 rounded-2xl space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-slate-200">{goal.goalName}</span>
                      <span className="text-[10px] text-slate-400">Target Deadline: {goal.deadline}</span>
                    </div>
                    <GoalProgressBar 
                      current={goal.currentAmount} 
                      target={goal.targetAmount} 
                      label=""
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* AI Insight banner & Pie chart block */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Pie Chart of Expense Distribution */}
          <CategoryPieChart data={pieData} />

          {/* AI Advisor Panel */}
          <div className="bg-gradient-to-br from-indigo-950/40 via-slate-900/60 to-slate-900/60 border border-indigo-900/20 rounded-3xl p-6 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 rounded-full blur-2xl" />
            
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider mb-3">
              <Cpu className="w-4.5 h-4.5 text-indigo-400 animate-pulse" />
              <span>AI Advisor Advisory</span>
            </div>

            {latestRec ? (
              <div className="space-y-4">
                <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                  {latestRec.recommendation.replace(/[*#]/g, '')}
                </p>
                <Link 
                  id="go-recommendations-btn"
                  to="/ai-recommendations" 
                  className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
                >
                  View Full Recommendations <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-slate-400 leading-relaxed">
                  Generate personal budget models or savings plans using our Google Gemini compiler. Start analyzing your logs.
                </p>
                <Link 
                  id="dash-generate-budget-link"
                  to="/ai-recommendations" 
                  className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
                >
                  Generate AI Analysis <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Secondary Ledger Section */}
      <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="font-bold text-slate-200 text-sm uppercase tracking-wider">Recent Expense Ledger</h3>
            <p className="text-[10px] text-slate-500 mt-0.5">Your most recent financial expenditures</p>
          </div>
          <Link id="view-expenses-link" to="/expenses" className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-0.5">
            View Ledger <ChevronRight className="w-4.5 h-4.5" />
          </Link>
        </div>

        {expenses.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-2xl">
            No expenses logged yet. Use the Log Expense button above.
          </div>
        ) : (
          <div className="space-y-3">
            {expenses.slice(-4).reverse().map((expense) => (
              <ExpenseCard 
                key={expense.id} 
                expense={expense} 
                onDelete={handleDeleteExpense} 
              />
            ))}
          </div>
        )}
      </div>

      {/* Dialog Modals */}
      <AddExpenseModal 
        isOpen={isExpenseOpen} 
        onClose={() => setIsExpenseOpen(false)} 
        onSubmit={handleAddExpense} 
      />

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
export default Dashboard;
