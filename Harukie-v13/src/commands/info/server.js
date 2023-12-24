const { ApplicationCommandType, ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'server',
    description: 'Get server information',
    type: ApplicationCommandType.ChatInput,
    cooldown: 10000,
    options: [
        {
            type: ApplicationCommandOptionType.Subcommand,
            name: 'avatar',
            description: 'Get the server avatar'
        },
        {
            type: ApplicationCommandOptionType.Subcommand,
            name: 'banner',
            description: 'Get the server banner'
        },
        {
            type: ApplicationCommandOptionType.Subcommand,
            name: 'info',
            description: 'Get general information about the server'
        },
        {
            type: ApplicationCommandOptionType.Subcommand,
            name: 'emojis',
            description: 'Get a list of all emojis in the server'
        },
        {
            type: ApplicationCommandOptionType.Subcommand,
            name: 'channel',
            description: 'Get information about a specific channel',
            options: [{
                type: ApplicationCommandOptionType.Channel,
                name: 'target',
                description: 'The channel to get information about',
                required: true
            }]
        }
    ],
    async run(client, interaction) {
        if (!interaction.guild) {
            return interaction.reply({ content: 'This command can only be used in a server.', ephemeral: true });
        }

        const subCommand = interaction.options.getSubcommand();

        switch (subCommand) {
            case 'avatar': {
                const avatarUrl = interaction.guild.iconURL({ dynamic: true, size: 1024 });
                if (!avatarUrl) {
                    return interaction.reply({ content: 'This server does not have an avatar.', ephemeral: true });
                }

                const avatarEmbed = new EmbedBuilder()
                    .setTitle(`${interaction.guild.name}'s Avatar`)
                    .setImage(avatarUrl)
                    .setColor(client.c.main);

                await interaction.reply({ embeds: [avatarEmbed] });
                break;
            }
            case 'banner': {
                const bannerUrl = interaction.guild.bannerURL({ size: 1024 });
                if (!bannerUrl) {
                    return interaction.reply({ content: 'This server does not have a banner.', ephemeral: true });
                }

                const bannerEmbed = new EmbedBuilder()
                    .setTitle(`${interaction.guild.name}'s Banner`)
                    .setImage(bannerUrl)
                    .setColor(client.c.main);

                await interaction.reply({ embeds: [bannerEmbed] });
                break;
            }
            case 'info': {
                const guild = interaction.guild;
                const createdAt = guild.createdAt.toDateString();
                const memberCount = guild.memberCount;
                const roleCount = guild.roles.cache.size;
                const channelCount = guild.channels.cache.size;
                const serverName = guild.name;
                const serverId = guild.id;
                const owner = await guild.fetchOwner();

                const infoEmbed = new EmbedBuilder()
                    .setTitle(`${serverName} Information`)
                    .addFields(
                        { name: 'Server Name', value: serverName, inline: true },
                        { name: 'Server ID', value: serverId, inline: true },
                        { name: 'Owner', value: owner.user.tag, inline: true },
                        { name: 'Member Count', value: memberCount.toString(), inline: true },
                        { name: 'Role Count', value: roleCount.toString(), inline: true },
                        { name: 'Channel Count', value: channelCount.toString(), inline: true },
                        { name: 'Created On', value: createdAt, inline: true }
                    )
                    .setColor(client.c.main);

                await interaction.reply({ embeds: [infoEmbed] });
                break;
            }
            case 'emojis': {
                const emojis = interaction.guild.emojis.cache.map(emoji => `${emoji}`).join(' ');
                const emojisEmbed = new EmbedBuilder()
                    .setTitle('Server Emojis')
                    .setDescription(emojis || 'No emojis found')
                    .setColor(client.c.main);

                await interaction.reply({ embeds: [emojisEmbed] });
                break;
            }
            case 'channel': {
                const channel = interaction.options.getChannel('target');
                const createdAt = channel.createdAt.toDateString();
                const nsfwStatus = channel.nsfw ? 'Yes' : 'No';

                const channelType = channelTypeToString(channel.type);

                const channelEmbed = new EmbedBuilder()
                    .setTitle(`Channel Information: ${channel.name}`)
                    .addFields(
                        { name: 'Channel ID', value: channel.id, inline: true },
                        { name: 'Channel Type', value: channelType, inline: true },
                        { name: 'Created On', value: createdAt, inline: true },
                        { name: 'NSFW', value: nsfwStatus, inline: true }
                    )
                    .setColor(client.c.main);

                await interaction.reply({ embeds: [channelEmbed] });
                break;
            }
        }
    }
};

function channelTypeToString(type) {
    switch (type) {
        case 0: return 'Text';
        case 1: return 'DM';
        case 2: return 'Voice';
        case 3: return 'Group DM';
        case 4: return 'Category';
        case 5: return 'News';
        case 6: return 'Store';
        case 10: return 'News Thread';
        case 11: return 'Public Thread';
        case 12: return 'Private Thread';
        case 13: return 'Stage Voice';
        default: return 'Unknown';
    }
}