import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Menu, 
  X, 
  BarChart3, 
  Radio, 
  TrendingUp, 
  FileCheck, 
  User, 
  ChevronRight,
  Calendar
} from 'lucide-react';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const menuItems = [
    { name: 'Dashboard', icon: BarChart3, path: '/' },
    { name: 'Live Station Status', icon: Radio, path: '/status' },
    { name: 'KPI', icon: TrendingUp, path: '/kpi' },
    { name: 'Audit', icon: FileCheck, path: '/audit' },
    { name: 'Schedule', icon: Calendar, path: '/schedule' }
  ];

  const handleMenuClick = (path) => {
    console.log('Navigating to:', path);
    
    // Use React Router's navigate function
    navigate(path);
    
    // Close sidebar on mobile after clicking
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Hamburger Menu Button (visible when sidebar is closed) */}
      {!isOpen && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 p-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg shadow-lg transition-all duration-300"
          aria-label="Open sidebar"
        >
          <Menu size={20} />
        </button>
      )}

      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Panel */}
      <div
        className={`fixed top-0 left-0 h-full bg-gradient-to-b from-slate-600 to-slate-700 text-white transition-all duration-300 ease-in-out shadow-2xl z-40 ${
          isOpen ? 'w-64' : 'w-0'
        } overflow-hidden`}
      >
        <div className="flex flex-col h-full w-64">
          {/* Header */}
          <div className="p-6 pt-6 border-b border-slate-500 relative">
            <button
              onClick={toggleSidebar}
              className="absolute top-4 right-4 p-1.5 bg-slate-500 hover:bg-slate-400 text-white rounded-md shadow-md transition-all duration-200"
              aria-label="Close sidebar"
            >
              <X size={16} />
            </button>
            <h2 className="text-xl font-semibold text-white pr-12">Railway Control</h2>
            <p className="text-sm text-slate-200 mt-1">Management System</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6">
            <div className="space-y-1">
              {menuItems.map((item, index) => {
                // Use current location to determine active state
                const isActive = location.pathname === item.path;
                return (
                  <button
                    key={index}
                    onClick={() => handleMenuClick(item.path)}
                    className={`w-full flex items-center justify-between px-4 py-3 transition-all duration-200 group border-b border-slate-500/30 hover:border-slate-400 rounded-md ${
                      isActive 
                        ? 'text-white bg-slate-500/70 border-slate-400' 
                        : 'text-slate-100 hover:text-white hover:bg-slate-500/50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon 
                        size={20} 
                        className={`transition-colors ${
                          isActive 
                            ? 'text-white' 
                            : 'text-slate-300 group-hover:text-white'
                        }`} 
                      />
                      <span className="font-medium">{item.name}</span>
                    </div>
                    <ChevronRight 
                      size={16} 
                      className={`transition-transform duration-200 ${
                        isActive 
                          ? 'text-white opacity-100 translate-x-0' 
                          : 'text-slate-400 group-hover:text-white opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0'
                      }`} 
                    />
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-slate-500">
            <button
              onClick={() => handleMenuClick('/user-settings')}
              className={`w-full flex items-center justify-between px-4 py-3 transition-all duration-200 group border-b border-slate-500/30 hover:border-slate-400 rounded-md ${
                location.pathname === '/user-settings'
                  ? 'text-white bg-slate-500/70 border-slate-400'
                  : 'text-slate-100 hover:text-white hover:bg-slate-500/50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <User 
                  size={20} 
                  className={`transition-colors ${
                    location.pathname === '/user-settings'
                      ? 'text-white'
                      : 'text-slate-300 group-hover:text-white'
                  }`} 
                />
                <span className="font-medium">User Settings</span>
              </div>
              <ChevronRight 
                size={16} 
                className={`transition-colors ${
                  location.pathname === '/user-settings'
                    ? 'text-white opacity-100 translate-x-0'
                    : 'text-slate-400 group-hover:text-white opacity-0 group-hover:opacity-100'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;