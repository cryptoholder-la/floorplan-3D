export class FloorplanInteraction {
    constructor(canvas, core, floorplanCanvas) {
        this.canvas = canvas;
        this.core = core;
        this.currentTool = null;
        this.startPoint = null;
        this.floorplanCanvas = floorplanCanvas;
        
        /**
         * @tweakable Wall interaction configuration for selection and editing
         */
        this.wallInteractionConfig = {
            clickRadius: 10, // pixels - radius for wall detection
            popupWidth: 280,
            popupHeight: 320,
            enableDragToMove: true,
            enableDoubleClickEdit: true,
            highlightColor: '#3498db',
            selectedColor: '#e74c3c'
        };

        this.snapConfig = {
            gridSize: 20, // pixels
            angleSnap: 15, // degrees
            enabled: true
        };

        this.cursorStyles = {
            wall: 'crosshair',
            door: 'copy',
            window: 'copy',
            default: 'default'
        };

        /**
         * @tweakable Available wall attributes for the popup editor
         */
        this.wallAttributes = {
            colors: [
                { name: 'Light Gray', value: '#cccccc' },
                { name: 'White', value: '#ffffff' },
                { name: 'Beige', value: '#f5f5dc' },
                { name: 'Brown', value: '#8b4513' },
                { name: 'Dark Gray', value: '#696969' }
            ],
            textures: [
                { name: 'Smooth', value: 'smooth' },
                { name: 'Brick', value: 'brick' },
                { name: 'Concrete', value: 'concrete' },
                { name: 'Wood', value: 'wood' },
                { name: 'Stone', value: 'stone' }
            ],
            thicknessOptions: [10, 15, 20, 25, 30], // cm
            heightOptions: [240, 270, 300, 330] // cm
        };

        /**
         * @tweakable Hint integration for wall interaction feedback
         */
        this.hintIntegrationConfig = {
            showAttributeHints: true,
            showMovementHints: true,
            hintOnFirstSelection: true,
            hintOnAttributeChange: true
        };

        this.selectedWall = null;
        this.isDragging = false;
        this.dragStartPoint = null;
        this.attributePopup = null;
        this.hasShownAttributeHint = false;
        this.hasShownMovementHint = false;
        this.hasShownCompletionHint = false;

        /**
         * @tweakable Element variant integration for interaction handling
         */
        this.variantIntegrationConfig = {
            showVariantInPreview: true,
            enableVariantSpecificCursors: true,
            displayVariantTooltips: true
        };

        this.currentElementVariant = null;

        this.initEventListeners();
        this.createAttributePopup();
    }

    initEventListeners() {
        this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
        this.canvas.addEventListener('click', this.handleWallClick.bind(this));
        this.canvas.addEventListener('dblclick', this.handleWallDoubleClick.bind(this));
    }

    /**
     * @tweakable Wall selection and popup display logic with hint integration
     */
    handleWallClick(e) {
        if (this.currentTool && this.currentTool !== 'select') return;
        
        const pos = this.getCanvasPosition(e);
        const clickedWall = this.findWallAtPosition(pos);
        
        if (clickedWall) {
            this.selectWall(clickedWall);
            this.showAttributePopup(e.clientX, e.clientY, clickedWall);
            
            // Show hint for first-time wall selection
            if (this.hintIntegrationConfig.showAttributeHints && 
                this.hintIntegrationConfig.hintOnFirstSelection && 
                !this.hasShownAttributeHint) {
                
                setTimeout(() => {
                    this.showWallAttributeHint();
                }, 500);
                this.hasShownAttributeHint = true;
            }
        } else {
            this.deselectWall();
            this.hideAttributePopup();
        }
    }

    /**
     * @tweakable Wall attribute hint display for popup guidance
     */
    showWallAttributeHint() {
        const hintConfig = {
            title: "Wall Properties",
            text: "Adjust wall dimensions, materials, and appearance. Changes apply immediately to all views.",
            icon: "⚙️",
            position: 'auto',
            duration: 4000
        };
        
        // Create and show hint near the popup
        const popup = this.attributePopup;
        if (popup && popup.style.display !== 'none') {
            const hintElement = document.createElement('div');
            hintElement.className = 'wall-attribute-hint';
            hintElement.style.cssText = `
                position: fixed;
                background: rgba(52, 152, 219, 0.95);
                color: white;
                padding: 10px 15px;
                border-radius: 6px;
                font-size: 12px;
                max-width: 200px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
                z-index: 10002;
                opacity: 0;
                transform: translateY(10px);
                transition: all 300ms ease;
                pointer-events: none;
            `;
            
            hintElement.innerHTML = `
                <div style="display: flex; align-items: center; margin-bottom: 5px;">
                    <span style="font-size: 14px; margin-right: 8px;">${hintConfig.icon}</span>
                    <strong>${hintConfig.title}</strong>
                </div>
                <div style="font-size: 11px; opacity: 0.9;">${hintConfig.text}</div>
            `;
            
            // Position hint relative to popup
            const popupRect = popup.getBoundingClientRect();
            hintElement.style.left = `${popupRect.right + 10}px`;
            hintElement.style.top = `${popupRect.top}px`;
            
            document.body.appendChild(hintElement);
            
            // Animate in
            setTimeout(() => {
                hintElement.style.opacity = '1';
                hintElement.style.transform = 'translateY(0)';
            }, 100);
            
            // Auto-remove
            setTimeout(() => {
                hintElement.style.opacity = '0';
                hintElement.style.transform = 'translateY(-10px)';
                setTimeout(() => {
                    if (hintElement.parentNode) {
                        document.body.removeChild(hintElement);
                    }
                }, 300);
            }, hintConfig.duration);
        }
    }

    /**
     * @tweakable Wall double-click handling with movement hints
     */
    handleWallDoubleClick(e) {
        if (this.selectedWall && this.wallInteractionConfig.enableDoubleClickEdit) {
            this.enterWallEditMode(e);
            
            // Show movement hint
            if (this.hintIntegrationConfig.showMovementHints && !this.hasShownMovementHint) {
                this.showWallMovementHint();
                this.hasShownMovementHint = true;
            }
        }
    }

    /**
     * @tweakable Wall movement guidance hint
     */
    showWallMovementHint() {
        const movementHintConfig = {
            text: "Drag to move the wall. Press Escape to cancel. Click elsewhere to finish.",
            duration: 3000,
            position: 'top-center'
        };
        
        const hintElement = document.createElement('div');
        hintElement.className = 'wall-movement-hint';
        hintElement.style.cssText = `
            position: fixed;
            top: 60px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(255, 193, 7, 0.95);
            color: #333;
            padding: 8px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 500;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
            z-index: 10001;
            opacity: 0;
            transform: translateX(-50%) translateY(-10px);
            transition: all 250ms ease;
            pointer-events: none;
        `;
        
        hintElement.textContent = movementHintConfig.text;
        document.body.appendChild(hintElement);
        
        // Animate in
        setTimeout(() => {
            hintElement.style.opacity = '1';
            hintElement.style.transform = 'translateX(-50%) translateY(0)';
        }, 50);
        
        // Auto-remove
        setTimeout(() => {
            hintElement.style.opacity = '0';
            hintElement.style.transform = 'translateX(-50%) translateY(-10px)';
            setTimeout(() => {
                if (hintElement.parentNode) {
                    document.body.removeChild(hintElement);
                }
            }, 250);
        }, movementHintConfig.duration);
    }

    findWallAtPosition(pos) {
        const walls = this.core.elements.walls;
        const radius = this.wallInteractionConfig.clickRadius;
        
        for (const wall of walls) {
            const distance = this.distanceToWall(pos, wall);
            if (distance <= radius) {
                return wall;
            }
        }
        return null;
    }

    distanceToWall(point, wall) {
        const A = point.x - wall.x1;
        const B = point.y - wall.y1;
        const C = wall.x2 - wall.x1;
        const D = wall.y2 - wall.y1;

        const dot = A * C + B * D;
        const lenSq = C * C + D * D;
        let param = -1;
        
        if (lenSq !== 0) {
            param = dot / lenSq;
        }

        let xx, yy;
        if (param < 0) {
            xx = wall.x1;
            yy = wall.y1;
        } else if (param > 1) {
            xx = wall.x2;
            yy = wall.y2;
        } else {
            xx = wall.x1 + param * C;
            yy = wall.y1 + param * D;
        }

        const dx = point.x - xx;
        const dy = point.y - yy;
        return Math.sqrt(dx * dx + dy * dy);
    }

    selectWall(wall) {
        if (this.selectedWall) {
            this.selectedWall.selected = false;
        }
        
        this.selectedWall = wall;
        this.selectedWall.selected = true;
        this.floorplanCanvas.drawElements();
    }

    deselectWall() {
        if (this.selectedWall) {
            this.selectedWall.selected = false;
            this.selectedWall = null;
            this.floorplanCanvas.drawElements();
        }
    }

    /**
     * @tweakable Attribute popup creation and styling
     */
    createAttributePopup() {
        this.attributePopup = document.createElement('div');
        this.attributePopup.className = 'wall-attribute-popup';
        this.attributePopup.style.cssText = `
            position: fixed;
            width: ${this.wallInteractionConfig.popupWidth}px;
            height: ${this.wallInteractionConfig.popupHeight}px;
            background: white;
            border: 2px solid #3498db;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 1000;
            display: none;
            padding: 15px;
            font-family: Arial, sans-serif;
            font-size: 12px;
        `;

        this.attributePopup.innerHTML = `
            <div style="border-bottom: 1px solid #ddd; padding-bottom: 10px; margin-bottom: 15px;">
                <h3 style="margin: 0; color: #2c3e50;">Wall Attributes</h3>
                <button id="close-popup" style="float: right; margin-top: -25px; background: none; border: none; font-size: 18px; cursor: pointer;">&times;</button>
            </div>
            
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold;">Length (cm):</label>
                <input type="number" id="wall-length" min="10" max="1000" step="10" style="width: 100%; padding: 5px;">
            </div>
            
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold;">Height (cm):</label>
                <select id="wall-height" style="width: 100%; padding: 5px;">
                    ${this.wallAttributes.heightOptions.map(h => 
                        `<option value="${h}">${h} cm</option>`
                    ).join('')}
                </select>
            </div>
            
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold;">Thickness (cm):</label>
                <select id="wall-thickness" style="width: 100%; padding: 5px;">
                    ${this.wallAttributes.thicknessOptions.map(t => 
                        `<option value="${t}">${t} cm</option>`
                    ).join('')}
                </select>
            </div>
            
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold;">Color:</label>
                <div id="color-options" style="display: flex; flex-wrap: wrap; gap: 5px;">
                    ${this.wallAttributes.colors.map(color => 
                        `<div class="color-option" data-color="${color.value}" 
                              style="width: 25px; height: 25px; background: ${color.value}; 
                                     border: 2px solid #ddd; cursor: pointer; border-radius: 3px;"
                              title="${color.name}"></div>`
                    ).join('')}
                </div>
            </div>
            
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold;">Texture:</label>
                <select id="wall-texture" style="width: 100%; padding: 5px;">
                    ${this.wallAttributes.textures.map(texture => 
                        `<option value="${texture.value}">${texture.name}</option>`
                    ).join('')}
                </select>
            </div>
            
            <div style="text-align: center;">
                <button id="apply-changes" style="background: #3498db; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; margin-right: 10px;">Apply</button>
                <button id="cancel-changes" style="background: #95a5a6; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">Cancel</button>
            </div>
        `;

        document.body.appendChild(this.attributePopup);
        this.initPopupEventListeners();
    }

    initPopupEventListeners() {
        this.attributePopup.querySelector('#close-popup').addEventListener('click', () => {
            this.hideAttributePopup();
        });

        this.attributePopup.querySelector('#apply-changes').addEventListener('click', () => {
            this.applyWallChanges();
        });

        this.attributePopup.querySelector('#cancel-changes').addEventListener('click', () => {
            this.hideAttributePopup();
        });

        // Color selection
        this.attributePopup.querySelectorAll('.color-option').forEach(option => {
            option.addEventListener('click', (e) => {
                this.attributePopup.querySelectorAll('.color-option').forEach(opt => {
                    opt.style.border = '2px solid #ddd';
                });
                e.target.style.border = '2px solid #3498db';
            });
        });
    }

    /**
     * @tweakable Popup positioning and display configuration
     */
    showAttributePopup(x, y, wall) {
        const popup = this.attributePopup;
        
        // Position popup near click but keep it on screen
        let popupX = x + 10;
        let popupY = y + 10;
        
        if (popupX + this.wallInteractionConfig.popupWidth > window.innerWidth) {
            popupX = x - this.wallInteractionConfig.popupWidth - 10;
        }
        
        if (popupY + this.wallInteractionConfig.popupHeight > window.innerHeight) {
            popupY = y - this.wallInteractionConfig.popupHeight - 10;
        }
        
        popup.style.left = `${popupX}px`;
        popup.style.top = `${popupY}px`;
        popup.style.display = 'block';
        
        // Populate current values
        this.populateWallAttributes(wall);
    }

    hideAttributePopup() {
        this.attributePopup.style.display = 'none';
    }

    populateWallAttributes(wall) {
        const length = Math.hypot(wall.x2 - wall.x1, wall.y2 - wall.y1) * 0.5; // Convert pixels to cm
        
        this.attributePopup.querySelector('#wall-length').value = Math.round(length);
        this.attributePopup.querySelector('#wall-height').value = wall.height || 240;
        this.attributePopup.querySelector('#wall-thickness').value = wall.thickness || 15;
        this.attributePopup.querySelector('#wall-texture').value = wall.texture || 'smooth';
        
        // Set selected color
        const currentColor = wall.color || '#cccccc';
        this.attributePopup.querySelectorAll('.color-option').forEach(option => {
            if (option.dataset.color === currentColor) {
                option.style.border = '2px solid #3498db';
            } else {
                option.style.border = '2px solid #ddd';
            }
        });
    }

    /**
     * @tweakable Wall attribute modification with completion hints
     */
    applyWallChanges() {
        if (!this.selectedWall) return;
        
        const newLength = parseFloat(this.attributePopup.querySelector('#wall-length').value);
        const newHeight = parseFloat(this.attributePopup.querySelector('#wall-height').value);
        const newThickness = parseFloat(this.attributePopup.querySelector('#wall-thickness').value);
        const newTexture = this.attributePopup.querySelector('#wall-texture').value;
        
        // Get selected color
        const selectedColorOption = this.attributePopup.querySelector('.color-option[style*="rgb(52, 152, 219)"], .color-option[style*="#3498db"]');
        const newColor = selectedColorOption ? selectedColorOption.dataset.color : this.selectedWall.color || '#cccccc';
        
        // Calculate new wall endpoints based on length
        const currentLength = Math.hypot(this.selectedWall.x2 - this.selectedWall.x1, this.selectedWall.y2 - this.selectedWall.y1);
        const lengthRatio = (newLength / 0.5) / currentLength; // Convert cm to pixels
        
        const centerX = (this.selectedWall.x1 + this.selectedWall.x2) / 2;
        const centerY = (this.selectedWall.y1 + this.selectedWall.y2) / 2;
        const deltaX = (this.selectedWall.x2 - this.selectedWall.x1) * lengthRatio / 2;
        const deltaY = (this.selectedWall.y2 - this.selectedWall.y1) * lengthRatio / 2;
        
        // Update wall properties
        this.selectedWall.x1 = centerX - deltaX;
        this.selectedWall.y1 = centerY - deltaY;
        this.selectedWall.x2 = centerX + deltaX;
        this.selectedWall.y2 = centerY + deltaY;
        this.selectedWall.height = newHeight;
        this.selectedWall.thickness = newThickness;
        this.selectedWall.color = newColor;
        this.selectedWall.texture = newTexture;
        
        // Mark core as dirty and redraw
        this.core.isDirty = true;
        this.floorplanCanvas.drawElements();
        
        // Show completion hint if enabled
        if (this.hintIntegrationConfig.hintOnAttributeChange && !this.hasShownCompletionHint) {
            setTimeout(() => {
                this.showAttributeCompletionHint();
            }, 300);
            this.hasShownCompletionHint = true;
        }
        
        this.hideAttributePopup();
    }

    /**
     * @tweakable Completion hint for successful attribute changes
     */
    showAttributeCompletionHint() {
        const completionHintConfig = {
            text: "✅ Wall updated! Changes are reflected in all views.",
            duration: 2500,
            style: 'success'
        };
        
        const hintElement = document.createElement('div');
        hintElement.className = 'attribute-completion-hint';
        hintElement.style.cssText = `
            position: fixed;
            bottom: 80px;
            right: 20px;
            background: rgba(46, 204, 113, 0.95);
            color: white;
            padding: 10px 15px;
            border-radius: 6px;
            font-size: 13px;
            font-weight: 500;
            box-shadow: 0 3px 10px rgba(0, 0, 0, 0.3);
            z-index: 10001;
            opacity: 0;
            transform: translateX(20px);
            transition: all 300ms ease;
            pointer-events: none;
        `;
        
        hintElement.textContent = completionHintConfig.text;
        document.body.appendChild(hintElement);
        
        // Animate in
        setTimeout(() => {
            hintElement.style.opacity = '1';
            hintElement.style.transform = 'translateX(0)';
        }, 50);
        
        // Auto-remove
        setTimeout(() => {
            hintElement.style.opacity = '0';
            hintElement.style.transform = 'translateX(20px)';
            setTimeout(() => {
                if (hintElement.parentNode) {
                    document.body.removeChild(hintElement);
                }
            }, 300);
        }, completionHintConfig.duration);
    }

    /**
     * @tweakable Wall drag and move functionality
     */
    enterWallEditMode(e) {
        if (!this.selectedWall || !this.wallInteractionConfig.enableDragToMove) return;
        
        this.isDragging = true;
        this.dragStartPoint = this.getCanvasPosition(e);
        this.canvas.style.cursor = 'move';
        
        // Add temporary event listeners for drag operation
        const handleDragMove = (e) => {
            if (!this.isDragging) return;
            
            const currentPos = this.getCanvasPosition(e);
            const deltaX = currentPos.x - this.dragStartPoint.x;
            const deltaY = currentPos.y - this.dragStartPoint.y;
            
            // Move wall by delta
            this.selectedWall.x1 += deltaX;
            this.selectedWall.y1 += deltaY;
            this.selectedWall.x2 += deltaX;
            this.selectedWall.y2 += deltaY;
            
            this.dragStartPoint = currentPos;
            this.floorplanCanvas.drawElements();
        };
        
        const handleDragEnd = () => {
            this.isDragging = false;
            this.canvas.style.cursor = this.cursorStyles.default;
            this.core.isDirty = true;
            
            this.canvas.removeEventListener('mousemove', handleDragMove);
            this.canvas.removeEventListener('mouseup', handleDragEnd);
        };
        
        this.canvas.addEventListener('mousemove', handleDragMove);
        this.canvas.addEventListener('mouseup', handleDragEnd);
    }

    handleMouseDown(e) {
        const pos = this.getCanvasPosition(e);
        this.startPoint = this.snapConfig.enabled ? this.snapToGrid(pos) : pos;
        
        if(this.currentTool) {
            this.canvas.style.cursor = this.cursorStyles[this.currentTool];
        }
    }

    handleMouseMove(e) {
        if (!this.startPoint || !this.currentTool) return;

        const currentPos = this.getCanvasPosition(e);
        const snappedPos = this.snapConfig.enabled ? 
            this.snapToGrid(currentPos) : currentPos;

        // Draw preview
        this.floorplanCanvas.drawElements();
        
        /**
         * @tweakable Enhanced preview with variant information
         */
        if (this.variantIntegrationConfig.showVariantInPreview) {
            this.drawVariantPreview(this.startPoint, snappedPos);
        } else {
            this.floorplanCanvas.drawPreview(this.startPoint, snappedPos);
        }
    }

    /**
     * @tweakable Draw preview with variant-specific styling and information
     */
    drawVariantPreview(start, end) {
        const previewConfig = {
            showVariantLabel: true,
            useVariantColor: true,
            showDimensions: true,
            labelOffset: 10
        };

        // Draw basic preview
        this.floorplanCanvas.drawPreview(start, end);

        // Add variant-specific enhancements
        if (this.currentElementVariant && previewConfig.showVariantLabel) {
            const ctx = this.floorplanCanvas.ctx;
            const midX = (start.x + end.x) / 2;
            const midY = (start.y + end.y) / 2;

            ctx.save();
            ctx.fillStyle = previewConfig.useVariantColor ? '#3498db' : '#666';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(
                `${this.currentElementVariant.icon} ${this.currentElementVariant.name}`, 
                midX, 
                midY - previewConfig.labelOffset
            );

            if (previewConfig.showDimensions && this.currentElementVariant.dimensions) {
                const dims = this.currentElementVariant.dimensions;
                const dimensionText = `${dims.width || 'W'}×${dims.height || 'H'}cm`;
                ctx.font = '10px Arial';
                ctx.fillStyle = '#888';
                ctx.fillText(dimensionText, midX, midY + previewConfig.labelOffset);
            }
            ctx.restore();
        }
    }

    handleMouseUp(e) {
        if (!this.startPoint || !this.currentTool) return;

        const endPoint = this.getCanvasPosition(e);
        const snappedEnd = this.snapConfig.enabled ? 
            this.snapToGrid(endPoint) : endPoint;

        /**
         * @tweakable Enhanced element creation with variant data
         */
        const elementData = {
            x1: this.startPoint.x,
            y1: this.startPoint.y,
            x2: snappedEnd.x,
            y2: snappedEnd.y,
            z1: 0,
            z2: 0
        };

        // Add variant information if available
        if (this.variantIntegrationConfig.showVariantInPreview && this.currentElementVariant) {
            elementData.variantData = {
                id: this.currentElementVariant.id,
                name: this.currentElementVariant.name,
                icon: this.currentElementVariant.icon,
                dimensions: this.currentElementVariant.dimensions
            };
        }

        this.core.addElement(this.currentTool, elementData);

        this.resetState();
        this.floorplanCanvas.drawElements();
    }

    getCanvasPosition(e) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }

    snapToGrid(pos) {
        if (!this.snapConfig.enabled) return pos;

        return {
            x: Math.round(pos.x / this.snapConfig.gridSize) * this.snapConfig.gridSize,
            y: Math.round(pos.y / this.snapConfig.gridSize) * this.snapConfig.gridSize
        };
    }

    resetState() {
        this.startPoint = null;
        this.canvas.style.cursor = this.cursorStyles.default;
    }
}