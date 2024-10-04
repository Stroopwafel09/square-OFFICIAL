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
        console.log("Command executed by:", member.user.tag);

        // Tijdelijke reactie
        await interaction.reply({ content: 'Bezig met het verwerken van je verzoek...', ephemeral: true });

        const userId = args[0].value;
        let Target;

        try {
            Target = await guild.members.fetch(userId);
            console.log("Target user found:", Target.user.tag);
        } catch (error) {
            console.log("Error fetching member:", error);
            return await this.Bot.send(interaction, `❌ Could not find the user in this guild.`);
        }

        console.log("Member permissions:", member.permissions.toArray());
        if (!member.permissions.has("KICK_MEMBERS")) {
            console.log("Member does not have KICK_MEMBERS permission.");
            return await this.Bot.send(interaction, `❌ You do not have permission to kick members!`);
        }

        if (!Target.kickable) {
            return await this.Bot.send(interaction, `❌ I cannot kick this user. They might have a higher role or I do not have permission to kick them!`);
        }

        try {
            await Target.kick();
            console.log("User kicked.");
            return await this.Bot.send(interaction, `${Target} has been successfully kicked from the server. ✅`);
        } catch (error) {
            console.error("Error kicking user:", error);
            return await this.Bot.send(interaction, `❌ An error occurred while trying to kick the user.`);
        }
    }
}

module.exports = Kick;
