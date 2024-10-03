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

    async run(interaction) {
        console.log(interaction); // Log the interaction to inspect it

        if (!interaction.options) {
            return await interaction.reply({ content: `❌ Interaction options are undefined.`, ephemeral: true });
        }

        const targetUser = interaction.options.getUser('user');
        if (!targetUser) {
            return await interaction.reply({ content: `User not found!`, ephemeral: true });
        }

        // Fetch the target member
        const Target = await interaction.guild.members.fetch(targetUser.id);
        if (!Target) {
            return await interaction.reply({ content: `User not found in the guild!`, ephemeral: true });
        }

        // Check if the bot can kick the user
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
