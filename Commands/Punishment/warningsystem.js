const Command = require("../../Utils/Command.js");

class WarningSystem {
    constructor() {
        this.warnings = new Map(); // Store warnings in a Map
    }

    addWarning(userId, warning) {
        if (!this.warnings.has(userId)) {
            this.warnings.set(userId, []);
        }
        this.warnings.get(userId).push(warning);
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

const warningSystem = new WarningSystem();

// Warn Command
class Warn extends Command {
    constructor(Bot) {
        super(Bot, {
            enabled: true,
            required_perm: "MANAGE_MESSAGES",
            usages: ["warn"],
            description: "Warn a member in the guild.",
            category: "Moderation",
            options: [{
                name: "user",
                description: "Enter target user.",
                type: 6, // USER type
                required: true
            },
            {
                name: "reason",
                description: "Reason for the warning.",
                type: 3, // STRING type
                required: true
            }]
        });
    }

    load() {
        return;
    }

    async run(interaction, guild, member, args) {
        const Target = guild.members.cache.get(args[0].value);
        const reason = args[1].value;

        if (!Target) {
            return await this.Bot.send(interaction, `❌ User not found in this guild!`);
        }

        warningSystem.addWarning(Target.id, reason);
        return await this.Bot.send(interaction, `✅ ${Target} has been warned for: ${reason}`);
    }
}

// Warnings Command
class Warnings extends Command {
    constructor(Bot) {
        super(Bot, {
            enabled: true,
            required_perm: "MANAGE_MESSAGES",
            usages: ["warnings"],
            description: "See a user's warnings.",
            category: "Moderation",
            options: [{
                name: "user",
                description: "Enter target user.",
                type: 6, // USER type
                required: true
            }]
        });
    }

    load() {
        return;
    }

    async run(interaction, guild, member, args) {
        const Target = guild.members.cache.get(args[0].value);
        
        if (!Target) {
            return await this.Bot.send(interaction, `❌ User not found in this guild!`);
        }

        const userWarnings = warningSystem.getWarnings(Target.id);
        if (userWarnings.length === 0) {
            return await this.Bot.send(interaction, `✅ ${Target} has no warnings.`);
        }

        const warningList = userWarnings.map((warn, index) => `${index + 1}: ${warn}`).join("\n");
        return await this.Bot.send(interaction, `Warnings for ${Target}:\n${warningList}`);
    }
}

// Remove Warning Command
class RemoveWarning extends Command {
    constructor(Bot) {
        super(Bot, {
            enabled: true,
            required_perm: "MANAGE_MESSAGES",
            usages: ["removewarn"],
            description: "Remove a warning from a user.",
            category: "Moderation",
            options: [{
                name: "user",
                description: "Enter target user.",
                type: 6, // USER type
                required: true
            },
            {
                name: "index",
                description: "Index of the warning to remove.",
                type: 4, // INTEGER type
                required: true
            }]
        });
    }

    load() {
        return;
    }

    async run(interaction, guild, member, args) {
        const Target = guild.members.cache.get(args[0].value);
        const index = args[1].value - 1; // Convert to 0-based index
        
        if (!Target) {
            return await this.Bot.send(interaction, `❌ User not found in this guild!`);
        }

        const removed = warningSystem.removeWarning(Target.id, index);
        if (removed) {
            return await this.Bot.send(interaction, `✅ Warning removed from ${Target}.`);
        } else {
            return await this.Bot.send(interaction, `❌ No warning found at that index for ${Target}.`);
        }
    }
}

module.exports = {
    Warn,
    Warnings,
    RemoveWarning,
    warningSystem // Exporting the warning system if needed
};
