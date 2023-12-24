const { ApplicationCommandType, EmbedBuilder, ActionRowBuilder, SelectMenuBuilder, SelectMenuOptionBuilder, ButtonBuilder, ButtonStyle  } = require('discord.js');

module.exports = {
    name: 'help',
    description: "Have the help page.",
    type: ApplicationCommandType.ChatInput,
    cooldown: 10000,
        run: async (client, interaction) => {
        if (!interaction.guild) {
            return interaction.reply({ content: "The command can only be used on servers.", ephemeral: true });
        }
        
        const botAvatarUrl = interaction.client.user.displayAvatarURL();
        const userAvatarUrl = interaction.user.displayAvatarURL();
        const userName = interaction.user.username;

        const initialEmbed = new EmbedBuilder()
            .setTitle('Help page of Harukie 📚')
            .setURL('https://discord.gg/..')
            .setDescription('Below, you will find a menu with several categories that explains all of **my commands**. ⌚\n\n> If you have any questions about the bot, please join the [**Harukie\'s Server**](https://discord.gg/MhDheur2zg)')
            .setAuthor({ name: userName, iconURL: userAvatarUrl })
            .setThumbnail(botAvatarUrl)
            .setFooter({ text: interaction.client.user.username, iconURL: botAvatarUrl })
            .setTimestamp()
            .setColor(client.c.main);

        const utilitiesEmbed = new EmbedBuilder()
            .setTitle('Utilities 🎈')
            .setURL('https://discord.gg/..')
            .setDescription('</help:1187872482955370517> : *Have the help page.*\n</ping:1187846611292917900> : *Check the ping.*\n</user avatar:1187853331503251577> : *Displays a user\'s avatar.*\n</user banner:1187853331503251577> : *Displays a user\'s banner.*\n</user info:1187853331503251577> : *Displays information about a user.*\n</user highestrole:1187853331503251577> : *Displays a user\'s highest role and its permissions.*\n\n> If you have any questions about the bot, please join the [**Harukie\'s Server**](https://discord.gg/MhDheur2zg)')
            .setAuthor({ name: userName, iconURL: userAvatarUrl })
            .setThumbnail(botAvatarUrl)
            .setFooter({ text: interaction.client.user.username, iconURL: botAvatarUrl })
            .setTimestamp()
            .setColor(client.c.main);

            const selectMenu = new ActionRowBuilder()
            .addComponents(
                new SelectMenuBuilder()
                    .setCustomId('help-menu')
                    .setPlaceholder('Harukie')
                    .addOptions(
                        new SelectMenuOptionBuilder()
                            .setLabel('Utilities')
                            .setDescription('Show utility commands')
                            .setValue('utilities')
                            .setEmoji('🎈'),
                        new SelectMenuOptionBuilder()
                            .setLabel('Main Menu')
                            .setDescription('Back to the main menu')
                            .setValue('main')
                            .setEmoji('🏠')
                    )
            );

            const buttonsRow = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setLabel('Add Bot')
                        .setStyle(ButtonStyle.Link)
                        .setURL('https://discord.com/api/oauth2/authorize?client_id=828290580541997086&permissions=8&scope=bot+applications.commands'),
                    new ButtonBuilder()
                        .setLabel('Support Server')
                        .setStyle(ButtonStyle.Link)
                        .setURL('https://discord.gg/..'),
                    new ButtonBuilder()
                        .setLabel('Top.gg')
                        .setStyle(ButtonStyle.Link)
                        .setURL('https://top.gg/bot/..')
                        .setDisabled(true)
                );

        await interaction.reply({ embeds: [initialEmbed], components: [selectMenu, buttonsRow] });

        const filter = (i) => i.isSelectMenu();
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async (i) => {
            if (i.customId === 'help-menu') {
                switch (i.values[0]) {
                    case 'utilities':
                        await i.update({ embeds: [utilitiesEmbed], components: [selectMenu, buttonsRow] });
                        break;
                    case 'main':
                        await i.update({ embeds: [initialEmbed], components: [selectMenu, buttonsRow] });
                        break;
                }
            }
        });

        collector.on('end', collected => console.log(`Collected ${collected.size} interactions.`));
    }
};