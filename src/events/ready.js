const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events, ActivityType } = require('discord.js');
const moment = require('moment');

module.exports = {
	name: Events.ClientReady,
	once: true,
	run: async(client) => {
		client.logger.info("Ready!");

		client.user.setPresence({
			activities: [{ name: `le dernier post`, type: ActivityType.Watching }],
		});

		// const embed = new EmbedBuilder()
		// .setColor("CF1010")
		// // .setImage("https://imgur.com/Q0dgyFL.png")
		// .setThumbnail("https://imgur.com/cwu6dOI.png")
		// .setTitle("Los Santos Infos")
		// .setDescription(`Retrouvez tous les posts du journal ici ainsi que sur le canal principal : <#1170457275463377037>`)

		// const channel = await client.channels.fetch("1271626918432608347");
		// if (channel) channel.send({ embeds: [embed] }).catch(e => console.error(e));
		// else console.log("Channel not found.");

	}
};
