const Command = require("../../Utils/Command.js");

class Unmute extends Command {
    
    constructor(Bot) {
        super(Bot, {
            enabled: true,
            required_perm: "MUTE_MEMBERS",
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

        if (!Target) {
            return await this.Bot.send(interaction, `❌ User not found in this guild!`);
        }

        if (!member.permissions.has("MUTE_MEMBERS")) {
            return await this.Bot.send(interaction, `❌ You do not have permission to unmute members!`);
        }

        // Ensure the bot can manage roles
        const muteRole = guild.roles.cache.find(role => role.name === "Muted");
        if (!muteRole || !Target.manageable) {
            return await this.Bot.send(interaction, `❌ I cannot unmute this user. They might have a higher role or I do not have permission!`);
        }

        try {
            await Target.roles.remove(muteRole); // Remove the mute role
            return await this.Bot.send(interaction, `✅ ${Target} has been unmuted.`);
        } catch (error) {
            console.error("Error unmuting user:", error);
            return await this.Bot.send(interaction, `❌ An error occurred while unmuting the user.`);
        }
    }
}

module.exports = Unmute;
