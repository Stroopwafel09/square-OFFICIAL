// Commands/Punishments/Unwarn.js

const Command = require("../../Utils/Command.js");
const WarningSystem = require("../../WarningSystem.js");

const warningSystem = new WarningSystem(); // Reference the same instance

class Unwarn extends Command {
    constructor(Bot) {
        super(Bot, {
            enabled: true,
            required_perm: "MANAGE_MESSAGES",
            usages: ["unwarn"],
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

module.exports = Unwarn;
