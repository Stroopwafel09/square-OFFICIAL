const Command = require("../../Utils/Command.js");

class Info extends Command {
    
    constructor(Bot) {
        super(Bot, {
            enabled: true,
            required_perm: null, // No permissions required for info
            usages: ["info"],
            description: "Get information about the bot and its owner.",
            category: "Utility",
            options: []
        });
    }

    load() {
        return;
    }

    async run(interaction, guild, member, args) {
        console.log("Info command executed.");

        // Bot information
        const botInfo = {
            name: this.Bot.user.username,
            id: this.Bot.user.id,
            Server: "https://discord.gg/Kk4jcNYSS2",
            owner: "BramPower09", // Replace with actual owner name
            ownerId: "573891601781489667", // Replace with actual owner ID
            createdAt: this.Bot.user.createdAt.toDateString(),
            guildCount: this.Bot.guilds.cache.size
        };

        // Create the response message
        const infoMessage = `
**Bot Name:** ${botInfo.name}
**Bot ID:** ${botInfo.id}
**Bot Server:** ${botInfo.Server}
**Owner:** ${botInfo.owner} (ID: ${botInfo.ownerId})
**Created On:** ${botInfo.createdAt}
**Servers:** ${botInfo.guildCount}
        `.trim();

        return await this.Bot.send(interaction, infoMessage);
    }
}

module.exports = Info;
