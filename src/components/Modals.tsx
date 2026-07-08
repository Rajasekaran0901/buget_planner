import React, { useState } from 'react';
import { X, Calendar, DollarSign, Tag, Info } from 'lucide-react';

// 1. Generic Base Modal
interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const BaseModal: React.FC<BaseModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden relative">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <h3 className="font-bold text-slate-100 text-base">{title}</h3>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

// 2. Edit Budget Modal
interface EditBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { monthlyIncome: number; budgetLimit: number }) => Promise<void>;
  initialIncome: number;
  initialLimit: number;
}

export const EditBudgetModal: React.FC<EditBudgetModalProps> = ({ 
  isOpen, onClose, onSubmit, initialIncome, initialLimit 
}) => {
  const [income, setIncome] = useState(initialIncome);
  const [limit, setLimit] = useState(initialLimit);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (income < 0 || limit < 0) {
      setError('Values cannot be negative.');
      return;
    }
    setError('');
    setIsSubmitting(true);
    try {
      await onSubmit({ monthlyIncome: income, budgetLimit: limit });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to update budget.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Configure Budget">
      <form onSubmit={handleFormSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Monthly Income ($)
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"><DollarSign className="w-4 h-4" /></span>
            <input 
              type="number" 
              required
              min="0"
              value={income}
              onChange={(e) => setIncome(Number(e.target.value))}
              placeholder="e.g. 5000"
              className="w-full bg-slate-800/60 border border-slate-700/80 rounded-2xl py-3 pl-10 pr-4 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Budget Spending Limit ($)
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"><DollarSign className="w-4 h-4" /></span>
            <input 
              type="number" 
              required
              min="0"
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              placeholder="e.g. 4000"
              className="w-full bg-slate-800/60 border border-slate-700/80 rounded-2xl py-3 pl-10 pr-4 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>
          <p className="text-[10px] text-slate-500 mt-1.5 flex items-center gap-1">
            <Info className="w-3 h-3" />
            Set a maximum monthly target spend limit. We'll warn you if you cross this threshold.
          </p>
        </div>

        <button 
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-2xl py-3 text-sm shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition disabled:opacity-50 mt-2"
        >
          {isSubmitting ? 'Saving Configuration...' : 'Save Configuration'}
        </button>
      </form>
    </BaseModal>
  );
};

// 3. Add Expense Modal
interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; category: string; amount: number; date: string }) => Promise<void>;
}

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Food');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const categories = [
    'Food', 'Transport', 'Shopping', 'Healthcare', 'Education', 'Entertainment', 'Rent', 'EMI', 'Utilities', 'Travel', 'Investment', 'Others'
  ];

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount) {
      setError('Please complete all fields.');
      return;
    }
    setError('');
    setIsSubmitting(true);
    try {
      await onSubmit({ title, category, amount: Number(amount), date });
      // Reset form
      setTitle('');
      setCategory('Food');
      setAmount('');
      setDate(new Date().toISOString().split('T')[0]);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to submit expense.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Log New Expense">
      <form onSubmit={handleFormSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Expense Name
          </label>
          <input 
            type="text" 
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Starbucks Coffee"
            className="w-full bg-slate-800/60 border border-slate-700/80 rounded-2xl py-3 px-4 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Category
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"><Tag className="w-4 h-4" /></span>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-800/60 border border-slate-700/80 rounded-2xl py-3 pl-10 pr-4 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition appearance-none"
              >
                {categories.map(c => <option key={c} value={c} className="bg-slate-900">{c}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Amount ($)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"><DollarSign className="w-4 h-4" /></span>
              <input 
                type="number" 
                required
                min="0.01"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-slate-800/60 border border-slate-700/80 rounded-2xl py-3 pl-10 pr-4 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Date
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"><Calendar className="w-4 h-4" /></span>
            <input 
              type="date" 
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-slate-800/60 border border-slate-700/80 rounded-2xl py-3 pl-10 pr-4 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>
        </div>

        <button 
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-2xl py-3 text-sm shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition disabled:opacity-50 mt-2"
        >
          {isSubmitting ? 'Logging Expense...' : 'Log Expense'}
        </button>
      </form>
    </BaseModal>
  );
};

// 4. Add Income Modal
interface AddIncomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { source: string; amount: number; date: string }) => Promise<void>;
}

export const AddIncomeModal: React.FC<AddIncomeModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [source, setSource] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!source || !amount) {
      setError('Please complete all fields.');
      return;
    }
    setError('');
    setIsSubmitting(true);
    try {
      await onSubmit({ source, amount: Number(amount), date });
      setSource('');
      setAmount('');
      setDate(new Date().toISOString().split('T')[0]);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to submit income.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Log New Income">
      <form onSubmit={handleFormSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Income Source
          </label>
          <input 
            type="text" 
            required
            value={source}
            onChange={(e) => setSource(e.target.value)}
            placeholder="e.g. Salary, Freelance Work, Investments"
            className="w-full bg-slate-800/60 border border-slate-700/80 rounded-2xl py-3 px-4 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Amount ($)
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"><DollarSign className="w-4 h-4" /></span>
            <input 
              type="number" 
              required
              min="0.01"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full bg-slate-800/60 border border-slate-700/80 rounded-2xl py-3 pl-10 pr-4 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Date Received
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"><Calendar className="w-4 h-4" /></span>
            <input 
              type="date" 
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-slate-800/60 border border-slate-700/80 rounded-2xl py-3 pl-10 pr-4 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>
        </div>

        <button 
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-2xl py-3 text-sm shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition disabled:opacity-50 mt-2"
        >
          {isSubmitting ? 'Logging Income...' : 'Log Income'}
        </button>
      </form>
    </BaseModal>
  );
};

// 5. Add Savings Goal Modal
interface AddGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { goalName: string; targetAmount: number; currentAmount: number; deadline: string }) => Promise<void>;
}

export const AddGoalModal: React.FC<AddGoalModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [goalName, setGoalName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [deadline, setDeadline] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalName || !targetAmount || !deadline) {
      setError('Please fill in all required fields.');
      return;
    }
    setError('');
    setIsSubmitting(true);
    try {
      await onSubmit({ 
        goalName, 
        targetAmount: Number(targetAmount), 
        currentAmount: Number(currentAmount) || 0, 
        deadline 
      });
      setGoalName('');
      setTargetAmount('');
      setCurrentAmount('');
      setDeadline('');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to submit savings goal.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Establish Savings Goal">
      <form onSubmit={handleFormSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Goal Name
          </label>
          <input 
            type="text" 
            required
            value={goalName}
            onChange={(e) => setGoalName(e.target.value)}
            placeholder="e.g. New Electric Car, Europe Vacation"
            className="w-full bg-slate-800/60 border border-slate-700/80 rounded-2xl py-3 px-4 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Target Amount ($)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"><DollarSign className="w-4 h-4" /></span>
              <input 
                type="number" 
                required
                min="1"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                placeholder="10000"
                className="w-full bg-slate-800/60 border border-slate-700/80 rounded-2xl py-3 pl-10 pr-4 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Initial Savings ($)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"><DollarSign className="w-4 h-4" /></span>
              <input 
                type="number" 
                min="0"
                value={currentAmount}
                onChange={(e) => setCurrentAmount(e.target.value)}
                placeholder="0"
                className="w-full bg-slate-800/60 border border-slate-700/80 rounded-2xl py-3 pl-10 pr-4 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Target Completion Deadline
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"><Calendar className="w-4 h-4" /></span>
            <input 
              type="date" 
              required
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full bg-slate-800/60 border border-slate-700/80 rounded-2xl py-3 pl-10 pr-4 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>
        </div>

        <button 
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-2xl py-3 text-sm shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition disabled:opacity-50 mt-2"
        >
          {isSubmitting ? 'Establishing Goal...' : 'Establish Savings Goal'}
        </button>
      </form>
    </BaseModal>
  );
};
