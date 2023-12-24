const { ApplicationCommandType, ApplicationCommandOptionType, PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'clear',
    description: 'Clears messages',
    type: ApplicationCommandType.ChatInput,
    cooldown: 10000,
    options: [
        {
            type: ApplicationCommandOptionType.Number,
            name: 'number',
            description: 'Number of messages to clear',
            required: true,
        },
        {
            type: ApplicationCommandOptionType.User,
            name: 'member',
            description: 'Member whose messages to clear',
            required: false,
        },
    ],
    async run(client, interaction) {
        if (!interaction.guild) {
            return interaction.reply({ content: 'This command can only be used in a server.', ephemeral: true });
        }

        const number = interaction.options.getNumber('number');
        const member = interaction.options.getUser('member');

        try {
            const messages = await interaction.channel.messages.fetch({ limit: Math.min(number, 100) });
            const messagesToDelete = member ? messages.filter(m => m.author.id === member.id) : messages;
            const deletedMessages = await interaction.channel.bulkDelete(messagesToDelete, true);

            await interaction.reply({ content: `Cleared ${deletedMessages.size} messages${member ? ` from ${member.username}` : ''}.`, ephemeral: true });
        } catch (error) {
            console.error(error);
            interaction.reply({ content: 'There was an error trying to clear messages in this channel.', ephemeral: true });
        }
    }
};