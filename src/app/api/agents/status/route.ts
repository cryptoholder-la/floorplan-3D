
// Agent Status API
import { NextRequest, NextResponse } from 'next/server';

// Mock agent data - in real implementation, this would come from the actual agent system
const mockAgents = [
  {
    id: 'nkba-agent',
    name: 'NKBA Compliance Agent',
    status: 'active',
    tasksProcessed: 42,
    successRate: 0.97,
    lastActivity: new Date().toISOString()
  },
  {
    id: 'optimization-agent',
    name: 'Design Optimization Agent',
    status: 'active',
    tasksProcessed: 38,
    successRate: 0.94,
    lastActivity: new Date().toISOString()
  },
  {
    id: 'ux-agent',
    name: 'User Experience Agent',
    status: 'active',
    tasksProcessed: 25,
    successRate: 0.96,
    lastActivity: new Date().toISOString()
  },
  {
    id: 'design-agent',
    name: 'Design Aesthetics Agent',
    status: 'active',
    tasksProcessed: 31,
    successRate: 0.92,
    lastActivity: new Date().toISOString()
  },
  {
    id: 'learning-agent',
    name: 'Self-Learning Agent',
    status: 'training',
    tasksProcessed: 15,
    successRate: 0.89,
    lastActivity: new Date().toISOString()
  }
];

const mockCoordinationHistory = [
  {
    timestamp: new Date(Date.now() - 5000).toISOString(),
    type: 'coordination_cycle',
    participants: ['nkba-agent', 'optimization-agent', 'ux-agent'],
    tasks: []
  },
  {
    timestamp: new Date(Date.now() - 10000).toISOString(),
    type: 'coordination_cycle',
    participants: ['design-agent', 'learning-agent'],
    tasks: []
  }
];

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      agents: mockAgents,
      coordinationHistory: mockCoordinationHistory,
      systemStatus: 'active',
      lastCoordination: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch agent status' },
      { status: 500 }
    );
  }
}
