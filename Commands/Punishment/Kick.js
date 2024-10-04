const Command = require("../../Utils/Command.js");

class Kick extends Command {
    
    constructor(Bot) {
        super(Bot, {
            enabled: true,
            required_perm: "KICK_MEMBERS",
            usages: ["kick"],
            description: "Kick members from guild.",
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
            return await this.Bot.send(interaction, '❌ User not found in this guild!');
        }

        // Log member's permissions for debugging
        console.log("Member permissions:", member.permissions.toArray());

        // Check if the member executing the command has permission to kick
        if (!member.permissions.has("KICK_MEMBERS")) {
            return await this.Bot.send(interaction, '❌ You do not have permission to kick members!');
        }

        // Check if the target user can be kicked
        if (!Target.kickable) {
            return await this.Bot.send(interaction, '❌ I cannot kick this user. They might have a higher role or I do not have permission to kick them!');
        }

        // Proceed to kick the user
        await Target.kick();
        console.log("User kicked.");
        return await this.Bot.send(interaction, `${Target} has been successfully kicked from the server. ✅`);
    }
}

module.exports = Kick;
