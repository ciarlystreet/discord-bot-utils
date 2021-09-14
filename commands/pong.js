module.exports = {
  data: {
    name: "pong",
    description: "Risponde con ping",
    options: [
      {
        name: "input",
        description: "Inserisci una stringa",
        type: "NUMBER", // STRING, NUMBER, INTEGER, BOOLEAN, USER, CHANNEL, ROLE e MENTIONABLE
        required: true,
      },
    ],
  },
  async execute(interaction) {
    const input = interaction.options.getNumber("input");
    await interaction.reply({ content: `ping: ${input}`, ephemeral: true });
  },
  publish: false,
};
