const { ApplicationCommandOptionType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    name: "test",
    description: "Commande test",
    run: async(client, interaction, { errorEmbed }) => {
        console.log("ok");
        // const embed = new EmbedBuilder()
        //     .setColor("#D1EB48")
        //     .setTitle("Shift Lock")
        //     .setDescription("Merci pour votre commande ! Nous espérons que vous avez apprécié votre expérience avec nous, c'est pourquoi il nous serait grandement utile de connaître votre avis sur notre service.\nVeuillez choisir entre 1 et 5 étoiles.")

        // const rows = new ActionRowBuilder().setComponents(
        //     new ButtonBuilder().setCustomId("1").setEmoji("<:standard_star:1294308601300516874>").setStyle(ButtonStyle.Secondary),
        //     new ButtonBuilder().setCustomId("2").setEmoji("<:standard_star:1294308601300516874>").setStyle(ButtonStyle.Secondary),
        //     new ButtonBuilder().setCustomId("3").setEmoji("<:standard_star:1294308601300516874>").setStyle(ButtonStyle.Secondary),
        //     new ButtonBuilder().setCustomId("4").setEmoji("<:premium_star:1294308603993522207>").setStyle(ButtonStyle.Secondary),
        //     new ButtonBuilder().setCustomId("5").setEmoji("<:premium_star:1294308603993522207>").setStyle(ButtonStyle.Secondary),
        // )

        // const message = await interaction.reply({ embeds: [embed], components: [rows] });
        // if (!message) return errorEmbed("Une erreur s'est produite, veuillez réessayer.");

        // const filter = i => i.user.id === interaction.user.id;
        // const collector = message.createMessageComponentCollector({ filter, time: 30000 });

        // collector.on("collect", async i => {
        //     i.update({ components: [] });

        //     const responseEmbed = new EmbedBuilder()
        //     .setColor("#D1EB48")
        //     .setDescription("Merci pour votre avis !");

        //     return i.reply({ embeds: [responseEmbed], ephemeral: true });
        // });

        // collector.on("end", async collected => {
        //     message.edit({ components: [] });
        // });
    }
}