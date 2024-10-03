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
        if (!Target) return await this.Bot.say(`User not found!`);
        if (!Target.bannable) return await this.Bot.say(`❌ You do not have permission to ban this user!`);

        await Target.ban();

        return await this.Bot.say(`${Target} has been successfully banned from the server. ✅`);
    }
}

module.exports = Ban;
