import React from 'react';
import { Link } from 'react-router-dom';
import { Cpu, DollarSign, Target, ShieldCheck, ArrowRight, Wallet, BarChart3, TrendingUp } from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between border-b border-slate-900/80">
        <div className="flex items-center gap-2">
          <div className="p-2.5 bg-gradient-to-tr from-indigo-600 to-cyan-500 rounded-xl shadow-lg shadow-indigo-500/20">
            <Cpu className="w-5 h-5 text-white animate-pulse" />
          </div>
          <span className="font-bold text-lg bg-gradient-to-r from-indigo-400 to-cyan-300 bg-clip-text text-transparent">
            Budget Planning Agent
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Link 
            id="nav-login-btn"
            to="/login" 
            className="text-sm font-semibold text-slate-300 hover:text-white transition"
          >
            Sign In
          </Link>
          <Link 
            id="nav-register-btn"
            to="/register" 
            className="text-sm font-semibold bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition"
          >
            Create Free Account
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex-1 max-w-7xl mx-auto w-full px-6 py-16 sm:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
          <div className="inline-flex items-center gap-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1.5 text-xs text-indigo-300 font-semibold uppercase tracking-wider">
            <Cpu className="w-3.5 h-3.5" /> Introducing Next-Gen Financial Intelligence
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-slate-100 tracking-tight leading-none">
            Take control of your cash with <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">Smart AI Budgeting</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
            Stop guessing where your money goes. The Budget Planning Agent organizes your expenses, tracks income, establishes savings, and deploys the Gemini LLM to construct personal budgeting recommendations instantly.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <Link
              id="hero-get-started"
              to="/register"
              className="w-full sm:w-auto text-sm font-semibold bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white px-8 py-3.5 rounded-2xl shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/30 transition flex items-center justify-center gap-2"
            >
              Get Started Instantly <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              id="hero-demo-login"
              to="/login"
              className="w-full sm:w-auto text-sm font-semibold bg-slate-900 border border-slate-800 text-slate-300 hover:text-white px-8 py-3.5 rounded-2xl hover:bg-slate-850 hover:border-slate-700 transition flex items-center justify-center"
            >
              Try Demo Account
            </Link>
          </div>

          <div className="pt-4 grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0">
            <div className="text-center lg:text-left">
              <div className="text-2xl font-black text-slate-100">100%</div>
              <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">Secure & Confidential</div>
            </div>
            <div className="text-center lg:text-left">
              <div className="text-2xl font-black text-slate-100">Gemini 3.5</div>
              <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">LLM Deep Analytics</div>
            </div>
            <div className="text-center lg:text-left">
              <div className="text-2xl font-black text-slate-100">No Fees</div>
              <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">Open & Transparent</div>
            </div>
          </div>
        </div>

        {/* Hero Interactive Card Mockup */}
        <div className="lg:col-span-5 relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-cyan-400 rounded-3xl blur-3xl opacity-15" />
          <div className="relative bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              </div>
              <span className="text-[10px] bg-indigo-500/10 text-indigo-400 font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-indigo-500/20">
                Live Simulator
              </span>
            </div>

            <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Monthly Balance Tracker</span>
                <span className="text-emerald-400 font-semibold">+ $5,250.00</span>
              </div>
              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 w-3/4 rounded-full" />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>Spent: $3,900</span>
                <span>Threshold Limit: $4,500</span>
              </div>
            </div>

            <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400">
                <Cpu className="w-4 h-4 animate-bounce" /> Gemini Financial Agent:
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed italic">
                "Based on your recent grocery ledger ($450) and active utilities ($180), we suggest capping entertainment categories to save $120.00 and redirecting it to your Emergency Savings target."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Blocks */}
      <section className="bg-slate-900/30 border-t border-slate-900/80 py-16 px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-100">Supercharged Financial Services</h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">Explore the rich functional modules engineered to help you analyze, construct, and complete your financial goals.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 bg-slate-900/50 border border-slate-800 rounded-2xl space-y-4 hover:border-indigo-500/20 transition">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Wallet className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-200 text-sm">Budget Orchestration</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Establish complex fixed/variable limits and track spent versus remaining thresholds with active meters.</p>
            </div>

            <div className="p-5 bg-slate-900/50 border border-slate-800 rounded-2xl space-y-4 hover:border-indigo-500/20 transition">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-200 text-sm">Target Savings</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Define timelines and targets. Track progress visually with incremental micro-deposits calculators.</p>
            </div>

            <div className="p-5 bg-slate-900/50 border border-slate-800 rounded-2xl space-y-4 hover:border-indigo-500/20 transition">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-200 text-sm">LLM Core Advice</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Deploy Gemini deep analytics to run safety net audits, risk profiles, and seasonal spend forecasts.</p>
            </div>

            <div className="p-5 bg-slate-900/50 border border-slate-800 rounded-2xl space-y-4 hover:border-indigo-500/20 transition">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-200 text-sm">Seasonal Reports</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Generate complete monthly, weekly, and annual summaries. View beautiful proportional charts and print PDFs.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 border-t border-slate-900/80 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} Budget Planning Agent. All rights reserved. Powered by Google Gemini.</p>
      </footer>
    </div>
  );
};
export default LandingPage;
