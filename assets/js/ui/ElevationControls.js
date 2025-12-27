import { Vector2 } from 'three';

export class ElevationControls {
    constructor(sceneManager, container, controlsManager) {
        this.sceneManager = sceneManager;
        this.container = container;
        this.controlsManager = controlsManager;
        
        /**
         * @tweakable Viewport toggle configuration for fullscreen view switching
         */
        this.viewportToggleConfig = {
            enableFullscreenViews: true,
            transitionDuration: 400, // ms
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
            showExitButton: true,
            dimOtherViews: true,
            dimOpacity: 0.1
        };
        
        this.controlSettings = {
            buttonSize: 40,
            buttonSpacing: 10,
            activeColor: '#3498db',
            inactiveColor: '#95a5a6'
        };

        this.viewTransition = {
            duration: 500,
            easing: 'easeInOutCubic'
        };

        this.initControls();
        this.initEventListeners();
        
        /**
         * @tweakable Fullscreen toggle controls setup
         */
        if (this.viewportToggleConfig.enableFullscreenViews) {
            this.initViewportToggleControls();
            this.setupViewportToggleEvents();
        }
        
        this.setActiveView('perspective'); // Start in perspective view
    }

    initControls() {
        this.viewButtons = {
            perspective: this.createViewButton('3D'),
            front: this.createViewButton('Front'),
            right: this.createViewButton('Right'),
            back: this.createViewButton('Back'),
            left: this.createViewButton('Left')
        };

        const controlsContainer = document.createElement('div');
        controlsContainer.className = 'elevation-controls';
        Object.values(this.viewButtons).forEach(button => {
            controlsContainer.appendChild(button);
        });

        this.container.appendChild(controlsContainer);
    }

    createViewButton(label) {
        const button = document.createElement('button');
        button.className = 'elevation-view-button';
        button.textContent = label;
        button.dataset.view = label.toLowerCase();
        return button;
    }

    initEventListeners() {
        Object.entries(this.viewButtons).forEach(([view, button]) => {
            button.addEventListener('click', () => {
                this.setActiveView(view);
                this.sceneManager.setView(view);

                if (view === 'perspective') {
                    this.controlsManager.enableOrbitControls(true);
                } else {
                    this.controlsManager.enableOrbitControls(false);
                }
            });
        });
    }

    setActiveView(view) {
        Object.keys(this.viewButtons).forEach(v => {
            if (v === view) {
                 this.viewButtons[v].classList.add('active');
            } else {
                this.viewButtons[v].classList.remove('active');
            }
        });
    }

    /**
     * @tweakable Initialize fullscreen toggle controls for each viewport
     */
    initViewportToggleControls() {
        const viewportToggleSettings = {
            buttonSize: '24px',
            buttonPosition: 'top-right',
            buttonOffset: '8px',
            iconColor: '#666',
            hoverColor: '#333'
        };
        
        // Add toggle buttons to each viewport
        const viewports = ['floorplan-view', 'elevation-view', '3d-view'];
        
        viewports.forEach(viewportId => {
            const viewport = document.getElementById(viewportId);
            if (viewport) {
                const toggleButton = document.createElement('button');
                toggleButton.className = 'viewport-toggle-btn';
                toggleButton.innerHTML = '⛶'; // Fullscreen icon
                toggleButton.title = 'Toggle fullscreen view';
                toggleButton.style.cssText = `
                    position: absolute;
                    top: ${viewportToggleSettings.buttonOffset};
                    right: ${viewportToggleSettings.buttonOffset};
                    width: ${viewportToggleSettings.buttonSize};
                    height: ${viewportToggleSettings.buttonSize};
                    background: rgba(255, 255, 255, 0.9);
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 14px;
                    color: ${viewportToggleSettings.iconColor};
                    z-index: 1000;
                    transition: all 0.2s ease;
                    opacity: 0.7;
                `;
                
                toggleButton.addEventListener('mouseenter', () => {
                    toggleButton.style.opacity = '1';
                    toggleButton.style.color = viewportToggleSettings.hoverColor;
                });
                
                toggleButton.addEventListener('mouseleave', () => {
                    toggleButton.style.opacity = '0.7';
                    toggleButton.style.color = viewportToggleSettings.iconColor;
                });
                
                toggleButton.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.toggleViewportFullscreen(viewportId);
                });
                
                viewport.appendChild(toggleButton);
                viewport.style.position = 'relative'; // Ensure positioning context
            }
        });
    }

    /**
     * @tweakable Setup viewport toggle event handlers and keyboard shortcuts
     */
    setupViewportToggleEvents() {
        const keyboardShortcuts = {
            enableKeyboardShortcuts: true,
            floorplanKey: 'F1',
            elevationKey: 'F2',
            threeDKey: 'F3',
            exitKey: 'Escape'
        };
        
        if (keyboardShortcuts.enableKeyboardShortcuts) {
            document.addEventListener('keydown', (event) => {
                if (event.altKey) {
                    switch (event.code) {
                        case 'F1':
                            event.preventDefault();
                            this.toggleViewportFullscreen('floorplan-view');
                            break;
                        case 'F2':
                            event.preventDefault();
                            this.toggleViewportFullscreen('elevation-view');
                            break;
                        case 'F3':
                            event.preventDefault();
                            this.toggleViewportFullscreen('3d-view');
                            break;
                    }
                }
                
                if (event.key === 'Escape' && this.currentFullscreenView) {
                    this.exitFullscreenView();
                }
            });
        }
        
        // Track current fullscreen state
        this.currentFullscreenView = null;
        this.originalViewportStyles = new Map();
    }

    /**
     * @tweakable Toggle a specific viewport to fullscreen or restore normal layout
     */
    toggleViewportFullscreen(viewportId) {
        const toggleSettings = {
            animationDuration: this.viewportToggleConfig.transitionDuration,
            easing: this.viewportToggleConfig.easing,
            preserveAspectRatio: true,
            centerContent: true
        };
        
        if (this.currentFullscreenView === viewportId) {
            // Exit fullscreen
            this.exitFullscreenView();
        } else {
            // Enter fullscreen
            this.enterFullscreenView(viewportId, toggleSettings);
        }
    }

    /**
     * @tweakable Enter fullscreen mode for a specific viewport
     */
    enterFullscreenView(viewportId, settings) {
        const viewport = document.getElementById(viewportId);
        const container = document.getElementById('view-container');
        
        if (!viewport || !container) return;
        
        // Store original styles
        this.storeOriginalStyles();
        
        // Update current state
        this.currentFullscreenView = viewportId;
        
        // Apply fullscreen styles with animation
        container.style.transition = `all ${settings.animationDuration}ms ${settings.easing}`;
        
        // Hide other viewports
        const allViewports = ['floorplan-view', 'elevation-view', '3d-view'];
        allViewports.forEach(id => {
            const view = document.getElementById(id);
            if (view && id !== viewportId) {
                if (this.viewportToggleConfig.dimOtherViews) {
                    view.style.transition = `opacity ${settings.animationDuration}ms ${settings.easing}`;
                    view.style.opacity = this.viewportToggleConfig.dimOpacity.toString();
                    view.style.pointerEvents = 'none';
                } else {
                    view.style.display = 'none';
                }
            }
        });
        
        // Expand target viewport
        viewport.style.transition = `all ${settings.animationDuration}ms ${settings.easing}`;
        viewport.style.gridColumn = '1 / -1';
        viewport.style.gridRow = '1 / -1';
        viewport.style.zIndex = '10';
        
        // Update toggle button
        const toggleBtn = viewport.querySelector('.viewport-toggle-btn');
        if (toggleBtn) {
            toggleBtn.innerHTML = '⤡'; // Exit fullscreen icon
            toggleBtn.title = 'Exit fullscreen view';
        }
        
        // Add exit button if enabled
        if (this.viewportToggleConfig.showExitButton) {
            this.addExitButton(viewport);
        }
        
        // Notify about fullscreen change
        this.notifyFullscreenChange(viewportId, true);
        
        // Handle 3D renderer resize
        if (viewportId === '3d-view') {
            setTimeout(() => {
                this.sceneManager.onWindowResize();
            }, settings.animationDuration);
        }
    }

    /**
     * @tweakable Exit fullscreen mode and restore normal layout
     */
    exitFullscreenView() {
        if (!this.currentFullscreenView) return;
        
        const exitSettings = {
            animationDuration: this.viewportToggleConfig.transitionDuration,
            easing: this.viewportToggleConfig.easing
        };
        
        const viewport = document.getElementById(this.currentFullscreenView);
        const container = document.getElementById('view-container');
        
        if (!viewport || !container) return;
        
        // Restore original styles
        this.restoreOriginalStyles(exitSettings);
        
        // Update toggle button
        const toggleBtn = viewport.querySelector('.viewport-toggle-btn');
        if (toggleBtn) {
            toggleBtn.innerHTML = '⛶';
            toggleBtn.title = 'Toggle fullscreen view';
        }
        
        // Remove exit button
        this.removeExitButton(viewport);
        
        // Notify about fullscreen change
        this.notifyFullscreenChange(this.currentFullscreenView, false);
        
        // Clear current state
        const previousView = this.currentFullscreenView;
        this.currentFullscreenView = null;
        
        // Handle 3D renderer resize
        if (previousView === '3d-view') {
            setTimeout(() => {
                this.sceneManager.onWindowResize();
            }, exitSettings.animationDuration);
        }
    }

    /**
     * @tweakable Store original viewport styles for restoration
     */
    storeOriginalStyles() {
        const styleProperties = [
            'gridColumn', 'gridRow', 'zIndex', 'opacity', 
            'pointerEvents', 'display', 'transition'
        ];
        
        const allViewports = ['floorplan-view', 'elevation-view', '3d-view'];
        allViewports.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                const styles = {};
                styleProperties.forEach(prop => {
                    styles[prop] = element.style[prop] || '';
                });
                this.originalViewportStyles.set(id, styles);
            }
        });
    }

    /**
     * @tweakable Restore original viewport styles
     */
    restoreOriginalStyles(settings) {
        const allViewports = ['floorplan-view', 'elevation-view', '3d-view'];
        
        allViewports.forEach(id => {
            const element = document.getElementById(id);
            const originalStyles = this.originalViewportStyles.get(id);
            
            if (element && originalStyles) {
                element.style.transition = `all ${settings.animationDuration}ms ${settings.easing}`;
                
                Object.entries(originalStyles).forEach(([prop, value]) => {
                    element.style[prop] = value;
                });
                
                // Clean up transition after animation
                setTimeout(() => {
                    element.style.transition = '';
                }, settings.animationDuration);
            }
        });
        
        this.originalViewportStyles.clear();
    }

    /**
     * @tweakable Add exit button to fullscreen viewport
     */
    addExitButton(viewport) {
        const exitButtonConfig = {
            size: '36px',
            position: 'top-left',
            offset: '16px',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            textColor: 'white',
            hoverBackgroundColor: 'rgba(0, 0, 0, 0.9)'
        };
        
        // Remove existing exit button if any
        this.removeExitButton(viewport);
        
        const exitButton = document.createElement('button');
        exitButton.className = 'viewport-exit-btn';
        exitButton.innerHTML = '✕';
        exitButton.title = 'Exit fullscreen (Esc)';
        exitButton.style.cssText = `
            position: absolute;
            top: ${exitButtonConfig.offset};
            left: ${exitButtonConfig.offset};
            width: ${exitButtonConfig.size};
            height: ${exitButtonConfig.size};
            background: ${exitButtonConfig.backgroundColor};
            border: none;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            color: ${exitButtonConfig.textColor};
            z-index: 1001;
            transition: background-color 0.2s ease;
        `;
        
        exitButton.addEventListener('mouseenter', () => {
            exitButton.style.backgroundColor = exitButtonConfig.hoverBackgroundColor;
        });
        
        exitButton.addEventListener('mouseleave', () => {
            exitButton.style.backgroundColor = exitButtonConfig.backgroundColor;
        });
        
        exitButton.addEventListener('click', (e) => {
            e.stopPropagation();
            this.exitFullscreenView();
        });
        
        viewport.appendChild(exitButton);
    }

    /**
     * @tweakable Remove exit button from viewport
     */
    removeExitButton(viewport) {
        const existingExitBtn = viewport.querySelector('.viewport-exit-btn');
        if (existingExitBtn) {
            viewport.removeChild(existingExitBtn);
        }
    }

    /**
     * @tweakable Notify other components about fullscreen state changes
     */
    notifyFullscreenChange(viewportId, isFullscreen) {
        const fullscreenChangeEvent = new CustomEvent('viewport-fullscreen-change', {
            detail: {
                viewportId,
                isFullscreen,
                timestamp: Date.now()
            }
        });
        
        document.dispatchEvent(fullscreenChangeEvent);
        
        // Update body class for global styling
        if (isFullscreen) {
            document.body.classList.add('viewport-fullscreen');
            document.body.classList.add(`viewport-fullscreen-${viewportId.replace('-view', '')}`);
        } else {
            document.body.classList.remove('viewport-fullscreen');
            document.body.classList.remove(`viewport-fullscreen-${viewportId.replace('-view', '')}`);
        }
    }
}