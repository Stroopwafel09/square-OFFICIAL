const { Client, Collection, APIMessage, PermissionsBitField, GatewayIntentBits } = require("discord.js");
const fs = require("fs");
const fetch = require("node-fetch").default;
const AsciiTable = require("ascii-table");

// Load configuration
const Config = (global.Config = JSON.parse(fs.readFileSync("./config.json", { encoding: "utf-8" })));

// Create a new client instance with required intents
const Bot = (global.Bot = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
    fetchAllMembers: true,
    disableMentions: "none",
}));

const Commands = (global.Commands = new Collection());
const CommandTable = new AsciiTable("List of Commands");

Bot.once("ready", async () => {
    await new Promise(async (resolve, reject) => {
        try {
            const commandsList = await Bot.api.applications(Bot.user.id).commands.get();

            const Dirs = fs.readdirSync("./Commands");
            for (const commandDir of Dirs) {
                const Files = fs.readdirSync("./Commands/" + commandDir).filter(e => e.endsWith(".js"));
                for (const commandFile of Files) {
                    const Command = new (require("./Commands/" + commandDir + "/" + commandFile))(Bot);
                    if (!Command.usages || !Command.usages.length) {
                        reject("ERROR! Cannot load \'" + commandFile + "\' command file: Command usages not found!");
                    }
                    if (!Command.options || !Array.isArray(Command.options)) {
                        reject("ERROR! Cannot load \'" + commandFile + "\' command file: Command options is not set!");
                    }

                    CommandTable.addRow(commandFile, `Command: ${Command.usages[0]} | Aliases: ${Command.usages.slice(1).join(", ")} | Category: ${Command.category || dir}`, "✅");
                    Commands.set(Command.usages[0], Command);
                    Command.usages.forEach(async (usage) => {
                        const existingCommand = commandsList.find(cmd => cmd.name === usage);
                        if (existingCommand) {
                            await Bot.api.applications(Bot.user.id).commands(existingCommand.id).patch({
                                data: {
                                    name: usage,
                                    description: Command.description,
                                    options: Command.options
                                }
                            });
                        } else {
                            await Bot.api.applications(Bot.user.id).commands.post({
                                data: {
                                    name: usage,
                                    description: Command.description,
                                    options: Command.options
                                }
                            });
                        }
                    });

                    Command.load();
                }
            }

            // Clean up commands that are not in the Commands collection
            commandsList.filter(cmd => !Array.from(Commands.keys()).includes(cmd.name)).forEach(async (cmd) => {
                await fetch(`https://discord.com/api/v8/applications/${Bot.user.id}/commands/${cmd.id}`, {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bot ${Bot.token}`,
                        "Content-Type": "application/json",
                    }
                });
            });

            if (CommandTable.getRows().length < 1) CommandTable.addRow("❌", "❌", `❌ -> No commands found.`);
            console.log(CommandTable.toString());
            resolve();
        } catch (error) {
            console.error("Error fetching commands:", error);
            reject(error);
        }
    });

    Bot.ws.on("INTERACTION_CREATE", async (interaction) => {
        const Command = Commands.get(interaction.data.name) || Commands.find(e => e.usages.some(a => a === interaction.data.name));
        if (!Command || (!Command.enabled || Command.enabled !== true)) return;

        if (Command.required_perm !== 0 && Command.required_perm.length && !Bot.hasPermission(interaction.member, Command.required_perm)) {
            return await Bot.send(interaction, `You must have a \`${Command.required_perm.toUpperCase()}\` permission to use this command!`);
        }

        const Guild = Bot.guilds.cache.get(interaction.guild_id);
        const Member = Guild.members.cache.get(interaction.member.user.id);
        return Command.run(interaction, Guild, Member, interaction.data.options);
    });

    Bot.user.setPresence({
        status: "dnd",
        activity: {
            name: Config.DEFAULTS.ACTIVITY_TEXT,
            type: "WATCHING"
        }
    });

    console.log(`[BOT] \'${Bot.user.username}\' client has been activated!`);
});

// Login to Discord
Bot.login(process.env.TOKEN).catch(err => {
    console.error("ERROR! An error occurred while connecting to the client: " + err.message);
    Bot.destroy();
});

// Permissions helper
const AllPermissions = Object.values(PermissionsBitField.Flags).map(flag => flag.toString());
Bot.hasPermission = function (member, permission) {
    if (!AllPermissions.includes(permission.toUpperCase())) return true; // Check if the permission is valid
    const Perms = new PermissionsBitField(member.permissions);
    return Perms.has(permission.toUpperCase());
};

// Send a message function
Bot.send = async function (interaction, content) {
    return Bot.api.interactions(interaction.id, interaction.token).callback.post({
        data: {
            type: 4,
            data: await createAPIMessage(interaction, content)
        }
    });
};

// Create API message function
async function createAPIMessage(interaction, content) {
    const apiMessage = await APIMessage.create(Bot.channels.resolve(interaction.channel_id), content).resolveData().resolveFiles();
    return { ...apiMessage.data, files: apiMessage.files };
}

// Keep server alive (if applicable)
const keepAlive = require('./server.js');
keepAlive();
