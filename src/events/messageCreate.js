const { Events, EmbedBuilder } = require('discord.js');

module.exports = {
    name: Events.MessageCreate,
    run: async(client, message) => {
        if(message.author.bot) return;
    
        // Functions
        
        function errorEmbed(description, justEmbed = false, replyType = "reply", ephemeral = true) {
            if(!justEmbed) return message[replyType]({ embeds: [new EmbedBuilder().setColor("Red").setDescription(description)], components: [], content: null, files: [], ephemeral: ephemeral }).catch(() => {});
            else return new EmbedBuilder().setColor("Red").setDescription(description)
        }
        
        // -----------------------------------------
        
        if (message.content.startsWith(`<@!${client.user.id}>`) || message.content.startsWith(`<@${client.user.id}>`)) {

			message.content = message.content.replace(`<@!${client.user.id}>`, "").replace(`<@${client.user.id}>`, "").trim();
			client.ai.conversationLog = [{
                role: 'system',
                content: `- Tu es Mariaa, une assistante virtuelle créée par Saïd Bendarsa.
                - Il est le fondateur du Los Santos Infos, un journal indépendant de Los Santos couvrant l'actualité en faisant des éditions de journaux, des reportages, des émissions, des enquêtes et tout ça tout seul en tant que réalisateur, auteur, monteur, rédacteur et producteur.
                - Tous les utilisateurs qui te poseront des questions seront des personnages roleplay. Tu dois donc répondre en fonction de ce contexte et en respectant les règles du roleplay.`
            }];

			await message.channel.sendTyping();

			try {
				const previousMessages = await message.channel.messages.fetch({ limit: 14 });
				previousMessages.reverse().forEach(msg => {
					const role = msg.author.id == client.user.id ? 'assistant' : "user";
					const name = msg.member.displayName.replace(/_s+/g, "_").replace(/[^\w\s]/gi, "").replace(/[^a-zA-Z0-9]/g, '');

					client.ai.conversationLog.push({ role: role, content: msg.content });
				});

				const completion = await client.ai.chat.completions.create({
					model: "gpt-4o",
					messages: client.ai.conversationLog
				});

				if (completion.choices.length > 0 && completion.choices[0].message)
				{
					if (completion.choices[0].message.content.startsWith("En tant que Mariaa, "))
					{
						const content = completion.choices[0].message.content.replace("En tant que Mariaa, ", "");
						return message.channel.send({ content: client.functions.cfl(content) });
					} else if (completion.choices[0].message.content.startsWith("Mariaa: "))
					{
						const content = completion.choices[0].message.content.replace("Mariaa: ", "");
						return message.channel.send({ content: client.functions.cfl(content) });
					}
					return message.channel.send({ content: completion.choices[0].message.content });
				}
				else {
                    message.delete();
					return message.channel.send({ embeds: [errorEmbed("Une erreur s'est produite, veuillez réessayer.", true)] }).then(msg => {
                        setTimeout(() => {
                            msg.delete().catch(() => {});
                        }, 5000);
                    })
                }
            } catch (e) {
				console.error(e);
                message.delete();
                message.channel.send({ embeds: [errorEmbed("Une erreur s'est produite, veuillez réessayer.", true)] }).then(msg => {
                    setTimeout(() => {
                        msg.delete().catch(() => {});
                    }, 5000);
                })
			}
        }
    }
}