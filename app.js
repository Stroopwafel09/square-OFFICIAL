const { Client, Collection, APIMessage, GatewayIntentBits, PermissionsBitField } = require("discord.js");
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
    // Your existing ready code...
});

// Login to Discord
Bot.login(process.env.TOKEN).catch(err => {
    console.error("ERROR! An error occurred while connecting to the client: " + err.message);
    Bot.destroy();
});

// Permissions helper
const AllPermissions = PermissionsBitField.Flags; // Use Flags for permissions
Bot.hasPermission = function(member, permission) {
    if (!AllPermissions[permission.toUpperCase()]) return true; // Check if the permission is valid
    const Perms = new PermissionsBitField(Number(member.permissions));
    return Perms.has(permission.toUpperCase());
};

// Send a message function
Bot.send = async function(interaction, content) {
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
