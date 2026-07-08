import axios from 'axios';
import { Budget, Expense, Income, SavingsGoal, AIRecommendation, Notification } from '../types';

const api = axios.create({
  baseURL: '',
});

// Auto-attach JWT token on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('budget_agent_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const budgetService = {
  getBudget: () => api.get<Budget>('/api/budget').then(r => r.data),
  createBudget: (data: { monthlyIncome: number; budgetLimit: number }) => 
    api.post<Budget>('/api/budget', data).then(r => r.data),
  updateBudget: (data: Partial<Budget>) => 
    api.put<Budget>('/api/budget', data).then(r => r.data),
  deleteBudget: () => api.delete('/api/budget').then(r => r.data),
};

export const expenseService = {
  getExpenses: () => api.get<Expense[]>('/api/expense').then(r => r.data),
  addExpense: (data: { title: string; category: string; amount: number; date?: string }) => 
    api.post<Expense>('/api/expense', data).then(r => r.data),
  updateExpense: (id: string, data: Partial<Expense>) => 
    api.put<Expense>(`/api/expense/${id}`, data).then(r => r.data),
  deleteExpense: (id: string) => api.delete(`/api/expense/${id}`).then(r => r.data),
};

export const incomeService = {
  getIncomes: () => api.get<Income[]>('/api/income').then(r => r.data),
  addIncome: (data: { source: string; amount: number; date?: string }) => 
    api.post<Income>('/api/income', data).then(r => r.data),
};

export const goalService = {
  getGoals: () => api.get<SavingsGoal[]>('/api/goal').then(r => r.data),
  addGoal: (data: { goalName: string; targetAmount: number; currentAmount?: number; deadline?: string }) => 
    api.post<SavingsGoal>('/api/goal', data).then(r => r.data),
  updateGoal: (id: string, data: Partial<SavingsGoal>) => 
    api.put<SavingsGoal>(`/api/goal/${id}`, data).then(r => r.data),
  deleteGoal: (id: string) => api.delete(`/api/goal/${id}`).then(r => r.data),
};

export const aiService = {
  generateBudget: (lifestyle: string) => 
    api.post<{ budget: Budget; recommendation: any }>('/api/generate-budget', { lifestyle }).then(r => r.data),
  analyzeExpenses: () => 
    api.post<any>('/api/expense-analysis').then(r => r.data),
  runFinancialHealth: () => 
    api.post<any>('/api/financial-health').then(r => r.data),
  getRecommendations: () => 
    api.get<AIRecommendation[]>('/api/recommendations').then(r => r.data),
  planSavings: (goalId: string) => 
    api.post<any>(`/api/savings-planner/${goalId}`).then(r => r.data),
};

export const reportService = {
  getMonthlyReport: () => api.get<any>('/api/monthly-report').then(r => r.data),
  getAnnualReport: () => api.get<any[]>('/api/annual-report').then(r => r.data),
};

export const notificationService = {
  getNotifications: () => api.get<Notification[]>('/api/notifications').then(r => r.data),
  markAsRead: (id: string) => api.put<Notification>(`/api/notifications/${id}/read`).then(r => r.data),
};

export const adminService = {
  getUsers: () => api.get<any[]>('/api/admin/users').then(r => r.data),
  deleteUser: (id: string) => api.delete(`/api/admin/users/${id}`).then(r => r.data),
  getStats: () => api.get<any>('/api/admin/stats').then(r => r.data),
  resetDatabase: () => api.post('/api/admin/db/reset').then(r => r.data),
};

export default api;
