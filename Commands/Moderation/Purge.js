const Command = require("../../Utils/Command.js");

class Purge extends Command {
    
    constructor(Bot) {
        super(Bot, {
            enabled: true,
            required_perm: "MANAGE_MESSAGES",
            usages: ["purge"],
            description: "Delete a specified number of messages from the channel.",
            category: "Moderation",
            options: [{
                name: "amount",
                description: "Number of messages to delete (1-100).",
                type: 4, // 4 is type INTEGER
                required: true
            }]
        });
    }

    load() {
        return;
    }

    async run(interaction, guild, member, args) {
        // Ensure the command is used in a text channel
        const channel = interaction.channel || interaction.guild.channels.cache.get(interaction.channelId);

        if (!channel || !channel.isText()) {
            return await this.Bot.send(interaction, `❌ This command can only be used in a text channel.`);
        }

        const amount = args[0].value;

        // Validate the amount
        if (amount < 1 || amount > 100) {
            return await this.Bot.send(interaction, `❌ You must specify an amount between 1 and 100.`);
        }

        // Check if the member has permission to manage messages
        if (!member.permissions.has("MANAGE_MESSAGES")) {
            return await this.Bot.send(interaction, `❌ You do not have permission to manage messages!`);
        }

        try {
            const messages = await channel.messages.fetch({ limit: amount });
            console.log(`Fetched ${messages.size} messages.`);

            // Filter out messages older than 14 days
            const deletableMessages = messages.filter(msg => (Date.now() - msg.createdTimestamp) < 1209600000);
            console.log(`Deletable messages: ${deletableMessages.size}`);

            if (deletableMessages.size === 0) {
                return await this.Bot.send(interaction, `❌ No messages to delete (older than 14 days).`);
            }

            const deletedMessages = await channel.bulkDelete(deletableMessages);
            return await this.Bot.send(interaction, `✅ Successfully deleted ${deletedMessages.size} messages.`);
        } catch (error) {
            console.error("Error deleting messages:", error);
            return await this.Bot.send(interaction, `❌ An error occurred while trying to delete messages: ${error.message}`);
        }
    }
}

module.exports = Purge;
