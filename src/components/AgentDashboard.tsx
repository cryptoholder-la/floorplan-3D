import { useState, useEffect } from 'react';
'use client';

import React, { useState, useEffect } from 'react';
import { X, Activity, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Status } from '@/types';

interface AgentTask {
  id: string;
  type: string;
  agent: string;
  status: 'running' | 'completed' | 'failed' | 'queued';
  duration?: number;
  timestamp: number;
}

interface AgentDashboardProps {
  onClose: () => void;
}

export function AgentDashboard({ onClose }: AgentDashboardProps) {
  const [tasks, setTasks] = useState<AgentTask[]>([]);
  const [queue, setQueue] = useState<string[]>([]);

  // Simulate agent system activity
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate random task activity
      if (Math.random() > 0.7) {
        const newTask: AgentTask = {
          id: `task_${Date.now()}`,
          type: ['nkba_check', 'optimization', 'user_happiness', 'grace_and_beauty'][Math.floor(Math.random() * 4)],
          agent: ['nkba', 'optimization', 'ux', 'design'][Math.floor(Math.random() * 4)],
          status: Math.random() > 0.3 ? 'completed' : 'running',
          duration: Math.floor(Math.random() * 1000) + 100,
          timestamp: Date.now()
        };
        
        setTasks(prev => [...prev.slice(-10), newTask]);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <Activity className="w-3 h-3 text-yellow-400" />;
      case 'completed':
        return <CheckCircle className="w-3 h-3 text-green-400" />;
      case 'failed':
        return <XCircle className="w-3 h-3 text-red-400" />;
      default:
        return <Clock className="w-3 h-3 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'text-yellow-400';
      case 'completed':
        return 'text-green-400';
      case 'failed':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const activeTasks = tasks.filter(t => t.status === 'running');
  const recentTasks = tasks.slice(-5).reverse();

  return (
    <div className="fixed bottom-4 left-4 w-80 bg-black/90 border border-green-500/30 rounded-lg p-4 z-50 font-mono text-xs">
      <div className="flex justify-between items-center mb-3 pb-2 border-b border-green-500/30">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-green-400" />
          <span className="text-green-400 font-bold">AGENT SYS</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-green-400">Q:{queue.length} ACT:{activeTasks.length}</span>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>

      <div className="space-y-1 max-h-40 overflow-y-auto">
        {activeTasks.map(task => (
          <div key={task.id} className="flex items-center gap-2 text-yellow-400">
            {getStatusIcon(task.status)}
            <span>&gt; {task.type} ({task.agent})</span>
          </div>
        ))}
        
        {recentTasks.map(task => (
          <div key={task.id} className={`flex items-center gap-2 ${getStatusColor(task.status)} whitespace-nowrap overflow-hidden text-ellipsis`}>
            <span>{task.status === 'failed' ? '✖' : '✓'}</span>
            <span className="flex-1">{task.type}</span>
            {task.duration && (
              <span className="opacity-50">
                {task.duration.toFixed(0)}ms
              </span>
            )}
          </div>
        ))}
      </div>

      {tasks.length === 0 && (
        <div className="text-gray-500 text-center py-4">
          No agent activity yet...
        </div>
      )}
    </div>
  );
}
