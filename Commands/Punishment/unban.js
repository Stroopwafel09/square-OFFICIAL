const Command = require("../../Utils/Command.js");

class Unban extends Command {
    
    constructor(Bot) {
        super(Bot, {
            enabled: true,
            required_perm: "BAN_MEMBERS",
            usages: ["unban"],
            description: "Unban members from the guild.",
            category: "Punishment",
            options: [{
                name: "user_id",
                description: "Enter the ID of the user to unban.",
                type: 3, // 3 is type STRING (for user ID)
                required: true
            }]
        });
    }

    load() {
        return;
    }

    async run(interaction, guild, member, args) {
        const userId = args[0].value;

        try {
            await guild.members.unban(userId);
            return await interaction.reply({ content: `User with ID ${userId} has been successfully unbanned. ✅` });
        } catch (error) {
            if (error.code === 10026) {
                return await interaction.reply({ content: `❌ User with ID ${userId} is not banned.`, ephemeral: true });
            } else {
                return await interaction.reply({ content: `❌ An error occurred: ${error.message}`, ephemeral: true });
            }
        }
    }
}

module.exports = Unban;
