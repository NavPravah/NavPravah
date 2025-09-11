import React, { useState, useEffect } from 'react';
import { 
  X, Clock, Zap, MapPin, AlertTriangle, ArrowRight, ArrowLeft,
  Bell, User, ChevronDown, Search, Activity, Wifi, Database,
  Eye, Play, Check, Menu
} from 'lucide-react';
import Sidebar from '../Sidebar/Sidebar';

// This new component renders the train's SVG shape
const TrainSvg = ({ color, direction }) => {
  return (
    <svg
      width="64"
      height="24"
      viewBox="0 0 64 24"
      xmlns="http://www.w3.org/2000/svg"
      className="drop-shadow-lg"
      style={{ transform: direction === 'left' ? 'scaleX(-1)' : 'none', overflow: 'visible' }}
    >
      <g>
        <path
          d="M 5 3 L 52 3 L 62 12 L 62 21 L 5 21 Z"
          fill={color}
          stroke="#111827"
          strokeWidth="1"
        />
        <rect x="10" y="7" width="13" height="7" fill="#a5f3fc" rx="1" opacity="0.9" />
        <rect x="26" y="7" width="13" height="7" fill="#a5f3fc" rx="1" opacity="0.9" />
        <circle cx="60" cy="15" r="1.5" fill="#fef08a" />
      </g>
    </svg>
  );
};

// Global Header Component
const GlobalHeader = ({ isLive, setIsLive, currentTime, sidebarOpen, setSidebarOpen }) => {
  const [notifications, setNotifications] = useState(3);
  
  const systemStatus = {
    signalling: 'green',
    tms: 'amber',
    dataFeed: 'green'
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'green': return 'bg-green-500';
      case 'amber': return 'bg-yellow-500';
      case 'red': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <header className={`bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center justify-between fixed top-0 right-0 z-50 transition-all duration-300 ${
      sidebarOpen ? 'left-64' : 'left-0'
    }`}>
      {/* Left: Logo & App Name */}
      <div className="flex items-center gap-4">
        {/* Sidebar Toggle Button */}
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

      {/* Center: Live/Sandbox Toggle & Search */}
      <div className="flex items-center gap-6">
        {/* Master Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search train, platform, signal..."
            className="bg-gray-700 text-white pl-10 pr-4 py-2 rounded-lg w-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Right: System Status, Notifications, User, Clock */}
      <div className="flex items-center gap-4">
        {/* System Status */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-300">Status:</span>
          <div className="flex gap-1">
            <div className={`w-3 h-3 rounded-full ${getStatusColor(systemStatus.signalling)}`} title="Signalling" />
            <div className={`w-3 h-3 rounded-full ${getStatusColor(systemStatus.tms)}`} title="TMS" />
            <div className={`w-3 h-3 rounded-full ${getStatusColor(systemStatus.dataFeed)}`} title="Data Feed" />
          </div>
        </div>

        {/* Notifications */}
        <div className="relative">
          <Bell className="w-5 h-5 text-gray-300 cursor-pointer hover:text-white" />
          {notifications > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {notifications}
            </span>
          )}
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-2 text-white">
          <User className="w-5 h-5" />
          <div className="text-sm">
            <div className="font-medium">John Doe</div>
            <div className="text-xs text-gray-400">Dispatcher</div>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </div>

        {/* Master Clock */}
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
    switch(severity) {
      case 'high': return 'border-red-500 bg-red-500/10';
      case 'medium': return 'border-yellow-500 bg-yellow-500/10';
      case 'low': return 'border-blue-500 bg-blue-500/10';
      default: return 'border-gray-500 bg-gray-500/10';
    }
  };
  
  // THIS IS THE FIX: A new, robust positioning logic for the panel
  const panelStyle = {
    width: '380px',
    left: isOpen ? (sidebarOpen ? '16rem' : '0') : '-380px', // Controls position directly
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed top-20 bg-gray-700 text-white p-2 rounded-lg z-50 hover:bg-gray-600 transition-all duration-300 ${
          isOpen
            ? (sidebarOpen ? 'left-[calc(16rem+380px+8px)]' : 'left-[388px]')
            : (sidebarOpen ? 'left-[calc(16rem+1rem)]' : 'left-4')
        }`}
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Left Panel */}
      <div 
        className="fixed top-16 h-[calc(100vh-4rem)] bg-gray-800 border-r border-gray-700 transition-all duration-300 z-40"
        style={panelStyle} // Apply the new positioning style here
      >
        
        {/* Panel Header */}
        <div className="bg-gray-700 p-4 border-b border-gray-600">
          <h2 className="text-white font-bold text-lg">Action & Recommendation Center</h2>
          <p className="text-gray-300 text-sm">Controller's inbox - items needing attention</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-700">
          <button
            onClick={() => setActiveTab('alerts')}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === 'alerts' 
                ? 'bg-red-600 text-white' 
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            Alerts (Urgent) <span className="ml-1 bg-red-500 text-white text-xs px-1 rounded">{alerts.length}</span>
          </button>
          <button
            onClick={() => setActiveTab('recommendations')}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === 'recommendations' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            AI Recommendations <span className="ml-1 bg-blue-500 text-white text-xs px-1 rounded">{recommendations.length}</span>
          </button>
        </div>

        {/* Content */}
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
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          alert.severity === 'high' ? 'bg-red-600 text-white' :
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
                        style={{width: `${rec.confidence}%`}}
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
                      <X className="w-3 h-3" /> Dismiss
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

const LiveStatus = () => {
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLive, setIsLive] = useState(true);
  const [leftPanelOpen, setLeftPanelOpen] = useState(false);
  const [masterClock, setMasterClock] = useState('14:23:45');
  const [sidebarOpen, setSidebarOpen] = useState(false); // Changed initial state to match video

  // Update master clock every second
  useEffect(() => {
    const clockInterval = setInterval(() => {
      const now = new Date();
      setMasterClock(now.toLocaleTimeString('en-US', { hour12: false }));
    }, 1000);
    return () => clearInterval(clockInterval);
  }, []);

  // Sample train data for different tracks
  const trainData = {
    track1: [
      { id: 'EXP-101', number: 'EXP-101', speed: 85, delay: 0, distance: 2.5, arrival: '14:25', destination: 'Central Station', platform: 1, direction: 'right' },
      null,
      { id: 'RAJ-234', number: 'RAJ-234', speed: 0, delay: 2, distance: 0, arrival: '14:32', destination: 'Mumbai Central', platform: 1, direction: 'left' },
      { id: 'SUP-167', number: 'SUP-167', speed: 72, delay: 5, distance: 1.8, arrival: '14:40', destination: 'Delhi Junction', platform: 1, direction: 'left' },
      null
    ],
    track2: [
      null,
      { id: 'LOC-203', number: 'LOC-203', speed: 0, delay: 5, distance: 0, arrival: '14:30', destination: 'North Terminal', platform: 2, direction: 'right' },
      null,
      { id: 'REG-305', number: 'REG-305', speed: 45, delay: 12, distance: 8.2, arrival: '14:42', destination: 'South Junction', platform: 2, direction: 'right' },
      null
    ],
    track3: [
      { id: 'EXP-401', number: 'EXP-401', speed: 90, delay: 0, distance: 3.2, arrival: '14:28', destination: 'Bangalore City', platform: 3, direction: 'left' },
      null,
      { id: 'LOC-502', number: 'LOC-502', speed: 0, delay: 8, distance: 0, arrival: '14:35', destination: 'Chennai Central', platform: 3, direction: 'right' },
      null,
      { id: 'SUP-603', number: 'SUP-603', speed: 65, delay: 3, arrival: '14:45', distance: 4.1, destination: 'Kolkata Station', platform: 3, direction: 'left' }
    ]
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(prev => (prev + 1) % 5);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const getTrainAtTime = (trackData) => {
    return trackData[currentTime];
  };

  const getTrainStatusHexColor = (train) => {
    if (!train) return '#6b7280';
    if (train.delay > 0) return '#eab308';
    if (train.speed === 0) return '#ef4444';
    return '#22c55e';
  };

  const getTrainStatusText = (train) => {
    if (!train) return '';
    if (train.delay > 0) return 'DELAYED';
    if (train.speed === 0) return 'STOPPED';
    return 'MOVING';
  };

  const TrainModal = ({ train, onClose }) => {
    if (!train) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
        <div className="bg-gray-800 rounded-lg p-6 w-96 text-white border border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold">Train {train.number}</h2>
              <span className={`px-2 py-1 rounded text-xs font-semibold ${
                getTrainStatusHexColor(train) === '#eab308' ? 'bg-yellow-500 text-black' :
                getTrainStatusHexColor(train) === '#ef4444' ? 'bg-red-500' : 'bg-green-500'
              }`}>
                {getTrainStatusText(train)}
              </span>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X size={24} />
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Zap size={16} className="text-blue-400" />
              <div>
                <div className="text-sm text-gray-400">Speed</div>
                <div className="text-lg font-semibold">{train.speed} km/h</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-blue-400" />
              <div>
                <div className="text-sm text-gray-400">Distance</div>
                <div className="text-lg font-semibold">{train.distance} km</div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-blue-400" />
              <div>
                <div className="text-sm text-gray-400">Arrival Time</div>
                <div className="text-lg font-semibold">{train.arrival}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle size={16} className="text-blue-400" />
              <div>
                <div className="text-sm text-gray-400">Delay</div>
                <div className="text-lg font-semibold">
                  {train.delay > 0 ? `+${train.delay} min` : '0 min'}
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-4 mb-6">
            <div className="text-sm text-gray-400">Track & Destination</div>
            <div className="flex justify-between items-center">
              <div className="text-lg font-semibold">Platform {train.platform}</div>
              <div className="text-lg font-semibold">{train.destination}</div>
            </div>
          </div>
          <button className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors">
            Override
          </button>
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
        isLive={isLive} 
        setIsLive={setIsLive} 
        currentTime={masterClock} 
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
            <div className="flex justify-between items-center mb-4 mt-4">
              <h1 className="text-3xl font-bold text-white">Railway Control Center</h1>
              <div className="text-white text-right">
                <div className="text-sm opacity-75">Platform View - Station Alpha</div>
                <div className="text-lg">14:23:45 | 3 Active</div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-4">
              <h2 className="text-xl font-semibold text-white mb-2">Platform Schematic</h2>
              <p className="text-gray-400 mb-4 text-sm">Click on trains for detailed information</p>

              {/* Map Container */}
              <div className="relative w-full h-[600px] bg-gray-900 rounded-lg p-4 overflow-hidden">
                <svg width="100%" height="100%" viewBox="0 0 1400 550" className="absolute inset-0">
                  <defs>
                    <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                      <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#374151" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                  <path d="M 0 120 L 1400 120" stroke="#6B7280" strokeWidth="4" />
                  <path d="M 0 140 L 1400 140" stroke="#6B7280" strokeWidth="4" />
                  <path d="M 0 220 L 1400 220" stroke="#6B7280" strokeWidth="4" />
                  <path d="M 0 240 L 1400 240" stroke="#6B7280" strokeWidth="4" />
                  <path d="M 0 320 L 1400 320" stroke="#6B7280" strokeWidth="4" />
                  <path d="M 0 340 L 1400 340" stroke="#6B7280" strokeWidth="4" />
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
                  <rect x="450" y="80" width="500" height="300" fill="#374151" stroke="#6B7280" strokeWidth="3" rx="12" fillOpacity="0.8" />
                  <rect x="400" y="100" width="600" height="25" fill="#4B5563" rx="4" />
                  <text x="700" y="118" textAnchor="middle" className="fill-white text-base font-semibold">Platform 1</text>
                  <rect x="400" y="200" width="600" height="25" fill="#4B5563" rx="4" />
                  <text x="700" y="218" textAnchor="middle" className="fill-white text-base font-semibold">Platform 2</text>
                  <rect x="400" y="300" width="600" height="25" fill="#4B5563" rx="4" />
                  <text x="700" y="318" textAnchor="middle" className="fill-white text-base font-semibold">Platform 3</text>
                  <text x="700" y="265" textAnchor="middle" className="fill-white text-3xl font-bold tracking-wider">CENTRAL STATION</text>
                  {[150, 350, 1050, 1250].map(x => [120, 140, 220, 240, 320, 340].map(y => 
                    <circle key={`${x}-${y}`} cx={x} cy={y} r="4" fill="#3B82F6" />
                  ))}
                  {[100, 1300].map(x => [80, 180].map(y => 
                    <circle key={`${x}-${y}`} cx={x} cy={y} r="4" fill="#3B82F6" />
                  ))}
                  <polygon points="1330,115 1370,120 1330,125" fill="#10B981" />
                  <polygon points="1330,135 1370,140 1330,145" fill="#10B981" />
                  <polygon points="1330,215 1370,220 1330,225" fill="#10B981" />
                  <polygon points="1330,235 1370,240 1330,245" fill="#10B981" />
                  <polygon points="1330,315 1370,320 1330,325" fill="#10B981" />
                  <polygon points="1330,335 1370,340 1330,345" fill="#10B981" />
                  <text x="20" y="115" className="fill-gray-400 text-sm">Track 1A</text>
                  <text x="20" y="155" className="fill-gray-400 text-sm">Track 1B</text>
                  <text x="20" y="215" className="fill-gray-400 text-sm">Track 2A</text>
                  <text x="20" y="255" className="fill-gray-400 text-sm">Track 2B</text>
                  <text x="20" y="315" className="fill-gray-400 text-sm">Track 3A</text>
                  <text x="20" y="355" className="fill-gray-400 text-sm">Track 3B</text>
                </svg>

                <div className="absolute inset-0">
                  {Object.entries(trainData).map(([trackId, trackTrains], index) => {
                    const train = getTrainAtTime(trackTrains);
                    if (!train) return null;
                    const topPosition = train.direction === 'right' ? (21 + index * 18) : (24 + index * 18);

                    return (
                      <div
                        key={train.id}
                        className="absolute transition-all duration-1000 ease-in-out cursor-pointer"
                        style={{
                          left: `${20 + (currentTime * 15)}%`,
                          top: `${topPosition}%`,
                          transform: 'translate(-50%, -50%)'
                        }}
                        onClick={() => setSelectedTrain(train)}
                      >
                        <div className="flex flex-col items-center">
                          <div className="flex items-center gap-1 mb-1 text-xs text-gray-300">
                            {train.direction === 'right' ? <ArrowRight size={10} /> : <ArrowLeft size={10} />}
                            <span>{train.direction === 'right' ? 'EAST' : 'WEST'}BOUND</span>
                          </div>
                          <div className="relative">
                            <TrainSvg
                              color={getTrainStatusHexColor(train)}
                              direction={train.direction}
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-white text-xs font-bold pointer-events-none">{train.number.split('-')[1]}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-center mt-4 gap-6 text-sm text-gray-300">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#22c55e' }}></div>
                  <span>Moving</span>
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
        </div>
      </div>
      <TrainModal train={selectedTrain} onClose={() => setSelectedTrain(null)} />
    </div>
  );
};

export default LiveStatus;