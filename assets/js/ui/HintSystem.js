/**
 * @tweakable Popup hints system configuration for user guidance
 */
const hintConfig = {
    enableHints: true,
    showOnFirstVisit: true,
    hintDelay: 500, // ms before hint appears
    hintDuration: 5000, // ms hint stays visible
    maxHintsPerSession: 10,
    enableProgressiveHints: true,
    hintOpacity: 0.9,
    hintPosition: 'auto' // 'auto', 'top', 'bottom', 'left', 'right'
};

/**
 * @tweakable Hint content configuration for different modes and interactions
 */
const hintContent = {
    modes: {
        wall: {
            title: "Wall Mode",
            text: "Click and drag to draw walls. Walls form the foundation of your kitchen design.",
            icon: ""
        },
        window: {
            title: "Window Mode", 
            text: "Click on walls to add windows. Windows must be placed on existing walls.",
            icon: ""
        },
        door: {
            title: "Door Mode",
            text: "Click on walls to add doors. Consider traffic flow when placing doors.",
            icon: ""
        },
        cabinet: {
            title: "Cabinet Mode",
            text: "Click to place cabinets. Cabinets snap to walls and align with countertops.",
            icon: ""
        },
        select: {
            title: "Selection Mode",
            text: "Click on elements to select and modify their properties.",
            icon: ""
        }
    },
    interactions: {
        firstWall: "Draw your first wall by clicking and dragging in the floorplan view",
        wallAttributes: "Click on any wall to edit its properties like height, thickness, and materials",
        doubleClickWall: "Double-click a wall to move or rotate it",
        viewSwitching: "Use the view controls to switch between floorplan, elevation, and 3D perspectives",
        undoRedo: "Use Ctrl+Z to undo and Ctrl+Y to redo your changes",
        objectPlacement: "Objects automatically check for collisions and snap to valid positions"
    },
    tips: {
        performance: " Tip: Hide unused elements to improve performance in complex designs",
        measurement: " Tip: Use measurement mode to check distances and dimensions",
        sync: " Tip: All views update automatically - changes in one view appear in all others",
        shortcuts: " Tip: Press 1, 2, 3 for quick view switching, Delete to remove selected objects"
    }
};

export class HintSystem {
    constructor() {
        this.hints = new Map();
        this.activeHint = null;
        this.hintHistory = new Set();
        this.sessionHintCount = 0;
        
        /**
         * @tweakable Hint display timing and behavior settings
         */
        this.displayConfig = {
            fadeInDuration: 300,
            fadeOutDuration: 200,
            pulseAnimation: true,
            followCursor: false,
            autoHide: true,
            showCloseButton: true
        };
        
        this.initializeHintSystem();
        this.setupEventListeners();
    }

    initializeHintSystem() {
        if (!hintConfig.enableHints) return;
        
        // Create hint container
        this.hintContainer = document.createElement('div');
        this.hintContainer.className = 'hint-system-container';
        this.hintContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 10000;
        `;
        document.body.appendChild(this.hintContainer);
        
        // Show initial hints if first visit
        if (hintConfig.showOnFirstVisit && !localStorage.getItem('kitchen-designer-hints-seen')) {
            setTimeout(() => {
                this.showWelcomeHints();
            }, 1000);
        }
    }

    setupEventListeners() {
        // Mode change hints
        document.addEventListener('mode-changed', (event) => {
            const mode = event.detail.mode;
            if (hintContent.modes[mode]) {
                this.showModeHint(mode);
            }
        });
        
        // Element interaction hints
        document.addEventListener('element-selected', (event) => {
            const elementType = event.detail.type;
            this.showInteractionHint(elementType);
        });
        
        /**
         * @tweakable Viewport fullscreen hints integration
         */
        document.addEventListener('viewport-fullscreen-change', (event) => {
            const { viewportId, isFullscreen } = event.detail;
            
            if (isFullscreen && !this.hasShownFullscreenHint) {
                setTimeout(() => {
                    this.showFullscreenModeHint(viewportId);
                }, 800);
                this.hasShownFullscreenHint = true;
            }
        });
        
        // Progress-based hints
        document.addEventListener('wall-created', () => {
            if (this.shouldShowProgressHint('firstWall')) {
                this.showHint('interactions.firstWall', { type: 'progress' });
            }
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (event) => {
            if (event.ctrlKey && event.key === 'h') {
                event.preventDefault();
                this.toggleHelpOverlay();
            }
        });
    }

    /**
     * @tweakable Welcome hint sequence configuration
     */
    showWelcomeHints() {
        const welcomeSequence = [
            {
                text: "Welcome to Kitchen Designer! Let's start by building some walls.",
                position: { x: '50%', y: '20%' },
                duration: 4000,
                highlight: '#mode-wall'
            },
            {
                text: "Use the floorplan view to draw your kitchen layout.",
                position: { x: '25%', y: '50%' },
                duration: 3000,
                highlight: '#floorplan-view'
            },
            {
                text: "All views update in real-time as you make changes.",
                position: { x: '75%', y: '30%' },
                duration: 3000,
                highlight: '.view-port'
            }
        ];
        
        this.showHintSequence(welcomeSequence);
        localStorage.setItem('kitchen-designer-hints-seen', 'true');
    }

    showModeHint(mode) {
        if (!this.shouldShowHint(`mode-${mode}`)) return;
        
        const hint = hintContent.modes[mode];
        const button = document.getElementById(`mode-${mode}`);
        
        if (button && hint) {
            this.showTooltipHint(button, {
                title: hint.title,
                text: hint.text,
                icon: hint.icon,
                type: 'mode'
            });
        }
    }

    showInteractionHint(elementType) {
        /**
         * @tweakable Interaction hint display rules
         */
        const interactionRules = {
            wall: 'wallAttributes',
            cabinet: 'objectPlacement', 
            door: 'viewSwitching',
            window: 'viewSwitching'
        };
        
        const hintKey = interactionRules[elementType];
        if (hintKey && hintContent.interactions[hintKey]) {
            this.showHint(`interactions.${hintKey}`, { 
                type: 'interaction',
                elementType 
            });
        }
    }

    showTooltipHint(targetElement, hintData) {
        if (!targetElement || this.sessionHintCount >= hintConfig.maxHintsPerSession) return;
        
        const hintElement = this.createHintElement(hintData);
        
        // Position hint relative to target
        const position = this.calculateOptimalPosition(targetElement.getBoundingClientRect(), hintElement);
        hintElement.style.left = `${position.x}px`;
        hintElement.style.top = `${position.y}px`;
        
        this.showHintElement(hintElement, hintData);
    }

    /**
     * @tweakable Hint element creation and styling
     */
    createHintElement(hintData) {
        const hint = document.createElement('div');
        hint.className = 'popup-hint';
        hint.style.cssText = `
            position: absolute;
            background: rgba(0, 0, 0, ${hintConfig.hintOpacity});
            color: white;
            padding: 12px 16px;
            border-radius: 8px;
            font-size: 13px;
            max-width: 280px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            pointer-events: auto;
            opacity: 0;
            transform: translateY(10px);
            transition: all ${this.displayConfig.fadeInDuration}ms ease;
            z-index: 10001;
        `;
        
        // Add pulse animation if enabled
        if (this.displayConfig.pulseAnimation) {
            hint.style.animation = 'hint-pulse 2s infinite ease-in-out';
        }
        
        let content = '';
        if (hintData.icon) {
            content += `<span style="font-size: 16px; margin-right: 8px;">${hintData.icon}</span>`;
        }
        if (hintData.title) {
            content += `<strong>${hintData.title}</strong><br>`;
        }
        content += hintData.text;
        
        if (this.displayConfig.showCloseButton) {
            content += `<button class="hint-close" style="
                position: absolute;
                top: 4px;
                right: 4px;
                background: none;
                border: none;
                color: white;
                cursor: pointer;
                font-size: 16px;
                opacity: 0.7;
                padding: 2px;
            ">&times;</button>`;
        }
        
        hint.innerHTML = content;
        
        // Add close button event
        const closeBtn = hint.querySelector('.hint-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.hideHint(hint));
        }
        
        return hint;
    }

    calculateOptimalPosition(targetRect, hintElement) {
        /**
         * @tweakable Hint positioning algorithm preferences
         */
        const positionPreferences = {
            preferredSides: ['bottom', 'top', 'right', 'left'],
            marginFromTarget: 12,
            screenMargin: 20,
            arrowSize: 8
        };
        
        const hintRect = hintElement.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        // Try preferred positions in order
        for (const side of positionPreferences.preferredSides) {
            const position = this.calculatePositionForSide(
                side, 
                targetRect, 
                hintRect, 
                positionPreferences
            );
            
            // Check if position fits in viewport
            if (position.x >= positionPreferences.screenMargin && 
                position.x + hintRect.width <= viewportWidth - positionPreferences.screenMargin &&
                position.y >= positionPreferences.screenMargin && 
                position.y + hintRect.height <= viewportHeight - positionPreferences.screenMargin) {
                return position;
            }
        }
        
        // Fallback to center if no position works
        return {
            x: (viewportWidth - hintRect.width) / 2,
            y: (viewportHeight - hintRect.height) / 2
        };
    }

    calculatePositionForSide(side, targetRect, hintRect, preferences) {
        const { marginFromTarget } = preferences;
        
        switch (side) {
            case 'bottom':
                return {
                    x: targetRect.left + (targetRect.width - hintRect.width) / 2,
                    y: targetRect.bottom + marginFromTarget
                };
            case 'top':
                return {
                    x: targetRect.left + (targetRect.width - hintRect.width) / 2,
                    y: targetRect.top - hintRect.height - marginFromTarget
                };
            case 'right':
                return {
                    x: targetRect.right + marginFromTarget,
                    y: targetRect.top + (targetRect.height - hintRect.height) / 2
                };
            case 'left':
                return {
                    x: targetRect.left - hintRect.width - marginFromTarget,
                    y: targetRect.top + (targetRect.height - hintRect.height) / 2
                };
            default:
                return { x: 0, y: 0 };
        }
    }

    showHintElement(hintElement, hintData) {
        this.hintContainer.appendChild(hintElement);
        this.activeHint = hintElement;
        this.sessionHintCount++;
        
        // Trigger animation
        setTimeout(() => {
            hintElement.style.opacity = '1';
            hintElement.style.transform = 'translateY(0)';
        }, 50);
        
        // Auto-hide if enabled
        if (this.displayConfig.autoHide && hintConfig.hintDuration > 0) {
            setTimeout(() => {
                this.hideHint(hintElement);
            }, hintConfig.hintDuration);
        }
        
        // Track hint for progressive disclosure
        if (hintData.type) {
            this.hintHistory.add(`${hintData.type}-${Date.now()}`);
        }
    }

    hideHint(hintElement) {
        if (!hintElement || !hintElement.parentNode) return;
        
        hintElement.style.opacity = '0';
        hintElement.style.transform = 'translateY(-10px)';
        
        setTimeout(() => {
            if (hintElement.parentNode) {
                this.hintContainer.removeChild(hintElement);
            }
            if (this.activeHint === hintElement) {
                this.activeHint = null;
            }
        }, this.displayConfig.fadeOutDuration);
    }

    /**
     * @tweakable Progressive hint disclosure rules
     */
    shouldShowHint(hintKey) {
        if (!hintConfig.enableHints) return false;
        if (this.sessionHintCount >= hintConfig.maxHintsPerSession) return false;
        
        const progressiveRules = {
            maxSameHintPerSession: 2,
            cooldownBetweenHints: 3000, // ms
            skipIfRecentlySeen: true
        };
        
        // Check cooldown
        const lastHintTime = this.getLastHintTime();
        if (Date.now() - lastHintTime < progressiveRules.cooldownBetweenHints) {
            return false;
        }
        
        // Check if already shown too many times
        const hintCount = this.getHintCount(hintKey);
        if (hintCount >= progressiveRules.maxSameHintPerSession) {
            return false;
        }
        
        return true;
    }

    shouldShowProgressHint(progressKey) {
        return hintConfig.enableProgressiveHints && 
               !this.hintHistory.has(progressKey) &&
               this.shouldShowHint(progressKey);
    }

    getLastHintTime() {
        return parseInt(localStorage.getItem('kitchen-designer-last-hint') || '0');
    }

    getHintCount(hintKey) {
        return parseInt(localStorage.getItem(`kitchen-designer-hint-${hintKey}`) || '0');
    }

    incrementHintCount(hintKey) {
        const current = this.getHintCount(hintKey);
        localStorage.setItem(`kitchen-designer-hint-${hintKey}`, (current + 1).toString());
        localStorage.setItem('kitchen-designer-last-hint', Date.now().toString());
    }

    showHint(hintPath, options = {}) {
        const pathParts = hintPath.split('.');
        let hintText = hintContent;
        
        for (const part of pathParts) {
            hintText = hintText[part];
            if (!hintText) return;
        }
        
        const hintData = {
            text: hintText,
            type: options.type || 'general',
            ...options
        };
        
        // Show as floating hint if no target element
        this.showFloatingHint(hintData);
    }

    showFloatingHint(hintData) {
        const hintElement = this.createHintElement(hintData);
        
        // Position in top-right corner
        hintElement.style.left = `${window.innerWidth - 320}px`;
        hintElement.style.top = '80px';
        
        this.showHintElement(hintElement, hintData);
    }

    /**
     * @tweakable Show hint for fullscreen viewport mode
     */
    showFullscreenModeHint(viewportId) {
        const fullscreenHints = {
            'floorplan-view': {
                title: "Fullscreen Floorplan",
                text: "You're now in fullscreen floorplan mode. Use Esc or click ✕ to return to normal view.",
                icon: "🗺️"
            },
            'elevation-view': {
                title: "Fullscreen Elevation",
                text: "Perfect for detailed elevation work. Press Esc or click ✕ to exit fullscreen.",
                icon: "📏"
            },
            '3d-view': {
                title: "Fullscreen 3D View",
                text: "Immersive 3D perspective for design review. Press Esc or click ✕ to return.",
                icon: "🎭"
            }
        };
        
        const hint = fullscreenHints[viewportId];
        if (hint) {
            const hintElement = this.createHintElement({
                title: hint.title,
                text: hint.text,
                icon: hint.icon,
                type: 'fullscreen-mode'
            });
            
            // Position in center-top
            hintElement.style.left = '50%';
            hintElement.style.top = '60px';
            hintElement.style.transform = 'translateX(-50%)';
            
            this.showHintElement(hintElement, { type: 'fullscreen-mode' });
        }
    }

    /**
     * @tweakable Help overlay configuration and content
     */
    toggleHelpOverlay() {
        const existingOverlay = document.getElementById('hint-help-overlay');
        if (existingOverlay) {
            existingOverlay.remove();
            return;
        }
        
        const overlay = document.createElement('div');
        overlay.id = 'hint-help-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            z-index: 20000;
            display: flex;
            justify-content: center;
            align-items: center;
            color: white;
            font-family: Arial, sans-serif;
        `;
        
        const helpContent = `
            <div style="background: #2c3e50; padding: 30px; border-radius: 12px; max-width: 600px; max-height: 80vh; overflow-y: auto;">
                <h2 style="margin-top: 0; color: #3498db;">Kitchen Designer Help</h2>
                
                <h3>🏗️ Building Mode</h3>
                <p>• Click and drag in floorplan view to draw walls</p>
                <p>• Click on walls to add windows and doors</p>
                <p>• Double-click walls to move or rotate them</p>
                
                <h3>⌨️ Keyboard Shortcuts</h3>
                <p>• <strong>Ctrl+Z</strong> - Undo last action</p>
                <p>• <strong>Ctrl+Y</strong> - Redo action</p>
                <p>• <strong>1, 2, 3</strong> - Switch between views</p>
                <p>• <strong>Alt+F1, F2, F3</strong> - Toggle fullscreen views</p>
                <p>• <strong>Delete</strong> - Remove selected object</p>
                <p>• <strong>Ctrl+H</strong> - Toggle this help</p>
                <p>• <strong>Escape</strong> - Exit fullscreen mode</p>
                
                <h3>📺 Viewport Controls</h3>
                <p>• Click ⛶ button to toggle any view to fullscreen</p>
                <p>• Press Esc or click ✕ to exit fullscreen</p>
                <p>• Use Alt+F1/F2/F3 for quick fullscreen switching</p>
                
                <h3>💡 Tips</h3>
                <p>• All views update automatically</p>
                <p>• Use measurement mode to check distances and dimensions</p>
                <p>• Objects snap to valid positions</p>
                <p>• Collision detection prevents overlapping</p>
                <p>• Fullscreen mode is perfect for detailed work</p>
                
                <button onclick="this.closest('#hint-help-overlay').remove()" 
                        style="background: #3498db; color: white; border: none; padding: 10px 20px; 
                               border-radius: 5px; cursor: pointer; margin-top: 20px;">
                    Close Help (Ctrl+H)
                </button>
            </div>
        `;
        
        overlay.innerHTML = helpContent;
        
        // Close on click outside
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.remove();
            }
        });
        
        document.body.appendChild(overlay);
    }

    showHintSequence(hintSequence) {
        let currentIndex = 0;
        
        const showNext = () => {
            if (currentIndex >= hintSequence.length) return;
            
            const hint = hintSequence[currentIndex];
            const hintElement = this.createHintElement({
                text: hint.text,
                type: 'sequence'
            });
            
            // Position hint
            if (hint.position) {
                if (hint.position.x.includes('%')) {
                    hintElement.style.left = hint.position.x;
                } else {
                    hintElement.style.left = `${hint.position.x}px`;
                }
                if (hint.position.y.includes('%')) {
                    hintElement.style.top = hint.position.y;
                } else {
                    hintElement.style.top = `${hint.position.y}px`;
                }
            }
            
            // Highlight element if specified
            if (hint.highlight) {
                this.highlightElement(hint.highlight);
            }
            
            this.showHintElement(hintElement, { type: 'sequence' });
            
            // Auto-advance to next hint
            setTimeout(() => {
                this.hideHint(hintElement);
                this.removeHighlight();
                currentIndex++;
                setTimeout(showNext, 500);
            }, hint.duration || 3000);
        };
        
        showNext();
    }

    highlightElement(selector) {
        const element = document.querySelector(selector);
        if (element) {
            element.style.boxShadow = '0 0 0 3px #3498db, 0 0 20px rgba(52, 152, 219, 0.5)';
            element.style.transition = 'box-shadow 0.3s ease';
        }
    }

    removeHighlight() {
        document.querySelectorAll('*').forEach(el => {
            if (el.style.boxShadow && el.style.boxShadow.includes('#3498db')) {
                el.style.boxShadow = '';
            }
        });
    }

    // Public API methods
    disable() {
        hintConfig.enableHints = false;
        if (this.activeHint) {
            this.hideHint(this.activeHint);
        }
    }

    enable() {
        hintConfig.enableHints = true;
    }

    resetProgress() {
        this.hintHistory.clear();
        this.sessionHintCount = 0;
        // Clear localStorage hints data
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('kitchen-designer-hint')) {
                localStorage.removeItem(key);
            }
        });
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes hint-pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }
    
    .popup-hint:hover {
        transform: scale(1.02) !important;
    }
    
    .hint-close:hover {
        opacity: 1 !important;
        background: rgba(255, 255, 255, 0.2) !important;
        border-radius: 2px;
    }
`;
document.head.appendChild(style);