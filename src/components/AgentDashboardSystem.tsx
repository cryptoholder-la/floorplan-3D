
// Agent Dashboard Component
'use client';

import React, { useState, useEffect } from 'react';
import { X, Activity, Clock, CheckCircle, XCircle, AlertCircle, Brain, Settings } from 'lucide-react';

export function AgentDashboard({ onClose }) {
  const [agents, setAgents] = useState([]);
  const [systemStatus, setSystemStatus] = useState('active');
  const [coordinationHistory, setCoordinationHistory] = useState([]);

  useEffect(() => {
    // Fetch agent data
    const fetchAgentData = async () => {
      try {
        const response = await fetch('/api/agents/status');
        const data = await response.json();
        setAgents(data.agents);
        setCoordinationHistory(data.coordinationHistory);
      } catch (error) {
        console.error('Error fetching agent data:', error);
      }
    };

    fetchAgentData();
    const interval = setInterval(fetchAgentData, 2000);
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <Activity className="w-3 h-3 text-green-400" />;
      case 'training':
        return <Brain className="w-3 h-3 text-yellow-400" />;
      case 'error':
        return <XCircle className="w-3 h-3 text-red-400" />;
      default:
        return <Clock className="w-3 h-3 text-gray-400" />;
    }
  };

  const activeAgents = agents.filter(a => a.status === 'active');
  const recentCoordination = coordinationHistory.slice(-3).reverse();

  return (
    <div className="fixed bottom-4 left-4 w-96 bg-black/90 border border-green-500/30 rounded-lg p-4 z-50 font-mono text-xs">
      <div className="flex justify-between items-center mb-3 pb-2 border-b border-green-500/30">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-green-400" />
          <span className="text-green-400 font-bold">AGENT SYSTEM</span>
          <span className={`px-2 py-1 rounded text-xs ${systemStatus === 'active' ? 'bg-green-600' : 'bg-yellow-600'}`}>
            {systemStatus.toUpperCase()}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-green-400">{activeAgents.length} ACTIVE</span>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>

      <div className="space-y-2 max-h-48 overflow-y-auto">
        {agents.map(agent => (
          <div key={agent.id} className="flex items-center justify-between p-2 bg-slate-800/50 rounded">
            <div className="flex items-center gap-2">
              {getStatusIcon(agent.status)}
              <span className="text-gray-300">{agent.name}</span>
            </div>
            <div className="text-right">
              <div className="text-green-400">{agent.tasksProcessed || 0} tasks</div>
              <div className="text-gray-500 text-xs">{((agent.successRate || 0.95) * 100).toFixed(1)}% success</div>
            </div>
          </div>
        ))}
      </div>

      {recentCoordination.length > 0 && (
        <div className="mt-3 pt-2 border-t border-green-500/30">
          <div className="text-green-400 text-xs mb-1">Recent Coordination</div>
          {recentCoordination.map((coord, idx) => (
            <div key={idx} className="text-gray-400 text-xs">
              {coord.participants.length} agents coordinated
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
