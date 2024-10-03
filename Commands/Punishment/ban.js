const Command = require("../../Utils/Command.js");

class Ban extends Command {
    
    constructor(Bot) {
        super(Bot, {
            enabled: true,
            required_perm: "BAN_MEMBERS",
            usages: ["ban"],
            description: "Ban members from the guild.",
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
        const targetId = args[0].value;
        const Target = guild.members.cache.get(targetId);
        
        if (!Target) {
            return await interaction.reply({ content: `User not found!`, ephemeral: true });
        }
        
        if (!Target.bannable) {
            return await interaction.reply({ content: `❌ You do not have permission to ban this user!`, ephemeral: true });
        }

        try {
            await Target.ban();
            return await interaction.reply({ content: `${Target} has been successfully banned from the server. ✅` });
        } catch (error) {
            return await interaction.reply({ content: `❌ An error occurred while trying to ban the user. Please check my permissions or the user's status.`, ephemeral: true });
        }
    }
}

module.exports = Ban;
