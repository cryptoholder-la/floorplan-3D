/**
 * @tweakable Object pool performance optimization settings
 */
const poolPerformanceConfig = {
    enablePrewarm: true,
    prewarmCount: 10,
    maxPoolSize: 100,
    enableMetrics: true,
    cleanupInterval: 30000 // ms
};

export class ObjectPoolManager {
    constructor() {
        this.pools = new Map();
        this.metrics = new Map();
        this.lastCleanup = Date.now();
        
        if (poolPerformanceConfig.enableMetrics) {
            this.initializeMetrics();
        }
    }

    initializeMetrics() {
        this.metrics.set('totalAcquisitions', 0);
        this.metrics.set('totalReleases', 0);
        this.metrics.set('cacheHits', 0);
        this.metrics.set('cacheMisses', 0);
    }

    initializePools(config) {
        Object.entries(config).forEach(([type, settings]) => {
            const pool = {
                available: [],
                inUse: new Set(),
                factory: settings.factory,
                reset: settings.reset,
                maxSize: settings.maxSize || poolPerformanceConfig.maxPoolSize
            };
            
            // Prewarm pool if enabled
            if (poolPerformanceConfig.enablePrewarm) {
                const prewarmCount = Math.min(
                    poolPerformanceConfig.prewarmCount,
                    pool.maxSize
                );
                
                for (let i = 0; i < prewarmCount; i++) {
                    pool.available.push(settings.factory());
                }
            }
            
            this.pools.set(type, pool);
        });
    }

    async acquire(type) {
        const pool = this.pools.get(type);
        if (!pool) {
            throw new Error(`No pool exists for type: ${type}`);
        }

        if (poolPerformanceConfig.enableMetrics) {
            this.metrics.set('totalAcquisitions', this.metrics.get('totalAcquisitions') + 1);
        }

        let object = pool.available.pop();
        if (object) {
            if (poolPerformanceConfig.enableMetrics) {
                this.metrics.set('cacheHits', this.metrics.get('cacheHits') + 1);
            }
        } else {
            if (poolPerformanceConfig.enableMetrics) {
                this.metrics.set('cacheMisses', this.metrics.get('cacheMisses') + 1);
            }
            object = pool.factory();
        }

        pool.reset(object);
        pool.inUse.add(object);
        
        // Perform cleanup if needed
        this.performMaintenanceCleanup();
        
        return object;
    }

    release(type, object) {
        const pool = this.pools.get(type);
        if (!pool) return;

        if (poolPerformanceConfig.enableMetrics) {
            this.metrics.set('totalReleases', this.metrics.get('totalReleases') + 1);
        }

        pool.inUse.delete(object);
        pool.reset(object);
        
        // Only return to pool if under max size
        if (pool.available.length < pool.maxSize) {
            pool.available.push(object);
        } else {
            // Dispose excess objects
            if (object.geometry) object.geometry.dispose();
            if (object.material) {
                if (Array.isArray(object.material)) {
                    object.material.forEach(mat => mat.dispose());
                } else {
                    object.material.dispose();
                }
            }
        }
    }

    /**
     * @tweakable Pool maintenance and cleanup settings
     */
    performMaintenanceCleanup() {
        const cleanupSettings = {
            interval: poolPerformanceConfig.cleanupInterval,
            maxIdleObjects: 20,
            enableMemoryCompaction: true
        };
        
        const now = Date.now();
        if (now - this.lastCleanup < cleanupSettings.interval) return;
        
        this.pools.forEach((pool, type) => {
            // Remove excess idle objects
            while (pool.available.length > cleanupSettings.maxIdleObjects) {
                const object = pool.available.pop();
                if (object.geometry) object.geometry.dispose();
                if (object.material) object.material.dispose();
            }
        });
        
        this.lastCleanup = now;
    }

    getMetrics() {
        if (!poolPerformanceConfig.enableMetrics) return null;
        
        const poolStats = {};
        this.pools.forEach((pool, type) => {
            poolStats[type] = {
                available: pool.available.length,
                inUse: pool.inUse.size,
                maxSize: pool.maxSize
            };
        });
        
        return {
            global: Object.fromEntries(this.metrics),
            pools: poolStats
        };
    }

    dispose() {
        this.pools.forEach(pool => {
            [...pool.available, ...pool.inUse].forEach(object => {
                if (object.geometry) object.geometry.dispose();
                if (object.material) object.material.dispose();
            });
        });
        this.pools.clear();
    }
}