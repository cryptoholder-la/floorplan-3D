export class UIController {
    constructor(model) {
        this.model = model;
        this.modeButtons = {
            wall: document.getElementById('tb-wall'),
            window: document.getElementById('tb-window'),
            door: document.getElementById('tb-door'),
            cabinet: document.getElementById('tb-cabinet')
        };
        this.propertiesContainer = document.getElementById('element-properties');
        this.clearButton = document.getElementById('clear-scene');
        
        /**
         * @tweakable Dropdown menu configuration for mode-specific options
         */
        this.dropdownConfig = {
            enableDropdowns: true,
            showIcons: true,
            autoSelectFirst: true,
            groupSimilarItems: true,
            enableTooltips: true
        };

        /**
         * @tweakable Mode-specific dropdown options for window, door, and cabinet selection
         */
        this.modeOptions = {
            window: {
                options: [
                    { id: 'standard-window', name: 'Standard Window', icon: '🪟', description: 'Regular rectangular window' },
                    { id: 'sliding-window', name: 'Sliding Window', icon: '↔️', description: 'Horizontal sliding window' },
                    { id: 'bay-window', name: 'Bay Window', icon: '🏠', description: 'Protruding bay window' },
                    { id: 'casement-window', name: 'Casement Window', icon: '🔄', description: 'Side-hinged window' }
                ],
                defaultDimensions: { width: 120, height: 100, sillHeight: 90 }
            },
            door: {
                options: [
                    { id: 'standard-door', name: 'Standard Door', icon: '🚪', description: 'Single swing door' },
                    { id: 'double-door', name: 'Double Door', icon: '🚪🚪', description: 'French doors or double entry' },
                    { id: 'sliding-door', name: 'Sliding Door', icon: '↔️', description: 'Sliding patio door' },
                    { id: 'pocket-door', name: 'Pocket Door', icon: '📱', description: 'Door that slides into wall' },
                    { id: 'barn-door', name: 'Barn Door', icon: '🚜', description: 'Sliding barn-style door' }
                ],
                defaultDimensions: { width: 90, height: 200, thickness: 7 }
            },
            cabinet: {
                options: [
                    { id: 'base-cabinet', name: 'Base Cabinet', icon: '📦', description: 'Lower kitchen cabinet' },
                    { id: 'wall-cabinet', name: 'Wall Cabinet', icon: '⬆️', description: 'Upper wall-mounted cabinet' },
                    { id: 'tall-cabinet', name: 'Tall Cabinet', icon: '🏢', description: 'Full-height pantry cabinet' },
                    { id: 'corner-cabinet', name: 'Corner Cabinet', icon: '📐', description: 'L-shaped corner cabinet' },
                    { id: 'island-cabinet', name: 'Island Cabinet', icon: '🏝️', description: 'Standalone island cabinet' }
                ],
                defaultDimensions: { width: 60, height: 80, depth: 60 }
            }
        };

        this.selectedOptions = {
            window: this.modeOptions.window.options[0].id,
            door: this.modeOptions.door.options[0].id,
            cabinet: this.modeOptions.cabinet.options[0].id
        };
        
        this.initEventListeners();
        this.setMode('wall');
        
        /**
         * @tweakable UI hint integration for mode switching guidance
         */
        this.hintConfig = {
            showModeHints: true,
            showFirstTimeHints: true,
            hintDelay: 1000,
            enableTooltips: true
        };
        
        if (this.hintConfig.enableTooltips) {
            this.initializeTooltips();
        }
    }

    /**
     * @tweakable Tooltip initialization for UI elements
     */
    initializeTooltips() {
        const tooltipConfig = {
            delay: 800,
            duration: 3000,
            position: 'bottom',
            showOnHover: true
        };
        
        // Add tooltips to mode buttons
        Object.entries(this.modeButtons).forEach(([mode, button]) => {
            if (button && tooltipConfig.showOnHover) {
                this.addTooltip(button, this.getModeTooltip(mode), tooltipConfig);
            }
        });
        
        // Add tooltip to clear button
        if (this.clearButton) {
            this.addTooltip(this.clearButton, {
                text: "Clear all elements from the scene. This action cannot be undone.",
                icon: "🗑️"
            }, tooltipConfig);
        }
    }

    getModeTooltip(mode) {
        const tooltips = {
            wall: {
                text: "Draw walls by clicking and dragging in the floorplan view",
                icon: "🏗️"
            },
            window: {
                text: "Add windows to existing walls by clicking on them",
                icon: "🪟"
            },
            door: {
                text: "Add doors to walls for room entrances and exits",
                icon: "🚪"
            },
            cabinet: {
                text: "Place kitchen cabinets and storage units",
                icon: "🗄️"
            }
        };
        return tooltips[mode] || { text: "Select this mode to use the tool", icon: "🔧" };
    }

    /**
     * @tweakable Tooltip creation and display system
     */
    addTooltip(element, tooltipData, config) {
        let tooltipElement = null;
        let showTimeout = null;
        let hideTimeout = null;
        
        const showTooltip = (e) => {
            if (showTimeout) clearTimeout(showTimeout);
            if (hideTimeout) clearTimeout(hideTimeout);
            
            showTimeout = setTimeout(() => {
                // Remove existing tooltip
                if (tooltipElement) {
                    document.body.removeChild(tooltipElement);
                }
                
                // Create new tooltip
                tooltipElement = document.createElement('div');
                tooltipElement.className = 'ui-tooltip';
                tooltipElement.style.cssText = `
                    position: absolute;
                    background: rgba(44, 62, 80, 0.95);
                    color: white;
                    padding: 8px 12px;
                    border-radius: 4px;
                    font-size: 12px;
                    max-width: 200px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
                    z-index: 10003;
                    opacity: 0;
                    transition: opacity 200ms ease;
                    pointer-events: none;
                    white-space: nowrap;
                `;
                
                let content = '';
                if (tooltipData.icon) {
                    content += `<span style="margin-right: 6px;">${tooltipData.icon}</span>`;
                }
                content += tooltipData.text;
                
                tooltipElement.innerHTML = content;
                document.body.appendChild(tooltipElement);
                
                // Position tooltip
                const rect = element.getBoundingClientRect();
                const tooltipRect = tooltipElement.getBoundingClientRect();
                
                let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
                let top = rect.bottom + 8;
                
                // Adjust if tooltip goes off screen
                if (left < 10) left = 10;
                if (left + tooltipRect.width > window.innerWidth - 10) {
                    left = window.innerWidth - tooltipRect.width - 10;
                }
                if (top + tooltipRect.height > window.innerHeight - 10) {
                    top = rect.top - tooltipRect.height - 8;
                }
                
                tooltipElement.style.left = `${left}px`;
                tooltipElement.style.top = `${top}px`;
                
                // Show tooltip
                setTimeout(() => {
                    if (tooltipElement) {
                        tooltipElement.style.opacity = '1';
                    }
                }, 50);
                
                // Auto-hide tooltip
                hideTimeout = setTimeout(() => {
                    hideTooltip();
                }, config.duration);
                
            }, config.delay);
        };
        
        const hideTooltip = () => {
            if (showTimeout) clearTimeout(showTimeout);
            if (hideTimeout) clearTimeout(hideTimeout);
            
            if (tooltipElement) {
                tooltipElement.style.opacity = '0';
                setTimeout(() => {
                    if (tooltipElement && tooltipElement.parentNode) {
                        document.body.removeChild(tooltipElement);
                    }
                    tooltipElement = null;
                }, 200);
            }
        };
        
        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
        element.addEventListener('click', hideTooltip);
    }

    initEventListeners() {
        // Listen to global set-mode event dispatched by the toolbar
        window.addEventListener('set-mode', (e) => {
            if (e.detail.mode) {
                this.setMode(e.detail.mode);
            }
        });
        
        if (this.clearButton) {
            this.clearButton.addEventListener('click', () => {
                this.model.clearAll();
                
                // Hide context panel after clearing scene
                const contextPanel = document.getElementById('context-ui-panel');
                if (contextPanel) contextPanel.style.display = 'none';
            });
        }

        /**
         * @tweakable Dropdown change handlers for mode-specific selections
         */
        if (this.dropdownConfig.enableDropdowns) {
            this.initDropdownHandlers();
        }
    }

    /**
     * @tweakable Initialize dropdown change handlers for each mode
     */
    initDropdownHandlers() {
        const dropdownHandlerConfig = {
            updateModelOnChange: true,
            showSelectionFeedback: true,
            enablePreview: false
        };

        ['window', 'door', 'cabinet'].forEach(mode => {
            document.addEventListener('change', (event) => {
                if (event.target.id === `${mode}-type-select`) {
                    this.selectedOptions[mode] = event.target.value;
                    
                    if (dropdownHandlerConfig.updateModelOnChange) {
                        this.updateModeSelection(mode, event.target.value);
                    }
                    
                    if (dropdownHandlerConfig.showSelectionFeedback) {
                        this.showSelectionFeedback(mode, event.target.value);
                    }
                }
            });
        });
    }

    /**
     * @tweakable Update model with selected mode option
     */
    updateModeSelection(mode, selectedId) {
        const selectionConfig = {
            notifyListeners: true,
            updatePropertiesUI: true,
            triggerPreview: false
        };

        const selectedOption = this.modeOptions[mode].options.find(opt => opt.id === selectedId);
        
        if (selectedOption && selectionConfig.notifyListeners) {
            // Dispatch event for other components to listen to
            const selectionEvent = new CustomEvent('mode-selection-changed', {
                detail: {
                    mode,
                    selectedId,
                    option: selectedOption,
                    dimensions: this.modeOptions[mode].defaultDimensions
                }
            });
            document.dispatchEvent(selectionEvent);
        }

        if (selectionConfig.updatePropertiesUI) {
            this.updatePropertiesForSelection(mode, selectedOption);
        }
    }

    /**
     * @tweakable Show visual feedback when user selects a different option
     */
    showSelectionFeedback(mode, selectedId) {
        const feedbackConfig = {
            showToast: true,
            toastDuration: 2000,
            highlightDropdown: true,
            highlightDuration: 300
        };

        const selectedOption = this.modeOptions[mode].options.find(opt => opt.id === selectedId);
        
        if (feedbackConfig.showToast && selectedOption) {
            this.showToast(`Selected: ${selectedOption.name}`, feedbackConfig.toastDuration);
        }

        if (feedbackConfig.highlightDropdown) {
            const dropdown = document.getElementById(`${mode}-type-select`);
            if (dropdown) {
                dropdown.style.boxShadow = '0 0 8px rgba(52, 152, 219, 0.6)';
                setTimeout(() => {
                    dropdown.style.boxShadow = '';
                }, feedbackConfig.highlightDuration);
            }
        }
    }

    /**
     * @tweakable Display toast notification for user feedback
     */
    showToast(message, duration) {
        const toastConfig = {
            position: 'bottom-right',
            backgroundColor: 'rgba(52, 152, 219, 0.9)',
            textColor: 'white',
            borderRadius: '6px'
        };

        const toast = document.createElement('div');
        toast.className = 'selection-toast';
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: ${toastConfig.backgroundColor};
            color: ${toastConfig.textColor};
            padding: 10px 15px;
            border-radius: ${toastConfig.borderRadius};
            font-size: 13px;
            z-index: 10000;
            opacity: 0;
            transform: translateY(20px);
            transition: all 300ms ease;
        `;

        toast.textContent = message;
        document.body.appendChild(toast);

        // Animate in
        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateY(0)';
        }, 50);

        // Auto-remove
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(20px)';
            setTimeout(() => {
                if (toast.parentNode) {
                    document.body.removeChild(toast);
                }
            }, 300);
        }, duration);
    }

    setMode(newMode) {
        this.model.currentMode = newMode;
        
        // Active class toggling is handled by index.html toolbar logic

        this.updatePropertiesUI(newMode);
        
        /**
         * @tweakable Mode change notifications for dropdown integration
         */
        if (this.dropdownConfig.enableDropdowns) {
            this.notifyModeChange(newMode);
        }
    }

    /**
     * @tweakable Notify other components about mode changes
     */
    notifyModeChange(newMode) {
        const modeChangeEvent = new CustomEvent('ui-mode-changed', {
            detail: {
                mode: newMode,
                selectedOption: this.selectedOptions[newMode] || null,
                timestamp: Date.now()
            }
        });
        document.dispatchEvent(modeChangeEvent);
    }

    updatePropertiesUI(mode) {
        this.propertiesContainer.innerHTML = ''; // Clear previous
        
        // Ensure properties container is visible when in a mode that needs it
        const contextPanel = document.getElementById('context-ui-panel');
        
        const uiGenerationConfig = {
            showModeSelector: ['window', 'door', 'cabinet'].includes(mode),
            showDimensions: true,
            showActions: true,
            compactLayout: true
        };

        if (uiGenerationConfig.showModeSelector && this.dropdownConfig.enableDropdowns) {
            this.addModeDropdown(mode);
        }

        if (mode === 'cabinet') {
            if (uiGenerationConfig.showActions) {
                const button = document.createElement('button');
                button.textContent = 'Add Selected Cabinet';
                button.onclick = () => {
                    const selectedType = this.selectedOptions.cabinet;
                    this.addElementWithType('cabinet', selectedType);
                };
                this.propertiesContainer.appendChild(button);
            }
        } else if (mode === 'window') {
            if (uiGenerationConfig.showActions) {
                const button = document.createElement('button');
                button.textContent = 'Add Selected Window';
                button.onclick = () => {
                    const selectedType = this.selectedOptions.window;
                    this.addElementWithType('window', selectedType);
                };
                this.propertiesContainer.appendChild(button);
            }
        } else if (mode === 'door') {
            if (uiGenerationConfig.showActions) {
                const button = document.createElement('button');
                button.textContent = 'Add Selected Door';
                button.onclick = () => {
                    const selectedType = this.selectedOptions.door;
                    this.addElementWithType('door', selectedType);
                };
                this.propertiesContainer.appendChild(button);
            }
        }

        if (uiGenerationConfig.showDimensions && ['window', 'door', 'cabinet'].includes(mode)) {
            this.addDimensionControls(mode);
        }

        if (['window', 'door', 'cabinet'].includes(mode)) {
            if (contextPanel) {
                contextPanel.style.display = 'flex'; // Show panel
                // Clear scene button visibility is managed by the panel's display style
            }
        } else {
            // Hide panel for non-placement modes (info, plan, light, measure, wall)
            if (contextPanel) {
                contextPanel.style.display = 'none';
            }
        }
    }

    /**
     * @tweakable Add dropdown selector for the current mode
     */
    addModeDropdown(mode) {
        const dropdownStylingConfig = {
            containerClass: 'mode-dropdown-container',
            labelClass: 'mode-dropdown-label',
            selectClass: 'mode-dropdown-select',
            showDescriptions: true
        };

        if (!this.modeOptions[mode]) return;

        const container = document.createElement('div');
        container.className = dropdownStylingConfig.containerClass;
        container.style.marginBottom = '15px';

        const label = document.createElement('label');
        label.className = dropdownStylingConfig.labelClass;
        label.textContent = `${mode.charAt(0).toUpperCase() + mode.slice(1)} Type:`;
        label.style.cssText = `
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
            color: #ecf0f1;
        `;

        const select = document.createElement('select');
        select.id = `${mode}-type-select`;
        select.className = dropdownStylingConfig.selectClass;
        select.style.cssText = `
            width: 100%;
            padding: 8px;
            border: 1px solid #34495e;
            border-radius: 4px;
            background: #2c3e50;
            color: #ecf0f1;
            font-size: 13px;
        `;

        this.modeOptions[mode].options.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option.id;
            optionElement.textContent = this.dropdownConfig.showIcons ? 
                `${option.icon} ${option.name}` : option.name;
            
            if (option.id === this.selectedOptions[mode]) {
                optionElement.selected = true;
            }
            
            select.appendChild(optionElement);
        });

        container.appendChild(label);
        container.appendChild(select);

        // Add description if enabled
        if (dropdownStylingConfig.showDescriptions) {
            const description = document.createElement('div');
            description.className = 'mode-option-description';
            description.style.cssText = `
                font-size: 11px;
                color: #bdc3c7;
                margin-top: 4px;
                font-style: italic;
            `;
            
            const updateDescription = () => {
                const selectedOption = this.modeOptions[mode].options.find(
                    opt => opt.id === select.value
                );
                description.textContent = selectedOption ? selectedOption.description : '';
            };
            
            updateDescription();
            select.addEventListener('change', updateDescription);
            
            container.appendChild(description);
        }

        this.propertiesContainer.appendChild(container);
    }

    /**
     * @tweakable Add dimension control inputs for the selected mode
     */
    addDimensionControls(mode) {
        const dimensionControlConfig = {
            showWidthHeight: true,
            showDepthForCabinet: mode === 'cabinet',
            showSillHeightForWindow: mode === 'window',
            enableRealTimeUpdate: false
        };

        const dimensions = this.modeOptions[mode].defaultDimensions;
        
        const container = document.createElement('div');
        container.className = 'dimension-controls';
        container.style.marginBottom = '15px';

        const title = document.createElement('h4');
        title.textContent = 'Dimensions (cm)';
        title.style.cssText = `
            margin: 0 0 10px 0;
            color: #ecf0f1;
            font-size: 14px;
        `;
        container.appendChild(title);

        if (dimensionControlConfig.showWidthHeight) {
            this.addDimensionInput(container, 'width', dimensions.width || 60);
            this.addDimensionInput(container, 'height', dimensions.height || 80);
        }

        if (dimensionControlConfig.showDepthForCabinet) {
            this.addDimensionInput(container, 'depth', dimensions.depth || 60);
        }

        if (dimensionControlConfig.showSillHeightForWindow) {
            this.addDimensionInput(container, 'sillHeight', dimensions.sillHeight || 90);
        }

        this.propertiesContainer.appendChild(container);
    }

    /**
     * @tweakable Create individual dimension input fields
     */
    addDimensionInput(container, dimensionName, defaultValue) {
        const inputStylingConfig = {
            inputWidth: '80px',
            labelWidth: '60px',
            containerMargin: '8px'
        };

        const inputContainer = document.createElement('div');
        inputContainer.style.cssText = `
            display: flex;
            align-items: center;
            margin-bottom: ${inputStylingConfig.containerMargin};
        `;

        const label = document.createElement('label');
        label.textContent = `${dimensionName.charAt(0).toUpperCase() + dimensionName.slice(1)}:`;
        label.style.cssText = `
            width: ${inputStylingConfig.labelWidth};
            color: #ecf0f1;
            font-size: 12px;
        `;

        const input = document.createElement('input');
        input.type = 'number';
        input.id = `${dimensionName}-input`;
        input.value = defaultValue;
        input.min = '1';
        input.step = '1';
        input.style.cssText = `
            width: ${inputStylingConfig.inputWidth};
            padding: 4px;
            border: 1px solid #34495e;
            border-radius: 3px;
            background: #34495e;
            color: #ecf0f1;
            font-size: 12px;
        `;

        inputContainer.appendChild(label);
        inputContainer.appendChild(input);
        container.appendChild(inputContainer);
    }

    /**
     * @tweakable Add element with selected type and custom dimensions
     */
    addElementWithType(elementType, selectedTypeId) {
        const elementCreationConfig = {
            useCustomDimensions: true,
            defaultPosition: { x: 200, y: 200 },
            notifyOnCreate: true
        };

        const selectedOption = this.modeOptions[elementType].options.find(
            opt => opt.id === selectedTypeId
        );

        const properties = { 
            ...elementCreationConfig.defaultPosition,
            type: selectedTypeId,
            variant: selectedOption ? selectedOption.name : 'Standard'
        };

        // Get custom dimensions if available
        if (elementCreationConfig.useCustomDimensions) {
            const widthInput = document.getElementById('width-input');
            const heightInput = document.getElementById('height-input');
            const depthInput = document.getElementById('depth-input');
            const sillHeightInput = document.getElementById('sillHeight-input');

            if (widthInput) properties.width = parseFloat(widthInput.value);
            if (heightInput) properties.height = parseFloat(heightInput.value);
            if (depthInput) properties.depth = parseFloat(depthInput.value);
            if (sillHeightInput) properties.sillHeight = parseFloat(sillHeightInput.value);
        }

        this.model.addElement(elementType, properties);

        if (elementCreationConfig.notifyOnCreate) {
            this.showToast(`${selectedOption ? selectedOption.name : elementType} added!`, 2000);
        }
    }

    /**
     * @tweakable Update properties UI when selection changes
     */
    updatePropertiesForSelection(mode, selectedOption) {
        const updateConfig = {
            updateDimensions: true,
            showSelectionInfo: true,
            animateChanges: false
        };

        if (!selectedOption) return;

        // Update dimension inputs with new defaults
        if (updateConfig.updateDimensions) {
            const dimensions = this.modeOptions[mode].defaultDimensions;
            
            ['width', 'height', 'depth', 'sillHeight'].forEach(dim => {
                const input = document.getElementById(`${dim}-input`);
                if (input && dimensions[dim]) {
                    input.value = dimensions[dim];
                }
            });
        }

        if (updateConfig.showSelectionInfo) {
            // Update description if it exists
            const description = document.querySelector('.mode-option-description');
            if (description) {
                description.textContent = selectedOption.description;
            }
        }
    }
}