// WarningSystem.js

class WarningSystem {
    constructor() {
        this.warnings = new Map(); // Store warnings in a Map
    }

    addWarning(userId, reason) {
        if (!this.warnings.has(userId)) {
            this.warnings.set(userId, []);
        }
        this.warnings.get(userId).push(reason);
    }

    getWarnings(userId) {
        return this.warnings.get(userId) || [];
    }

    removeWarning(userId, index) {
        if (this.warnings.has(userId)) {
            const userWarnings = this.warnings.get(userId);
            if (index >= 0 && index < userWarnings.length) {
                userWarnings.splice(index, 1);
                return true;
            }
        }
        return false;
    }
}

module.exports = WarningSystem;
