import React from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

// 1. Income vs Expense Seasonal Chart (Area Chart)
interface ComparisonChartProps {
  data: Array<{
    month: string;
    income: number;
    expenses: number;
  }>;
}

export const ComparisonChart: React.FC<ComparisonChartProps> = ({ data }) => {
  return (
    <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-3xl p-5 shadow-xl">
      <h3 className="font-bold text-slate-200 text-sm mb-4 uppercase tracking-wider">Seasonal Flow: Income vs Expenditures</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
            <XAxis dataKey="month" stroke="#64748B" fontSize={11} tickLine={false} />
            <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px' }}
              labelStyle={{ fontWeight: 'bold', color: '#94A3B8' }}
            />
            <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '11px', color: '#94A3B8' }} />
            <Area type="monotone" name="Income" dataKey="income" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorIncome)" />
            <Area type="monotone" name="Expenses" dataKey="expenses" stroke="#EF4444" strokeWidth={2} fillOpacity={1} fill="url(#colorExpenses)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// 2. Spending Breakdown Pie Chart
interface CategoryPieChartProps {
  data: Array<{
    name: string;
    value: number;
    percentage: number;
  }>;
}

const COLORS = ['#4F46E5', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#8B5CF6', '#F43F5E', '#14B8A6'];

export const CategoryPieChart: React.FC<CategoryPieChartProps> = ({ data }) => {
  if (data.length === 0) {
    return (
      <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col justify-center items-center h-80">
        <h3 className="font-bold text-slate-200 text-sm mb-4 uppercase tracking-wider self-start">Expense Distribution</h3>
        <p className="text-slate-500 text-xs">No expenditures logged to generate a visual graph.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col justify-between">
      <h3 className="font-bold text-slate-200 text-sm mb-4 uppercase tracking-wider">Expense Distribution</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        <div className="h-48 flex justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={70}
                paddingAngle={4}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px' }}
                wrapperStyle={{ fontSize: '11px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-1.5 overflow-y-auto max-h-48 pr-1">
          {data.map((item, index) => (
            <div key={item.name} className="flex items-center justify-between text-xs font-medium">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className="text-slate-300 truncate max-w-[100px]">{item.name}</span>
              </div>
              <div className="text-slate-400">
                ${item.value.toLocaleString()} <span className="text-[10px] text-slate-500">({item.percentage}%)</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// 3. Goal Progression Bar
interface GoalProgressBarProps {
  current: number;
  target: number;
  label: string;
}

export const GoalProgressBar: React.FC<GoalProgressBarProps> = ({ current, target, label }) => {
  const percentage = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;
  return (
    <div className="space-y-1.5 w-full">
      <div className="flex justify-between text-xs text-slate-400 font-semibold">
        <span>{label}</span>
        <span>${current.toLocaleString()} / ${target.toLocaleString()} ({percentage}%)</span>
      </div>
      <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
