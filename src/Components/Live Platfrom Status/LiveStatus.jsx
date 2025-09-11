import React, { useState, useEffect, useRef } from 'react';
import {
  X, Clock, Zap, MapPin, AlertTriangle, ArrowRight, ArrowLeft,
  Bell, User, ChevronDown, Search, Activity, Wifi, Database,
  Eye, Play, Check, Menu, Plus, Pause, RotateCcw, Settings
} from 'lucide-react';
import Sidebar from '../Sidebar/Sidebar';

// TrainSvg Component
const TrainSvg = ({ color, direction, trainId }) => {
  return (
    <div className="relative">
      <svg
        width="48"
        height="20"
        viewBox="0 0 48 20"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-lg"
        style={{ transform: direction === 'left' ? 'scaleX(-1)' : 'none' }}
      >
        <g>
          <path
            d="M 4 2 L 40 2 L 46 10 L 46 18 L 4 18 Z"
            fill={color}
            stroke="#111827"
            strokeWidth="1"
          />
          <rect x="8" y="5" width="10" height="6" fill="#a5f3fc" rx="1" opacity="0.9" />
          <rect x="20" y="5" width="10" height="6" fill="#a5f3fc" rx="1" opacity="0.9" />
          <circle cx="44" cy="12" r="1.2" fill="#fef08a" />
        </g>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-white text-xs font-bold">{trainId}</span>
      </div>
    </div>
  );
};

// Track Graph Definition (matching third image node names)
const TRACK_SECTIONS = {
  // Approach sections
  'A1': { x: 100, y: 130, connections: ['J1'] },
  'A2': { x: 100, y: 230, connections: ['J2'] },
  'A3': { x: 100, y: 330, connections: ['J3'] },

  // Junction sections
  'J1': { x: 200, y: 130, connections: ['P1A', 'J2'] },
  'J2': { x: 200, y: 230, connections: ['P2A', 'J1', 'J3'] },
  'J3': { x: 200, y: 330, connections: ['P3A', 'J2'] },

  // Platform approach sections
  'P1A': { x: 350, y: 130, connections: ['P1'] },
  'P2A': { x: 350, y: 230, connections: ['P2'] },
  'P3A': { x: 350, y: 330, connections: ['P3'] },

  // Platform sections (stations)
  'P1': { x: 500, y: 130, connections: ['P1D'], isStation: true, platform: 1 },
  'P2': { x: 500, y: 230, connections: ['P2D'], isStation: true, platform: 2 },
  'P3': { x: 500, y: 330, connections: ['P3D'], isStation: true, platform: 3 },

  // Platform departure sections
  'P1D': { x: 650, y: 130, connections: ['J4'] },
  'P2D': { x: 650, y: 230, connections: ['J5'] },
  'P3D': { x: 650, y: 330, connections: ['J6'] },

  // Exit junction sections
  'J4': { x: 750, y: 130, connections: ['E1', 'J5'] },
  'J5': { x: 750, y: 230, connections: ['E2', 'J4', 'J6'] },
  'J6': { x: 750, y: 330, connections: ['E3', 'J5'] },

  // Exit sections
  'E1': { x: 850, y: 130, connections: [] },
  'E2': { x: 850, y: 230, connections: [] },
  'E3': { x: 850, y: 330, connections: [] },
};

// Global Header Component
const GlobalHeader = ({ isLive, setIsLive, currentTime, sidebarOpen, setSidebarOpen }) => {
  const [notifications, setNotifications] = useState(1);

  const systemStatus = {
    signalling: 'green',
    tms: 'amber',
    dataFeed: 'green'
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'green': return 'bg-green-500';
      case 'amber': return 'bg-yellow-500';
      case 'red': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <header className={`bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center justify-between fixed top-0 right-0 z-50 transition-all duration-300 ${sidebarOpen ? 'left-64' : 'left-0'
      }`}>
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-gray-300 hover:text-white"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-white">Network Command</h1>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search train, platform, signal..."
            className="bg-gray-700 text-white pl-10 pr-4 py-2 rounded-lg w-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-300">Status:</span>
          <div className="flex gap-1">
            <div className={`w-3 h-3 rounded-full ${getStatusColor(systemStatus.signalling)}`} title="Signalling" />
            <div className={`w-3 h-3 rounded-full ${getStatusColor(systemStatus.tms)}`} title="TMS" />
            <div className={`w-3 h-3 rounded-full ${getStatusColor(systemStatus.dataFeed)}`} title="Data Feed" />
          </div>
        </div>

        <div className="relative">
          <Bell className="w-5 h-5 text-gray-300 cursor-pointer hover:text-white" />
          {notifications > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {notifications}
            </span>
          )}
        </div>

        <div className="text-white text-right border-l border-gray-600 pl-4">
          <div className="font-mono text-lg">{currentTime}</div>
          <div className="text-xs text-gray-400">IST</div>
        </div>
      </div>
    </header>
  );
};

// Left Panel Component
const LeftPanel = ({ isOpen, setIsOpen, sidebarOpen }) => {
  const [activeTab, setActiveTab] = useState('alerts');

  const alerts = [
    { id: 1, title: 'Signal S23 Failure', severity: 'high', time: '14:20', description: 'Critical signal malfunction detected' },
    { id: 2, title: 'Track Circuit T45 Occupied Unexpectedly', severity: 'medium', time: '14:18', description: 'Unexpected occupation on track circuit' },
    { id: 3, title: 'Platform P2 Overcrowding', severity: 'low', time: '14:15', description: 'Passenger density above normal threshold' }
  ];

  const recommendations = [
    {
      id: 1,
      title: 'Re-platform train 22104 to P6',
      impact: 'Est. Punctuality +6% | Resolves P5 Conflict',
      confidence: 95,
      type: 'routing'
    },
    {
      id: 2,
      title: 'Delay train EXP-401 by 3 minutes',
      impact: 'Prevents collision risk | +2% system efficiency',
      confidence: 87,
      type: 'scheduling'
    }
  ];

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'border-red-500 bg-red-500/10';
      case 'medium': return 'border-yellow-500 bg-yellow-500/10';
      case 'low': return 'border-blue-500 bg-blue-500/10';
      default: return 'border-gray-500 bg-gray-500/10';
    }
  };

  const panelStyle = {
    width: '380px',
    left: isOpen ? (sidebarOpen ? '16rem' : '0') : '-380px',
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed top-20 bg-gray-700 text-white p-2 rounded-lg z-50 hover:bg-gray-600 transition-all duration-300 ${isOpen
          ? (sidebarOpen ? 'left-[calc(16rem+380px+8px)]' : 'left-[388px]')
          : (sidebarOpen ? 'left-[calc(16rem+1rem)]' : 'left-4')
          }`}
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      <div
        className="fixed top-16 h-[calc(100vh-4rem)] bg-gray-800 border-r border-gray-700 transition-all duration-300 z-40"
        style={panelStyle}
      >
        <div className="bg-gray-700 p-4 border-b border-gray-600">
          <h2 className="text-white font-bold text-lg">Action & Recommendation Center</h2>
          <p className="text-gray-300 text-sm">Controller's inbox - items needing attention</p>
        </div>

        <div className="flex border-b border-gray-700">
          <button
            onClick={() => setActiveTab('alerts')}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${activeTab === 'alerts'
              ? 'bg-red-600 text-white'
              : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
          >
            Alerts (Urgent) <span className="ml-1 bg-red-500 text-white text-xs px-1 rounded">{alerts.length}</span>
          </button>
          <button
            onClick={() => setActiveTab('recommendations')}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${activeTab === 'recommendations'
              ? 'bg-blue-600 text-white'
              : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
          >
            AI Recommendations <span className="ml-1 bg-blue-500 text-white text-xs px-1 rounded">{recommendations.length}</span>
          </button>
        </div>

        <div className="p-4 h-full overflow-y-auto">
          {activeTab === 'alerts' && (
            <div className="space-y-3">
              {alerts.map(alert => (
                <div key={alert.id} className={`rounded-lg p-4 border-l-4 ${getSeverityColor(alert.severity)}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-white font-medium text-sm mb-1">{alert.title}</h3>
                      <p className="text-gray-300 text-xs mb-2">{alert.description}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">{alert.time}</span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${alert.severity === 'high' ? 'bg-red-600 text-white' :
                          alert.severity === 'medium' ? 'bg-yellow-600 text-white' : 'bg-blue-600 text-white'
                          }`}>
                          {alert.severity.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'recommendations' && (
            <div className="space-y-4">
              {recommendations.map(rec => (
                <div key={rec.id} className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                  <h3 className="text-white font-medium text-sm mb-2">{rec.title}</h3>
                  <p className="text-gray-300 text-xs mb-3">{rec.impact}</p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs text-gray-400">
                      Confidence: <span className="text-green-400 font-medium">{rec.confidence}%</span>
                    </span>
                    <div className="w-full bg-gray-600 rounded-full h-2 ml-4">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${rec.confidence}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <button className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors">
                      <Eye className="w-3 h-3" /> Details
                    </button>
                    <button className="flex items-center gap-1 px-3 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700 transition-colors">
                      <Play className="w-3 h-3" /> Simulate
                    </button>
                    <button className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors">
                      <Check className="w-3 h-3" /> Apply
                    </button>
                    <button className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors">
                      <X className="w-3 h-3" /> Override
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const TrainSimulationSystem = () => {
  const [trains, setTrains] = useState([]);
  const [simulationTime, setSimulationTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [realTime, setRealTime] = useState(new Date().toLocaleTimeString());
  const [alerts, setAlerts] = useState([]);
  const [collisionOverride, setCollisionOverride] = useState({});
  const [trainForm, setTrainForm] = useState({
    trainId: '',
    scheduledTime: '',
    departureTime: '',
    startSection: '',
    path: ''
  });
  const [showForm, setShowForm] = useState(false);
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [leftPanelOpen, setLeftPanelOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const intervalRef = useRef(null);

  // Update real time clock
  useEffect(() => {
    const clockInterval = setInterval(() => {
      setRealTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(clockInterval);
  }, []);

  // Simulation timer - 5 simulation minutes per real second
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSimulationTime(prev => prev + 5);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  // Format simulation time to HH:MM
  const formatSimTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  // Convert time string to minutes
  const timeToMinutes = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };

  // Add new train
  const addTrain = () => {
    if (!trainForm.trainId || !trainForm.scheduledTime || !trainForm.departureTime ||
      !trainForm.startSection || !trainForm.path) {
      alert('Please fill all fields');
      return;
    }

    const pathSections = trainForm.path.split(' ').filter(s => s.trim());
    const newTrain = {
      id: trainForm.trainId,
      scheduledTime: timeToMinutes(trainForm.scheduledTime),
      departureTime: timeToMinutes(trainForm.departureTime),
      path: pathSections,
      currentSectionIndex: 0,
      currentSection: pathSections[0],
      status: 'waiting',
      priority: trains.length + 1,
      timeInCurrentSection: 0,
      stationArrivalTime: null,
      isInStation: false
    };

    setTrains(prev => [...prev, newTrain]);
    setTrainForm({
      trainId: '',
      scheduledTime: '',
      departureTime: '',
      startSection: '',
      path: ''
    });
    setShowForm(false);
  };

  // Check for collisions
  const checkCollisions = (trainId, targetSection) => {
    return trains.some(train =>
      train.id !== trainId &&
      train.currentSection === targetSection &&
      train.status !== 'arrived'
    );
  };

  // Move trains logic
  useEffect(() => {
    setTrains(prevTrains => {
      const newAlerts = [];

      const updatedTrains = prevTrains.map(train => {
        if (train.status === 'arrived') return train;

        // Check if train should start
        if (train.status === 'waiting' && simulationTime >= train.scheduledTime) {
          return { ...train, status: 'moving' };
        }

        if (train.status === 'moving') {
          const currentSectionInfo = TRACK_SECTIONS[train.currentSection];

          // If in station, handle station time
          if (currentSectionInfo?.isStation && !train.isInStation) {
            const totalTravelTime = train.departureTime - train.scheduledTime;
            const sectionsToTravel = train.path.length - 1;
            const stationTime = Math.max(0, totalTravelTime - (sectionsToTravel * 12));

            return {
              ...train,
              isInStation: true,
              stationArrivalTime: simulationTime,
              timeInCurrentSection: 0,
              stationDwellTime: stationTime
            };
          }

          // Handle station dwelling
          if (train.isInStation && currentSectionInfo?.isStation) {
            const timeInStation = simulationTime - train.stationArrivalTime;
            if (timeInStation < train.stationDwellTime) {
              return train; // Stay in station
            } else {
              // Ready to leave station
              return { ...train, isInStation: false, timeInCurrentSection: 0 };
            }
          }

          // Regular section movement (12 minutes per section)
          const updatedTimeInSection = train.timeInCurrentSection + 5;

          if (updatedTimeInSection >= 12 * 60) {
            // Time to move to next section
            const nextSectionIndex = train.currentSectionIndex + 1;

            if (nextSectionIndex >= train.path.length) {
              // Train has reached destination
              return { ...train, status: 'arrived' };
            }

            const nextSection = train.path[nextSectionIndex];

            // Check for collision
            if (checkCollisions(train.id, nextSection) && !collisionOverride[train.id]) {
              // Collision detected, stop train
              newAlerts.push({
                id: Date.now() + Math.random(),
                trainId: train.id,
                message: `Collision risk: Train ${train.id} cannot move to section ${nextSection}`,
                type: 'collision',
                targetSection: nextSection
              });

              return { ...train, status: 'stopped', timeInCurrentSection: updatedTimeInSection };
            }

            // Move to next section
            return {
              ...train,
              currentSectionIndex: nextSectionIndex,
              currentSection: nextSection,
              timeInCurrentSection: 0
            };
          }

          return { ...train, timeInCurrentSection: updatedTimeInSection };
        }

        return train;
      });

      // Set new alerts
      if (newAlerts.length > 0) {
        setAlerts(prev => [...prev, ...newAlerts]);
      }

      return updatedTrains;
    });
  }, [simulationTime, collisionOverride]);

  // Handle collision override
  const handleOverride = (trainId, targetSection) => {
    setCollisionOverride(prev => ({ ...prev, [trainId]: true }));

    // Move the train to the target section (collision will occur)
    setTrains(prevTrains =>
      prevTrains.map(train => {
        if (train.id === trainId) {
          const nextSectionIndex = train.currentSectionIndex + 1;
          return {
            ...train,
            currentSectionIndex: nextSectionIndex,
            currentSection: targetSection,
            timeInCurrentSection: 0,
            status: 'moving'
          };
        }
        return train;
      })
    );

    // Remove the alert
    setAlerts(prev => prev.filter(alert => alert.trainId !== trainId));
  };

  // Clear alert
  const clearAlert = (alertId) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  // Reset simulation
  const resetSimulation = () => {
    setSimulationTime(0);
    setIsRunning(false);
    setTrains([]);
    setAlerts([]);
    setCollisionOverride({});
  };

  // Get train color based on status
  const getTrainColor = (train) => {
    if (train.status === 'moving') return '#22c55e'; // Green
    if (train.status === 'stopped') return '#ef4444'; // Red
    if (train.status === 'waiting') return '#6b7280'; // Gray
    if (train.status === 'arrived') return '#3b82f6'; // Blue
    return '#6b7280';
  };

  // Train Modal Component
  const TrainModal = ({ train, onClose, onOverride }) => {
    if (!train) return null;

    const getStatusText = (train) => {
      if (train.status === 'moving') return 'RUNNING';
      if (train.status === 'stopped') return 'STOPPED';
      if (train.status === 'waiting') return 'WAITING';
      if (train.status === 'arrived') return 'ARRIVED';
      return 'UNKNOWN';
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
        <div className="bg-gray-800 rounded-lg p-6 w-96 text-white border border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold">Train {train.id}</h2>
              <span className={`px-2 py-1 rounded text-xs font-semibold ${train.status === 'moving' ? 'bg-green-500' :
                train.status === 'stopped' ? 'bg-red-500' :
                  train.status === 'waiting' ? 'bg-gray-500' : 'bg-blue-500'
                }`}>
                {getStatusText(train)}
              </span>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X size={24} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Activity size={16} className="text-blue-400" />
              <div>
                <div className="text-sm text-gray-400">Status</div>
                <div className="text-lg font-semibold">{getStatusText(train)}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-blue-400" />
              <div>
                <div className="text-sm text-gray-400">Section</div>
                <div className="text-lg font-semibold">{train.currentSection}</div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-blue-400" />
              <div>
                <div className="text-sm text-gray-400">Scheduled</div>
                <div className="text-lg font-semibold">{formatSimTime(train.scheduledTime)}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-blue-400" />
              <div>
                <div className="text-sm text-gray-400">Departure</div>
                <div className="text-lg font-semibold">{formatSimTime(train.departureTime)}</div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-4 mb-3">
            <div className="text-sm text-gray-400">Progress</div>
            <div className="flex justify-between items-center">
              <div className="text-lg font-semibold">{train.currentSectionIndex + 1} / {train.path.length}</div>
              <div className="text-lg font-semibold">Path: {train.path.join(' → ')}</div>
            </div>
          </div>
          {train.status === 'stopped' && (
            <button
              onClick={() => onOverride && onOverride(train)}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              Override (Collision Risk)
            </button>
          )}
          <div className='w-full flex justify-center'>
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent parent card click (modal open)
                // Find the alert & handle override if exists:
                const alert = alerts.find(a => a.trainId === train.id);
                if (alert) {
                  handleOverride(train.id, alert.targetSection);
                }
              }}
              className="w mt-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-3 rounded-lg transition-colors"
            >
              Override
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 font-sans">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Global Header */}
      <GlobalHeader
        isLive={true}
        setIsLive={() => { }}
        currentTime={realTime}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Left Panel */}
      <LeftPanel
        isOpen={leftPanelOpen}
        setIsOpen={setLeftPanelOpen}
        sidebarOpen={sidebarOpen}
      />

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'} pt-16`}>
        <div className="p-4">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="bg-gray-800 rounded-lg p-4 mb-4">
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-white">Railway Train Simulation System</h1>
                <div className="flex items-center gap-4">
                  <div className="text-white text-right">
                    <div className="font-mono text-lg">Real Time: {realTime}</div>
                    <div className="font-mono text-lg">Sim Time: {formatSimTime(simulationTime)}</div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsRunning(!isRunning)}
                      className={`px-4 py-2 rounded-lg font-medium flex items-center gap-1 ${isRunning
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : 'bg-green-600 hover:bg-green-700 text-white'
                        }`}
                    >
                      {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      {isRunning ? ' Pause' : ' Start'}
                    </button>
                    <button
                      onClick={resetSimulation}
                      className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium flex items-center gap-1"
                    >
                      <RotateCcw className="w-4 h-4" /> Reset
                    </button>
                    <button
                      onClick={() => setShowForm(!showForm)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" /> Add Train
                    </button>
                  </div>
                </div>
              </div>

              {/* Train Input Form */}
              {showForm && (
                <div className="bg-gray-700 rounded-lg p-4 mb-4">
                  <h3 className="text-white font-bold mb-3">Add New Train</h3>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-gray-300 text-sm mb-1">Train ID</label>
                      <input
                        type="text"
                        value={trainForm.trainId}
                        onChange={(e) => setTrainForm(prev => ({ ...prev, trainId: e.target.value }))}
                        className="w-full bg-gray-600 text-white p-2 rounded border border-gray-500"
                        placeholder="e.g., T001"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 text-sm mb-1">Start Section</label>
                      <select
                        value={trainForm.startSection}
                        onChange={(e) => setTrainForm(prev => ({ ...prev, startSection: e.target.value }))}
                        className="w-full bg-gray-600 text-white p-2 rounded border border-gray-500"
                      >
                        <option value="">Select section</option>
                        {Object.keys(TRACK_SECTIONS).map(section => (
                          <option key={section} value={section}>{section}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-300 text-sm mb-1">Scheduled Time (HH:MM)</label>
                      <input
                        type="time"
                        value={trainForm.scheduledTime}
                        onChange={(e) => setTrainForm(prev => ({ ...prev, scheduledTime: e.target.value }))}
                        className="w-full bg-gray-600 text-white p-2 rounded border border-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 text-sm mb-1">Departure Time (HH:MM)</label>
                      <input
                        type="time"
                        value={trainForm.departureTime}
                        onChange={(e) => setTrainForm(prev => ({ ...prev, departureTime: e.target.value }))}
                        className="w-full bg-gray-600 text-white p-2 rounded border border-gray-500"
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-300 text-sm mb-1">Path (space-separated sections)</label>
                    <input
                      type="text"
                      value={trainForm.path}
                      onChange={(e) => setTrainForm(prev => ({ ...prev, path: e.target.value }))}
                      className="w-full bg-gray-600 text-white p-2 rounded border border-gray-500"
                      placeholder="e.g., A1 J1 P1A P1 P1D J4 E1"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={addTrain}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-medium"
                    >
                      Add Train
                    </button>
                    <button
                      onClick={() => setShowForm(false)}
                      className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Combined Track Network and Platform Schematic - WITH LARGER CIRCLES */}
              <div className="bg-gray-900 rounded-lg p-4">
                <h2 className="text-white font-bold mb-2">Platform Schematic</h2>
                <p className="text-gray-400 mb-4 text-sm">Click on trains for detailed information</p>

                <div className="relative w-full h-[600px] bg-gray-900 rounded-lg p-4 overflow-hidden">
                  <svg width="100%" height="100%" viewBox="0 0 1400 550" className="absolute inset-0">
                    <defs>
                      <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                        <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#374151" strokeWidth="0.5" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />

                    {/* Track lines - following 2nd image layout */}
                    <path d="M 0 120 L 1400 120" stroke="#6B7280" strokeWidth="4" />
                    <path d="M 0 140 L 1400 140" stroke="#6B7280" strokeWidth="4" />
                    <path d="M 0 220 L 1400 220" stroke="#6B7280" strokeWidth="4" />
                    <path d="M 0 240 L 1400 240" stroke="#6B7280" strokeWidth="4" />
                    <path d="M 0 320 L 1400 320" stroke="#6B7280" strokeWidth="4" />
                    <path d="M 0 340 L 1400 340" stroke="#6B7280" strokeWidth="4" />

                    {/* Junction lines - following 2nd image layout */}
                    <path d="M 150 120 L 350 140" stroke="#6B7280" strokeWidth="2" />
                    <path d="M 150 220 L 350 240" stroke="#6B7280" strokeWidth="2" />
                    <path d="M 150 320 L 350 340" stroke="#6B7280" strokeWidth="2" />
                    <path d="M 1050 120 L 1250 140" stroke="#6B7280" strokeWidth="2" />
                    <path d="M 1050 220 L 1250 240" stroke="#6B7280" strokeWidth="2" />
                    <path d="M 1050 320 L 1250 340" stroke="#6B7280" strokeWidth="2" />
                    <path d="M 100 80 L 350 240" stroke="#6B7280" strokeWidth="2" />
                    <path d="M 100 180 L 350 340" stroke="#6B7280" strokeWidth="2" />
                    <path d="M 1050 340 L 1300 180" stroke="#6B7280" strokeWidth="2" />
                    <path d="M 1050 240 L 1300 80" stroke="#6B7280" strokeWidth="2" />

                    {/* Central Station - following 2nd image design */}
                    <rect x="450" y="35" width="500" height="350" fill="#374151" stroke="#6B7280" strokeWidth="3" rx="12" fillOpacity="0.8" />
                    <rect x="400" y="100" width="600" height="25" fill="#4B5563" rx="4" />
                    <text x="700" y="118" textAnchor="middle" className="fill-white text-base font-semibold">Platform 1</text>
                    <rect x="400" y="200" width="600" height="25" fill="#4B5563" rx="4" />
                    <text x="700" y="218" textAnchor="middle" className="fill-white text-base font-semibold">Platform 2</text>
                    <rect x="400" y="300" width="600" height="25" fill="#4B5563" rx="4" />
                    <text x="700" y="318" textAnchor="middle" className="fill-white text-base font-semibold">Platform 3</text>

                    {/* Junction points with ENLARGED CIRCLES and proper labels */}
                    {/* Left side approach and junction nodes - INCREASED SIZE */}
                    <circle cx="100" cy="130" r="15" fill="#4B5563" stroke="#E5E7EB" strokeWidth="2" />
                    <text x="100" y="136" textAnchor="middle" className="fill-white text-sm font-bold">A1</text>
                    <circle cx="100" cy="230" r="15" fill="#4B5563" stroke="#E5E7EB" strokeWidth="2" />
                    <text x="100" y="236" textAnchor="middle" className="fill-white text-sm font-bold">A2</text>
                    <circle cx="100" cy="330" r="15" fill="#4B5563" stroke="#E5E7EB" strokeWidth="2" />
                    <text x="100" y="336" textAnchor="middle" className="fill-white text-sm font-bold">A3</text>

                    <circle cx="200" cy="130" r="15" fill="#4B5563" stroke="#E5E7EB" strokeWidth="2" />
                    <text x="200" y="136" textAnchor="middle" className="fill-white text-sm font-bold">J1</text>
                    <circle cx="200" cy="230" r="15" fill="#4B5563" stroke="#E5E7EB" strokeWidth="2" />
                    <text x="200" y="236" textAnchor="middle" className="fill-white text-sm font-bold">J2</text>
                    <circle cx="200" cy="330" r="15" fill="#4B5563" stroke="#E5E7EB" strokeWidth="2" />
                    <text x="200" y="336" textAnchor="middle" className="fill-white text-sm font-bold">J3</text>

                    <circle cx="350" cy="130" r="15" fill="#4B5563" stroke="#E5E7EB" strokeWidth="2" />
                    <text x="350" y="136" textAnchor="middle" className="fill-white text-sm font-bold">P1A</text>
                    <circle cx="350" cy="230" r="15" fill="#4B5563" stroke="#E5E7EB" strokeWidth="2" />
                    <text x="350" y="236" textAnchor="middle" className="fill-white text-sm font-bold">P2A</text>
                    <circle cx="350" cy="330" r="15" fill="#4B5563" stroke="#E5E7EB" strokeWidth="2" />
                    <text x="350" y="336" textAnchor="middle" className="fill-white text-sm font-bold">P3A</text>

                    {/* Platform nodes - INCREASED SIZE from 25 to 30 */}
                    <circle cx="500" cy="130" r="30" fill="#3B82F6" stroke="#E5E7EB" strokeWidth="2" />
                    <text x="500" y="138" textAnchor="middle" className="fill-white text-base font-bold">P1</text>
                    <circle cx="500" cy="230" r="30" fill="#3B82F6" stroke="#E5E7EB" strokeWidth="2" />
                    <text x="500" y="238" textAnchor="middle" className="fill-white text-base font-bold">P2</text>
                    <circle cx="500" cy="330" r="30" fill="#3B82F6" stroke="#E5E7EB" strokeWidth="2" />
                    <text x="500" y="338" textAnchor="middle" className="fill-white text-base font-bold">P3</text>

                    {/* Right side departure and junction nodes - INCREASED SIZE */}
                    <circle cx="650" cy="130" r="15" fill="#4B5563" stroke="#E5E7EB" strokeWidth="2" />
                    <text x="650" y="136" textAnchor="middle" className="fill-white text-sm font-bold">P1D</text>
                    <circle cx="650" cy="230" r="15" fill="#4B5563" stroke="#E5E7EB" strokeWidth="2" />
                    <text x="650" y="236" textAnchor="middle" className="fill-white text-sm font-bold">P2D</text>
                    <circle cx="650" cy="330" r="15" fill="#4B5563" stroke="#E5E7EB" strokeWidth="2" />
                    <text x="650" y="336" textAnchor="middle" className="fill-white text-sm font-bold">P3D</text>

                    <circle cx="750" cy="130" r="15" fill="#4B5563" stroke="#E5E7EB" strokeWidth="2" />
                    <text x="750" y="136" textAnchor="middle" className="fill-white text-sm font-bold">J4</text>
                    <circle cx="750" cy="230" r="15" fill="#4B5563" stroke="#E5E7EB" strokeWidth="2" />
                    <text x="750" y="236" textAnchor="middle" className="fill-white text-sm font-bold">J5</text>
                    <circle cx="750" cy="330" r="15" fill="#4B5563" stroke="#E5E7EB" strokeWidth="2" />
                    <text x="750" y="336" textAnchor="middle" className="fill-white text-sm font-bold">J6</text>

                    <circle cx="850" cy="130" r="15" fill="#4B5563" stroke="#E5E7EB" strokeWidth="2" />
                    <text x="850" y="136" textAnchor="middle" className="fill-white text-sm font-bold">E1</text>
                    <circle cx="850" cy="230" r="15" fill="#4B5563" stroke="#E5E7EB" strokeWidth="2" />
                    <text x="850" y="236" textAnchor="middle" className="fill-white text-sm font-bold">E2</text>
                    <circle cx="850" cy="330" r="15" fill="#4B5563" stroke="#E5E7EB" strokeWidth="2" />
                    <text x="850" y="336" textAnchor="middle" className="fill-white text-sm font-bold">E3</text>

                    {/* Direction indicators following 2nd image */}
                    <polygon points="1330,115 1370,120 1330,125" fill="#10B981" />
                    <polygon points="1330,135 1370,140 1330,145" fill="#10B981" />
                    <polygon points="1330,215 1370,220 1330,225" fill="#10B981" />
                    <polygon points="1330,235 1370,240 1330,245" fill="#10B981" />
                    <polygon points="1330,315 1370,320 1330,325" fill="#10B981" />
                    <polygon points="1330,335 1370,340 1330,345" fill="#10B981" />

                    {/* Track labels following 2nd image */}
                    <text x="20" y="115" className="fill-gray-400 text-sm">Track 1A</text>
                    <text x="20" y="155" className="fill-gray-400 text-sm">Track 1B</text>
                    <text x="20" y="215" className="fill-gray-400 text-sm">Track 2A</text>
                    <text x="20" y="255" className="fill-gray-400 text-sm">Track 2B</text>
                    <text x="20" y="315" className="fill-gray-400 text-sm">Track 3A</text>
                    <text x="20" y="355" className="fill-gray-400 text-sm">Track 3B</text>

                    {/* NEW: Additional track labels on the right side */}
                    <text x="1350" y="115" className="fill-gray-400 text-sm">Track 1A</text>
                    <text x="1350" y="155" className="fill-gray-400 text-sm">Track 1B</text>
                    <text x="1350" y="215" className="fill-gray-400 text-sm">Track 2A</text>
                    <text x="1350" y="255" className="fill-gray-400 text-sm">Track 2B</text>
                    <text x="1350" y="315" className="fill-gray-400 text-sm">Track 3A</text>
                    <text x="1350" y="355" className="fill-gray-400 text-sm">Track 3B</text>

                    {/* NEW: Exit node labels on the right side */}
                    <text x="900" y="136" textAnchor="start" className="fill-gray-300 text-sm font-bold">→ E1 Exit</text>
                    <text x="900" y="236" textAnchor="start" className="fill-gray-300 text-sm font-bold">→ E2 Exit</text>
                    <text x="900" y="336" textAnchor="start" className="fill-gray-300 text-sm font-bold">→ E3 Exit</text>
                  </svg>

                  {/* Train positions */}
                  <div className="absolute inset-0">
                    {trains.map(train => {
                      const section = TRACK_SECTIONS[train.currentSection];
                      if (!section) return null;

                      return (
                        <div key={train.id}
                          className="absolute cursor-pointer"
                          style={{
                            left: `${(section.x / 1400) * 100}%`,
                            top: `${((section.y - 45) / 550) * 100}%`,
                            transform: 'translate(-50%, 0)'
                          }}
                          onClick={() => setSelectedTrain(train)}>
                          <TrainSvg
                            color={getTrainColor(train)}
                            direction="right"
                            trainId={train.id}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-center mt-4 gap-6 text-sm text-gray-300">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#22c55e' }}></div>
                    <span>Running</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#eab308' }}></div>
                    <span>Delayed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#ef4444' }}></div>
                    <span>Stopped</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Alerts Panel */}
            {alerts.length > 0 && (
              <div className="bg-red-900 border border-red-600 rounded-lg p-4 mb-4">
                <h3 className="text-white font-bold mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Collision Alerts
                </h3>
                {alerts.map(alert => (
                  <div key={alert.id} className="bg-red-800 rounded p-3 mb-2 flex justify-between items-center">
                    <div className="text-white">
                      <div className="font-medium">Train {alert.trainId}</div>
                      <div className="text-sm opacity-90">{alert.message}</div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleOverride(alert.trainId, alert.targetSection)}
                        className="px-3 py-1 bg-orange-600 hover:bg-orange-700 text-white rounded text-sm"
                      >
                        Override (Collision Risk)
                      </button>
                      <button
                        onClick={() => clearAlert(alert.id)}
                        className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded text-sm"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Train Status Panel */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-white font-bold mb-3">Train Status</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {trains.map(train => (
                  <div key={train.id} className="bg-gray-700 rounded-lg p-3 cursor-pointer hover:bg-gray-600 transition-colors"
                    onClick={() => setSelectedTrain(train)}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white font-bold">{train.id}</span>
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: getTrainColor(train) }}
                      ></div>
                    </div>
                    <div className="text-gray-300 text-sm space-y-1">
                      <div>Status: <span className="font-medium text-white">{train.status.toUpperCase()}</span></div>
                      <div>Section: <span className="font-medium text-white">{train.currentSection}</span></div>
                      <div>Progress: <span className="font-medium text-white">{train.currentSectionIndex + 1}/{train.path.length}</span></div>
                      <div>Schedule: <span className="font-medium text-white">{formatSimTime(train.scheduledTime)}</span></div>
                      <div>Departure: <span className="font-medium text-white">{formatSimTime(train.departureTime)}</span></div>
                      <div>Section Time: <span className="font-medium text-white">{Math.floor((train.timeInCurrentSection || 0) / 60)}/12 min</span></div>
                      {train.isInStation && (
                        <div className="text-yellow-400">In Station - Dwelling ({Math.max(0, Math.floor((train.stationDwellTime - (simulationTime - train.stationArrivalTime)) / 60))} min left)</div>
                      )}
                    </div>
                    <div className='w-full flex justify-center'>
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent parent card click (modal open)
                          // Find the alert & handle override if exists:
                          const alert = alerts.find(a => a.trainId === train.id);
                          if (alert) {
                            handleOverride(train.id, alert.targetSection);
                          }
                        }}
                        className="w mt-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-3 rounded-lg transition-colors"
                      >
                        Override
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {trains.length === 0 && (
                <div className="text-gray-400 text-center py-8">
                  No trains scheduled. Click "Add Train" to begin simulation.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Train Modal */}
      <TrainModal
        train={selectedTrain}
        onClose={() => setSelectedTrain(null)}
        onOverride={(train) => {
          // Find the alert for this train and handle override
          const alert = alerts.find(a => a.trainId === train.id);
          if (alert) {
            handleOverride(train.id, alert.targetSection);
          }
          setSelectedTrain(null);
        }}
      />
    </div>
  );
};

export default TrainSimulationSystem;