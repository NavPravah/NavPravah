import React, { useState, useEffect } from 'react';
import { X, Clock, Zap, MapPin, AlertTriangle, ArrowRight, ArrowLeft } from 'lucide-react';

// This new component renders the train's SVG shape
const TrainSvg = ({ color, direction }) => {
  return (
    <svg
      width="64" // Roughly w-16
      height="24" // Roughly h-6
      viewBox="0 0 64 24"
      xmlns="http://www.w3.org/2000/svg"
      className="drop-shadow-lg"
      style={{ transform: direction === 'left' ? 'scaleX(-1)' : 'none', overflow: 'visible' }}
    >
      <g>
        {/* Main train body with a sloped front */}
        <path
          d="M 5 3 L 52 3 L 62 12 L 62 21 L 5 21 Z"
          fill={color}
          stroke="#111827" // A dark stroke for definition
          strokeWidth="1"
        />
        {/* Windows */}
        <rect x="10" y="7" width="13" height="7" fill="#a5f3fc" rx="1" opacity="0.9" />
        <rect x="26" y="7" width="13" height="7" fill="#a5f3fc" rx="1" opacity="0.9" />
        {/* Front light */}
        <circle cx="60" cy="15" r="1.5" fill="#fef08a" />
      </g>
    </svg>
  );
};


const LiveStatus = () => {
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);

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

  // This function now returns a hex color for the SVG fill
  const getTrainStatusHexColor = (train) => {
    if (!train) return '#6b7280'; // gray-500
    if (train.delay > 0) return '#eab308'; // yellow-500
    if (train.speed === 0) return '#ef4444'; // red-500
    return '#22c55e'; // green-500
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
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-gray-800 rounded-lg p-6 w-96 text-white">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold">Train {train.number}</h2>
              <span className={`px-2 py-1 rounded text-xs font-semibold ${getTrainStatusHexColor(train) === '#eab308' ? 'bg-yellow-500 text-black' :
                  getTrainStatusHexColor(train) === '#ef4444' ? 'bg-red-500' : 'bg-green-500'
                }`}>
                {getTrainStatusText(train)}
              </span>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X size={24} />
            </button>
          </div>
          {/* ... (modal content remains the same) */}
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
    <div className="min-h-screen bg-gray-900 p-4 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-white">Railway Control Center</h1>
          <div className="text-white text-right">
            <div className="text-sm opacity-75">Platform View - Station Alpha</div>
            <div className="text-lg">14:23:45 | 3 Active</div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4">
          <h2 className="text-xl font-semibold text-white mb-2">Platform Schematic</h2>
          <p className="text-gray-400 mb-4 text-sm">Click on trains for detailed information</p>

          <div className="relative w-full h-[600px] bg-gray-900 rounded-lg p-4 overflow-hidden">
            <svg width="100%" height="100%" viewBox="0 0 1400 550" className="absolute inset-0">
              {/* ... (SVG for tracks remains the same) ... */}
              <defs>
                <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                  <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#374151" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              <path d="M 0 120 L 1400 120" stroke="#6B7280" strokeWidth="4" /><path d="M 0 140 L 1400 140" stroke="#6B7280" strokeWidth="4" /><path d="M 0 220 L 1400 220" stroke="#6B7280" strokeWidth="4" /><path d="M 0 240 L 1400 240" stroke="#6B7280" strokeWidth="4" /><path d="M 0 320 L 1400 320" stroke="#6B7280" strokeWidth="4" /><path d="M 0 340 L 1400 340" stroke="#6B7280" strokeWidth="4" /><path d="M 150 120 L 350 140" stroke="#6B7280" strokeWidth="2" /><path d="M 150 220 L 350 240" stroke="#6B7280" strokeWidth="2" /><path d="M 150 320 L 350 340" stroke="#6B7280" strokeWidth="2" /><path d="M 1050 120 L 1250 140" stroke="#6B7280" strokeWidth="2" /><path d="M 1050 220 L 1250 240" stroke="#6B7280" strokeWidth="2" /><path d="M 1050 320 L 1250 340" stroke="#6B7280" strokeWidth="2" /><path d="M 100 80 L 350 240" stroke="#6B7280" strokeWidth="2" /><path d="M 100 180 L 350 340" stroke="#6B7280" strokeWidth="2" /><path d="M 1050 340 L 1300 180" stroke="#6B7280" strokeWidth="2" /><path d="M 1050 240 L 1300 80" stroke="#6B7280" strokeWidth="2" /><rect x="450" y="80" width="500" height="300" fill="#374151" stroke="#6B7280" strokeWidth="3" rx="12" fillOpacity="0.8" /><rect x="400" y="100" width="600" height="25" fill="#4B5563" rx="4" /><text x="700" y="118" textAnchor="middle" className="fill-white text-base font-semibold">Platform 1</text><rect x="400" y="200" width="600" height="25" fill="#4B5563" rx="4" /><text x="700" y="218" textAnchor="middle" className="fill-white text-base font-semibold">Platform 2</text><rect x="400" y="300" width="600" height="25" fill="#4B5563" rx="4" /><text x="700" y="318" textAnchor="middle" className="fill-white text-base font-semibold">Platform 3</text><text x="700" y="265" textAnchor="middle" className="fill-white text-3xl font-bold tracking-wider">CENTRAL STATION</text>{[150, 350, 1050, 1250].map(x => [120, 140, 220, 240, 320, 340].map(y => <circle key={`${x}-${y}`} cx={x} cy={y} r="4" fill="#3B82F6" />))}{[100, 1300].map(x => [80, 180].map(y => <circle key={`${x}-${y}`} cx={x} cy={y} r="4" fill="#3B82F6" />))}<polygon points="1330,115 1370,120 1330,125" fill="#10B981" /><polygon points="1330,135 1370,140 1330,145" fill="#10B981" /><polygon points="1330,215 1370,220 1330,225" fill="#10B981" /><polygon points="1330,235 1370,240 1330,245" fill="#10B981" /><polygon points="1330,315 1370,320 1330,325" fill="#10B981" /><polygon points="1330,335 1370,340 1330,345" fill="#10B981" /><text x="20" y="115" className="fill-gray-400 text-sm">Track 1A</text><text x="20" y="155" className="fill-gray-400 text-sm">Track 1B</text><text x="20" y="215" className="fill-gray-400 text-sm">Track 2A</text><text x="20" y="255" className="fill-gray-400 text-sm">Track 2B</text><text x="20" y="315" className="fill-gray-400 text-sm">Track 3A</text><text x="20" y="355" className="fill-gray-400 text-sm">Track 3B</text>
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
                      {/* Using the new TrainSvg component */}
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

          <div className="flex justify-center mt-4 gap-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#22c55e' }}></div>
              <span className="text-white text-sm">Moving</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#ef4444' }}></div>
              <span className="text-white text-sm">Stopped</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#eab308' }}></div>
              <span className="text-white text-sm">Delayed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span className="text-white text-sm">Junction</span>
            </div>
          </div>
        </div>
      </div>

      <TrainModal train={selectedTrain} onClose={() => setSelectedTrain(null)} />
    </div>
  );
};

export default LiveStatus;