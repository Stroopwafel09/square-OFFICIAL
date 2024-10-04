const Command = require("../../Utils/Command.js");

class Ping extends Command {
    
    constructor(Bot) {
        super(Bot, {
            enabled: true,
            required_perm: null, // No permissions required for ping
            usages: ["ping"],
            description: "Check the bot's latency and API response time.",
            category: "Utility",
            options: []
        });
    }

    load() {
        return;
    }

    async run(interaction, guild, member, args) {
        console.log("Ping command executed.");

        // Send initial message
        const sentMessage = await this.Bot.send(interaction, `🏓 Pong! Calculating latency...`);

        // Calculate latency
        const latency = Date.now() - interaction.createdTimestamp;

        // Calculate API latency
        const apiLatency = Math.round(this.Bot.ws.ping); // WebSocket ping

        // Send the response with the latency details
        return await sentMessage.edit(`🏓 Pong! Latency: ${latency}ms | API Latency: ${apiLatency}ms`);
    }
}

module.exports = Ping;
