// Main Application Integration for Agent-Model System
import AgentModelIntegration from '@/lib/integration/agent-model-integration.js';

class AppIntegration {
  constructor() {
    this.agentModelIntegration = null;
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;

    console.log('🚀 Initializing Application with Agent-Model System...');
    
    try {
      // Initialize the agent-model integration
      this.agentModelIntegration = new AgentModelIntegration();
      await this.agentModelIntegration.initialize();
      
      // Set up event listeners for application events
      this.setupEventListeners();
      
      // Wire up to main application components
      this.wireApplicationComponents();
      
      this.initialized = true;
      console.log('✅ Application integration complete');
      
    } catch (error) {
      console.error('❌ Failed to initialize application integration:', error);
      throw error;
    }
  }

  setupEventListeners() {
    // Listen to agent-model events
    this.agentModelIntegration.on('connection_established', (connection) => {
      console.log(`🔌 Connection established: ${connection.id}`);
    });

    this.agentModelIntegration.on('agent_task_completed', (result) => {
      console.log(`🤖 Agent task completed:`, result);
    });

    this.agentModelIntegration.on('model_prediction', (prediction) => {
      console.log(`🧠 Model prediction:`, prediction);
    });
  }

  wireApplicationComponents() {
    // Wire up to floorplan design events
    this.wireFloorplanEvents();
    
    // Wire up to user interaction events  
    this.wireUserInteractionEvents();
    
    // Wire up to design validation events
    this.wireValidationEvents();
  }

  wireFloorplanEvents() {
    // Example: Auto-optimize layout when design changes
    window.addEventListener('floorplan-changed', async (event) => {
      const floorplanData = event.detail;
      
      try {
        // Get optimization suggestions
        const optimization = await this.agentModelIntegration.processRequest(
          'optimization-agent',
          'layout-optimization-model', 
          { design: floorplanData }
        );
        
        // Emit optimization suggestions
        window.dispatchEvent(new CustomEvent('optimization-suggestions', {
          detail: optimization
        }));
        
      } catch (error) {
        console.error('Optimization failed:', error);
      }
    });
  }

  wireUserInteractionEvents() {
    // Example: Learn from user preferences
    window.addEventListener('user-design-choice', async (event) => {
      const userChoice = event.detail;
      
      try {
        // Update user preference model
        await this.agentModelIntegration.processRequest(
          'ux-agent',
          'user-preference-model',
          { interaction: userChoice }
        );
        
      } catch (error) {
        console.error('Preference learning failed:', error);
      }
    });
  }

  wireValidationEvents() {
    // Example: Real-time NKBA compliance checking
    window.addEventListener('design-validation-request', async (event) => {
      const designData = event.detail;
      
      try {
        // Validate against NKBA standards
        const validation = await this.agentModelIntegration.processRequest(
          'nkba-agent',
          'nkba-compliance-model',
          { design: designData }
        );
        
        // Emit validation results
        window.dispatchEvent(new CustomEvent('validation-results', {
          detail: validation
        }));
        
      } catch (error) {
        console.error('Validation failed:', error);
      }
    });
  }

  // Public API for application components
  async getDesignSuggestions(designData) {
    if (!this.initialized) {
      throw new Error('Application integration not initialized');
    }

    try {
      const suggestions = await this.agentModelIntegration.processRequest(
        'design-agent',
        'user-preference-model',
        { design: designData }
      );
      
      return suggestions;
    } catch (error) {
      console.error('Failed to get design suggestions:', error);
      throw error;
    }
  }

  async validateDesign(designData) {
    if (!this.initialized) {
      throw new Error('Application integration not initialized');
    }

    try {
      const validation = await this.agentModelIntegration.processRequest(
        'nkba-agent',
        'nkba-compliance-model',
        { design: designData }
      );
      
      return validation;
    } catch (error) {
      console.error('Design validation failed:', error);
      throw error;
    }
  }

  async optimizeLayout(layoutData) {
    if (!this.initialized) {
      throw new Error('Application integration not initialized');
    }

    try {
      const optimization = await this.agentModelIntegration.processRequest(
        'optimization-agent',
        'layout-optimization-model',
        { layout: layoutData }
      );
      
      return optimization;
    } catch (error) {
      console.error('Layout optimization failed:', error);
      throw error;
    }
  }

  async getUserPreferences() {
    if (!this.initialized) {
      throw new Error('Application integration not initialized');
    }

    try {
      const preferences = await this.agentModelIntegration.processRequest(
        'ux-agent',
        'user-preference-model',
        { request: 'get_preferences' }
      );
      
      return preferences;
    } catch (error) {
      console.error('Failed to get user preferences:', error);
      throw error;
    }
  }

  async shutdown() {
    if (this.agentModelIntegration) {
      await this.agentModelIntegration.shutdown();
    }
    this.initialized = false;
  }
}

// Create singleton instance
const appIntegration = new AppIntegration();

// Auto-initialize when DOM is ready
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      appIntegration.initialize();
    });
  } else {
    appIntegration.initialize();
  }
}

export default appIntegration;
