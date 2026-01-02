// Agent System Manager
import { NkbaAgent, OptimizationAgent, UxAgent, DesignAgent, LearningAgent } from './agent-classes.js';
import { EventEmitter } from 'events';

export class AgentSystem extends EventEmitter {
  constructor() {
    super();
    this.agents = new Map();
    this.activeAgents = [];
    this.initialized = false;
  }

  async initialize() {
    console.log('Initializing Agent System...');
    
    // Initialize all agents
    const agentClasses = [
      new NkbaAgent(),
      new OptimizationAgent(),
      new UxAgent(),
      new DesignAgent(),
      new LearningAgent()
    ];

    for (const agent of agentClasses) {
      await agent.initialize();
      this.agents.set(agent.id, agent);
      this.activeAgents.push(agent);
      console.log(`✅ ${agent.name} initialized`);
    }

    this.initialized = true;
    this.emit('system_initialized', this.activeAgents);
    console.log('🤖 Agent System fully initialized');
  }

  getActiveAgents() {
    return this.activeAgents;
  }

  getAgent(agentId) {
    return this.agents.get(agentId);
  }

  async coordinateAgents(task) {
    const results = [];
    
    for (const agent of this.activeAgents) {
      if (this.shouldAgentParticipate(agent, task)) {
        const result = await agent.processTask(task);
        results.push({ agentId: agent.id, result });
      }
    }

    return results;
  }

  shouldAgentParticipate(agent, task) {
    // Simple logic - can be enhanced
    return agent.status === 'active';
  }

  async shutdown() {
    console.log('Shutting down Agent System...');
    this.agents.clear();
    this.activeAgents = [];
    this.initialized = false;
    this.emit('system_shutdown');
  }
}

export default AgentSystem;
