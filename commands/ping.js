module.exports = {
  data: {
    name: "ping",
    description: "Risponde con pong",
  },
  async execute(interaction) {
    // Risposta visibile a tutti gli utenti
    //await interaction.reply("pong");
    // risposta visibile al solo utente che ha eseguito il comando
    await interaction.reply({ content: "pong", ephemeral: true });

    // Modifica dopo un tot di tempo
    //await wait(3000);
    //await interaction.editReply({ content: "pong2", ephemeral: true });

    // Ulteriori risposta dopo un tot di tempo
    //   await wait(3000);
    //   await interaction.followUp({
    //     content: "pong follow",
    //     ephemeral: false,
    //   });

    //   Eliminare la risposta dopo tot di tempo (solo se non ephemeral)
    //   await wait(3000);
    //   await interaction.deleteReply();
  },
  permissions: [
    {
      id: process.env.ROLE_GIOVANE_ID,
      type: "ROLE",
      permission: false,
    },
  ],
  publish: false,
};
