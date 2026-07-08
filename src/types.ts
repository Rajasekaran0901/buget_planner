export interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

export interface Budget {
  id: string;
  userId: string;
  monthlyIncome: number;
  fixedExpenses: number;
  variableExpenses: number;
  budgetLimit: number;
  recommendedBudget: number;
  remainingAmount: number;
  createdAt: string;
}

export interface Expense {
  id: string;
  userId: string;
  title: string;
  category: string;
  amount: number;
  date: string;
}

export interface Income {
  id: string;
  userId: string;
  source: string;
  amount: number;
  date: string;
}

export interface SavingsGoal {
  id: string;
  userId: string;
  goalName: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  createdAt: string;
}

export interface AIRecommendation {
  id: string;
  userId: string;
  recommendation: string;
  priority: 'High' | 'Medium' | 'Low';
  type: 'budget' | 'expense' | 'savings' | 'health';
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  type: 'budget_exceeded' | 'bill_reminder' | 'savings_reminder' | 'goal_completed' | 'report_ready';
  read: boolean;
  createdAt: string;
}
