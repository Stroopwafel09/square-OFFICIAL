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
        console.log("Command executed.");
        console.log("Interaction context:", interaction); // Debugging line

        // Ensure interaction is from a guild and has a valid channel
        if (!interaction.guild || !interaction.channel) {
            return await this.Bot.send(interaction, `❌ This command can only be used in a text channel in a server.`);
        }

        const amount = args[0].value;

        // Validate the amount
        if (amount < 1 || amount > 100) {
            return await this.Bot.send(interaction, `❌ You must specify an amount between 1 and 100.`);
        }

        // Check if the member executing the command has permission to manage messages
        if (!member.permissions.has("MANAGE_MESSAGES")) {
            return await this.Bot.send(interaction, `❌ You do not have permission to manage messages!`);
        }

        try {
            // Use interaction.channel directly
            const messages = await interaction.channel.messages.fetch({ limit: Math.min(amount + 1, 100) });
            let deletedMessages = 0;

            // Delete messages authored by the bot itself
            const deletableMessages = messages.filter(m => m.author.id === this.Bot.user.id);

            for (const msg of deletableMessages.values()) {
                await msg.delete();
                deletedMessages++;
            }

            return await this.Bot.send(interaction, `✅ Purged \`${deletedMessages}\` messages.`);
        } catch (error) {
            console.error("Error during purge:", error);
            return await this.Bot.send(interaction, `❌ An error occurred while trying to purge messages: ${error.message}`);
        }
    }
}

module.exports = Purge;
