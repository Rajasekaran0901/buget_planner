import React, { useState, useEffect } from 'react';
import { goalService, aiService } from '../services/api';
import { SavingsGoal } from '../types';
import { SavingsCard } from '../components/FinanceCards';
import { AddGoalModal } from '../components/Modals';
import { Loader, SectionHeader, Alert } from '../components/Common';
import { Plus, Target, Sparkles, HelpCircle, Cpu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const SavingsPage: React.FC = () => {
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  const [isGoalOpen, setIsGoalOpen] = useState(false);
  const [isPlanning, setIsPlanning] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      setIsLoading(true);
      setError('');
      const data = await goalService.getGoals();
      setGoals(data);
    } catch (err) {
      console.error(err);
      setError('Could not update savings profiles.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddGoal = async (data: { goalName: string; targetAmount: number; currentAmount: number; deadline: string }) => {
    await goalService.addGoal(data);
    await loadGoals();
  };

  const handleUpdateAmount = async (id: string, current: number) => {
    try {
      setError('');
      await goalService.updateGoal(id, { currentAmount: current });
      await loadGoals();
    } catch (err) {
      console.error(err);
      setError('Failed to update savings progression.');
    }
  };

  const handleDeleteGoal = async (id: string) => {
    try {
      await goalService.deleteGoal(id);
      await loadGoals();
    } catch (err) {
      console.error(err);
    }
  };

  const handleTriggerAIPlanner = async (id: string) => {
    try {
      setError('');
      setSuccessMsg('');
      setIsPlanning(id);
      
      const plan = await aiService.planSavings(id);
      
      setSuccessMsg(`AI Savings Strategy generated! Feasibility score is ${plan.feasibilityScore}/100. We recommend allocating $${plan.monthlyContribution}/month.`);
      
      // Delay navigation slightly so they see the success message
      setTimeout(() => {
        navigate('/ai-recommendations');
      }, 3000);
    } catch (err) {
      console.error(err);
      setError('AI compilation failed. Check connections.');
    } finally {
      setIsPlanning(null);
    }
  };

  if (isLoading) {
    return <Loader message="Accessing active savings goals portfolio..." />;
  }

  const totalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0);
  const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);

  return (
    <div className="space-y-6">
      
      <SectionHeader 
        title="Savings Goals" 
        subtitle="Manage long-term targets, track deposit progress, and deploy AI timelines"
        action={
          <button 
            id="savings-add-btn"
            onClick={() => setIsGoalOpen(true)}
            className="text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> New Savings Target
          </button>
        }
      />

      {error && <Alert type="error" message={error} />}
      {successMsg && <Alert type="success" message={successMsg} />}

      {/* Aggregate stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-5 bg-slate-900/40 border border-slate-800 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-xl">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Total Accumulation</span>
            <span className="text-xl font-bold text-slate-200 mt-0.5 block">${totalSaved.toLocaleString()}</span>
          </div>
        </div>

        <div className="p-5 bg-slate-900/40 border border-slate-800 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-xl">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Combined Target</span>
            <span className="text-xl font-bold text-slate-200 mt-0.5 block">${totalTarget.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Goals Grid */}
      {goals.length === 0 ? (
        <div className="p-16 text-center text-slate-500 text-xs border border-dashed border-slate-850 rounded-3xl">
          No active savings goals found. Establish an emergency buffer or future purchase target above.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {goals.map((goal) => (
            <div key={goal.id} className="space-y-3">
              <SavingsCard 
                goal={goal} 
                onUpdateAmount={handleUpdateAmount} 
                onDelete={handleDeleteGoal} 
              />
              
              {/* One-click AI plan triggers */}
              <button
                onClick={() => handleTriggerAIPlanner(goal.id)}
                disabled={isPlanning !== null}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl text-xs bg-indigo-950/40 text-indigo-400 hover:bg-indigo-600 hover:text-white border border-indigo-900/20 hover:border-transparent transition font-semibold"
              >
                <Cpu className="w-4 h-4" />
                {isPlanning === goal.id ? 'Gemini is planning strategy...' : 'Optimize Goal Timeline with AI'}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      <AddGoalModal 
        isOpen={isGoalOpen} 
        onClose={() => setIsGoalOpen(false)} 
        onSubmit={handleAddGoal} 
      />

    </div>
  );
};
export default SavingsPage;
