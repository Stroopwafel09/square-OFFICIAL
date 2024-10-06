const Command = require("../../Utils/Command.js");

class Unmute extends Command {
    
    constructor(Bot) {
        super(Bot, {
            enabled: true,
            required_perm: "MUTE_MEMBERS", // Required permission
            usages: ["unmute"],
            description: "Unmute a previously muted member.",
            category: "Moderation",
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

        // Check if the target user is found
        if (!Target) {
            return await this.Bot.send(interaction, `❌ User not found in this guild!`);
        }

        // Check if the member executing the command has permission to mute members
        if (!member.permissions.has("MUTE_MEMBERS")) {
            return await this.Bot.send(interaction, `❌ You do not have permission to unmute members!`);
        }

        // Check if the target user can be unmuted
        if (!Target.manageable) {
            return await this.Bot.send(interaction, `❌ I cannot unmute this user. They might have a higher role or I do not have permission!`);
        }

        // Proceed to unmute the user
        try {
            await Target.timeout(null); // Removing the timeout by setting it to null
            return await this.Bot.send(interaction, `✅ ${Target} has been unmuted.`);
        } catch (error) {
            console.error("Error unmuting user:", error);
            return await this.Bot.send(interaction, `❌ An error occurred while unmuting the user.`);
        }
    }
}

module.exports = Unmute;
