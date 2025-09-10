import React, { useState, useMemo } from 'react';
import { Search, Filter, Download, Eye, AlertTriangle, Clock, User, Settings } from 'lucide-react';

const AuditTrail = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [timeRange, setTimeRange] = useState('today');

  // Sample audit data
  const auditData = [
    {
      id: 'AUD_001',
      timestamp: '2025-09-10T14:23:45.123Z',
      controller: 'Operator_Alpha',
      action: 'Override Route Decision',
      trainId: 'EXP_12345',
      section: 'Platform 2 - Track 2A',
      aiRecommendation: 'Route via Track 2B (Delay: +3 min)',
      actualDecision: 'Route via Track 2A (Delay: +1 min)',
      overrideReason: 'Platform 2B occupied by delayed freight train',
      outcome: 'Successful - 2min delay avoided',
      conflictType: 'Platform Occupancy',
      priority: 'Express',
      weatherCondition: 'Clear',
      linkedIncident: null,
      dataSource: ['Signaling_Log_14:23', 'Timetable_v2.1', 'Platform_Status']
    },
    {
      id: 'AUD_002',
      timestamp: '2025-09-10T14:21:32.456Z',
      controller: 'System_Auto',
      action: 'Automatic Conflict Resolution',
      trainId: 'LOCAL_456',
      section: 'Track 1A Junction',
      aiRecommendation: 'Hold LOCAL_456 for Express precedence',
      actualDecision: 'Hold LOCAL_456 for Express precedence',
      overrideReason: null,
      outcome: 'Successful - Express maintained schedule',
      conflictType: 'Priority Crossing',
      priority: 'Local',
      weatherCondition: 'Clear',
      linkedIncident: null,
      dataSource: ['Priority_Matrix', 'Schedule_DB', 'Track_Sensors']
    },
    {
      id: 'AUD_003',
      timestamp: '2025-09-10T14:19:15.789Z',
      controller: 'Operator_Beta',
      action: 'Emergency Override',
      trainId: 'FREIGHT_789',
      section: 'Track 3B - Maintenance Block',
      aiRecommendation: 'Maintain scheduled maintenance window',
      actualDecision: 'Emergency passage granted',
      overrideReason: 'Loco failure on alternate route - emergency medical situation',
      outcome: 'Maintenance delayed by 45min - Patient evacuated safely',
      conflictType: 'Maintenance vs Emergency',
      priority: 'Emergency',
      weatherCondition: 'Fog - Low Visibility',
      linkedIncident: 'INC_2025_091001',
      dataSource: ['Emergency_Protocol', 'Medical_Alert', 'Maintenance_Schedule']
    },
    {
      id: 'AUD_004',
      timestamp: '2025-09-10T14:15:22.234Z',
      controller: 'System_Auto',
      action: 'Delay Propagation Analysis',
      trainId: 'EXP_67890',
      section: 'Central Station Platform 1',
      aiRecommendation: 'Adjust downstream schedule -5min',
      actualDecision: 'Adjust downstream schedule -5min',
      overrideReason: null,
      outcome: 'Cascade delay prevented for 3 subsequent trains',
      conflictType: 'Schedule Optimization',
      priority: 'Express',
      weatherCondition: 'Clear',
      linkedIncident: null,
      dataSource: ['Delay_Predictor', 'Network_Model', 'Live_Tracking']
    }
  ];

  const filteredData = useMemo(() => {
    return auditData.filter(entry => {
      const matchesFilter = selectedFilter === 'all' || 
        (selectedFilter === 'overrides' && entry.overrideReason) ||
        (selectedFilter === 'conflicts' && entry.conflictType !== 'Schedule Optimization') ||
        (selectedFilter === 'incidents' && entry.linkedIncident) ||
        (selectedFilter === 'emergency' && entry.priority === 'Emergency');
      
      const matchesSearch = searchTerm === '' || 
        entry.trainId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.controller.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.section.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesFilter && matchesSearch;
    });
  }, [selectedFilter, searchTerm]);

  const getStatusColor = (outcome) => {
    if (outcome.includes('Successful')) return 'text-green-400';
    if (outcome.includes('delayed') || outcome.includes('Maintenance delayed')) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'Emergency': return 'bg-red-600';
      case 'Express': return 'bg-blue-600';
      case 'Local': return 'bg-green-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-gray-100">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Railway Control Center</h1>
            <p className="text-sm text-gray-400 mt-1">Audit Trail - Station Alpha | 14:23:45 | 15 Active Sessions</p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export Logs</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="px-6 py-4 bg-slate-800/50 border-b border-slate-700">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select 
                value={selectedFilter} 
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Events</option>
                <option value="overrides">Manual Overrides</option>
                <option value="conflicts">Conflict Resolutions</option>
                <option value="incidents">Linked Incidents</option>
                <option value="emergency">Emergency Actions</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <select 
                value={timeRange} 
                onChange={(e) => setTimeRange(e.target.value)}
                className="bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search trains, controllers, sections..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 w-72"
            />
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Main Audit List */}
        <div className="flex-1 p-6">
          <div className="bg-slate-800 rounded-lg border border-slate-700">
            <div className="px-6 py-4 border-b border-slate-700">
              <h2 className="text-lg font-semibold text-white">Audit Trail Entries</h2>
              <p className="text-sm text-gray-400 mt-1">{filteredData.length} entries found</p>
            </div>
            
            <div className="divide-y divide-slate-700">
              {filteredData.map((entry) => (
                <div 
                  key={entry.id}
                  className="px-6 py-4 hover:bg-slate-700/50 cursor-pointer transition-colors"
                  onClick={() => setSelectedEntry(entry)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(entry.priority)}`}>
                          {entry.priority}
                        </span>
                        <span className="text-sm font-medium text-white">{entry.trainId}</span>
                        <span className="text-sm text-gray-400">{entry.section}</span>
                        {entry.linkedIncident && (
                          <AlertTriangle className="w-4 h-4 text-yellow-400" />
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">Action:</span>
                          <span className="ml-2 text-white">{entry.action}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Controller:</span>
                          <span className="ml-2 text-white flex items-center">
                            <User className="w-3 h-3 mr-1" />
                            {entry.controller}
                          </span>
                        </div>
                      </div>
                      
                      {entry.overrideReason && (
                        <div className="mt-2 text-sm">
                          <span className="text-yellow-400">Override Reason:</span>
                          <span className="ml-2 text-gray-300">{entry.overrideReason}</span>
                        </div>
                      )}
                      
                      <div className="mt-2 text-sm">
                        <span className="text-gray-400">Outcome:</span>
                        <span className={`ml-2 ${getStatusColor(entry.outcome)}`}>{entry.outcome}</span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-xs text-gray-400 mb-1">
                        {new Date(entry.timestamp).toLocaleTimeString()}
                      </div>
                      <button className="text-blue-400 hover:text-blue-300">
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Detail Panel */}
        {selectedEntry && (
          <div className="w-96 bg-slate-800 border-l border-slate-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Entry Details</h3>
              <button 
                onClick={() => setSelectedEntry(null)}
                className="text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-slate-700/50 rounded-lg p-4">
                <h4 className="font-medium text-white mb-2">Decision Trail</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-400">AI Recommendation:</span>
                    <p className="text-green-400 mt-1">{selectedEntry.aiRecommendation}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Actual Decision:</span>
                    <p className="text-blue-400 mt-1">{selectedEntry.actualDecision}</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-700/50 rounded-lg p-4">
                <h4 className="font-medium text-white mb-2">Context Data</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-400">Conflict Type:</span>
                    <span className="ml-2 text-white">{selectedEntry.conflictType}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Weather:</span>
                    <span className="ml-2 text-white">{selectedEntry.weatherCondition}</span>
                  </div>
                  {selectedEntry.linkedIncident && (
                    <div>
                      <span className="text-gray-400">Linked Incident:</span>
                      <span className="ml-2 text-yellow-400">{selectedEntry.linkedIncident}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-slate-700/50 rounded-lg p-4">
                <h4 className="font-medium text-white mb-2">Data Sources</h4>
                <div className="space-y-1">
                  {selectedEntry.dataSource.map((source, index) => (
                    <div key={index} className="text-sm text-gray-300 flex items-center">
                      <Settings className="w-3 h-3 mr-2" />
                      {source}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-700/50 rounded-lg p-4">
                <h4 className="font-medium text-white mb-2">Timestamps</h4>
                <div className="text-xs text-gray-400">
                  <div>Created: {new Date(selectedEntry.timestamp).toLocaleString()}</div>
                  <div className="mt-1">ID: {selectedEntry.id}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditTrail;