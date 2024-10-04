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
        console.log("Command executed.");

        const Target = guild.members.cache.get(args[0].value);
        console.log("Target user:", Target);

        // Check if the target user is found
        if (!Target) {
            return await this.Bot.send(interaction, `❌ User not found in this guild!`);
        }

        // Log member's permissions for debugging
        console.log("Member permissions:", member.permissions.toArray());

        // Check if the member executing the command has permission to ban
        if (!member.permissions.has("BAN_MEMBERS")) {
            return await this.Bot.send(interaction, `❌ You do not have permission to ban members!`);
        }

        // Check if the target user can be banned
        if (!Target.bannable) {
            return await this.Bot.send(interaction, `❌ I cannot ban this user. They might have a higher role or I do not have permission to ban them!`);
        }

        // Proceed to ban the user
        await Target.ban();
        console.log("User banned.");
        return await this.Bot.send(interaction, `${Target} has been successfully banned from the server. ✅`);
    }
}

module.exports = Ban;
