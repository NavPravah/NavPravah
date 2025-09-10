import React, { useState, useEffect } from 'react';
import { AlertTriangle, Clock, Train, Users, Zap, Cloud, Settings, Activity, TrendingUp, TrendingDown, Minus } from 'lucide-react';

const Dashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [alertsExpanded, setAlertsExpanded] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Real-time data simulation
  const currentDelays = [
    { trainId: 'EXP_12345', delay: 8, section: 'Platform 2 → Track 2A', severity: 'medium', eta: '14:31' },
    { trainId: 'LOCAL_456', delay: 3, section: 'Junction 1A', severity: 'low', eta: '14:26' },
    { trainId: 'FREIGHT_789', delay: 15, section: 'Maintenance Block', severity: 'high', eta: '14:38' },
    { trainId: 'EXP_67890', delay: 2, section: 'Platform 1', severity: 'low', eta: '14:25' }
  ];

  const trainQueue = [
    { trainId: 'EXP_12001', priority: 'Express', status: 'Approaching', platform: 'Platform 1', eta: '14:25', passengers: 850 },
    { trainId: 'LOCAL_789', priority: 'Local', status: 'Waiting', platform: 'Platform 2', eta: '14:27', passengers: 450 },
    { trainId: 'FREIGHT_445', priority: 'Freight', status: 'Holding', platform: 'Track 3A', eta: '14:30', passengers: 0 },
    { trainId: 'EXP_55678', priority: 'Express', status: 'Scheduled', platform: 'Platform 3', eta: '14:33', passengers: 920 }
  ];

  const platformStatus = [
    { id: 'Platform 1', status: 'occupied', train: 'EXP_12345', timeRemaining: '3min', capacity: 85 },
    { id: 'Platform 2', status: 'clearing', train: 'LOCAL_456', timeRemaining: '1min', capacity: 20 },
    { id: 'Platform 3', status: 'available', train: null, timeRemaining: null, capacity: 0 },
    { id: 'Track 1A', status: 'occupied', train: 'FREIGHT_789', timeRemaining: '8min', capacity: 100 },
    { id: 'Track 2A', status: 'maintenance', train: null, timeRemaining: '45min', capacity: 0 },
    { id: 'Track 3B', status: 'available', train: null, timeRemaining: null, capacity: 0 }
  ];

  const predictedConflicts = [
    { time: '14:28', trains: ['EXP_12001', 'LOCAL_789'], location: 'Junction 1A', severity: 'medium', resolution: 'Hold LOCAL_789 2min' },
    { time: '14:35', trains: ['FREIGHT_445', 'EXP_55678'], location: 'Track 3A Exit', severity: 'low', resolution: 'Reroute FREIGHT via 3B' },
    { time: '14:42', trains: ['EXP_67890', 'LOCAL_991'], location: 'Platform 2', severity: 'high', resolution: 'Priority override pending' }
  ];

  const weatherAlerts = [
    { type: 'Fog', severity: 'medium', affected: 'Sections 1A-2B', visibility: '200m', impact: 'Speed restrictions active' },
    { type: 'Temperature', severity: 'low', affected: 'Track expansion zones', temp: '18°C', impact: 'Monitoring thermal stress' }
  ];

  const systemMetrics = {
    throughput: { current: 24, target: null },
    punctuality: { current: 87, target: 90, unit: '%' },
    aiAcceptance: { current: 92, target: 85, unit: '%' },
    avgWaitTime: { current: 4.2, target: 5.0, unit: 'min' },
  };

  const maintenanceBlocks = [
    { track: 'Track 2A', status: 'Active', remaining: '43min', type: 'Signal Maintenance', crew: 'Team Alpha' },
    { track: 'Platform 1B', status: 'Scheduled', remaining: '2h 15min', type: 'Platform Cleaning', crew: 'Team Beta' },
    { track: 'Junction 3', status: 'Overrun', remaining: '-8min', type: 'Point Inspection', crew: 'Team Gamma' }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'occupied': return 'bg-red-600';
      case 'clearing': return 'bg-yellow-600';
      case 'available': return 'bg-green-600';
      case 'maintenance': return 'bg-blue-600';
      default: return 'bg-gray-600';
    }
  };

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'high': return 'text-red-400 bg-red-900/20';
      case 'medium': return 'text-yellow-400 bg-yellow-900/20';
      case 'low': return 'text-green-400 bg-green-900/20';
      default: return 'text-gray-400 bg-gray-900/20';
    }
  };

  const getMetricTrend = (current, target) => {
    if (current > target) return { icon: TrendingUp, color: 'text-green-400' };
    if (current < target * 0.9) return { icon: TrendingDown, color: 'text-red-400' };
    return { icon: Minus, color: 'text-yellow-400' };
  };

  return (
    <div className="min-h-screen bg-slate-900 text-gray-100">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Railway Control Center</h1>
            <p className="text-sm text-gray-400 mt-1">
              Real-Time Dashboard - Station Alpha | {currentTime.toLocaleTimeString()} | 3 Controllers Active
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-300">System Operational</span>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium">
              Emergency Override
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Key Metrics Row with AI Actions in Center */}
  <div className="flex justify-center items-center mx-12 gap-6">
          {/* Left Metrics */}
          <div className="flex gap-6">
            {Object.entries(systemMetrics).slice(0, 2).map(([key, data]) => {
              const trend = getMetricTrend(data.current, data.target);
              const TrendIcon = trend.icon;
              
              return (
                <div key={key} className="bg-slate-800 rounded-lg border border-slate-700 p-4" style={{ minWidth: '12vw' }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-400 uppercase tracking-wide">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <TrendIcon className={`w-4 h-4 ${trend.color}`} />
                  </div>
                  <div className="flex items-baseline space-x-1">
                    <span className="text-2xl font-bold text-white">{data.current}</span>
                    <span className="text-sm text-gray-400">{data.unit}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {data.target ? `Target: ${data.target}${data.unit}` : ''}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Center AI Actions */}
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-3 mx-6 flex flex-col items-center" style={{ minWidth: '20vw' }}>
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center">
              <Zap className="w-4 h-4 mr-2 text-yellow-400" />
              AI vs Controller Actions (Last Hour)
            </h3>
            <div className="grid grid-cols-3 gap-4 w-full">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">20</div>
                <div className="text-xs text-gray-400">AI Accepted</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">2</div>
                <div className="text-xs text-gray-400">Manual Override</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-400">1</div>
                <div className="text-xs text-gray-400">Emergency</div>
              </div>
            </div>
          </div>

          {/* Right Metrics */}
          <div className="flex gap-6">
            {Object.entries(systemMetrics).slice(2, 4).map(([key, data]) => {
              const trend = getMetricTrend(data.current, data.target);
              const TrendIcon = trend.icon;
              
              return (
                <div key={key} className="bg-slate-800 rounded-lg border border-slate-700 p-4" style={{ minWidth: '12vw' }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-400 uppercase tracking-wide">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <TrendIcon className={`w-4 h-4 ${trend.color}`} />
                  </div>
                  <div className="flex items-baseline space-x-1">
                    <span className="text-2xl font-bold text-white">{data.current}</span>
                    <span className="text-sm text-gray-400">{data.unit}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {data.target ? `Target: ${data.target}${data.unit}` : ''}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Current Delays */}
          <div className="col-span-4 bg-slate-800 rounded-lg border border-slate-700">
            <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white flex items-center">
                <Clock className="w-5 h-5 mr-2 text-yellow-400" />
                Current Delays
              </h2>
              <span className="text-sm text-gray-400">{currentDelays.length} trains</span>
            </div>
            <div className="p-4 space-y-3 max-h-80 overflow-y-auto">
              {currentDelays.map((train, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-white">{train.trainId}</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${getSeverityColor(train.severity)}`}>
                        +{train.delay}min
                      </span>
                    </div>
                    <div className="text-sm text-gray-400">{train.section}</div>
                  </div>
                  <div className="text-right text-sm">
                    <div className="text-gray-300">ETA: {train.eta}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Train Priority Queue */}
          <div className="col-span-4 bg-slate-800 rounded-lg border border-slate-700">
            <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white flex items-center">
                <Train className="w-5 h-5 mr-2 text-blue-400" />
                Train Queue
              </h2>
              <span className="text-sm text-gray-400">{trainQueue.length} in queue</span>
            </div>
            <div className="p-4 space-y-3 max-h-80 overflow-y-auto">
              {trainQueue.map((train, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-white">{train.trainId}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        train.priority === 'Express' ? 'bg-red-600' :
                        train.priority === 'Local' ? 'bg-green-600' : 'bg-gray-600'
                      }`}>
                        {train.priority}
                      </span>
                    </div>
                    <div className="text-sm text-gray-400">{train.platform} • {train.status}</div>
                    {train.passengers > 0 && (
                      <div className="text-xs text-gray-500 flex items-center mt-1">
                        <Users className="w-3 h-3 mr-1" />
                        {train.passengers} passengers
                      </div>
                    )}
                  </div>
                  <div className="text-right text-sm">
                    <div className="text-gray-300">{train.eta}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Platform Status */}
          <div className="col-span-4 bg-slate-800 rounded-lg border border-slate-700">
            <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white flex items-center">
                <Activity className="w-5 h-5 mr-2 text-green-400" />
                Platform Status
              </h2>
              <span className="text-sm text-gray-400">6 platforms</span>
            </div>
            <div className="p-4 space-y-3 max-h-80 overflow-y-auto">
              {platformStatus.map((platform, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center space-x-3 flex-1">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(platform.status)}`}></div>
                    <div>
                      <div className="font-medium text-white">{platform.id}</div>
                      <div className="text-sm text-gray-400">
                        {platform.train || platform.status}
                      </div>
                    </div>
                  </div>
                  <div className="text-right text-sm">
                    {platform.timeRemaining && (
                      <div className="text-gray-300">{platform.timeRemaining}</div>
                    )}
                    <div className="text-xs text-gray-500">{platform.capacity}% capacity</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Predicted Conflicts */}
          <div className="col-span-6 bg-slate-800 rounded-lg border border-slate-700">
            <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-orange-400" />
                Predicted Conflicts
              </h2>
              <span className="text-sm text-gray-400">{predictedConflicts.length} conflicts</span>
            </div>
            <div className="p-4 space-y-3">
              {predictedConflicts.map((conflict, index) => (
                <div key={index} className="p-3 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-white">{conflict.time}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${getSeverityColor(conflict.severity)}`}>
                      {conflict.severity}
                    </span>
                  </div>
                  <div className="text-sm text-gray-300 mb-1">
                    {conflict.trains.join(' ↔ ')} at {conflict.location}
                  </div>
                  <div className="text-xs text-blue-400">
                    Resolution: {conflict.resolution}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Weather & Alerts */}
          <div className="col-span-3 bg-slate-800 rounded-lg border border-slate-700">
            <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white flex items-center">
                <Cloud className="w-5 h-5 mr-2 text-cyan-400" />
                Weather & Alerts
              </h2>
              <button 
                onClick={() => setAlertsExpanded(!alertsExpanded)}
                className="text-sm text-gray-400 hover:text-white"
              >
                {alertsExpanded ? 'Less' : 'More'}
              </button>
            </div>
            <div className="p-4 space-y-3">
              {weatherAlerts.map((alert, index) => (
                <div key={index} className="p-3 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-white">{alert.type}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${getSeverityColor(alert.severity)}`}>
                      {alert.severity}
                    </span>
                  </div>
                  <div className="text-sm text-gray-400 mb-1">{alert.affected}</div>
                  <div className="text-xs text-gray-500">{alert.impact}</div>
                  {alert.visibility && (
                    <div className="text-xs text-orange-400 mt-1">Visibility: {alert.visibility}</div>
                  )}
                  {alert.temp && (
                    <div className="text-xs text-red-400 mt-1">Temperature: {alert.temp}</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Maintenance Blocks */}
          <div className="col-span-3 bg-slate-800 rounded-lg border border-slate-700">
            <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white flex items-center">
                <Settings className="w-5 h-5 mr-2 text-purple-400" />
                Maintenance
              </h2>
              <span className="text-sm text-gray-400">{maintenanceBlocks.length} blocks</span>
            </div>
            <div className="p-4 space-y-3">
              {maintenanceBlocks.map((block, index) => (
                <div key={index} className="p-3 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-white">{block.track}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      block.status === 'Active' ? 'bg-blue-600' :
                      block.status === 'Scheduled' ? 'bg-yellow-600' : 'bg-red-600'
                    }`}>
                      {block.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-400 mb-1">{block.type}</div>
                  <div className="text-xs text-gray-500">{block.crew}</div>
                  <div className={`text-xs mt-1 ${
                    block.remaining.includes('-') ? 'text-red-400' : 'text-gray-300'
                  }`}>
                    {block.remaining.includes('-') ? 'Overrun: ' : 'Remaining: '}
                    {block.remaining}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;