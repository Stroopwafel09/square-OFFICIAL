// Commands/Punishments/Warnings.js

const Command = require("../../Utils/Command.js");
const warningSystem = require("../../WarningSystem.js"); // Import the singleton instance

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

module.exports = Warnings;
