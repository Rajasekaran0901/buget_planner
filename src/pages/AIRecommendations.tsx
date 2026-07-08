import React, { useState, useEffect } from 'react';
import { aiService, budgetService } from '../services/api';
import { AIRecommendation, Budget } from '../types';
import { Loader, SectionHeader, Alert } from '../components/Common';
import { 
  Cpu, 
  Sparkles, 
  Heart, 
  ShieldAlert, 
  Compass, 
  Plus, 
  Trash2, 
  ArrowRight,
  TrendingUp,
  AlertCircle,
  HelpCircle,
  UserCheck
} from 'lucide-react';

// Custom lightweight Markdown-to-HTML formatter to ensure absolute compile-safety
const renderCustomMarkdown = (text: string) => {
  const lines = text.split('\n');
  return lines.map((line, idx) => {
    let cleanLine = line.trim();
    
    // Header 3
    if (cleanLine.startsWith('###')) {
      return (
        <h3 key={idx} className="text-sm font-bold text-slate-100 uppercase tracking-wider mt-4 mb-2 border-b border-slate-800 pb-1">
          {cleanLine.replace('###', '').trim()}
        </h3>
      );
    }
    // Header 2
    if (cleanLine.startsWith('##')) {
      return (
        <h2 key={idx} className="text-base font-black text-indigo-400 mt-5 mb-2.5">
          {cleanLine.replace('##', '').trim()}
        </h2>
      );
    }
    // Bullet lists
    if (cleanLine.startsWith('-') || cleanLine.startsWith('*')) {
      const bulletText = cleanLine.replace(/^[-*]\s*/, '');
      // Parse strong/bold markers inside bullet
      return (
        <li key={idx} className="text-xs text-slate-300 leading-relaxed ml-4 list-disc mt-1.5">
          {parseBoldText(bulletText)}
        </li>
      );
    }
    // Number lists
    if (/^\d+\.\s*/.test(cleanLine)) {
      const numText = cleanLine.replace(/^\d+\.\s*/, '');
      return (
        <li key={idx} className="text-xs text-slate-300 leading-relaxed ml-4 list-decimal mt-1.5">
          {parseBoldText(numText)}
        </li>
      );
    }
    // Paragraph or empty lines
    if (cleanLine === '') {
      return <div key={idx} className="h-2" />;
    }

    return (
      <p key={idx} className="text-xs text-slate-300 leading-relaxed mt-1">
        {parseBoldText(cleanLine)}
      </p>
    );
  });
};

const parseBoldText = (text: string) => {
  const parts = text.split('**');
  return parts.map((part, i) => {
    // Every odd index is a bold block
    if (i % 2 === 1) {
      return <strong key={i} className="font-bold text-indigo-300">{part}</strong>;
    }
    return part;
  });
};

export const AIRecommendations: React.FC = () => {
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [budget, setBudget] = useState<Budget | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isAiRunning, setIsAiRunning] = useState(false);
  const [aiType, setAiType] = useState('');
  
  const [lifestyle, setLifestyle] = useState('Balanced');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    try {
      setIsLoading(true);
      setError('');
      const [recs, bdg] = await Promise.all([
        aiService.getRecommendations(),
        budgetService.getBudget()
      ]);
      setRecommendations(recs);
      setBudget(bdg);
    } catch (err) {
      console.error(err);
      setError('Could not update recommendations logs.');
    } finally {
      setIsLoading(false);
    }
  };

  const runAIOptimizer = async (type: 'budget' | 'leak' | 'audit') => {
    try {
      setError('');
      setSuccess('');
      setIsAiRunning(true);
      setAiType(type);

      if (type === 'budget') {
        if (!budget || budget.monthlyIncome <= 0) {
          setError('A monthly income is required to model allocations. Please adjust budget details first.');
          setIsAiRunning(false);
          return;
        }
        await aiService.generateBudget(lifestyle);
        setSuccess(`Gemini optimized model allocations for a "${lifestyle}" lifestyle successfully!`);
      } else if (type === 'leak') {
        await aiService.analyzeExpenses();
        setSuccess('Expense Leakage Audit compiled successfully! Action items loaded.');
      } else if (type === 'audit') {
        await aiService.runFinancialHealth();
        setSuccess('Personal Financial Health Audit complete! Risk dashboard compiled.');
      }

      await loadRecommendations();
    } catch (err: any) {
      console.error(err);
      setError('AI request timed out or was suspended by the engine.');
    } finally {
      setIsAiRunning(false);
      setAiType('');
    }
  };

  if (isLoading) {
    return <Loader message="Accessing recommendations data caches..." />;
  }

  return (
    <div className="space-y-6">
      
      <SectionHeader 
        title="AI Financial Intelligence" 
        subtitle="Deploy Google Gemini LLM algorithms to audit expenses, plan budgets, and run risk scores"
      />

      {error && <Alert type="error" message={error} />}
      {success && <Alert type="success" message={success} />}

      {/* AI Command Central */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Card 1: Budget modeller */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-9 h-9 bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 rounded-xl flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-200 text-sm">Model Allocations</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Generate optimal allocations across Food, Rent, and Investments using the 50/30/20 standard fitted to your lifestyle choice.
            </p>

            <div className="pt-2">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Lifestyle Preference</label>
              <select 
                value={lifestyle}
                onChange={(e) => setLifestyle(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700/60 rounded-xl py-2 px-3 text-xs text-slate-200 focus:outline-none"
              >
                <option value="Frugal">Frugal (Maximize Savings)</option>
                <option value="Balanced">Balanced (Balanced 50/30/20)</option>
                <option value="Luxury">Aspiring (Higher leisure cap)</option>
              </select>
            </div>
          </div>

          <button
            onClick={() => runAIOptimizer('budget')}
            disabled={isAiRunning}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/10 transition disabled:opacity-50"
          >
            {isAiRunning && aiType === 'budget' ? 'Modeling allocations...' : 'Optimize Budget'}
          </button>
        </div>

        {/* Card 2: Expense leakage auditor */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-9 h-9 bg-rose-600/10 border border-rose-500/20 text-rose-400 rounded-xl flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-200 text-sm">Audit Expenditure Leaks</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Isolate unnecessary expenses inside your transaction logs, suggests alternative cost savings, and establishes immediate monthly margin gains.
            </p>
          </div>

          <button
            onClick={() => runAIOptimizer('leak')}
            disabled={isAiRunning}
            className="w-full bg-rose-600 hover:bg-rose-500 text-white py-2.5 rounded-xl text-xs font-semibold shadow-lg shadow-rose-600/10 transition disabled:opacity-50"
          >
            {isAiRunning && aiType === 'leak' ? 'Auditing leaks...' : 'Audit Expense Leaks'}
          </button>
        </div>

        {/* Card 3: Financial Health Grade */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-9 h-9 bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-200 text-sm">Financial Health Score</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Conduct a complete risk analysis across cash reserves, liquidity metrics, and savings rates to calculate your personal financial health score.
            </p>
          </div>

          <button
            onClick={() => runAIOptimizer('audit')}
            disabled={isAiRunning}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 rounded-xl text-xs font-semibold shadow-lg shadow-emerald-600/10 transition disabled:opacity-50"
          >
            {isAiRunning && aiType === 'audit' ? 'Auditing risks...' : 'Analyze Health Score'}
          </button>
        </div>

      </div>

      {isAiRunning && <Loader message="Google Gemini AI is parsing logs & compiling reports..." />}

      {/* Recommendations logs history */}
      <div className="space-y-4">
        <h3 className="font-bold text-slate-200 text-sm uppercase tracking-wider">AI Advisories Log</h3>

        {recommendations.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs border border-dashed border-slate-850 rounded-2xl">
            No advisory reports generated yet. Deploy any optimizer above.
          </div>
        ) : (
          <div className="space-y-4">
            {recommendations.slice().reverse().map((rec) => (
              <div 
                key={rec.id}
                className="bg-slate-900/40 border border-slate-850 rounded-3xl p-6 shadow-xl space-y-4 relative overflow-hidden"
              >
                <div className="flex justify-between items-center pb-3 border-b border-slate-800/60">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                      <Cpu className="w-4 h-4" />
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                        {rec.type === 'budget' ? 'Budget Allocation Plan' : rec.type === 'expense' ? 'Expense Leakage Log' : rec.type === 'savings' ? 'Savings Deadline Guide' : 'Personal Health Grade'}
                      </h4>
                      <span className="text-[10px] text-slate-500">{new Date(rec.createdAt).toLocaleString()}</span>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                    rec.priority === 'High' 
                      ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' 
                      : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                  }`}>
                    {rec.priority} Priority
                  </span>
                </div>

                <div className="space-y-2 prose prose-invert max-w-none text-xs text-slate-300">
                  {renderCustomMarkdown(rec.recommendation)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
export default AIRecommendations;
