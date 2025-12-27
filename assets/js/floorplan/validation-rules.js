export const WallValidation = {
        settings: {
        minLength: 2, // feet
        maxIntersectionAngle: 30, // degrees
        minWallSpacing: 3 // feet
    },
    
    validateWallPosition(newWall, existingWalls) {
        return existingWalls.every(wall => {
            const angle = this.calculateAngle(wall, newWall);
            const spacing = this.calculateWallSpacing(wall, newWall);
            
            return angle >= this.settings.maxIntersectionAngle &&
                   spacing >= this.settings.minWallSpacing;
        });
    },

    calculateAngle(wall1, wall2) {
        const v1 = { x: wall1.x2 - wall1.x1, y: wall1.y2 - wall1.y1 };
        const v2 = { x: wall2.x2 - wall2.x1, y: wall2.y2 - wall2.y1 };
        const dot = v1.x * v2.x + v1.y * v2.y;
        const mag1 = Math.hypot(v1.x, v1.y);
        const mag2 = Math.hypot(v2.x, v2.y);
        return Math.acos(dot/(mag1*mag2)) * (180/Math.PI);
    },

    calculateWallSpacing(wall1, wall2) {
        // Calculate minimum distance between walls
        const x1 = (wall1.x1 + wall1.x2) / 2;
        const y1 = (wall1.y1 + wall1.y2) / 2;
        const x2 = (wall2.x1 + wall2.x2) / 2;
        const y2 = (wall2.y1 + wall2.y2) / 2;
        
        return Math.hypot(x2 - x1, y2 - y1);
    }
};