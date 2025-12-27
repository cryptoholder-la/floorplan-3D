export class StateManager {
    constructor() {
        this.states = new Map();
        this.locks = new Map();
        this.transactions = new Set();
        
        this.stateConfig = {
            maxTransactionRetries: 3,
            lockTimeout: 5000,
            snapshotInterval: 10000
        };
        
        /**
         * @tweakable Enhanced state management configuration for implementing unused undo/redo
         */
        this.enhancedStateConfig = {
            enableTransactionLocking: true,
            maxConcurrentTransactions: 5,
            stateCompressionEnabled: true,
            autoCommitInterval: 5000,
            enableStateValidation: true
        };
        
        this.transactionQueue = [];
        this.activeTransactions = new Set();
        this.stateHistory = [];
        this.currentStateIndex = -1;
        this.maxHistorySize = 100;
        
        if (this.enhancedStateConfig.autoCommitInterval > 0) {
            this.startAutoCommit();
        }
    }

    /**
     * @tweakable Auto-commit configuration for state persistence
     */
    startAutoCommit() {
        const autoCommitConfig = {
            interval: this.enhancedStateConfig.autoCommitInterval,
            minChangesThreshold: 3,
            enableBatching: true
        };
        
        setInterval(() => {
            if (this.transactionQueue.length >= autoCommitConfig.minChangesThreshold) {
                this.processPendingTransactions();
            }
        }, autoCommitConfig.interval);
    }

    async beginTransaction(metadata = {}) {
        if (this.activeTransactions.size >= this.enhancedStateConfig.maxConcurrentTransactions) {
            throw new Error('Maximum concurrent transactions exceeded');
        }
        
        const transaction = {
            id: crypto.randomUUID(),
            timestamp: Date.now(),
            changes: new Map(),
            locks: new Set(),
            metadata,
            status: 'active'
        };
        
        this.activeTransactions.add(transaction);
        return transaction;
    }

    async commitTransaction(transaction) {
        if (!this.activeTransactions.has(transaction)) {
            throw new Error('Invalid or already committed transaction');
        }
        
        try {
            // Validate all changes in transaction
            if (this.enhancedStateConfig.enableStateValidation) {
                await this.validateTransactionChanges(transaction);
            }
            
            // Apply changes atomically
            const stateSnapshot = this.createStateSnapshot();
            for (const [objectId, change] of transaction.changes) {
                await this.applyChange(objectId, change);
            }
            
            // Add to history for undo/redo
            this.addToHistory(stateSnapshot, transaction);
            
            transaction.status = 'committed';
            this.activeTransactions.delete(transaction);
            
            // Release locks
            transaction.locks.forEach(lockId => {
                this.locks.delete(lockId);
            });
            
            return true;
        } catch (error) {
            await this.rollbackTransaction(transaction);
            throw error;
        }
    }

    async rollbackTransaction(transaction) {
        // Revert all changes made by this transaction
        for (const [objectId, change] of transaction.changes) {
            const previousState = this.states.get(objectId);
            if (previousState && previousState.previousVersion) {
                this.states.set(objectId, previousState.previousVersion);
            }
        }
        
        transaction.status = 'rolledback';
        this.activeTransactions.delete(transaction);
        
        // Release locks
        transaction.locks.forEach(lockId => {
            this.locks.delete(lockId);
        });
    }

    createStateSnapshot() {
        /**
         * @tweakable State snapshot configuration for undo/redo functionality
         */
        const snapshotConfig = {
            includeObjectGeometry: true,
            includeTransformMatrices: true,
            enableCompression: this.enhancedStateConfig.stateCompressionEnabled,
            excludeTemporaryProperties: true
        };
        
        const snapshot = {
            timestamp: Date.now(),
            states: new Map(),
            metadata: {}
        };
        
        this.states.forEach((state, objectId) => {
            const stateClone = { ...state };
            
            if (snapshotConfig.excludeTemporaryProperties) {
                delete stateClone.lastAccessed;
                delete stateClone.tempFlags;
            }
            
            snapshot.states.set(objectId, stateClone);
        });
        
        return snapshot;
    }

    addToHistory(snapshot, transaction) {
        // Remove future states if we're not at the end
        this.stateHistory = this.stateHistory.slice(0, this.currentStateIndex + 1);
        
        this.stateHistory.push({
            snapshot,
            transaction: {
                id: transaction.id,
                timestamp: transaction.timestamp,
                metadata: transaction.metadata
            }
        });
        
        this.currentStateIndex++;
        
        // Limit history size
        if (this.stateHistory.length > this.maxHistorySize) {
            this.stateHistory.shift();
            this.currentStateIndex--;
        }
    }

    async undo() {
        if (this.currentStateIndex <= 0) {
            return false;
        }
        
        this.currentStateIndex--;
        const historyEntry = this.stateHistory[this.currentStateIndex];
        await this.restoreStateFromSnapshot(historyEntry.snapshot);
        
        this.emitStateChange('undo', historyEntry);
        return true;
    }

    async redo() {
        if (this.currentStateIndex >= this.stateHistory.length - 1) {
            return false;
        }
        
        this.currentStateIndex++;
        const historyEntry = this.stateHistory[this.currentStateIndex];
        await this.restoreStateFromSnapshot(historyEntry.snapshot);
        
        this.emitStateChange('redo', historyEntry);
        return true;
    }

    async restoreStateFromSnapshot(snapshot) {
        // Clear current state
        this.states.clear();
        
        // Restore from snapshot
        snapshot.states.forEach((state, objectId) => {
            this.states.set(objectId, { ...state });
        });
        
        this.emitStateChange('restore', snapshot);
    }

    async validateTransactionChanges(transaction) {
        /**
         * @tweakable Transaction validation rules for state integrity
         */
        const validationRules = {
            maxChangeSize: 1000000, // bytes
            allowedChangeTypes: ['create', 'update', 'delete', 'transform'],
            requireChangeReason: true,
            enableCrossReferenceValidation: true
        };
        
        for (const [objectId, change] of transaction.changes) {
            // Validate change size
            const changeSize = JSON.stringify(change).length;
            if (changeSize > validationRules.maxChangeSize) {
                throw new Error(`Change too large for object ${objectId}: ${changeSize} bytes`);
            }
            
            // Validate change type
            if (change.type && !validationRules.allowedChangeTypes.includes(change.type)) {
                throw new Error(`Invalid change type: ${change.type}`);
            }
            
            // Require change reason
            if (validationRules.requireChangeReason && !change.reason) {
                throw new Error(`Change reason required for object ${objectId}`);
            }
        }
    }

    processPendingTransactions() {
        const pendingTransactions = [...this.transactionQueue];
        this.transactionQueue = [];
        
        pendingTransactions.forEach(async (transaction) => {
            try {
                await this.commitTransaction(transaction);
            } catch (error) {
                console.error('Failed to commit pending transaction:', error);
            }
        });
    }

    createTransaction() {
        const transaction = {
            id: crypto.randomUUID(),
            changes: new Map(),
            locks: new Set(),
            
            async commit() {
                // Implementation for committing changes
                for (const [objectId, change] of this.changes) {
                    await this.applyChange(objectId, change);
                }
                this.cleanup();
            },
            
            async rollback() {
                // Implementation for rolling back changes
                this.cleanup();
            },
            
            cleanup() {
                // Release all locks held by this transaction
                for (const lockId of this.locks) {
                    this.releaseLock(lockId);
                }
            }
        };

        this.transactions.add(transaction);
        return transaction;
    }

    acquireLock(objectId) {
        if (this.locks.has(objectId)) {
            throw new Error('Object is locked');
        }

        const lock = {
            id: objectId,
            timestamp: Date.now(),
            promise: new Promise((resolve) => {
                setTimeout(resolve, this.stateConfig.lockTimeout);
            }),
            release: () => {
                this.locks.delete(objectId);
            }
        };

        this.locks.set(objectId, lock);
        return lock;
    }

    async applyChange(objectId, change) {
        /**
         * @tweakable State change application settings
         */
        const changeSettings = {
            enableVersioning: true,
            enableChangeValidation: true,
            enableRollbackOnError: true,
            maxRetries: 3
        };

        const currentState = this.states.get(objectId) || {};
        let retryCount = 0;
        
        while (retryCount < changeSettings.maxRetries) {
            try {
                if (changeSettings.enableChangeValidation) {
                    this.validateChange(currentState, change);
                }

                const newState = {
                    ...currentState,
                    ...change,
                    version: changeSettings.enableVersioning ? (currentState.version || 0) + 1 : 1,
                    lastModified: Date.now(),
                    modifiedBy: 'system'
                };
                
                this.states.set(objectId, newState);
                
                // Emit state change event
                this.emitStateChange(objectId, newState, currentState);
                
                return newState;
            } catch (error) {
                retryCount++;
                if (retryCount >= changeSettings.maxRetries) {
                    if (changeSettings.enableRollbackOnError) {
                        this.rollbackChange(objectId, currentState);
                    }
                    throw error;
                }
                
                // Wait before retry
                await new Promise(resolve => setTimeout(resolve, 100 * retryCount));
            }
        }
    }

    validateChange(currentState, change) {
        /**
         * @tweakable Change validation rules
         */
        const validationRules = {
            requiredFields: ['type'],
            forbiddenFields: ['id', 'created_at'],
            maxStringLength: 1000,
            maxObjectDepth: 5
        };

        // Check required fields
        validationRules.requiredFields.forEach(field => {
            if (!currentState[field] && !change[field]) {
                throw new Error(`Required field missing: ${field}`);
            }
        });

        // Check forbidden fields
        validationRules.forbiddenFields.forEach(field => {
            if (change.hasOwnProperty(field)) {
                throw new Error(`Cannot modify protected field: ${field}`);
            }
        });

        // Validate string lengths
        Object.entries(change).forEach(([key, value]) => {
            if (typeof value === 'string' && value.length > validationRules.maxStringLength) {
                throw new Error(`String too long for field ${key}: ${value.length} > ${validationRules.maxStringLength}`);
            }
        });
    }

    rollbackChange(objectId, previousState) {
        this.states.set(objectId, previousState);
        console.warn(`Rolled back changes for object ${objectId}`);
    }

    emitStateChange(objectId, newState, previousState) {
        const changeEvent = new CustomEvent('state-changed', {
            detail: {
                objectId,
                newState,
                previousState,
                timestamp: Date.now()
            }
        });
        
        if (typeof window !== 'undefined') {
            window.dispatchEvent(changeEvent);
        }
    }

    getSnapshot() {
        return {
            timestamp: Date.now(),
            states: new Map(this.states),
            transactions: new Set(this.transactions)
        };
    }

    clear() {
        this.states.clear();
        this.locks.clear();
        this.transactions.clear();
    }
}