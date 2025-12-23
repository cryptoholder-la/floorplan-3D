export class HistoryManager<T> {
  private readonly maxStates: number;
  private history: T[];
  private currentIndex: number;

  constructor(maxStates = 50) {
    this.maxStates = maxStates;
    this.history = [];
    this.currentIndex = -1;
  }

  private cloneState(state: T): T {
    // Prefer structuredClone when available (handles more than JSON)
    // Fallback to JSON clone for plain data objects
    const anyGlobal = globalThis as any;
    if (typeof anyGlobal.structuredClone === 'function') {
      return anyGlobal.structuredClone(state);
    }
    return JSON.parse(JSON.stringify(state)) as T;
  }

  saveState(state: T) {
    // Remove any states after current index (for new changes after undo)
    this.history = this.history.slice(0, this.currentIndex + 1);

    // Add new state
    this.history.push(this.cloneState(state));
    this.currentIndex++;

    // Limit history size
    if (this.history.length > this.maxStates) {
      this.history.shift();
      this.currentIndex--;
    }
  }

  undo(): T | null {
    if (this.canUndo()) {
      this.currentIndex--;
      return this.getCurrentState();
    }
    return null;
  }

  redo(): T | null {
    if (this.canRedo()) {
      this.currentIndex++;
      return this.getCurrentState();
    }
    return null;
  }

  getCurrentState(): T | null {
    if (this.currentIndex >= 0 && this.currentIndex < this.history.length) {
      return this.history[this.currentIndex];
    }
    return null;
  }

  canUndo(): boolean {
    return this.currentIndex > 0;
  }

  canRedo(): boolean {
    return this.currentIndex < this.history.length - 1;
  }

  clear() {
    this.history = [];
    this.currentIndex = -1;
  }
}
