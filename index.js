require("dotenv").config();
const { Client, Collection, Intents } = require("discord.js");
const wait = require("util").promisify(setTimeout);
const fs = require("fs");

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

// Registrare tutti i comandi presi dai file contenuti nella directory /commands
// client.commands = new Collection();
// const commandFiles = fs
//   .readdirSync("./commands")
//   .filter((file) => file.endsWith(".js"));
// for (const file of commandFiles) {
//   const command = require(`./commands/${file}`);
//   client.commands.set(command.data.name, command);
// }

/**
 * Registrazione comandi GLOBALI e GUILD
 */
const registerCommands = async () => {
  const commandsData = client.commands
    .filter((command) => command?.publish)
    .map((command) => command.data);

  // Registrazione comando GLOBALE (utilizzabile in tutti i server in cui è installato il bot. Può volerci un ora perché sia effettivamente disponibile)
  //   const commands = await client.application?.commands.set([]);
  //   console.log(commands);

  // Registrazione comando GUILD (disponibile solo all'interno del server in cui viene registrato. È disponibile non appena viene registrato)
  // const command = await client.guilds.cache
  //   .get(process.env.ID_GUILD)
  //   .commands.create(commandsData);

  // Regitra i comandi sovrascrivendo quelli precedentemente registrati (set invece di create)
  const commands = await client.guilds.cache
    .get(process.env.ID_GUILD)
    .commands.set(commandsData);

  //   let count = 0;
  //   for (const command of commands) {
  // if (commandData?.permissions) {
  //   const command = await client.guilds.cache
  //     .get("123456789012345678")
  //     ?.commands.fetch("876543210987654321");
  // }
  //   }
  console.log("Commands registerd!");
};

/**
 * Evento scaturito, una sola volta, non appena il Bot è caricato nel server
 */
client.once("ready", async () => {
  console.log("Bot Online");
  //await registerCommands();
});

/**
 * Registrazione comandi GLOBALI e GUILD tramite messaggio in chat
 */
client.on("messageCreate", async (message) => {
  if (!client.application?.owner) {
    await client.application?.fetch();
  }

  if (
    message.channelId === process.env.CHANNEL_REGOLAMENTO_ID &&
    message.author.id !== client.application?.owner.id &&
    message.author.username !== process.env.BOT_NAME
  ) {
    if (message.content === "accetto il regolamento") {
      if (message.member.roles.cache.has(process.env.ROLE_GIOVANE_ID)) {
        const reply = await message.reply({
          content: `Hai già il ruolo`,
          ephemeral: true,
        });
        await wait(3000);
        await message.delete();
        await reply.delete();
      } else {
        const role = message.guild.roles.cache.find(
          (r) => r.id === process.env.ROLE_GIOVANE_ID
        );
        try {
          await message.member.roles.add(role);
          const reply = await message.reply({
            content: `Benvenuto tra i Boomers! La sua soddisfazione è il nostro miglior premio!`,
            ephemeral: true,
          });
          await wait(5000);

          // await message.author.send("**Benvenuto tra i Boomers!**\nPer ogni dubbio o segnalazione contattaci sul canale vocale 'assistenza'.")
          await message.delete();
          await reply.delete();
          // sposta l'utente su un canale
          //const channel = message.guild.channels.cache.get("CHANNEL_ID"); //spazio1
          //member.voice.setChannel(channel)
        } catch (err) {
          console.error(err);
          await message.reply({
            content: `Qualcosa è andato storto!`,
            ephemeral: true,
          });
        }
        // await message.delete();
      }
    }else{
      const reply = await message.reply({
        content: `Questa chat è riservata all'approvazione del regolamento, se hai bisogno di assistenza rivolgiti al canale vocale "assistenza"`,
        ephemeral: true,
      });
      await wait(5000);

      await message.delete();
      await reply.delete();
    }
    return;
  } else if (
    message.content.toLocaleLowerCase() === "!registra" &&
    message.author.id === client.application?.owner.id
  ) {
    await registerCommands();
  }
});

/**
 * Interazione ai comandi registrati
 */
// client.on("interactionCreate", async (interaction) => {
//   if (!interaction.isCommand()) return;

//   const commandName = interaction.commandName;
//   if (!client.commands.has(commandName)) return;

//   if (
//     interaction.user.id !== interaction.member.guild.ownerId &&
//     client.commands.get(commandName).admin
//   ) {
//     await interaction.reply({
//       content: "Non hai i permessi per utilizzare questo comando",
//       ephemeral: true,
//     });
//     return;
//   }

//   try {
//     await client.commands.get(commandName).execute(interaction);
//   } catch (err) {
//     console.error(err);
//     await interaction.reply({
//       content: "Qualcosa è andato storto!",
//       ephemeral: true,
//     });
//   }
// });

client.login(process.env.DISCORD_BOT_TOKEN);
