import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Target, 
  Cpu, 
  BarChart3, 
  User as UserIcon, 
  Bell, 
  LogOut, 
  Menu, 
  X,
  Settings,
  ShieldCheck,
  Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { notificationService } from '../services/api';
import { Notification } from '../types';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
      loadNotifications();
      const interval = setInterval(loadNotifications, 10000); // refresh notifs
      return () => clearInterval(interval);
    }
  }, [user]);

  const loadNotifications = async () => {
    try {
      const data = await notificationService.getNotifications();
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.read).length);
    } catch (err) {
      console.error('Failed to load notifications:', err);
    }
  };

  const markRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      loadNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Budget & Income', path: '/budget', icon: Wallet },
    { name: 'Expenses', path: '/expenses', icon: ArrowUpRight },
    { name: 'Savings Goals', path: '/savings', icon: Target },
    { name: 'AI Insights', path: '/ai-recommendations', icon: Cpu },
    { name: 'Financial Reports', path: '/reports', icon: BarChart3 },
    { name: 'My Profile', path: '/profile', icon: UserIcon },
  ];

  if (user?.isAdmin) {
    menuItems.push({ name: 'Admin Console', path: '/admin', icon: ShieldCheck });
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Top Header / Navbar */}
      <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 h-16 flex items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button 
            id="sidebar-toggle-btn"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition"
          >
            <Menu className="w-5 h-5" />
          </button>
          <Link id="logo-link" to="/dashboard" className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-tr from-indigo-600 to-cyan-500 rounded-xl shadow-lg shadow-indigo-500/20">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-lg bg-gradient-to-r from-indigo-400 to-cyan-300 bg-clip-text text-transparent hidden sm:inline">
              Budget Planning Agent
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {/* Notifications Icon with Badge */}
          <div className="relative">
            <button 
              id="notif-bell-btn"
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition relative"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-[10px] flex items-center justify-center font-bold animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Pane */}
            <AnimatePresence>
              {isNotifOpen && (
                <motion.div 
                  id="notif-pane-dropdown"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  className="absolute right-0 mt-3 w-80 bg-slate-800/95 backdrop-blur-xl border border-slate-700 rounded-2xl shadow-xl z-50 p-4"
                >
                  <div className="flex items-center justify-between border-b border-slate-700 pb-2 mb-3">
                    <span className="font-semibold text-sm">Notifications</span>
                    <span className="text-xs text-indigo-400 font-medium">
                      {unreadCount} Unread
                    </span>
                  </div>

                  <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
                    {notifications.length === 0 ? (
                      <div className="text-center py-6 text-slate-500 text-xs">
                        No notifications yet.
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div 
                          key={notif.id} 
                          className={`p-2.5 rounded-xl border text-xs transition relative group ${
                            notif.read 
                              ? 'bg-slate-800/40 border-slate-700 text-slate-400' 
                              : 'bg-slate-700/50 border-slate-600 text-slate-200'
                          }`}
                        >
                          <div className="pr-4">{notif.message}</div>
                          <div className="text-[10px] text-slate-500 mt-1">
                            {new Date(notif.createdAt).toLocaleDateString()}
                          </div>
                          {!notif.read && (
                            <button
                              onClick={() => markRead(notif.id)}
                              className="absolute top-2 right-2 p-1 rounded-md hover:bg-slate-600 text-indigo-400 hover:text-white"
                              title="Mark as read"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User badge */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center font-bold text-white shadow-md">
              {user?.name ? user.name[0].toUpperCase() : 'U'}
            </div>
            <div className="hidden md:block text-left">
              <div className="text-xs font-semibold text-slate-200">{user?.name}</div>
              <div className="text-[10px] text-slate-400 capitalize">
                {user?.isAdmin ? 'Administrator' : 'Financial Planner'}
              </div>
            </div>
          </div>

          {/* Sign Out Button */}
          <button 
            id="logout-btn"
            onClick={handleLogout}
            className="p-2 rounded-lg bg-slate-800 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition"
            title="Log Out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex flex-1 relative overflow-hidden">
        {/* Sidebar Navigation */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.aside 
              id="app-sidebar"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 256, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="hidden lg:flex flex-col bg-slate-900/90 border-r border-slate-800 w-64 p-4 shrink-0 justify-between backdrop-blur-md"
            >
              <div className="space-y-6">
                <div className="text-[11px] font-bold text-slate-500 tracking-wider uppercase px-3">
                  Navigation
                </div>
                <nav className="space-y-1">
                  {menuItems.map((item) => {
                    const IconComponent = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                      <Link
                        key={item.name}
                        to={item.path}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                          isActive 
                            ? 'bg-gradient-to-r from-indigo-600/30 to-cyan-500/10 border-l-4 border-indigo-500 text-slate-100 shadow-lg shadow-indigo-500/5' 
                            : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                        }`}
                      >
                        <IconComponent className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                        {item.name}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* Sidebar Footer */}
              <div className="p-3 bg-slate-800/40 rounded-2xl border border-slate-800">
                <div className="text-xs text-slate-400 font-medium">Financial Health</div>
                <div className="h-1.5 bg-slate-700 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 w-[72%] rounded-full" />
                </div>
                <div className="flex justify-between items-center text-[10px] text-slate-500 mt-1">
                  <span>Score: 72%</span>
                  <span className="text-cyan-400">Stable</span>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Dynamic Mobile Menu (Drawer overlay) */}
        <AnimatePresence>
          {!isSidebarOpen && (
            <motion.div 
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              className="lg:hidden fixed inset-y-16 left-0 w-64 bg-slate-900 border-r border-slate-800 z-50 p-4 flex flex-col justify-between"
            >
              <nav className="space-y-2">
                {menuItems.map((item) => {
                  const IconComponent = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={() => setIsSidebarOpen(true)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                        isActive 
                          ? 'bg-indigo-600/20 text-indigo-300 border-l-4 border-indigo-500' 
                          : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition mt-auto"
              >
                <LogOut className="w-4 h-4" />
                Log Out
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content Outlet */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-950">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900/50 border-t border-slate-800/80 py-4 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} Budget Planning Agent • Crafted with Gemini AI. Keep your goals within reach.</p>
      </footer>
    </div>
  );
};
export default Layout;
