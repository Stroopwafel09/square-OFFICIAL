const Command = require("../../Utils/Command.js");

class Purge extends Command {
    
    constructor(Bot) {
        super(Bot, {
            enabled: true,
            required_perm: "MANAGE_MESSAGES", // Required permission to manage messages
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
      

        const amount = args[0].value; // Get the amount from the command arguments
      

        // Validate the amount
        if (amount < 1 || amount > 100) {
            return await this.Bot.send(interaction, `❌ You must specify an amount between 1 and 100.`);
        }

        // Check if the member executing the command has permission to manage messages
        if (!member.permissions.has("MANAGE_MESSAGES")) {
            return await this.Bot.send(interaction, `❌ You do not have permission to manage messages!`);
        }

        // Proceed to purge messages
        try {
            const messages = await interaction.channel.messages.fetch({ limit: amount });
            await interaction.channel.bulkDelete(messages);
            
            return await this.Bot.send(interaction, `✅ Successfully deleted ${messages.size} messages.`);
        } catch (error) {
           
            return await this.Bot.send(interaction, `❌ An error occurred while trying to delete messages.`);
        }
    }
}

module.exports = Purge;
