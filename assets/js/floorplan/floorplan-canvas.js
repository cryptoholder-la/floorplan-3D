export class FloorplanCanvas {
    constructor(containerId, core) {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.core = core;
        
        /**
         * @tweakable Wall rendering styles including selection highlighting
         */
        this.styles = {
            gridColor: "#131010",
            wallColor: '#333',
            wallSelectedColor: '#e74c3c',
            wallHighlightColor: '#3498db',
            doorColor: '#8B4513',
            windowColor: '#87CEEB',
            lineWidth: 2,
            selectedLineWidth: 3,
            previewColor: '#666666',
            selectionGlow: 5
        };
        
        this.initCanvas(containerId);
    }

    initCanvas(containerId) {
        this.canvas.width = 800;
        this.canvas.height = 600;
        this.canvas.style.border = '1px solid #ccc';
        document.getElementById(containerId).appendChild(this.canvas);
    }

    drawGrid(gridSize) {
        this.ctx.strokeStyle = this.styles.gridColor;
        this.ctx.lineWidth = 0.5;
        
        for(let x = 0; x < this.canvas.width; x += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }
        for(let y = 0; y < this.canvas.height; y += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
    }

    /**
     * @tweakable Enhanced wall drawing with selection highlighting and attributes
     */
    drawElements() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawGrid(20); // 20px grid
        
        const elements = this.core.elements;
        
        // Draw walls with enhanced styling
        elements.walls.forEach(wall => {
            this.drawWallWithAttributes(wall);
        });

        // Draw doors
        elements.doors.forEach(door => {
            this.ctx.strokeStyle = this.styles.doorColor;
            this.ctx.lineWidth = this.styles.lineWidth;
            this.ctx.strokeRect(door.x, door.y, door.width, door.height);
        });

        // Draw windows
        elements.windows.forEach(window => {
            this.ctx.strokeStyle = this.styles.windowColor;
            this.ctx.lineWidth = this.styles.lineWidth;
            this.ctx.strokeRect(window.x, window.y, window.width, window.height);
        });
    }

    drawWallWithAttributes(wall) {
        // Set wall color based on attributes or defaults
        let strokeColor = wall.color || this.styles.wallColor;
        let lineWidth = this.styles.lineWidth;
        
        // Apply selection highlighting
        if (wall.selected) {
            this.ctx.shadowColor = this.styles.wallSelectedColor;
            this.ctx.shadowBlur = this.styles.selectionGlow;
            strokeColor = this.styles.wallSelectedColor;
            lineWidth = this.styles.selectedLineWidth;
        }
        
        this.ctx.strokeStyle = strokeColor;
        this.ctx.lineWidth = lineWidth;
        
        // Draw the wall line
        this.ctx.beginPath();
        this.ctx.moveTo(wall.x1, wall.y1);
        this.ctx.lineTo(wall.x2, wall.y2);
        this.ctx.stroke();
        
        // Reset shadow
        this.ctx.shadowBlur = 0;
        
        // Draw thickness indicator if wall is selected
        if (wall.selected && wall.thickness) {
            this.drawWallThickness(wall);
        }
        
        // Draw texture indicator
        if (wall.texture && wall.texture !== 'smooth') {
            this.drawTexturePattern(wall);
        }
    }

    /**
     * @tweakable Wall thickness visualization for selected walls
     */
    drawWallThickness(wall) {
        const thicknessVisualizationConfig = {
            opacity: 0.3,
            offsetDistance: 3, // pixels
            showDimensions: true
        };
        
        // Calculate perpendicular offset for thickness visualization
        const dx = wall.x2 - wall.x1;
        const dy = wall.y2 - wall.y1;
        const length = Math.hypot(dx, dy);
        
        if (length === 0) return;
        
        const perpX = -dy / length * thicknessVisualizationConfig.offsetDistance;
        const perpY = dx / length * thicknessVisualizationConfig.offsetDistance;
        
        // Draw parallel lines to show thickness
        this.ctx.save();
        this.ctx.globalAlpha = thicknessVisualizationConfig.opacity;
        this.ctx.strokeStyle = this.styles.wallSelectedColor;
        this.ctx.lineWidth = 1;
        this.ctx.setLineDash([3, 3]);
        
        // Top line
        this.ctx.beginPath();
        this.ctx.moveTo(wall.x1 + perpX, wall.y1 + perpY);
        this.ctx.lineTo(wall.x2 + perpX, wall.y2 + perpY);
        this.ctx.stroke();
        
        // Bottom line
        this.ctx.beginPath();
        this.ctx.moveTo(wall.x1 - perpX, wall.y1 - perpY);
        this.ctx.lineTo(wall.x2 - perpX, wall.y2 - perpY);
        this.ctx.stroke();
        
        this.ctx.restore();
        this.ctx.setLineDash([]);
        
        // Show thickness dimension
        if (thicknessVisualizationConfig.showDimensions) {
            const midX = (wall.x1 + wall.x2) / 2;
            const midY = (wall.y1 + wall.y2) / 2;
            
            this.ctx.fillStyle = this.styles.wallSelectedColor;
            this.ctx.font = '10px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(`${wall.thickness || 15}cm`, midX, midY - 10);
        }
    }

    /**
     * @tweakable Texture pattern visualization for walls
     */
    drawTexturePattern(wall) {
        const texturePatterns = {
            brick: () => this.drawBrickPattern(wall),
            concrete: () => this.drawConcretePattern(wall),
            wood: () => this.drawWoodPattern(wall),
            stone: () => this.drawStonePattern(wall)
        };
        
        if (texturePatterns[wall.texture]) {
            this.ctx.save();
            this.ctx.globalAlpha = 0.4;
            texturePatterns[wall.texture]();
            this.ctx.restore();
        }
    }

    drawBrickPattern(wall) {
        const brickWidth = 8;
        const brickHeight = 4;
        
        this.ctx.strokeStyle = '#8B4513';
        this.ctx.lineWidth = 0.5;
        
        const dx = wall.x2 - wall.x1;
        const dy = wall.y2 - wall.y1;
        const length = Math.hypot(dx, dy);
        const steps = Math.floor(length / brickWidth);
        
        for (let i = 0; i < steps; i++) {
            const x = wall.x1 + (dx / steps) * i;
            const y = wall.y1 + (dy / steps) * i;
            
            this.ctx.beginPath();
            this.ctx.arc(x, y, 1, 0, Math.PI * 2);
            this.ctx.stroke();
        }
    }

    drawConcretePattern(wall) {
        // Simple dotted pattern for concrete
        this.ctx.strokeStyle = '#999999';
        this.ctx.lineWidth = 1;
        this.ctx.setLineDash([2, 4]);
        
        this.ctx.beginPath();
        this.ctx.moveTo(wall.x1, wall.y1);
        this.ctx.lineTo(wall.x2, wall.y2);
        this.ctx.stroke();
        
        this.ctx.setLineDash([]);
    }

    drawWoodPattern(wall) {
        // Wood grain lines
        this.ctx.strokeStyle = '#8B4513';
        this.ctx.lineWidth = 0.5;
        
        const dx = wall.x2 - wall.x1;
        const dy = wall.y2 - wall.y1;
        const perpX = -dy * 0.1;
        const perpY = dx * 0.1;
        
        for (let i = 0; i < 3; i++) {
            const offset = (i - 1) * 2;
            this.ctx.beginPath();
            this.ctx.moveTo(wall.x1 + perpX * offset, wall.y1 + perpY * offset);
            this.ctx.lineTo(wall.x2 + perpX * offset, wall.y2 + perpY * offset);
            this.ctx.stroke();
        }
    }

    drawStonePattern(wall) {
        // Stone texture with small squares
        const stoneSize = 3;
        this.ctx.fillStyle = '#696969';
        
        const dx = wall.x2 - wall.x1;
        const dy = wall.y2 - wall.y1;
        const length = Math.hypot(dx, dy);
        const steps = Math.floor(length / stoneSize);
        
        for (let i = 0; i < steps; i += 2) {
            const x = wall.x1 + (dx / steps) * i;
            const y = wall.y1 + (dy / steps) * i;
            
            this.ctx.fillRect(x - 1, y - 1, 2, 2);
        }
    }

    drawPreview(start, end) {
        this.ctx.strokeStyle = this.styles.previewColor;
        this.ctx.setLineDash([5, 5]);
        this.ctx.beginPath();
        this.ctx.moveTo(start.x, start.y);
        this.ctx.lineTo(end.x, end.y);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
    }
}