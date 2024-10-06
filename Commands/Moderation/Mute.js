const Command = require("../../Utils/Command.js");

class Mute extends Command {
    
    constructor(Bot) {
        super(Bot, {
            enabled: true,
            required_perm: "MUTE_MEMBERS", // Required permission
            usages: ["mute"],
            description: "Mute a member for a specified duration.",
            category: "Moderation",
            options: [{
                name: "user",
                description: "Enter target user.",
                type: 6, // 6 is type USER
                required: true
            },
            {
                name: "duration",
                description: "Enter duration in seconds (leave blank for indefinite mute).",
                type: 4, // 4 is type INTEGER
                required: false
            }]
        });
    }

    load() {
        return;
    }

    async run(interaction, guild, member, args) {
        const Target = guild.members.cache.get(args[0].value);
        const duration = args[1]?.value; // Get the duration in seconds

        // Check if the target user is found
        if (!Target) {
            return await this.Bot.send(interaction, `❌ User not found in this guild!`);
        }

        // Check if the member executing the command has permission to mute members
        if (!member.permissions.has("MUTE_MEMBERS")) {
            return await this.Bot.send(interaction, `❌ You do not have permission to mute members!`);
        }

        // Check if the target user can be muted
        if (!Target.manageable) {
            return await this.Bot.send(interaction, `❌ I cannot mute this user. They might have a higher role or I do not have permission!`);
        }

        // Proceed to mute the user
        try {
            await Target.timeout(duration ? duration * 1000 : null); // Set timeout duration in milliseconds
            if (duration) {
                return await this.Bot.send(interaction, `✅ ${Target} has been muted for **${duration} seconds**.`);
            } else {
                return await this.Bot.send(interaction, `✅ ${Target} has been muted indefinitely.`);
            }
        } catch (error) {
            console.error("Error muting user:", error);
            return await this.Bot.send(interaction, `❌ An error occurred while muting the user.`);
        }
    }
}

module.exports = Mute;
