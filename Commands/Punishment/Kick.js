const Command = require("../../Utils/Command.js");

class Kick extends Command {
    
    constructor(Bot) {
        super(Bot, {
            enabled: true,
            required_perm: "KICK_MEMBERS",
            usages: ["kick"],
            description: "Kick members from the guild.",
            category: "Punishment",
            options: [{
                name: "user",
                description: "Enter target user.",
                type: 6, // 6 is type USER
                required: true
            }]
        });
    }

    load() {
        return;
    }

    async run(interaction, guild, member, args) {
        const targetId = args[0].value; // Get the target user ID
        const Target = guild.members.cache.get(targetId);
        
        // Check if the user exists
        if (!Target) {
            return await interaction.reply({ content: `User not found!`, ephemeral: true });
        }
        
        // Check if the bot can kick the user
        if (!Target.kickable) {
            return await interaction.reply({ content: `❌ You do not have permission to kick this user!`, ephemeral: true });
        }

        try {
            await Target.kick(); // Attempt to kick the user
            return await interaction.reply({ content: `${Target} has been successfully kicked from the server. ✅` });
        } catch (error) {
            return await interaction.reply({ content: `❌ An error occurred while trying to kick the user. Please check my permissions or the user's status.`, ephemeral: true });
        }
    }
}

module.exports = Kick;
