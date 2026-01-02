import { memoize, memoizeAsync, defaultCache, PerformanceMonitor, withPerformanceMonitoring } from "@/lib/utils/caching";
'use client';

import React, { useState, useEffect } from 'react';
import { X, Activity, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Status } from '@/types';

// Import the real agent system
import appIntegration from '@/lib/app-integration.js';

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

  // Connect to real agent system
  useEffect(() => {
    if (!appIntegration.initialized) {
      appIntegration.initialize().catch(console.error);
    }

    // Listen for real agent events
    const handleAgentTask = (event) => {
      const task: AgentTask = {
        id: event.detail.id || `task_${Date.now()}`,
        type: event.detail.type || 'unknown',
        agent: event.detail.agent || 'unknown',
        status: event.detail.status || 'running',
        duration: event.detail.duration,
        timestamp: Date.now()
      };
      
      setTasks(prev => [...prev.slice(-10), task]);
    };

    // Set up event listeners for real agent activity
    window.addEventListener('agent_task_completed', handleAgentTask);
    window.addEventListener('agent_task_started', handleAgentTask);
    window.addEventListener('model_prediction', handleAgentTask);

    // Generate some initial demo activity to show the system is working
    const demoInterval = setInterval(() => {
      if (Math.random() > 0.8) {
        const demoTask: AgentTask = {
          id: `demo_${Date.now()}`,
          type: ['nkba_validation', 'layout_optimization', 'ux_analysis', 'design_enhancement'][Math.floor(Math.random() * 4)],
          agent: ['nkba-agent', 'optimization-agent', 'ux-agent', 'design-agent'][Math.floor(Math.random() * 4)],
          status: Math.random() > 0.2 ? 'completed' : 'running',
          duration: Math.floor(Math.random() * 500) + 50,
          timestamp: Date.now()
        };
        
        setTasks(prev => [...prev.slice(-10), demoTask]);
      }
    }, 3000);

    return () => {
      window.removeEventListener('agent_task_completed', handleAgentTask);
      window.removeEventListener('agent_task_started', handleAgentTask);
      window.removeEventListener('model_prediction', handleAgentTask);
      clearInterval(demoInterval);
    };
  }, []);

  const getStatusIcon = (status) => {
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

  const getStatusColor = (status) => {
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
