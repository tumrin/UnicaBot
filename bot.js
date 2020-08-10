const { paivitaRuoat } = require("./tasks/waiter.js");

const fs = require("fs");

const Discord = require("discord.js");
const client = new Discord.Client();
client.commands = new Discord.Collection();
const cooldowns = new Discord.Collection();

// scan commands folder for all available commands
const commandFiles = fs
    .readdirSync("./commands")
    .filter(file => file.endsWith(".js"));

//iterate through found command files
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    // set a new item in the Collection
    // with the key as the command name and the value as the exported module
    client.commands.set(command.name, command);
}

//configs
const package = require("./package.json");
const { prefix, name} = require("./config.json");
const { token } = require("./token.json");

console.log("bot loaded");

// triggered when bot:
//  -logs in
//  -reconnects after disconnecting
client.on("ready", () => {
    console.log(name + " is now logged in");
    client.user.setPresence({status:"online", game:{
        name: "!ruoka",
        type:"LISTENING"
    }})
});

client.login(token);


// triggered when bot receives message
client.on("message", message => {
    //ignore messages on other channels
    //if (message.channel.name !== channel) return;
    // ignore non-commands and own messages
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    console.log(`${message.author.username}:${message.content}`);

    // get arguments and command name from message
    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    // check for command name in commands list, including aliases
    const command =
        client.commands.get(commandName) ||
        client.commands.find(
            cmd => cmd.aliases && cmd.aliases.includes(commandName)
        );

    if (!command) return;

    // if command requires args but none are provided
    if (command.args == true && !args.length) {
        let reply = `Tämä komento vaatii argumentteja, ${message.author}`;
        if (command.usage) {
            reply += `\nKomennon oikea käyttö on: \`${prefix}${command.name} ${command.usage}\``;
        }
        return message.channel.send(reply);
    }


    // try executing the command provided
    try {
        command.execute(message, args);
    } catch (error) {
        // catch errors when executing the command
        console.error(error);
        message.reply("jotain meni pieleen.");
    }
    console.log(message.author.username + ": " + message.content);
});

paivitaRuoat();

setInterval(() => {
    paivitaRuoat();
}, 1000 * 60 * 60 * 4); // 4 tunnin välein
