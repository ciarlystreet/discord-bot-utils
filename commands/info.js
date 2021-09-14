const { MessageEmbed } = require("discord.js");
const dayjs = require("dayjs");

module.exports = {
  data: {
    name: "info",
    description: "Informazioni",
    options: [
      {
        name: "user",
        description: "Utente di cui vuoi avere le informazioni",
        type: "SUB_COMMAND", // STRING, NUMBER, INTEGER, BOOLEAN, USER, CHANNEL, ROLE, MENTIONABLE e SUB_COMMAND
        required: false,
        options: [
          {
            name: "target",
            description: "L'utente",
            type: "USER",
          },
        ],
      },
      {
        name: "server",
        description: "Informazioni sul server",
        type: "SUB_COMMAND", // STRING, NUMBER, INTEGER, BOOLEAN, USER, CHANNEL, ROLE, MENTIONABLE e SUB_COMMAND
        required: false,
      },
    ],
  },
  async execute(interaction) {
    let embedData = {};
    switch (interaction.options.getSubcommand()) {
      case "user":
        // utente discord
        const user = interaction.options.getUser("target") ?? interaction.user;
        // utente discord come membro del server in cui si esegue il comando
        const member =
          interaction.options.getMember("target") ?? interaction.member;
        console.log(member);
        embedData = {
          color: "",
          title: "",
          url: "",
          author: {
            name: user.username,
            iconURL: user.displayAvatarURL({ dynamic: true }),
          },
          description: "",
          thumbanil: user.displayAvatarURL({ dynamic: true }),
          fields: [
            {
              name: "Iscrizione a Discord",
              value: `${dayjs(user.createdAt).format("DD/MM/YYYY")}`,
              inline: true,
            },
            {
              name: "Ingresso nel server",
              value: `${dayjs(member.joinedAt).format("DD/MM/YYYY")}`,
              inline: true,
            },
            {
              name: "Ruoli",
              value: `${member.roles.cache
                .map((role) => `${role}`)
                .join(", ")}`,
              inline: true,
            },
          ],
          footer: `ID: ${user.id}`,
        };
        break;
      case "server":
        const guild = interaction.guild;
        const guildOwner = await guild.members.fetch(guild.ownerId);
        const tier =
          guild.premiumTier === "NONE" ? 0 : guild.premiumTier.split("_")[1];
        embedData = {
          color: "",
          title: "",
          url: "",
          author: {
            name: guild.name,
            iconURL: guild.iconURL({ dynamic: true }),
          },
          description: "",
          thumbanil: guild.iconURL({ dynamic: true }),
          fields: [
            {
              name: "Proprietario",
              value: `${guildOwner.user.username}#${guildOwner.user.discriminator}`,
              inline: true,
            },
            {
              name: "Bootst",
              value: `${guild.premiumSubscriptionCount} (Tier: ${tier})`,
              inline: true,
            },
            {
              name: "Creazione",
              value: `${dayjs(guild.createdAt).format("DD/MM/YYYY")}`,
              inline: true,
            },
            {
              name: "Utenti",
              value: `${guild.memberCount}`,
              inline: true,
            },
            {
              name: "Ruoli",
              value: `${guild.roles.cache.size}`,
              inline: true,
            },
            {
              name: "Canali Testuali",
              value: `${
                guild.channels.cache.filter(
                  (channel) => channel.type === "GUILD_TEXT"
                ).size
              }`,
              inline: true,
            },
            {
              name: "Canali Vocali",
              value: `${
                guild.channels.cache.filter(
                  (channel) => channel.type === "GUILD_VOICE"
                ).size
              }`,
              inline: true,
            },
          ],
          footer: `ID: ${guild.id}`,
        };
        break;
      default:
        console.error(
          `SubCommand not found ${interaction.options.getSubcommand()}`
        );
    }
    // await interaction.reply({ content: `ping: ${input}`, ephemeral: true });

    const embed = new MessageEmbed()
      .setColor(embedData?.color || "RANDOM")
      .setTitle(embedData?.title)
      .setURL(embedData?.url)
      .setAuthor(embedData?.author?.name, embedData?.author?.iconURL)
      .setDescription(embedData?.description)
      .setThumbnail(embedData?.thumbnail)
      //   .addField("\u200b", "\u200b") // riga vuota
      .addFields(embedData?.fields)
      .setImage(embedData?.image)
      .setFooter(embedData?.footer)
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
  publish: true,
  admin: true,
};
