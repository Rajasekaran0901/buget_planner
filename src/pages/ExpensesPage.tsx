import React, { useState, useEffect } from 'react';
import { expenseService } from '../services/api';
import { Expense } from '../types';
import { ExpenseCard } from '../components/FinanceCards';
import { AddExpenseModal } from '../components/Modals';
import { Loader, SectionHeader, Alert } from '../components/Common';
import { Plus, Search, Filter, TrendingDown, ArrowDownLeft } from 'lucide-react';

export const ExpensesPage: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isExpenseOpen, setIsExpenseOpen] = useState(false);

  const categories = [
    'All', 'Food', 'Transport', 'Shopping', 'Healthcare', 'Education', 'Entertainment', 'Rent', 'EMI', 'Utilities', 'Travel', 'Investment', 'Others'
  ];

  useEffect(() => {
    loadExpenses();
  }, []);

  useEffect(() => {
    let result = expenses;

    if (searchQuery) {
      result = result.filter(e => e.title.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    if (selectedCategory !== 'All') {
      result = result.filter(e => e.category === selectedCategory);
    }

    setFilteredExpenses(result);
  }, [expenses, searchQuery, selectedCategory]);

  const loadExpenses = async () => {
    try {
      setIsLoading(true);
      setError('');
      const data = await expenseService.getExpenses();
      setExpenses(data);
    } catch (err) {
      console.error(err);
      setError('Could not fetch transaction log ledger.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddExpense = async (data: { title: string; category: string; amount: number; date: string }) => {
    await expenseService.addExpense(data);
    await loadExpenses();
  };

  const handleDeleteExpense = async (id: string) => {
    try {
      await expenseService.deleteExpense(id);
      await loadExpenses();
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) {
    return <Loader message="Indexing expense transaction ledgers..." />;
  }

  const totalSpent = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="space-y-6">
      
      <SectionHeader 
        title="Expense Ledger" 
        subtitle="Review, filter, and audit your logged transaction items"
        action={
          <button 
            id="exp-add-btn"
            onClick={() => setIsExpenseOpen(true)}
            className="text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white px-4 py-2.5 rounded-xl transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Log Expense
          </button>
        }
      />

      {error && <Alert type="error" message={error} />}

      {/* Stats row */}
      <div className="p-5 bg-slate-900/40 border border-slate-800 rounded-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-xl">
            <TrendingDown className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Aggregated Ledger Sum</span>
            <span className="text-xl font-bold text-slate-200 mt-0.5 block">${totalSpent.toLocaleString()}</span>
          </div>
        </div>
        <div className="text-right text-xs text-slate-400">
          Showing <strong>{filteredExpenses.length}</strong> of {expenses.length} logs
        </div>
      </div>

      {/* Filter controls */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        
        {/* Search Input */}
        <div className="md:col-span-7 relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"><Search className="w-4 h-4" /></span>
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search items by keyword..."
            className="w-full bg-slate-900/60 border border-slate-850 rounded-2xl py-3 pl-10 pr-4 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 transition"
          />
        </div>

        {/* Category Dropdown */}
        <div className="md:col-span-5 relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"><Filter className="w-4 h-4" /></span>
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-slate-900/60 border border-slate-850 rounded-2xl py-3 pl-10 pr-4 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 transition appearance-none"
          >
            {categories.map(c => <option key={c} value={c} className="bg-slate-950">{c} Category</option>)}
          </select>
        </div>

      </div>

      {/* Transaction List */}
      <div className="space-y-3">
        {filteredExpenses.length === 0 ? (
          <div className="p-16 text-center text-slate-500 text-xs border border-dashed border-slate-850 rounded-3xl">
            No expenditures found matching search criteria.
          </div>
        ) : (
          filteredExpenses.slice().reverse().map(expense => (
            <ExpenseCard 
              key={expense.id} 
              expense={expense} 
              onDelete={handleDeleteExpense} 
            />
          ))
        )}
      </div>

      {/* Log Modal */}
      <AddExpenseModal 
        isOpen={isExpenseOpen} 
        onClose={() => setIsExpenseOpen(false)} 
        onSubmit={handleAddExpense} 
      />

    </div>
  );
};
export default ExpensesPage;
