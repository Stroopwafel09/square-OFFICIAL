const Command = require("../../Utils/Command.js");

class Unban extends Command {
    
    constructor(Bot) {
        super(Bot, {
            enabled: true,
            required_perm: "BAN_MEMBERS",
            usages: ["unban"],
            description: "Unban members from the guild.",
            category: "Punishment",
            options: [{
                name: "user_id",
                description: "Enter the ID of the user to unban.",
                type: 3, // 3 is type STRING (for user ID)
                required: true
            }]
        });
    }

    load() {
        return;
    }

    async run(interaction, guild, member, args) {
        const userId = args[0].value;

        try {
            await guild.members.unban(userId);
            return await this.Bot.say(`User with ID ${userId} has been successfully unbanned. ✅`);
        } catch (error) {
            if (error.code === 10026) {
                return await this.Bot.say(`❌ User with ID ${userId} is not banned.`);
            } else {
                return await this.Bot.say(`❌ An error occurred: ${error.message}`);
            }
        }
    }
}

module.exports = Unban;
