const { Events, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, UserSelectMenuBuilder, StringSelectMenuBuilder, InteractionType, PermissionFlagsBits } = require('discord.js');

module.exports = {
	name: Events.InteractionCreate,
	run: async(client, interaction) => {
		if(!interaction.inGuild() || !interaction.guildId) return;

		// Functions
		
		function errorEmbed(description, justEmbed = false, replyType = "reply", ephemeral = true) {
			if(!justEmbed) return interaction[replyType]({ embeds: [new EmbedBuilder().setColor("Red").setDescription(description)], components: [], content: null, files: [], ephemeral: ephemeral }).catch(() => {});
			else return new EmbedBuilder().setColor("Red").setDescription(description)
		}
		
		function successEmbed(description, justEmbed = false, ephemeral = false, replyType = "reply") {
			if(!justEmbed) return interaction[replyType]({ embeds: [new EmbedBuilder().setColor("Green").setDescription(description)], components: [], content: null, files: [], ephemeral: ephemeral }).catch(() => {})
			else return new EmbedBuilder().setColor("Green").setDescription(description)
		}

		// -----------------------------------------
	
		const command = interaction.client.commands[interaction.commandName];
		if (!command && interaction.type !== InteractionType.MessageComponent) {
			client.logger.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}

		try {
			if (interaction.type == InteractionType.ApplicationCommand) return command.run(client, interaction, { errorEmbed, successEmbed });
			if (interaction.type == InteractionType.MessageComponent) {
				
				const customId = interaction.customId;
				let method, addMessage;

				if (!customId) return;
				if (customId.startsWith("open")) method = "open";
				else if (customId.startsWith("sm_open")) method = "sm_open";
				else if (customId.startsWith("add")) method = "add";
				else if (customId.startsWith("sm_add")) method = "sm_add";
				else if (customId.startsWith("close")) method = "close";

				const args = customId.split(".");
				switch (method) {

					case "open": {
						
						const embed = new EmbedBuilder()
						.setColor("CF1010")
						.setThumbnail("https://imgur.com/cwu6dOI.png")
						.setTitle("Los Santos Infos")
						.setDescription(`Veuillez choisir la catégorie de votre ticket.`)

						const rows = new ActionRowBuilder().addComponents(
							new StringSelectMenuBuilder().setCustomId("sm_open").setPlaceholder("Sélectionnez une catégorie").setOptions(
								{ label: "Demande d'informations", value: "Demande d'informations" },
								{ label: "Demande de services (voir salon services)", value: "Demande de services" },
								{ label: "Demande de partenariat", value: "Demande de partenariat" },
								{ label: "Demande de rendez-vous", value: "Demande de rendez-vous" },
								{ label: "Recrutement", value: "Recrutement" },
								{ label: "Autre", value: "Autre" }
							)
						)

						interaction.reply({ embeds: [embed], components: [rows], ephemeral: true });

						break;
					}

					case "sm_open": {

						const category = interaction.values[0];
						const embed = new EmbedBuilder()
						.setColor("CF1010")
						.setThumbnail("https://imgur.com/cwu6dOI.png")
						.setTitle("Los Santos Infos")
						.setDescription(`Bienvenue au centre d'aide du Los Santos Infos, je suis Mariaa votre assistante virtuelle.
							
						Vous avez ouvert un ticket pour **${category}**. Veuillez indiquer la raison exacte de l'ouverture du ticket.
						Mr Bendarsa vous répondra dans __les plus brefs délais__.`);

						const rows = new ActionRowBuilder().addComponents(
							new ButtonBuilder().setCustomId("add").setLabel("Ajouter une personne").setStyle(ButtonStyle.Secondary),
							new ButtonBuilder().setCustomId("close").setLabel("Fermer").setStyle(ButtonStyle.Danger)
						)

						const channel = await interaction.guild.channels.create({
							name: `ticket-${interaction.member.displayName}`,
							reason: "Création d'un ticket",
							parent: "1271591778692239360",
							topic: `Ticket ouvert par ${interaction.member.displayName} pour ${category}`,
							permissionOverwrites: [
								{
									id: interaction.guildId,
									deny: PermissionFlagsBits.ViewChannel
								},
								{
									id: interaction.member.id,
									allow: PermissionFlagsBits.ViewChannel
								}
							]
						})

						interaction.update({ embeds: [successEmbed(`Votre ticket a été ouvert ! <#${channel.id}>`, true)], components: [], ephemeral: true });
						await channel.send({ embeds: [embed], components: [rows] });

						break;
					}

					case "add": {
						
						const embed = new EmbedBuilder()
						.setColor("CF1010")
						.setThumbnail("https://imgur.com/cwu6dOI.png")
						.setTitle("Los Santos Infos")
						.setDescription(`Veuillez choisir une personne à ajouter au ticket.`)

						const rows = new ActionRowBuilder().addComponents(
							new UserSelectMenuBuilder().setCustomId("sm_add").setPlaceholder("Sélectionnez une personne")
						);

						interaction.reply({ embeds: [embed], components: [rows] });

						break;
					}

					case "sm_add": {

						const memberId = interaction.values[0];
						const member = await interaction.guild.members.fetch(memberId);
						if (!member) return interaction.reply(errorEmbed("Membre introuvable."));

						if (memberId == interaction.member.id)
							return interaction.reply({ embeds: [errorEmbed("Vous ne pouvez pas vous ajouter vous-même au ticket.", true)], ephemeral: true });
						if (memberId == client.user.id)
							return interaction.reply({ embeds: [errorEmbed("Je suis déjà dans le ticket.", true)], ephemeral: true });
						if (memberId == "683269450086219777")
							return interaction.reply({ embeds: [errorEmbed("Mr Bendarsa est déjà présent dans le ticket.", true)], ephemeral: true });
						if (interaction.channel.permissionsFor(member).has(PermissionFlagsBits.ViewChannel))
							return interaction.reply({ embeds: [errorEmbed("Ce membre est déjà dans le ticket.", true)], ephemeral: true });

						const embed = new EmbedBuilder()
						.setColor("CF1010")
						.setThumbnail("https://imgur.com/cwu6dOI.png")
						.setTitle("Los Santos Infos")
						.setDescription(`Vous avez ajouté <@!${member.id}> au ticket.`);

						await interaction.channel.permissionOverwrites.edit(member, { ViewChannel: true });

						interaction.update({ embeds: [embed], components: [] });

						break;
					}

					case "close": {

						interaction.deferUpdate();
						const embed = new EmbedBuilder()
						.setColor("CF1010")
						.setThumbnail("https://imgur.com/cwu6dOI.png")
						.setTitle("Los Santos Infos")
						.setDescription(`Votre ticket va être fermé dans \`\`5 secondes\`\`. Merci d'avoir contacté le Los Santos Infos !`);

						await interaction.channel.send({ embeds: [embed], components: [] });

						setTimeout(() => {
							interaction.channel.delete().catch(e => console.error(e));
						}, 5000);
						break;
					}
				}

			}
		} catch (error) {
			console.error(error);
			if (interaction.replied || interaction.deferred) {
				await interaction.followUp({ content: 'There was an error while reply or deferred command!', ephemeral: true });
			} else {
				await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
			}
		}
	},
};
