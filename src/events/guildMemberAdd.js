const { Events } = require('discord.js');

module.exports = {
    name: Events.GuildMemberAdd,
    run: async(client, member) => {
        member.roles.add("1271588783040499793").catch(e => console.error(e));  
    }
}