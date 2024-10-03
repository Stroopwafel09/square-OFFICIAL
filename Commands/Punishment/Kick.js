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
        console.log(interaction); // Debugging line to check interaction object

        if (typeof interaction.reply !== 'function') {
            return console.error("Interaction does not support reply.");
        }

        const targetId = args[0].value; // Get the target user ID
        const Target = guild.members.cache.get(targetId);
        
        if (!Target) {
            return await interaction.reply({ content: `User not found!`, ephemeral: true });
        }
        
        if (!Target.kickable) {
            return await interaction.reply({ content: `❌ You do not have permission to kick this user!`, ephemeral: true });
        }

        try {
            await Target.kick();
            return await interaction.reply({ content: `${Target} has been successfully kicked from the server. ✅` });
        } catch (error) {
            console.error(`Kick error: ${error}`);
            return await interaction.reply({ content: `❌ An error occurred while trying to kick the user. Please check my permissions or the user's status.`, ephemeral: true });
        }
    }
}

module.exports = Kick;
