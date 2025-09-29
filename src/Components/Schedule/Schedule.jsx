import React, { useState } from 'react';
import { 
  Clock,
  MapPin,
  Train,
  Search
} from 'lucide-react';
import Sidebar from '../Sidebar/Sidebar';

export default function Schedule() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');

  const scheduleData = [
    {
      trainNumber: '12267',
      trainName: 'Mumbai Central - Ahmedabad AC Duronto Exp',
      trainType: 'DURONTO',
      runDays: 'M,T,W,T,F,S,S',
      departureTime: '23:25',
      arrivalTime: '05:55',
      status: 'On Time',
      platform: '2'
    },
    {
      trainNumber: '12268',
      trainName: 'Ahmedabad - Mumbai Cent AC Duronto Exp',
      trainType: 'DURONTO',
      runDays: 'M,T,W,T,F,S,S',
      departureTime: '23:40',
      arrivalTime: '06:00',
      status: 'Delayed 10min',
      platform: '3'
    },
    {
      trainNumber: '22201',
      trainName: 'Kolkata Sealdah - Puri Duronto Express',
      trainType: 'DURONTO',
      runDays: 'M,W,F',
      departureTime: '20:00',
      arrivalTime: '04:00',
      status: 'On Time',
      platform: '1'
    },
    {
      trainNumber: '12426',
      trainName: 'Jammu Tawi - New Delhi Rajdhani Express',
      trainType: 'RAJDHANI',
      runDays: 'M,T,W,T,F,S,S',
      departureTime: '19:40',
      arrivalTime: '05:05',
      status: 'On Time',
      platform: '4'
    },
    {
      trainNumber: '12430',
      trainName: 'New Delhi - Lucknow AC Sf Express',
      trainType: 'RAJDHANI',
      runDays: 'M,T,F,S',
      departureTime: '20:50',
      arrivalTime: '06:40',
      status: 'Delayed 15min',
      platform: '2'
    },
    {
      trainNumber: '12951',
      trainName: 'Mumbai Central - New Delhi Rajdhani Express',
      trainType: 'RAJDHANI',
      runDays: 'M,T,W,T,F,S,S',
      departureTime: '16:35',
      arrivalTime: '08:35',
      status: 'On Time',
      platform: '5'
    },
    {
      trainNumber: '12019',
      trainName: 'Howrah - Ranchi Shatabdi Express',
      trainType: 'SHATABDI',
      runDays: 'M,T,W,T,F,S',
      departureTime: '06:05',
      arrivalTime: '13:15',
      status: 'On Time',
      platform: '6'
    },
    {
      trainNumber: '12038',
      trainName: 'Ludhiana - New Delhi Shatabdi Express',
      trainType: 'SHATABDI',
      runDays: 'T,W,T,F,S',
      departureTime: '16:40',
      arrivalTime: '22:10',
      status: 'Cancelled',
      platform: '-'
    }
  ];

  const filteredTrains = scheduleData.filter(train => {
    const matchesSearch = train.trainNumber.includes(searchTerm) || 
                         train.trainName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'ALL' || train.trainType === filterType;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status) => {
    if (status === 'On Time') return 'bg-green-500/20 text-green-400 border-green-500/30';
    if (status.includes('Delayed')) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    if (status === 'Cancelled') return 'bg-red-500/20 text-red-400 border-red-500/30';
    return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
  };

  const getTypeColor = (type) => {
    if (type === 'DURONTO') return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    if (type === 'RAJDHANI') return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
    if (type === 'SHATABDI') return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
    return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <main className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-30">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Train className="text-blue-400" size={28} />
                  Train Schedule
                </h1>
                <p className="text-slate-400 text-sm mt-1">
                  List of Indian Railway Trains and their Time Table
                </p>
              </div>
            </div>
          </div>
        </header>

        <div className="px-6 py-4 bg-slate-800/30">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Search by train number or name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setFilterType('ALL')}
                className={`px-4 py-2.5 rounded-lg font-medium transition-all ${
                  filterType === 'ALL' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                }`}
              >
                All Trains
              </button>
              <button
                onClick={() => setFilterType('DURONTO')}
                className={`px-4 py-2.5 rounded-lg font-medium transition-all ${
                  filterType === 'DURONTO' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Duronto
              </button>
              <button
                onClick={() => setFilterType('RAJDHANI')}
                className={`px-4 py-2.5 rounded-lg font-medium transition-all ${
                  filterType === 'RAJDHANI' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Rajdhani
              </button>
              <button
                onClick={() => setFilterType('SHATABDI')}
                className={`px-4 py-2.5 rounded-lg font-medium transition-all ${
                  filterType === 'SHATABDI' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Shatabdi
              </button>
            </div>
          </div>
        </div>

        <div className="px-6 py-6">
          <div className="bg-slate-800/40 rounded-lg border border-slate-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-700/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">TRAIN NUMBER</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">TRAIN NAME</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">TRAIN TYPE</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">RUN DAYS</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">DEPARTURE TIME</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">ARRIVAL TIME</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">PLATFORM</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {filteredTrains.map((train, index) => (
                    <tr key={index} className="hover:bg-slate-700/30 transition-colors">
                      <td className="px-6 py-4">
                        <span className="text-blue-400 font-mono font-semibold">{train.trainNumber}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-white font-medium">{train.trainName}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getTypeColor(train.trainType)}`}>
                          {train.trainType}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-slate-300 font-mono text-sm">{train.runDays}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Clock size={16} className="text-slate-400" />
                          <span className="text-white font-mono font-semibold">{train.departureTime}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Clock size={16} className="text-slate-400" />
                          <span className="text-white font-mono font-semibold">{train.arrivalTime}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <MapPin size={16} className="text-slate-400" />
                          <span className="text-white font-semibold">{train.platform}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(train.status)}`}>
                          {train.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="mt-4 text-center text-slate-400 text-sm">
            Showing {filteredTrains.length} of {scheduleData.length} trains
          </div>
        </div>
      </main>
    </div>
  );
}