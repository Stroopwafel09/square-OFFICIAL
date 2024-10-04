const Command = require("../../Utils/Command.js");

class Unban extends Command {
    
    constructor(Bot) {
        super(Bot, {
            enabled: true,
            required_perm: "BAN_MEMBERS",
            usages: ["unban"],
            description: "Unban members from guild.",
            category: "Punishment",
            options: [{
                name: "user_id",
                description: "Enter the ID of the user to unban.",
                type: 3, // 3 is type STRING for user ID
                required: true
            }]
        });
    }

    load() {
        return;
    }

    async run(interaction, guild, member, args) {
        console.log("Command executed.");

        const userId = args[0].value; // Verwacht een string voor de gebruikers-ID
        console.log("User ID to unban:", userId);

        // Check of de uitvoerende lid de permissie heeft om te bannen
        console.log("Member permissions:", member.permissions.toArray());
        if (!member.permissions.has("BAN_MEMBERS")) {
            return await this.Bot.send(interaction, `❌ You do not have permission to unban members!`);
        }

        try {
            await guild.members.unban(userId);
            console.log("User unbanned.");
            return await this.Bot.send(interaction, `User with ID ${userId} has been successfully unbanned from the server. ✅`);
        } catch (error) {
            console.error("Error unbanning user:", error);
            return await this.Bot.send(interaction, `❌ An error occurred while trying to unban the user. They might not be banned or the ID is incorrect.`);
        }
    }
}

module.exports = Unban;
