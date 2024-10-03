const Command = require("../../Utils/Command.js");

class Ban extends Command {
    
    constructor(Bot) {
        super(Bot, {
            enabled: true,
            required_perm: "BAN_MEMBERS",
            usages: ["ban"],
            description: "Ban members from guild.",
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
        const Target = guild.members.cache.get(args[0].value);
        if (!Target) return await interaction.reply({ content: `User not found!`, ephemeral: true });
        if (!Target.bannable) return await interaction.reply({ content: `❌ You do not have permission to ban this user!`, ephemeral: true });

        await Target.ban();

        return await interaction.reply({ content: `${Target} has been successfully banned from the server. ✅` });
    }
}

module.exports = Ban;
