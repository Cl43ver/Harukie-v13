const { ApplicationCommandType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ApplicationCommandOptionType, Permissions  } = require('discord.js');

module.exports = {
    name: 'user',
    description: "Get user information",
    type: ApplicationCommandType.ChatInput,
    cooldown: 10000,
    options: [
        {
            name: 'avatar',
            description: "Displays a user's avatar.",
            type: ApplicationCommandOptionType.Subcommand,
            options: [{
                name: 'user',
                description: 'Select a user',
                type: ApplicationCommandOptionType.User,
                required: false
            }],
        },
        {
            name: 'banner',
            description: "Displays a user's banner.",
            type: ApplicationCommandOptionType.Subcommand,
            options: [{
                name: 'user',
                description: 'Select a user',
                type: ApplicationCommandOptionType.User,
                required: false
            }],
        },
        {
            name: 'info',
            description: "Displays information about a user.",
            type: ApplicationCommandOptionType.Subcommand,
            options: [{
                name: 'user',
                description: 'Select a user',
                type: ApplicationCommandOptionType.User,
                required: false
            }],
        },
        {
            name: 'highestrole',
            description: "Displays a user's highest role and its permissions.",
            type: ApplicationCommandOptionType.Subcommand,
            options: [{
                name: 'user',
                description: 'Select a user',
                type: ApplicationCommandOptionType.User,
                required: false
            }],
        },
    ],
    run: async (client, interaction) => {
        const subCommand = interaction.options.getSubcommand();

        switch (subCommand) {
            case 'avatar':
                await handleAvatarSubcommand(client, interaction);
                break;
            case 'banner':
                await handleBannerSubcommand(client, interaction);
                break;
            case 'info':
                await handleInfoSubcommand(client, interaction);
                break;
            case 'highestrole':
                await handleHighestRoleSubcommand(client, interaction);
                break;
            default:
                await interaction.reply({ content: "Unknown subcommand", ephemeral: true });
                break;
        }
    }
};

async function handleAvatarSubcommand(client, interaction) {
    const user = interaction.options.getUser('user') || interaction.user;
    const avatarURL = user.displayAvatarURL({ dynamic: true, size: 1024 });

    const embed = new EmbedBuilder()
        .setTitle(`${user.username}'s Avatar`)
        .setImage(avatarURL)
        .setColor(client.c.main)
        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() });

    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setLabel('Download Avatar')
                .setEmoji('🔎')
                .setStyle(ButtonStyle.Link)
                .setURL(avatarURL)
        );

    await interaction.reply({ embeds: [embed], components: [row] });
}

async function handleBannerSubcommand(client, interaction) {
    const user = interaction.options.getUser('user') || interaction.user;

    const fullUser = await client.users.fetch(user.id, { force: true });

    const bannerURL = fullUser.bannerURL({ format: 'png', dynamic: true, size: 1024 });
    if (!bannerURL) {
        await interaction.reply({ content: "This user does not have a banner.", ephemeral: true });
        return;
    }

    const embed = new EmbedBuilder()
        .setTitle(`${fullUser.username}'s Banner`)
        .setImage(bannerURL)
        .setColor(client.c.main)
        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() });

    await interaction.reply({ embeds: [embed] });
}

async function handleInfoSubcommand(client, interaction) {
    const user = interaction.options.getUser('user') || interaction.user;

    const fullUser = await client.users.fetch(user.id, { force: true });
    const bannerURL = fullUser.bannerURL({ format: 'png', dynamic: true, size: 1024 });

    const createdAt = `<t:${Math.floor(user.createdAt.getTime() / 1000)}:F>`;
    const member = interaction.guild.members.cache.get(user.id);
    const joinedAt = member ? `<t:${Math.floor(member.joinedAt.getTime() / 1000)}:F>` : 'N/A';
    const roles = member ? member.roles.cache.map(role => role.toString()).join(", ") : 'N/A';
    const highestRole = member && member.roles.highest ? member.roles.highest.toString() : 'N/A';
    const rolesCount = member ? member.roles.cache.size - 1 : 0;

    const embed = new EmbedBuilder()
        .setTitle(`${user.username}'s Information`)
        .setThumbnail(user.displayAvatarURL({ dynamic: true }))
        .setImage(bannerURL ? bannerURL : null)
        .addFields(
            { name: "Username:", value: user.username, inline: true },
            { name: "User ID:", value: user.id, inline: true },
            { name: "Account Created:", value: createdAt, inline: true },
            { name: "Joined Server:", value: joinedAt, inline: true },
            { name: "Roles Count:", value: rolesCount.toString(), inline: true },
            { name: "Highest Role:", value: highestRole, inline: true },
            { name: "Roles:", value: roles, inline: true }
        )
        .setColor(client.c.main)
        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() });

        const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setLabel('Download Avatar')
                .setEmoji('🔎')
                .setStyle(ButtonStyle.Link)
                .setURL(user.displayAvatarURL({ dynamic: true, size: 1024 }))
        );

    if (bannerURL) {
        row.addComponents(
            new ButtonBuilder()
                .setLabel('Download Banner')
                .setEmoji('🔎')
                .setStyle(ButtonStyle.Link)
                .setURL(bannerURL)
        );
    }

    await interaction.reply({ embeds: [embed], components: [row] });
}

async function handleHighestRoleSubcommand(client, interaction) {
    const user = interaction.options.getUser('user') || interaction.user;
    const member = interaction.guild.members.cache.get(user.id);

    if (!member) {
        await interaction.reply({ content: "User not found in this server.", ephemeral: true });
        return;
    }

    const highestRole = member.roles.highest;
    const permissions = highestRole.permissions.toArray().map(perm => permissionName(perm)).join(", ") || "No Special Permissions";

    const embed = new EmbedBuilder()
        .setTitle(`${user.username}'s Highest Role`)
        .addFields(
            { name: "Role", value: highestRole.toString(), inline: true },
            { name: "Permissions", value: '```' + permissions + '```', inline: false }
        )
        .setColor(client.c.main)
        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() });

    await interaction.reply({ embeds: [embed] });
}

function permissionName(permission) {
    return permission.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' ');
}