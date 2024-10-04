const Command = require("../../Utils/Command.js");

class Ping extends Command {
    
    constructor(Bot) {
        super(Bot, {
            enabled: true,
            required_perm: null, // No permissions required for ping
            usages: ["ping"],
            description: "Check the bot's latency.",
            category: "Utility",
            options: []
        });
    }

    load() {
        return;
    }

    async run(interaction, guild, member, args) {
        console.log("Ping command executed.");

        // Calculate latency
        const sentMessage = await this.Bot.send(interaction, `🏓 Pong! Calculating latency...`);
        const latency = Date.now() - interaction.createdTimestamp;

        // Send the response with the latency
        return await sentMessage.edit(`🏓 Pong! Latency: ${latency}ms`);
    }
}

module.exports = Ping;
