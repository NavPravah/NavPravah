import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import {
  X, Clock, Zap, MapPin, AlertTriangle, ArrowRight, ArrowLeft,
  Bell, User, ChevronDown, Search, Activity, Wifi, Database,
  Eye, Play, Check, Menu, Plus, Pause, RotateCcw, Settings
} from 'lucide-react';
import Sidebar from '../Sidebar/Sidebar';

// ====== CONFIG ======
const API_URL = 'http://127.0.0.1:5000/optimize';

// ====== TrainSvg ======
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

// ====== TRACK SECTIONS ======
const TRACK_SECTIONS = {
  // Entry nodes
  Entry_1: { x: 50, y: 130, connections: ['A'] },
  Entry_4: { x: 50, y: 230, connections: ['A2'] },
  Entry_5: { x: 50, y: 330, connections: ['A3'] },
  Entry_9: { x: 950, y: 230, connections: [] },
  Entry_11: { x: 950, y: 330, connections: [] },
  Entry_12: { x: 950, y: 130, connections: [] },
  
  // Path nodes from optimization API
  A: { x: 150, y: 130, connections: ['P1_entry'] },
  B: { x: 150, y: 330, connections: ['P2_entry'] },
  P1_entry: { x: 350, y: 130, connections: ['P1_exit'] },
  P2_entry: { x: 350, y: 330, connections: ['P2_exit'] },
  P1_exit: { x: 650, y: 130, connections: ['F'] },
  P2_exit: { x: 650, y: 330, connections: ['E'] },
  F: { x: 750, y: 130, connections: ['Entry_12', 'E'] },
  E: { x: 750, y: 230, connections: ['Entry_9', 'Entry_11'] },
  
  // Original sections for fallback
  A1: { x: 100, y: 130, connections: ['J1'] },
  A2: { x: 100, y: 230, connections: ['J2'] },
  A3: { x: 100, y: 330, connections: ['J3'] },
  J1: { x: 200, y: 130, connections: ['P1A', 'J2'] },
  J2: { x: 200, y: 230, connections: ['P2A', 'J1', 'J3'] },
  J3: { x: 200, y: 330, connections: ['P3A', 'J2'] },
  P1A: { x: 350, y: 130, connections: ['P1'] },
  P2A: { x: 350, y: 230, connections: ['P2'] },
  P3A: { x: 350, y: 330, connections: ['P3'] },
  P1: { x: 500, y: 130, connections: ['P1D'], isStation: true, platform: 1 },
  P2: { x: 500, y: 230, connections: ['P2D'], isStation: true, platform: 2 },
  P3: { x: 500, y: 330, connections: ['P3D'], isStation: true, platform: 3 },
  P1D: { x: 650, y: 130, connections: ['J4'] },
  P2D: { x: 650, y: 230, connections: ['J5'] },
  P3D: { x: 650, y: 330, connections: ['J6'] },
  J4: { x: 750, y: 130, connections: ['E1', 'J5'] },
  J5: { x: 750, y: 230, connections: ['E2', 'J4', 'J6'] },
  J6: { x: 750, y: 330, connections: ['E3', 'J5'] },
  E1: { x: 850, y: 130, connections: [] },
  E2: { x: 850, y: 230, connections: [] },
  E3: { x: 850, y: 330, connections: [] },
};

// ====== GlobalHeader ======
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
    <header className={`bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center justify-between fixed top-0 right-0 z-50 transition-all duration-300 ${sidebarOpen ? 'left-64' : 'left-0'}`}>
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

// ====== LeftPanel ======
const LeftPanel = ({ isOpen, setIsOpen, sidebarOpen }) => {
  const [activeTab, setActiveTab] = useState('alerts');

  const alerts = [
    { id: 1, title: 'Signal S23 Failure', severity: 'high', time: '14:20', description: 'Critical signal malfunction detected' },
    { id: 2, title: 'Track Circuit T45 Occupied Unexpectedly', severity: 'medium', time: '14:18', description: 'Unexpected occupation on track circuit' },
    { id: 3, title: 'Platform P2 Overcrowding', severity: 'low', time: '14:15', description: 'Passenger density above normal threshold' }
  ];

  const recommendations = [
    { id: 1, title: 'Re-platform train 22104 to P6', impact: 'Est. Punctuality +6% | Resolves P5 Conflict', confidence: 95, type: 'routing' },
    { id: 2, title: 'Delay train EXP-401 by 3 minutes', impact: 'Prevents collision risk | +2% system efficiency', confidence: 87, type: 'scheduling' }
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
        className="fixed top-16 h-[calc(100vh-4rem)] bg-gray-800 border-r border-gray-700 transition-all duration-300 z-40 overflow-y-auto"
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

// ====== MAIN COMPONENT ======
const TrainSimulationSystem = () => {
  const [pendingTrains, setPendingTrains] = useState([]); // Trains waiting for optimization
  const [activeTrains, setActiveTrains] = useState([]); // Trains actually shown on map
  const [simulationTime, setSimulationTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [realTime, setRealTime] = useState(new Date().toLocaleTimeString());
  const [alerts, setAlerts] = useState([]);
  const [collisionOverride, setCollisionOverride] = useState({});
  const [optimizationResults, setOptimizationResults] = useState(null);
  const [trainForm, setTrainForm] = useState({
    trainId: '',
    trainType: '',
    scheduledTime: '',
    departureTime: '',
    startSection: '',
    path: '',
    delayFactors: {
      chainPullDelay: '',
      locoPilotDelay: '',
      mlWeatherDelay: ''
    }
  });
  const [showForm, setShowForm] = useState(false);
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [leftPanelOpen, setLeftPanelOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const intervalRef = useRef(null);
  const trainTimeoutsRef = useRef(new Map()); // Store timeouts for train departures

  // ====== HELPER FUNCTIONS ======
  const todayISODate = () => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const hhmmToIsoLocal = (hhmm) => {
    return `${todayISODate()}T${hhmm}:00`;
  };

  // ====== REAL TIME CLOCK ======
  useEffect(() => {
    const clockInterval = setInterval(() => {
      setRealTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(clockInterval);
  }, []);

  // ====== SIMULATION TIMER ======
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

  const formatSimTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  const timeToMinutes = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };

  // ====== API FUNCTIONS ======
  const buildOptimizePayload = (trainList) => {
    const trainsObj = {};
    for (const t of trainList) {
      const entry = t.path?.[0] || t.currentSection || t.startSection;
      const exit = t.path?.[t.path.length - 1];
      
      const delayFactors = (t.delayFactors && 
        (t.delayFactors.chainPullDelay || t.delayFactors.locoPilotDelay || t.delayFactors.mlWeatherDelay)) 
        ? {
            chain_pull_delay: parseInt(t.delayFactors.chainPullDelay) || 0,
            loco_pilot_delay: parseInt(t.delayFactors.locoPilotDelay) || 0,
            ml_weather_delay: parseInt(t.delayFactors.mlWeatherDelay) || 0
          } 
        : null;

      trainsObj[t.id] = {
        type: t.type || 'Passenger',
        entry_node: entry,
        exit_node: exit,
        scheduled_entry_time: hhmmToIsoLocal(t._scheduledHHMM || '12:00'),
        scheduled_exit_time: hhmmToIsoLocal(t._departureHHMM || '12:10'),
        delay_factors: delayFactors
      };
    }
    return {
      trains: trainsObj,
      non_functional_segments: []
    };
  };

  const optimizeAndStartSimulation = async () => {
    if (pendingTrains.length === 0) {
      toast.error('No trains added to optimize');
      return;
    }

    try {
      const payload = buildOptimizePayload(pendingTrains);
      console.log('Sending payload:', payload);
      
      const { data } = await axios.post(API_URL, payload, { timeout: 15000 });
      console.log('API Response:', data);
      
      setOptimizationResults(data);
      toast.success('Optimization completed successfully!');
      
      // Create active trains based on API response
      if (data.recommendations) {
        const newActiveTrains = pendingTrains.map(train => {
          const recommendation = data.recommendations.find(r => r.train_id === train.id);
          if (recommendation) {
            const adjustedDeparture = train.departureTime + (recommendation.total_delay_minutes || 0);
            
            // For REROUTED trains, use the rerouted path instead of original
            const finalPath = recommendation.action === 'REROUTED' 
              ? recommendation.path 
              : train.path;
            
            // Schedule departure timeout for PROCEED and REROUTED trains
            if (recommendation.action === 'PROCEED' || recommendation.action === 'REROUTED') {
              const departureTimeMs = adjustedDeparture * 60 * 1000; // Convert to milliseconds
              const timeoutId = setTimeout(() => {
                moveTrainToExit(train.id);
              }, departureTimeMs);
              trainTimeoutsRef.current.set(train.id, timeoutId);
            }
            
            return {
              ...train,
              recommendedPath: recommendation.path,
              totalDelay: recommendation.total_delay_minutes,
              action: recommendation.action,
              optimization: recommendation,
              path: finalPath, // Use rerouted path if applicable
              originalPath: train.path, // Keep original for reference
              currentSection: finalPath?.[0] || train.currentSection,
              currentSectionIndex: 0,
              adjustedDepartureTime: adjustedDeparture,
              status: 'waiting',
              timeInCurrentSection: 0,
              isVisible: false, // Will be shown based on 5-minute rule
              showTime: train.scheduledTime - 5 // Show 5 minutes before scheduled time
            };
          }
          return {
            ...train,
            isVisible: false,
            action: 'HOLD', // Default to HOLD if no recommendation
            showTime: train.scheduledTime - 5
          };
        });
        
        setActiveTrains(newActiveTrains);
        // Clear pending trains as they're now active
        setPendingTrains([]);
      }
    } catch (err) {
      console.error('API Error:', err);
      toast.error('Failed to apply optimization. Please try again later.');
      setOptimizationResults(null);
    }
  };

  // ====== TRAIN DEPARTURE LOGIC ======
  const moveTrainToExit = (trainId) => {
    setActiveTrains(prev => prev.map(train => {
      if (train.id === trainId && (train.action === 'PROCEED' || train.action === 'REROUTED')) {
        // Move train from entry to exit position
        const exitSection = train.path[train.path.length - 1];
        return {
          ...train,
          currentSection: exitSection,
          currentSectionIndex: train.path.length - 1,
          status: 'arrived'
        };
      }
      return train;
    }));
    
    // Clean up timeout
    if (trainTimeoutsRef.current.has(trainId)) {
      trainTimeoutsRef.current.delete(trainId);
    }
  };

  // ====== ADD TRAIN ======
  const addTrain = () => {
    if (
      !trainForm.trainId ||
      !trainForm.trainType ||
      !trainForm.scheduledTime ||
      !trainForm.departureTime ||
      !trainForm.startSection ||
      !trainForm.path
    ) {
      toast.error('Please fill all required fields');
      return;
    }

    const pathSections = trainForm.path.split(' ').filter(s => s.trim());

    const newTrain = {
      id: trainForm.trainId,
      type: trainForm.trainType,
      _scheduledHHMM: trainForm.scheduledTime,
      _departureHHMM: trainForm.departureTime,
      scheduledTime: timeToMinutes(trainForm.scheduledTime),
      departureTime: timeToMinutes(trainForm.departureTime),
      adjustedDepartureTime: timeToMinutes(trainForm.departureTime),
      path: pathSections,
      currentSectionIndex: 0,
      currentSection: pathSections[0],
      status: 'waiting',
      priority: pendingTrains.length + 1,
      timeInCurrentSection: 0,
      stationArrivalTime: null,
      isInStation: false,
      delayFactors: trainForm.delayFactors,
      optimization: null,
      action: null,
      isVisible: false // Not visible until simulation starts and 5-minute rule
    };

    setPendingTrains(prev => [...prev, newTrain]);
    toast.success(`Train ${trainForm.trainId} added successfully. Start simulation to see it on the map.`);

    // Reset form
    setTrainForm({
      trainId: '',
      trainType: '',
      scheduledTime: '',
      departureTime: '',
      startSection: '',
      path: '',
      delayFactors: {
        chainPullDelay: '',
        locoPilotDelay: '',
        mlWeatherDelay: ''
      }
    });
    setShowForm(false);
  };

  // ====== TRAIN MOVEMENT LOGIC ======
  useEffect(() => {
    setActiveTrains(prevTrains => {
      const newAlerts = [];

      const updatedTrains = prevTrains.map(train => {
        // 5-minute visibility rule: Show train 5 minutes before scheduled time
        const shouldBeVisible = simulationTime >= (train.showTime || train.scheduledTime - 5);
        
        if (!shouldBeVisible) {
          return { ...train, isVisible: false };
        }

        // Now the train should be visible
        if (!train.isVisible) {
          train = { ...train, isVisible: true };
        }

        if (train.status === 'arrived') return train;

        // Handle HOLD action - train stays at entry position
        if (train.action === 'HOLD') {
          return { 
            ...train, 
            status: 'held',
            currentSection: train.path[0] // Stay at entry
          };
        }

        // Handle PROCEED and REROUTED actions
        if (train.action === 'PROCEED' || train.action === 'REROUTED') {
          // Start moving at scheduled time
          if (train.status === 'waiting' && simulationTime >= train.scheduledTime) {
            return { ...train, status: 'moving' };
          }

          // Move through the path based on simulation time
          if (train.status === 'moving') {
            const timeElapsed = simulationTime - train.scheduledTime;
            const totalTravelTime = train.adjustedDepartureTime - train.scheduledTime;
            const pathLength = train.path.length;
            
            if (timeElapsed >= totalTravelTime) {
              // Reached destination
              return {
                ...train,
                status: 'arrived',
                currentSection: train.path[pathLength - 1],
                currentSectionIndex: pathLength - 1
              };
            } else if (pathLength > 1) {
              // Calculate current position based on time elapsed
              const progressRatio = timeElapsed / totalTravelTime;
              const targetIndex = Math.floor(progressRatio * (pathLength - 1));
              const actualIndex = Math.min(Math.max(targetIndex, 0), pathLength - 1);
              
              return {
                ...train,
                currentSectionIndex: actualIndex,
                currentSection: train.path[actualIndex],
                timeInCurrentSection: 0
              };
            }
          }
        }

        return train;
      });

      if (newAlerts.length > 0) {
        setAlerts(prev => [...prev, ...newAlerts]);
      }

      return updatedTrains;
    });
  }, [simulationTime]);

  // ====== EVENT HANDLERS ======
  const resetSimulation = () => {
    setSimulationTime(0);
    setIsRunning(false);
    setActiveTrains([]);
    setPendingTrains([]);
    setAlerts([]);
    setCollisionOverride({});
    setOptimizationResults(null);
    
    // Clear all train timeouts
    trainTimeoutsRef.current.forEach(timeoutId => clearTimeout(timeoutId));
    trainTimeoutsRef.current.clear();
    
    toast.success('Simulation reset');
  };

  const getTrainColor = (train) => {
    // Color based on action - Green for PROCEED, Red for HOLD, Yellow for REROUTED
    if (train.action === 'PROCEED') return '#22c55e'; // Green
    if (train.action === 'HOLD') return '#ef4444'; // Red
    if (train.action === 'REROUTED') return '#eab308'; // Yellow
    
    // Fallback to gray for trains without optimization
    return '#6b7280'; // Gray
  };

  // ====== TRAIN MODAL ======
  const TrainModal = ({ train, onClose }) => {
    if (!train) return null;

    const getStatusText = (train) => {
      if (train.action === 'HOLD') return 'WAITING';
      if (train.action === 'PROCEED') {
        if (train.status === 'arrived') return 'ARRIVED';
        if (train.status === 'moving') return 'PROCEEDING';
        return 'READY TO PROCEED';
      }
      if (train.action === 'REROUTED') {
        if (train.status === 'arrived') return 'ARRIVED (REROUTED)';
        if (train.status === 'moving') return 'PROCEEDING (REROUTED)';
        return 'READY TO PROCEED (REROUTED)';
      }
      return train.status?.toUpperCase() || 'UNKNOWN';
    };

    const OptimizationBlock = () => {
      const opt = train.optimization;
      return (
        <div className="mt-4">
          <div className="text-sm text-gray-400 mb-1">Optimization</div>
          {!opt && <div className="text-gray-300 text-sm">PROCEED: Delay 0min</div>}
          {opt && (
            <>
              <div className={`text-sm mb-2 ${
                opt.action === 'PROCEED' ? 'text-green-400' :
                opt.action === 'HOLD' ? 'text-red-400' :
                opt.action === 'REROUTED' ? 'text-yellow-400' :
                'text-gray-400'
              }`}>
                {opt.action}: Delay {opt.total_delay_minutes}min
              </div>
              <div className="bg-gray-900 border border-gray-700 rounded p-2 max-h-40 overflow-auto text-xs">
                <div className="text-white space-y-1">
                  <div>Action: <span className={
                    opt.action === 'PROCEED' ? 'text-green-400' :
                    opt.action === 'HOLD' ? 'text-red-400' :
                    opt.action === 'REROUTED' ? 'text-yellow-400' :
                    'text-gray-400'
                  }>{opt.action}</span></div>
                  <div>Total Delay: {opt.total_delay_minutes} minutes</div>
                  <div>Path: {opt.path?.join(' → ')}</div>
                  {train.originalPath && opt.action === 'REROUTED' && (
                    <div className="border-t border-gray-600 pt-1 mt-1">
                      <div className="text-gray-400">Original Path: {train.originalPath.join(' → ')}</div>
                      <div className="text-yellow-400">Rerouted Path: {opt.path?.join(' → ')}</div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      );
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
        <div className="bg-gray-800 rounded-lg p-6 w-96 text-white border border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold">Train {train.id}</h2>
              <span className={`px-2 py-1 rounded text-xs font-semibold ${
                train.action === 'PROCEED' ? 'bg-green-500' :
                train.action === 'HOLD' ? 'bg-red-500' :
                train.action === 'REROUTED' ? 'bg-yellow-500 text-black' :
                'bg-gray-500'
                }`}>
                {getStatusText(train)}
              </span>
            </div>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }} 
              className="text-gray-400 hover:text-white"
            >
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
                <div className="text-lg font-semibold">{formatSimTime(train.adjustedDepartureTime || train.departureTime)}</div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-4 mb-3">
            <div className="text-sm text-gray-400">Progress</div>
            <div className="flex justify-between items-center">
              <div className="text-lg font-semibold">{train.currentSectionIndex + 1} / {train.path.length}</div>
              <div className="text-sm">Path: {train.path.join(' → ')}</div>
            </div>
          </div>

          <OptimizationBlock />
        </div>
      </div>
    );
  };

  // ====== RENDER ======
  return (
    <div className="min-h-screen bg-gray-900 font-sans">
      <Toaster position="top-right" />
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <GlobalHeader
        isLive={true}
        setIsLive={() => { }}
        currentTime={realTime}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <LeftPanel
        isOpen={leftPanelOpen}
        setIsOpen={setLeftPanelOpen}
        sidebarOpen={sidebarOpen}
      />

      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'} pt-16`}>
        <div className="p-4">
          <div className="max-w-7xl mx-auto">
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
                      onClick={() => {
                        if (!isRunning && pendingTrains.length > 0) {
                          optimizeAndStartSimulation();
                        }
                        setIsRunning(!isRunning);
                      }}
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
                      <label className="block text-gray-300 text-sm mb-1">Train Type</label>
                      <select
                        value={trainForm.trainType}
                        onChange={(e) => setTrainForm(prev => ({ ...prev, trainType: e.target.value }))}
                        className="w-full bg-gray-600 text-white p-2 rounded border border-gray-500"
                      >
                        <option value="">Select type</option>
                        <option value="Passenger">Passenger</option>
                        <option value="Local">Local</option>
                        <option value="Freight">Freight</option>
                      </select>
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
                      placeholder="e.g., Entry_1 A P1_entry P1_exit F Entry_12"
                    />
                  </div>

                  {/* Delay Factors */}
                  <div className="mb-4">
                    <h4 className="text-white font-medium mb-2">Delay Factors (Optional)</h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-gray-300 text-xs mb-1">Chain Pull Delay (min)</label>
                        <input
                          type="number"
                          value={trainForm.delayFactors.chainPullDelay}
                          onChange={(e) => setTrainForm(prev => ({
                            ...prev,
                            delayFactors: { ...prev.delayFactors, chainPullDelay: e.target.value }
                          }))}
                          className="w-full bg-gray-600 text-white p-2 rounded border border-gray-500 text-sm"
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 text-xs mb-1">Loco Pilot Delay (min)</label>
                        <input
                          type="number"
                          value={trainForm.delayFactors.locoPilotDelay}
                          onChange={(e) => setTrainForm(prev => ({
                            ...prev,
                            delayFactors: { ...prev.delayFactors, locoPilotDelay: e.target.value }
                          }))}
                          className="w-full bg-gray-600 text-white p-2 rounded border border-gray-500 text-sm"
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 text-xs mb-1">Weather Delay (min)</label>
                        <input
                          type="number"
                          value={trainForm.delayFactors.mlWeatherDelay}
                          onChange={(e) => setTrainForm(prev => ({
                            ...prev,
                            delayFactors: { ...prev.delayFactors, mlWeatherDelay: e.target.value }
                          }))}
                          className="w-full bg-gray-600 text-white p-2 rounded border border-gray-500 text-sm"
                          placeholder="0"
                        />
                      </div>
                    </div>
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

              {/* PLATFORM SCHEMATIC */}
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

                    {/* Track Lines */}
                    <path d="M 0 120 L 1400 120" stroke="#6B7280" strokeWidth="4" />
                    <path d="M 0 140 L 1400 140" stroke="#6B7280" strokeWidth="4" />
                    <path d="M 0 220 L 1400 220" stroke="#6B7280" strokeWidth="4" />
                    <path d="M 0 240 L 1400 240" stroke="#6B7280" strokeWidth="4" />
                    <path d="M 0 320 L 1400 320" stroke="#6B7280" strokeWidth="4" />
                    <path d="M 0 340 L 1400 340" stroke="#6B7280" strokeWidth="4" />

                    {/* Junction Lines */}
                    <path d="M 150 120 L 350 140" stroke="#6B7280" strokeWidth="2" />
                    <path d="M 150 220 L 350 240" stroke="#6B7280" strokeWidth="2" />
                    <path d="M 150 320 L 350 340" stroke="#6B7280" strokeWidth="2" />
                    <path d="M 1050 120 L 1250 140" stroke="#6B7280" strokeWidth="2" />
                    <path d="M 1050 220 L 1250 240" stroke="#6B7280" strokeWidth="2" />
                    <path d="M 1050 320 L 1250 340" stroke="#6B7280" strokeWidth="2" />

                    {/* Platform Area */}
                    <rect x="450" y="35" width="500" height="350" fill="#374151" stroke="#6B7280" strokeWidth="3" rx="12" fillOpacity="0.8" />
                    <rect x="400" y="100" width="600" height="25" fill="#4B5563" rx="4" />
                    <text x="700" y="118" textAnchor="middle" className="fill-white text-base font-semibold">Platform 1</text>
                    <rect x="400" y="200" width="600" height="25" fill="#4B5563" rx="4" />
                    <text x="700" y="218" textAnchor="middle" className="fill-white text-base font-semibold">Platform 2</text>
                    <rect x="400" y="300" width="600" height="25" fill="#4B5563" rx="4" />
                    <text x="700" y="318" textAnchor="middle" className="fill-white text-base font-semibold">Platform 3</text>

                    {/* Track Sections */}
                    {Object.entries(TRACK_SECTIONS).map(([id, section]) => (
                      <g key={id}>
                        <circle 
                          cx={section.x} 
                          cy={section.y} 
                          r={section.isStation ? 30 : 15} 
                          fill={section.isStation ? "#3B82F6" : "#4B5563"} 
                          stroke="#E5E7EB" 
                          strokeWidth="2" 
                        />
                        <text 
                          x={section.x} 
                          y={section.y + 6} 
                          textAnchor="middle" 
                          className={`fill-white ${section.isStation ? 'text-base' : 'text-sm'} font-bold`}
                        >
                          {id}
                        </text>
                      </g>
                    ))}

                    {/* Status Indicators */}
                    <g className="text-xs">
                      <circle cx="1300" cy="120" r="8" fill="#22c55e" />
                      <text x="1320" y="125" className="fill-white">PROCEED</text>
                      <circle cx="1300" cy="140" r="8" fill="#ef4444" />
                      <text x="1320" y="145" className="fill-white">HOLD</text>
                      <circle cx="1300" cy="160" r="8" fill="#eab308" />
                      <text x="1320" y="165" className="fill-white">REROUTED</text>
                      <circle cx="1300" cy="180" r="8" fill="#6b7280" />
                      <text x="1320" y="185" className="fill-white">Waiting</text>
                    </g>

                    {/* Render Active Trains Only (with 5-minute visibility rule) */}
                    {activeTrains.filter(train => train.isVisible).map(train => {
                      const sectionInfo = TRACK_SECTIONS[train.currentSection];
                      if (!sectionInfo) return null;

                      return (
                        <g key={train.id} onClick={() => setSelectedTrain(train)} className="cursor-pointer">
                          <foreignObject
                            x={sectionInfo.x - 24}
                            y={sectionInfo.y - 10}
                            width="48"
                            height="20"
                          >
                            <TrainSvg
                              color={getTrainColor(train)}
                              direction="right"
                              trainId={train.id}
                            />
                          </foreignObject>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </div>
            </div>

            {/* OPTIMIZATION RESULTS */}
            {optimizationResults && (
              <div className="bg-gray-800 rounded-lg p-4 mb-4">
                <h2 className="text-white font-bold mb-4">Optimization Results</h2>
                <div className="bg-gray-700 rounded-lg p-4 mb-4">
                  <div className="text-white text-lg font-semibold mb-2">
                    Total Score: {optimizationResults.score}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {optimizationResults.recommendations?.map((rec, index) => (
                      <div key={index} className="bg-gray-600 rounded-lg p-3">
                        <h3 className="text-white font-bold mb-2">Train {rec.train_id}</h3>
                        <div className="text-gray-300 text-sm space-y-1">
                          <div>Action: <span className={
                            rec.action === 'PROCEED' ? 'text-green-400' :
                            rec.action === 'HOLD' ? 'text-red-400' :
                            rec.action === 'REROUTED' ? 'text-yellow-400' :
                            'text-gray-400'
                          }>{rec.action}</span></div>
                          <div>Delay: <span className="text-yellow-400">{rec.total_delay_minutes} min</span></div>
                          <div className="text-xs">Path: {rec.path?.join(' → ')}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* PENDING TRAINS SECTION */}
            {pendingTrains.length > 0 && (
              <div className="bg-gray-800 rounded-lg p-4 mb-4">
                <h2 className="text-white font-bold mb-4">Pending Trains (Waiting for Simulation Start)</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pendingTrains.map(train => (
                    <div key={train.id} className="bg-gray-700 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-white font-bold">{train.id}</h3>
                        <span className="px-2 py-1 rounded text-xs font-semibold bg-yellow-500 text-black">
                          PENDING
                        </span>
                      </div>
                      <div className="text-gray-300 text-sm space-y-1">
                        <div>Type: {train.type}</div>
                        <div>Path: {train.path.join(' → ')}</div>
                        <div>Schedule: {formatSimTime(train.scheduledTime)}</div>
                        <div>Departure: {formatSimTime(train.departureTime)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ACTIVE TRAIN STATUS SECTION */}
            {activeTrains.length > 0 && (
              <div className="bg-gray-800 rounded-lg p-4 mb-4">
                <h2 className="text-white font-bold mb-4">Active Train Status</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {activeTrains.map(train => (
                    <div
                      key={train.id}
                      onClick={() => setSelectedTrain(train)}
                      className="bg-gray-700 rounded-lg p-4 cursor-pointer hover:bg-gray-600 transition-colors"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-white font-bold">{train.id}</h3>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          train.action === 'PROCEED' ? 'bg-green-500' :
                          train.action === 'HOLD' ? 'bg-red-500' :
                          train.action === 'REROUTED' ? 'bg-yellow-500 text-black' :
                          'bg-gray-500'
                          }`}>
                          {train.action === 'HOLD' ? 'WAITING' : 
                           train.action === 'PROCEED' && train.status === 'moving' ? 'PROCEEDING' :
                           train.action === 'PROCEED' && train.status === 'arrived' ? 'ARRIVED' :
                           train.action === 'PROCEED' ? 'READY' :
                           train.action === 'REROUTED' && train.status === 'moving' ? 'REROUTED' :
                           train.action === 'REROUTED' && train.status === 'arrived' ? 'ARRIVED (R)' :
                           train.action === 'REROUTED' ? 'READY (R)' :
                           train.status?.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-gray-300 text-sm space-y-1">
                        <div>Type: {train.type}</div>
                        <div>Section: <span className="font-mono">{train.currentSection}</span></div>
                        <div>Progress: {train.currentSectionIndex + 1}/{train.path.length}</div>
                        <div>Schedule: {formatSimTime(train.scheduledTime)}</div>
                        <div>Departure: {formatSimTime(train.adjustedDepartureTime || train.departureTime)}</div>
                        <div>Visible: <span className={train.isVisible ? 'text-green-400' : 'text-red-400'}>
                          {train.isVisible ? 'Yes' : `At ${formatSimTime((train.showTime || train.scheduledTime - 5))}`}
                        </span></div>
                        
                        {/* Optimization Status */}
                        <div className="border-t border-gray-600 pt-2 mt-2">
                          <div className="text-xs text-gray-400">Optimization:</div>
                          {train.optimization && (
                            <div className={`text-xs ${
                              train.optimization.action === 'PROCEED' ? 'text-green-400' :
                              train.optimization.action === 'HOLD' ? 'text-red-400' :
                              train.optimization.action === 'REROUTED' ? 'text-yellow-400' :
                              'text-gray-400'
                            }`}>
                              {train.optimization.action} - Delay: {train.optimization.total_delay_minutes}min
                              {train.optimization.action === 'REROUTED' && (
                                <div className="text-xs text-gray-400 mt-1">
                                  Rerouted to: {train.optimization.path?.join(' → ')}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* TRAIN MODAL */}
      {selectedTrain && (
        <TrainModal
          train={selectedTrain}
          onClose={() => setSelectedTrain(null)}
        />
      )}
    </div>
  );
};

export default TrainSimulationSystem;