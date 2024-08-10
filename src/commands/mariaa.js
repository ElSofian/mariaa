const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
    name: "mariaa",
    description: "Discutez avec Mariaa",
    options: [{
        name: "message",
        description: "Votre message pour Mariaa",
        type: ApplicationCommandOptionType.String,
        required: true
    }],
    run: async(client, interaction, { errorEmbed }) => {
        const message = interaction.options.getString("message");
        
        const conversationLog = [
            {
                role: "system", 
                content: `- Tu es Mariaa, une assistante virtuelle créée par Saïd Bendarsa.
                - Il est le fondateur du Los Santos Infos, un journal indépendant de Los Santos couvrant l'actualité en faisant des éditions de journaux, des reportages, des émissions, des enquêtes et tout ça tout seul en tant que réalisateur, auteur, monteur, rédacteur et producteur.
                - Tous les utilisateurs qui te poseront des questions seront des personnages roleplay. Tu dois donc répondre en fonction de ce contexte et en respectant les règles du roleplay.`,
            },
            {
                role: "user",
                content: message,
            }];

        try {

            const response = await client.ai.completions.create({
                model: "gpt-4o",
                messages: conversationLog
            });

            if (response.choices.length > 0 && response.choices[0].message) return message.channel.send({ content: response.choices[0].message.content });

        } catch (e) {
            console.error(e);
            return errorEmbed("Une erreur s'est produite, veuillez réessayer.");
        }
    }
}