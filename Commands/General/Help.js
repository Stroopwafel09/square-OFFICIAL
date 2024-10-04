const Command = require("../../Utils/Command.js");
const fs = require("fs");
const path = require("path");

class Help extends Command {
    
    constructor(Bot) {
        super(Bot, {
            enabled: true,
            required_perm: null, // No permissions required for help
            usages: ["help"],
            description: "Displays a list of all commands and their usage.",
            category: "Utility",
            options: []
        });
    }

    load() {
        return;
    }

    async run(interaction, guild, member, args) {
        console.log("Help command executed.");

        const commandFolders = fs.readdirSync(path.join(__dirname, '../../Commands'));
        const helpMessage = [];

        helpMessage.push("**Available Commands:**");

        for (const folder of commandFolders) {
            const commandFiles = fs.readdirSync(path.join(__dirname, '../../Commands', folder))
                .filter(file => file.endsWith('.js'));
            
            if (commandFiles.length > 0) {
                helpMessage.push(`\n**${folder.charAt(0).toUpperCase() + folder.slice(1)} Commands:**`);
                for (const file of commandFiles) {
                    const CommandClass = require(`../../Commands/${folder}/${file}`);
                    const commandInstance = new CommandClass(this.Bot);
                    helpMessage.push(`\`${commandInstance.usages.join(", ")}\`: ${commandInstance.description}`);
                }
            }
        }

        // Send the help message, limited to Discord's embed character limit if necessary
        const finalMessage = helpMessage.join("\n");
        return await this.Bot.send(interaction, finalMessage);
    }
}

module.exports = Help;
