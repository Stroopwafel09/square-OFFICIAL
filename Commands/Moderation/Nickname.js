const Command = require("../../Utils/Command.js");

class Nickname extends Command {
    
    constructor(Bot) {
        super(Bot, {
            enabled: true,
            required_perm: "MANAGE_NICKNAMES", // Required permission
            usages: ["nickname"],
            description: "Change or reset a member's nickname.",
            category: "Moderation",
            options: [{
                name: "user",
                description: "Enter target user.",
                type: 6, // 6 is type USER
                required: true
            },
            {
                name: "nickname",
                description: "Enter new nickname (leave blank to reset).",
                type: 3, // 3 is type STRING
                required: false
            }]
        });
    }

    load() {
        return;
    }

    async run(interaction, guild, member, args) {
        

        const Target = guild.members.cache.get(args[0].value);
        const newNickname = args[1]?.value || null; // Get the nickname, default to null



        // Check if the target user is found
        if (!Target) {
            return await this.Bot.send(interaction, `❌ User not found in this guild!`);
        }

        // Log member's permissions for debugging


        // Check if the member executing the command has permission to manage nicknames
        if (!member.permissions.has("MANAGE_NICKNAMES")) {
            return await this.Bot.send(interaction, `❌ You do not have permission to manage nicknames!`);
        }

        // Check if the target user can have their nickname changed
        if (!Target.manageable) {
            return await this.Bot.send(interaction, `❌ I cannot change this user's nickname. They might have a higher role or I do not have permission!`);
        }

        // Proceed to change the user's nickname or reset it
        try {
            await Target.setNickname(newNickname);
            if (newNickname) {
                return await this.Bot.send(interaction, `✅ ${Target} has been given the nickname: **${newNickname}**`);
            } else {
                return await this.Bot.send(interaction, `✅ ${Target}'s nickname has been reset to their username.`);
            }
        } catch (error) {
            console.error("Error changing nickname:", error);
            return await this.Bot.send(interaction, `❌ An error occurred while changing the nickname.`);
        }
    }
}

module.exports = Nickname;
