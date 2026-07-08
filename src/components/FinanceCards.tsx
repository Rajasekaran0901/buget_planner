import React from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Trash2, 
  Sparkles, 
  Activity, 
  Home, 
  Lightbulb, 
  GraduationCap, 
  Film, 
  CreditCard, 
  ShoppingBag, 
  Plane, 
  CircleDollarSign, 
  Utensils, 
  Plus, 
  User as UserIcon,
  ShieldAlert,
  AlertTriangle,
  ChevronRight
} from 'lucide-react';
import { Budget, Expense, Income, SavingsGoal, User } from '../types';

export const categoryIcons: { [key: string]: any } = {
  Food: Utensils,
  Transport: Plane,
  Shopping: ShoppingBag,
  Healthcare: Activity,
  Education: GraduationCap,
  Entertainment: Film,
  Rent: Home,
  EMI: CreditCard,
  Utilities: Lightbulb,
  Travel: Plane,
  Investment: TrendingUp,
  Others: CircleDollarSign
};

export const categoryColors: { [key: string]: string } = {
  Food: 'from-amber-500/20 to-orange-500/10 text-orange-400 border-orange-500/20',
  Transport: 'from-cyan-500/20 to-blue-500/10 text-cyan-400 border-cyan-500/20',
  Shopping: 'from-pink-500/20 to-rose-500/10 text-pink-400 border-pink-500/20',
  Healthcare: 'from-emerald-500/20 to-teal-500/10 text-emerald-400 border-emerald-500/20',
  Education: 'from-indigo-500/20 to-blue-500/10 text-indigo-400 border-indigo-500/20',
  Entertainment: 'from-purple-500/20 to-fuchsia-500/10 text-purple-400 border-purple-500/20',
  Rent: 'from-rose-500/20 to-orange-500/10 text-rose-400 border-rose-500/20',
  EMI: 'from-red-500/20 to-orange-500/10 text-red-400 border-red-500/20',
  Utilities: 'from-yellow-500/20 to-amber-500/10 text-yellow-400 border-yellow-500/20',
  Travel: 'from-teal-500/20 to-emerald-500/10 text-teal-400 border-teal-500/20',
  Investment: 'from-emerald-500/20 to-cyan-500/10 text-emerald-300 border-emerald-500/20',
  Others: 'from-slate-500/20 to-slate-600/10 text-slate-300 border-slate-700'
};

// 1. Budget Summary Card
interface BudgetCardProps {
  budget: Budget | null;
  totalExpenses: number;
  onEditClick?: () => void;
}

export const BudgetCard: React.FC<BudgetCardProps> = ({ budget, totalExpenses, onEditClick }) => {
  if (!budget) return null;
  
  const income = budget.monthlyIncome || 0;
  const limit = budget.budgetLimit || 0;
  const remaining = Math.max(0, income - totalExpenses);
  const utilizationRate = limit > 0 ? Math.round((totalExpenses / limit) * 100) : 0;
  const isOverspent = limit > 0 && totalExpenses > limit;

  return (
    <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden group hover:border-slate-700 transition duration-300">
      {/* Light glow effects */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-600/10 rounded-full blur-3xl group-hover:bg-indigo-600/15 transition" />
      
      <div className="flex justify-between items-start mb-6">
        <div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Monthly Income</span>
          <h2 className="text-3xl font-bold text-slate-100 mt-1">${income.toLocaleString()}</h2>
        </div>
        <button 
          onClick={onEditClick}
          className="text-xs bg-indigo-600/10 text-indigo-400 hover:bg-indigo-600 hover:text-white px-3 py-1.5 rounded-xl transition font-medium"
        >
          Adjust Budget
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-slate-800/40 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-2 text-rose-400 mb-1">
            <TrendingDown className="w-4 h-4" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Total Spent</span>
          </div>
          <div className="text-lg font-bold text-slate-200">${totalExpenses.toLocaleString()}</div>
        </div>

        <div className="p-4 bg-slate-800/40 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-2 text-emerald-400 mb-1">
            <TrendingUp className="w-4 h-4" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Remaining</span>
          </div>
          <div className="text-lg font-bold text-slate-200">${remaining.toLocaleString()}</div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs font-medium text-slate-400">
          <span>Budget Limit Utilization ({utilizationRate}%)</span>
          <span className={isOverspent ? 'text-red-400' : 'text-indigo-400'}>
            ${totalExpenses.toLocaleString()} / ${limit.toLocaleString()}
          </span>
        </div>
        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${
              isOverspent 
                ? 'bg-gradient-to-r from-red-600 to-rose-500' 
                : utilizationRate > 80 
                ? 'bg-gradient-to-r from-amber-500 to-orange-400' 
                : 'bg-gradient-to-r from-indigo-500 to-cyan-400'
            }`}
            style={{ width: `${Math.min(100, utilizationRate)}%` }}
          />
        </div>
        {isOverspent && (
          <div className="flex items-center gap-1.5 text-[11px] text-red-400 font-medium pt-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Warning: You have exceeded your threshold limit!</span>
          </div>
        )}
      </div>
    </div>
  );
};

// 2. Expense Row/Card
interface ExpenseCardProps {
  expense: Expense;
  onDelete: (id: string) => void;
}

export const ExpenseCard: React.FC<ExpenseCardProps> = ({ expense, onDelete }) => {
  const Icon = categoryIcons[expense.category] || CircleDollarSign;
  const theme = categoryColors[expense.category] || categoryColors.Others;

  return (
    <div className="flex items-center justify-between p-4 bg-slate-900/40 border border-slate-800 rounded-2xl hover:border-slate-700 transition group">
      <div className="flex items-center gap-3">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${theme} border`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-slate-100">{expense.title}</h4>
          <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
            <span className="font-medium">{expense.category}</span>
            <span>•</span>
            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {expense.date}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm font-bold text-rose-400">-${expense.amount.toLocaleString()}</span>
        <button 
          onClick={() => onDelete(expense.id)}
          className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// 3. Income Row/Card
interface IncomeCardProps {
  income: Income;
}

export const IncomeCard: React.FC<IncomeCardProps> = ({ income }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-slate-900/40 border border-slate-800 rounded-2xl hover:border-slate-700 transition">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
          <DollarSign className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-slate-100">{income.source}</h4>
          <span className="flex items-center gap-1 text-xs text-slate-400 mt-0.5"><Calendar className="w-3 h-3" /> {income.date}</span>
        </div>
      </div>
      <span className="text-sm font-bold text-emerald-400">+${income.amount.toLocaleString()}</span>
    </div>
  );
};

// 4. Savings Goal Card
interface SavingsCardProps {
  goal: SavingsGoal;
  onUpdateAmount?: (id: string, current: number) => void;
  onDelete?: (id: string) => void;
}

export const SavingsCard: React.FC<SavingsCardProps> = ({ goal, onUpdateAmount, onDelete }) => {
  const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);
  const progress = Math.round((goal.currentAmount / goal.targetAmount) * 100);
  const isCompleted = goal.currentAmount >= goal.targetAmount;

  return (
    <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-3xl p-5 shadow-xl relative overflow-hidden">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-slate-100 text-base">{goal.goalName}</h3>
          <p className="text-xs text-slate-400 mt-0.5">Target: ${goal.targetAmount.toLocaleString()} • Deadline: {goal.deadline}</p>
        </div>
        {onDelete && (
          <button 
            onClick={() => onDelete(goal.id)}
            className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg bg-slate-800/50 hover:bg-rose-500/10 transition"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-xs text-slate-300 font-semibold mb-1">
          <span>{progress}% Achieved</span>
          <span>${goal.currentAmount.toLocaleString()} / ${goal.targetAmount.toLocaleString()}</span>
        </div>
        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full bg-gradient-to-r ${isCompleted ? 'from-emerald-500 to-teal-400' : 'from-indigo-500 to-cyan-400'}`}
            style={{ width: `${Math.min(100, progress)}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800/60">
        <div className="text-xs text-slate-400">
          {isCompleted ? (
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Goal Achieved!
            </span>
          ) : (
            <span>Remaining: <strong className="text-slate-200">${remaining.toLocaleString()}</strong></span>
          )}
        </div>
        {onUpdateAmount && !isCompleted && (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onUpdateAmount(goal.id, goal.currentAmount + 100)}
              className="text-[10px] bg-indigo-600/20 text-indigo-300 border border-indigo-500/20 px-2 py-1 rounded-lg hover:bg-indigo-600 hover:text-white transition font-semibold"
            >
              Add $100
            </button>
            <button
              onClick={() => onUpdateAmount(goal.id, goal.currentAmount + 500)}
              className="text-[10px] bg-cyan-600/20 text-cyan-300 border border-cyan-500/20 px-2 py-1 rounded-lg hover:bg-cyan-600 hover:text-white transition font-semibold"
            >
              Add $500
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// 5. User Profile Card
interface ProfileCardProps {
  user: User | null;
  budgetCount: number;
  goalCount: number;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ user, budgetCount, goalCount }) => {
  if (!user) return null;

  return (
    <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-3xl p-6 shadow-xl text-center relative overflow-hidden">
      <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center font-bold text-white text-3xl mx-auto mb-4 shadow-lg shadow-indigo-500/10">
        {user.name[0].toUpperCase()}
      </div>
      <h3 className="font-bold text-slate-100 text-lg">{user.name}</h3>
      <p className="text-xs text-slate-400 mt-1">{user.email}</p>
      
      <div className="mt-2 inline-flex items-center gap-1 bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
        {user.isAdmin ? 'Administrator' : 'Premium Account'}
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-800/60">
        <div className="text-center">
          <span className="text-xs text-slate-500 block">Budgets Configured</span>
          <span className="text-lg font-bold text-slate-200 mt-0.5">{budgetCount}</span>
        </div>
        <div className="text-center">
          <span className="text-xs text-slate-500 block">Savings Goals</span>
          <span className="text-lg font-bold text-slate-200 mt-0.5">{goalCount}</span>
        </div>
      </div>
    </div>
  );
};
