import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Calendar, Download, Filter, Target, Award, AlertCircle, CheckCircle, Clock, Users, Zap, Settings, Activity, Menu, X as CloseIcon } from 'lucide-react';

import Sidebar from '../Sidebar/Sidebar';

const PerformanceTrends = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('7days');
  const [selectedKPI, setSelectedKPI] = useState('punctuality');
  const [comparisonMode, setComparisonMode] = useState('target');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Historical performance data
  const performanceData = {
    '7days': [
      { date: '2025-09-04', punctuality: 85, avgDelay: 5.2, throughput: 22, platformUtil: 78, aiAcceptance: 89, conflicts: 12, safetyIncidents: 0, energyEff: 82 },
      { date: '2025-09-05', punctuality: 88, avgDelay: 4.8, throughput: 25, platformUtil: 81, aiAcceptance: 91, conflicts: 8, safetyIncidents: 0, energyEff: 85 },
      { date: '2025-09-06', punctuality: 82, avgDelay: 6.1, throughput: 21, platformUtil: 75, aiAcceptance: 87, conflicts: 15, safetyIncidents: 1, energyEff: 79 },
      { date: '2025-09-07', punctuality: 91, avgDelay: 3.9, throughput: 27, platformUtil: 84, aiAcceptance: 94, conflicts: 6, safetyIncidents: 0, energyEff: 88 },
      { date: '2025-09-08', punctuality: 89, avgDelay: 4.2, throughput: 26, platformUtil: 82, aiAcceptance: 92, conflicts: 9, safetyIncidents: 0, energyEff: 86 },
      { date: '2025-09-09', punctuality: 86, avgDelay: 5.0, throughput: 24, platformUtil: 79, aiAcceptance: 90, conflicts: 11, safetyIncidents: 0, energyEff: 84 },
      { date: '2025-09-10', punctuality: 87, avgDelay: 4.6, throughput: 25, platformUtil: 80, aiAcceptance: 92, conflicts: 10, safetyIncidents: 0, energyEff: 87 }
    ],
    '30days': [
      { date: 'Week 1', punctuality: 86, avgDelay: 5.1, throughput: 24, platformUtil: 78, aiAcceptance: 88, conflicts: 45, safetyIncidents: 1, energyEff: 83 },
      { date: 'Week 2', punctuality: 89, avgDelay: 4.3, throughput: 26, platformUtil: 82, aiAcceptance: 91, conflicts: 38, safetyIncidents: 0, energyEff: 86 },
      { date: 'Week 3', punctuality: 84, avgDelay: 5.8, throughput: 22, platformUtil: 76, aiAcceptance: 87, conflicts: 52, safetyIncidents: 2, energyEff: 81 },
      { date: 'Week 4', punctuality: 87, avgDelay: 4.7, throughput: 25, platformUtil: 80, aiAcceptance: 90, conflicts: 41, safetyIncidents: 0, energyEff: 85 }
    ]
  };

  const kpiTargets = {
    punctuality: 90,
    avgDelay: 5.0,
    throughput: 28,
    platformUtil: 85,
    aiAcceptance: 85,
    conflicts: 10,
    safetyIncidents: 0,
    energyEff: 85
  };

  const kpiDefinitions = {
    punctuality: { name: 'On-Time Arrival %', unit: '%', icon: Clock, color: '#10b981' },
    avgDelay: { name: 'Average Delay', unit: 'min', icon: Clock, color: '#f59e0b' },
    throughput: { name: 'Throughput', unit: 'trains/hour', icon: Activity, color: '#3b82f6' },
    platformUtil: { name: 'Platform Utilization', unit: '%', icon: Users, color: '#8b5cf6' },
    aiAcceptance: { name: 'AI Acceptance Rate', unit: '%', icon: Zap, color: '#06b6d4' },
    conflicts: { name: 'Daily Conflicts', unit: 'count', icon: AlertCircle, color: '#ef4444' },
    safetyIncidents: { name: 'Safety Incidents', unit: 'count', icon: AlertCircle, color: '#dc2626' },
    energyEff: { name: 'Energy Efficiency', unit: '%', icon: Settings, color: '#22c55e' }
  };

  const conflictData = [
    { type: 'Platform Occupancy', resolved: 45, pending: 2, avgTime: 3.2 },
    { type: 'Priority Crossing', resolved: 38, pending: 1, avgTime: 2.8 },
    { type: 'Maintenance Override', resolved: 12, pending: 0, avgTime: 5.1 },
    { type: 'Weather Related', resolved: 18, pending: 3, avgTime: 4.7 },
    { type: 'Emergency', resolved: 6, pending: 0, avgTime: 1.9 }
  ];

  const trainTypeData = [
    { type: 'Express', punctuality: 89, avgDelay: 4.1, count: 145 },
    { type: 'Local', punctuality: 92, avgDelay: 3.2, count: 238 },
    { type: 'Freight', punctuality: 78, avgDelay: 8.4, count: 67 },
    { type: 'Special', punctuality: 85, avgDelay: 5.8, count: 12 }
  ];

  const controllerData = [
    { name: 'Operator_Alpha', decisions: 156, overrides: 12, accuracy: 94, efficiency: 88 },
    { name: 'Operator_Beta', decisions: 142, overrides: 8, accuracy: 96, efficiency: 91 },
    { name: 'Operator_Gamma', decisions: 134, overrides: 15, accuracy: 89, efficiency: 85 },
    { name: 'System_Auto', decisions: 892, overrides: 0, accuracy: 92, efficiency: 95 }
  ];

  const currentData = performanceData[selectedPeriod];
  const currentKPIData = kpiDefinitions[selectedKPI];
  const currentTarget = kpiTargets[selectedKPI];

  const getKPITrend = (data, key) => {
    if (data.length < 2) return { trend: 'stable', change: 0 };
    const latest = data[data.length - 1][key];
    const previous = data[data.length - 2][key];
    const change = ((latest - previous) / previous * 100);
    
    if (Math.abs(change) < 1) return { trend: 'stable', change: 0 };
    return { trend: change > 0 ? 'up' : 'down', change: Math.abs(change) };
  };

  const getTrendIcon = (trend) => {
    switch(trend) {
      case 'up': return TrendingUp;
      case 'down': return TrendingDown;
      default: return Clock;
    }
  };

  const getTrendColor = (key, trend) => {
    const isGoodUp = ['punctuality', 'throughput', 'platformUtil', 'aiAcceptance', 'energyEff'].includes(key);
    if (trend === 'stable') return 'text-gray-400';
    if ((trend === 'up' && isGoodUp) || (trend === 'down' && !isGoodUp)) return 'text-green-400';
    return 'text-red-400';
  };

  const formatDate = (dateStr) => {
    if (dateStr.includes('Week')) return dateStr;
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#22c55e', '#f97316'];

  return (
    <div className="min-h-screen bg-slate-900 text-gray-100">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      {/* Main Content Wrapper */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
        {/* Header */}
        <div className="bg-slate-800 border-b border-slate-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-gray-300 hover:text-white"
              >
                <Menu className="w-6 h-6" style={{ visibility: 'none' }} />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white">Railway Control Center</h1>
                <p className="text-sm text-gray-400 mt-1">Performance Trends & KPI Analysis - Station Alpha | Last Updated: 14:23:45</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <select 
                  value={selectedPeriod} 
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="7days">Last 7 Days</option>
                  <option value="30days">Last 30 Days</option>
                </select>
              </div>
              <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Export Report</span>
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* KPI Overview Cards */}
          <div className="grid grid-cols-4 gap-4">
            {Object.entries(kpiDefinitions).slice(0, 4).map(([key, def]) => {
              const trend = getKPITrend(currentData, key);
              const TrendIcon = getTrendIcon(trend.trend);
              const latest = currentData[currentData.length - 1][key];
              const target = kpiTargets[key];
              const IconComponent = def.icon;
              
              return (
                <div 
                  key={key}
                  className={`bg-slate-800 rounded-lg border border-slate-700 p-4 cursor-pointer transition-all ${
                    selectedKPI === key ? 'border-blue-500 bg-slate-700' : 'hover:border-slate-600'
                  }`}
                  onClick={() => setSelectedKPI(key)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <IconComponent className="w-5 h-5" style={{ color: def.color }} />
                    <TrendIcon className={`w-4 h-4 ${getTrendColor(key, trend.trend)}`} />
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-gray-400">{def.name}</div>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-2xl font-bold text-white">{latest}</span>
                      <span className="text-sm text-gray-400">{def.unit}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className={`${latest >= target ? 'text-green-400' : 'text-red-400'}`}>
                        Target: {target}{def.unit}
                      </span>
                      {trend.change > 0 && (
                        <span className={getTrendColor(key, trend.trend)}>
                          {trend.change.toFixed(1)}%
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-12 gap-6">
            {/* Main KPI Trend Chart */}
            <div className="col-span-8 bg-slate-800 rounded-lg border border-slate-700">
              <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <h2 className="text-lg font-semibold text-white">{currentKPIData.name} Trend</h2>
                  <div className="flex items-center space-x-2">
                    <Filter className="w-4 h-4 text-gray-400" />
                    <select 
                      value={comparisonMode} 
                      onChange={(e) => setComparisonMode(e.target.value)}
                      className="bg-slate-700 border border-slate-600 rounded-md px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="target">vs Target</option>
                      <option value="historical">vs Historical</option>
                    </select>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-400">Current</div>
                  <div className="text-xl font-bold text-white">
                    {currentData[currentData.length - 1][selectedKPI]}{currentKPIData.unit}
                  </div>
                </div>
              </div>
              <div className="p-6">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={currentData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#9ca3af"
                      fontSize={12}
                      tickFormatter={formatDate}
                    />
                    <YAxis stroke="#9ca3af" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1e293b', 
                        border: '1px solid #475569',
                        borderRadius: '8px'
                      }}
                      labelFormatter={formatDate}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey={selectedKPI} 
                      stroke={currentKPIData.color}
                      strokeWidth={3}
                      name={currentKPIData.name}
                      dot={{ fill: currentKPIData.color, strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: currentKPIData.color, strokeWidth: 2 }}
                    />
                    {comparisonMode === 'target' && (
                      <Line 
                        type="monotone" 
                        dataKey={() => currentTarget}
                        stroke="#6b7280" 
                        strokeDasharray="5 5"
                        dot={false}
                        name={`Target (${currentTarget})`}
                      />
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* KPI Summary */}
            <div className="col-span-4 bg-slate-800 rounded-lg border border-slate-700">
              <div className="px-6 py-4 border-b border-slate-700">
                <h2 className="text-lg font-semibold text-white flex items-center">
                  <Target className="w-5 h-5 mr-2 text-green-400" />
                  KPI Summary
                </h2>
              </div>
              <div className="p-4 space-y-3">
                {Object.entries(kpiDefinitions).map(([key, def]) => {
                  const latest = currentData[currentData.length - 1][key];
                  const target = kpiTargets[key];
                  const achievement = key === 'avgDelay' || key === 'conflicts' || key === 'safetyIncidents' 
                    ? (latest <= target ? 100 : (target / latest * 100))
                    : (latest / target * 100);
                  const IconComponent = def.icon;
                  
                  return (
                    <div key={key} className="flex items-center justify-between p-2 bg-slate-700/50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <IconComponent className="w-4 h-4" style={{ color: def.color }} />
                        <span className="text-sm text-gray-300">{def.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-white">
                          {latest}{def.unit}
                        </div>
                        <div className={`text-xs ${achievement >= 100 ? 'text-green-400' : achievement >= 90 ? 'text-yellow-400' : 'text-red-400'}`}>
                          {achievement.toFixed(0)}% of target
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-6">
            {/* Train Type Performance */}
            <div className="col-span-6 bg-slate-800 rounded-lg border border-slate-700">
              <div className="px-6 py-4 border-b border-slate-700">
                <h2 className="text-lg font-semibold text-white flex items-center">
                  <Award className="w-5 h-5 mr-2 text-blue-400" />
                  Performance by Train Type
                </h2>
              </div>
              <div className="p-6">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={trainTypeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="type" stroke="#9ca3af" fontSize={12} />
                    <YAxis stroke="#9ca3af" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1e293b', 
                        border: '1px solid #475569',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Bar dataKey="punctuality" fill="#10b981" name="Punctuality %" />
                    <Bar dataKey="avgDelay" fill="#f59e0b" name="Avg Delay (min)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Conflict Resolution Analysis */}
            <div className="col-span-6 bg-slate-800 rounded-lg border border-slate-700">
              <div className="px-6 py-4 border-b border-slate-700">
                <h2 className="text-lg font-semibold text-white flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2 text-orange-400" />
                  Conflict Resolution Analysis
                </h2>
              </div>
              <div className="p-6 flex items-center">
                <ResponsiveContainer width="40%" height={200}>
                  <PieChart>
                    <Pie
                      data={conflictData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="resolved"
                    >
                      {conflictData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="w-60 space-y-2">
                  {conflictData.map((conflict, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[index % COLORS.length]}}></div>
                      <span className="text-sm text-gray-300">{conflict.type}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Controller Performance */}
          <div className="bg-slate-800 rounded-lg border border-slate-700">
            <div className="px-6 py-4 border-b border-slate-700">
              <h2 className="text-lg font-semibold text-white flex items-center">
                <Users className="w-5 h-5 mr-2 text-purple-400" />
                Controller Performance Analysis
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-4 gap-6">
                {controllerData.map((controller, index) => (
                  <div key={index} className="bg-slate-700/30 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-white">{controller.name}</h3>
                      {controller.name.includes('System') && (
                        <Zap className="w-4 h-4 text-yellow-400" />
                      )}
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Decisions</span>
                        <span className="text-white">{controller.decisions}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Overrides</span>
                        <span className="text-white">{controller.overrides}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Accuracy</span>
                        <span className={`${controller.accuracy >= 90 ? 'text-green-400' : 'text-yellow-400'}`}>
                          {controller.accuracy}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Efficiency</span>
                        <span className={`${controller.efficiency >= 90 ? 'text-green-400' : 'text-yellow-400'}`}>
                          {controller.efficiency}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceTrends;
