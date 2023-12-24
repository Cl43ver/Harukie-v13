const { ApplicationCommandType, ApplicationCommandOptionType, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const packageJson = require('../../../package.json');
const emojis = require('../../emojis');

module.exports = {
    name: 'bot',
    description: 'Get bot information',
    type: ApplicationCommandType.ChatInput,
    cooldown: 10000,
    options: [
        {
            type: ApplicationCommandOptionType.Subcommand,
            name: 'avatar',
            description: 'Get the bot\'s avatar'
        },
        {
            type: ApplicationCommandOptionType.Subcommand,
            name: 'info',
            description: 'Get information about the bot'
        },
        {
            type: ApplicationCommandOptionType.Subcommand,
            name: 'author',
            description: 'Get information about the bot\'s author'
        }
    ],
    async run(client, interaction) {
        const subCommand = interaction.options.getSubcommand();

        switch (subCommand) {
            case 'avatar': {
                const avatarUrl = client.user.displayAvatarURL({ dynamic: true, size: 1024 });
                const avatarEmbed = new EmbedBuilder()
                    .setTitle(`${client.user.username}'s Avatar`)
                    .setURL('https://discord.gg/..')
                    .setImage(avatarUrl)
                    .setColor(client.c.main);

                const buttonRow = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setLabel('Download Avatar')
                            .setEmoji('🔎')
                            .setStyle(ButtonStyle.Link)
                            .setURL(avatarUrl)
                    );

                await interaction.reply({ embeds: [avatarEmbed], components: [buttonRow] });
                break;
            }
            case 'info': {
                const serverCount = client.guilds.cache.size;
                const userCount = client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);
                const discordJsVersion = packageJson.dependencies['discord.js'];
                const botAvatarUrl = client.user.displayAvatarURL({ dynamic: true, size: 1024 });
                const uptime = formatUptime(client.uptime);

                const infoEmbed = new EmbedBuilder()
                    .setTitle('Bot Information')
                    .setURL('https://discord.gg/..')
                    .setThumbnail(botAvatarUrl)
                    .addFields(
                        { name: '🔎 Name', value: '`' + client.user.username + '`', inline: true },
                        { name: '🆔 ID', value: '`' + client.user.id + '`', inline: true },
                        { name: '📅 Anniversaire', value: '`04/04/2021`', inline: true },
                        { name: '⌚ Uptime', value: '`' + uptime + '`', inline: true },
                        { name: '💻 Version', value: '`1.0.1`', inline: true },
                        { name: '💻 discord.js Version', value: '`' + discordJsVersion + '`', inline: true },
                        { name: '🏯 Server Count', value: '`' + serverCount.toString() + '`', inline: true },
                        { name: '👥 Total Members', value: '`' + userCount.toString() + '`', inline: true },
                    )
                    .setColor(client.c.main);

                const buttonsRow = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setLabel('Support Server')
                            .setEmoji('🔧')
                            .setStyle(ButtonStyle.Link)
                            .setURL('https://discord.gg/..'),
                        new ButtonBuilder()
                            .setLabel('Top.gg')
                            .setEmoji('🔗')
                            .setStyle(ButtonStyle.Link)
                            .setURL('https://top.gg/bot/..')
                            .setDisabled(true)
                    );

                await interaction.reply({ embeds: [infoEmbed], components: [buttonsRow] });
                break;
            }
            case 'author': {
                const authorDescription = `Hey there, I'm **Harukie**! My developer/creator is **Vicii**. My goal is to liven up your server by bringing entertainment and good vibes, always ready to brighten your day ${emojis.love}`;
                const discordUserUrl = `https://discord.com/users/117381264826302464`;
                const botAvatarUrl = client.user.displayAvatarURL({ dynamic: true, size: 1024 });

                const authorEmbed = new EmbedBuilder()
                    .setTitle('Bot Author')
                    .setURL('https://discord.gg/..')
                    .setThumbnail(botAvatarUrl)
                    .setDescription(authorDescription)
                    .setColor(client.c.main);

                const buttonsRow = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setLabel('Contact the Author')
                            .setEmoji(`${emojis.love}`)
                            .setStyle(ButtonStyle.Link)
                            .setURL(discordUserUrl)
                    );

                await interaction.reply({ embeds: [authorEmbed], components: [buttonsRow] });
                break;
            }
        }
    }
};

function formatUptime(uptime) {
    let totalSeconds = (uptime / 1000);
    const days = Math.floor(totalSeconds / 86400);
    totalSeconds %= 86400;
    const hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}