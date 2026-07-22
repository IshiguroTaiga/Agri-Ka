import React, { useState } from 'react';
import { LogIn, UserPlus, User, Lock, Sparkles, X, AlertCircle } from 'lucide-react';

export default function LoginModal({ 
  isOpen, 
  onClose, 
  onLoginSuccess, 
  users 
}) {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    const match = users.find(u => 
      u.username?.toLowerCase() === username.toLowerCase() || 
      u.name?.toLowerCase().includes(username.toLowerCase()) ||
      u.id?.toLowerCase() === username.toLowerCase()
    );

    if (match) {
      onLoginSuccess(match);
      onClose();
    } else {
      setErrorMsg('User not found. Try registered accounts or quick demo buttons below.');
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!username || !fullName) {
      setErrorMsg('Please fill out all fields.');
      return;
    }

    const newUser = {
      id: `user-${Date.now()}`,
      username: username.toLowerCase(),
      name: fullName,
      role: 'Farmer',
      roleCode: 'farmer',
      avatar: '👨‍🌾',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      description: 'Registered Farmer Account',
      isGuest: false
    };

    onLoginSuccess(newUser);
    onClose();
  };

  const handleQuickSelectUser = (u) => {
    onLoginSuccess(u);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full border border-purple-200 shadow-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 text-white p-6 relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-800/80 p-2 rounded-full border border-slate-700 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-purple-600/30 border border-purple-400/40 flex items-center justify-center text-xl">
              🔐
            </div>
            <div>
              <h3 className="font-black text-xl text-white">
                {isRegisterMode ? 'Register New Account' : 'Login'}
              </h3>
              <p className="text-xs text-purple-300">AGRI-KA Authentication</p>
            </div>
          </div>
        </div>

        {/* Quick Demo Selectors */}
        {!isRegisterMode && (
          <div className="p-4 bg-purple-50/70 border-b border-purple-100">
            <div className="text-[11px] font-bold text-purple-900 uppercase tracking-wider mb-2 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" /> One-Touch Quick Demo Logins:
            </div>
            <div className="grid grid-cols-3 gap-2">
              {users.filter(u => !u.isGuest).map(u => (
                <button
                  key={u.id}
                  onClick={() => handleQuickSelectUser(u)}
                  className="bg-white hover:bg-purple-100 border border-purple-200 p-2.5 rounded-xl text-center transition-colors flex flex-col items-center justify-center shadow-xs cursor-pointer"
                >
                  <span className="text-2xl mb-1">{u.avatar}</span>
                  <span className="font-bold text-slate-800 text-xs line-clamp-1">{u.name.split(' ')[0]}</span>
                  <span className="text-[10px] text-emerald-700 font-semibold">Farmer</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div className="m-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Main Form */}
        <form onSubmit={isRegisterMode ? handleRegisterSubmit : handleLoginSubmit} className="p-6 space-y-4 text-slate-800">
          
          {isRegisterMode && (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. JBenedict Alberto"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold outline-none focus:border-purple-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Username / Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. berto, nythan, boni"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-emerald-600 to-purple-600 hover:from-emerald-700 hover:to-purple-700 text-white font-bold rounded-xl text-xs shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            {isRegisterMode ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
            <span>{isRegisterMode ? 'Register New Account' : 'Login'}</span>
          </button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => {
                setIsRegisterMode(!isRegisterMode);
                setErrorMsg('');
              }}
              className="text-xs text-purple-700 font-bold hover:underline cursor-pointer"
            >
              {isRegisterMode ? 'Already have an account? Login here' : "Need a new account? Register here"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
