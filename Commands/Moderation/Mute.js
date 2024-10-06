const Command = require("../../Utils/Command.js");

class Mute extends Command {
    constructor(Bot) {
        super(Bot, {
            enabled: true,
            required_perm: "MUTE_MEMBERS",
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
        const duration = args[1]?.value; // Duration in seconds

        if (!Target) {
            return await this.Bot.send(interaction, `❌ User not found in this guild!`);
        }

        if (!member.permissions.has("MUTE_MEMBERS")) {
            return await this.Bot.send(interaction, `❌ You do not have permission to mute members!`);
        }

        const muteRole = guild.roles.cache.find(role => role.name === "Muted");
        if (!muteRole) {
            return await this.Bot.send(interaction, `❌ The "Muted" role does not exist.`);
        }

        // Log role positions for debugging
        console.log(`Bot's Highest Role Position: ${member.guild.me.roles.highest.position}`);
        console.log(`Target's Highest Role Position: ${Target.roles.highest.position}`);

        if (member.guild.me.roles.highest.position <= Target.roles.highest.position) {
            return await this.Bot.send(interaction, `❌ I cannot mute this user. They might have a higher role than me!`);
        }

        // Check if the bot can manage the target user
        if (!Target.manageable) {
            return await this.Bot.send(interaction, `❌ I cannot manage this user. They might have a higher role or I do not have permission!`);
        }

        try {
            await Target.roles.add(muteRole); // Add the mute role
            if (duration) {
                setTimeout(async () => {
                    await Target.roles.remove(muteRole); // Remove the mute role after the duration
                }, duration * 1000); // Duration in milliseconds

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
