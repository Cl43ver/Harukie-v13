const { ApplicationCommandType } = require('discord.js');
const emojis = require('../../emojis');

module.exports = {
    name: 'ping',
    description: "Check the ping.",
    type: ApplicationCommandType.ChatInput,
    cooldown: 10000,
    run: async (client, interaction) => {
        await interaction.reply(`${emojis.euuhh} I\'m thinking... I\'m not very good at math...`);

        setTimeout(async () => {
            const latencyMsg = `${emojis.hehe} I found it! and the bot's latency is ... \`${Math.round(client.ws.ping)}\`ms`;
            await interaction.editReply(latencyMsg);
        }, 3000); 
    }
};