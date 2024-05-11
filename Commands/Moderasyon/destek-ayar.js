const { Message, Client, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelSelectMenuBuilder, ChannelType, RoleSelectMenuBuilder } = require('discord.js');
const db = require('mzrdb');

module.exports = {
    name: 'destek-ayar',
    description: 'Destek sisteminin ayarları.',
    kategori: 'mod',
    izinler: ['Administrator'],
    kurucu: false,
    /**
     * @param {Client} client
     * @param {Message} message
     */
    async execute(client, message, args, prefix) {
        const { author, guild } = message;

        const destekLog = db.get(`destek.${guild.id}.log`);
        const destekYetkili = db.get(`destek.${guild.id}.yetkili`);
        const destekKategori = db.get(`destek.${guild.id}.kategori`);

        const embed = new EmbedBuilder()
            .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
            .setThumbnail(client.user.displayAvatarURL())
            .setDescription('Aşağıda ki menüden sistemleri kontrol edebilirsin.')
            .addFields(
                { name: 'Destek Log Kanalı', value: `${destekLog ? `<#${destekLog}>` : 'Yok'}`, inline: false },
                { name: 'Destek Yetkili Rolü', value: `${destekYetkili ? `<@&${destekYetkili}>` : 'Yok'}`, inline: false },
                { name: 'Destek Kategorisi', value: `${destekKategori ? `<#${destekKategori}>` : 'Yok'}`, inline: false },
            )
            .setColor('Blurple')
            .setTimestamp()

        const button = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel('Bütün sistemleri sıfırla')
                .setCustomId(`destekSifirla-${author.id}`)
                .setEmoji('🗑')
                .setStyle(ButtonStyle.Secondary))

        const logSelect = new ActionRowBuilder().addComponents(
            new ChannelSelectMenuBuilder()
                .setChannelTypes(ChannelType.GuildText)
                .setCustomId(`destekLogAyar-${author.id}`)
                .setPlaceholder('Destek log kanalı seç!')
                .setMaxValues(1))

        const yetkiliSelect = new ActionRowBuilder().addComponents(
            new RoleSelectMenuBuilder()
                .setCustomId(`destekYetkiliAyar-${author.id}`)
                .setPlaceholder('Destek Yetkili rolünü seç!')
                .setMaxValues(1))

        const kategoriSelect = new ActionRowBuilder().addComponents(
            new ChannelSelectMenuBuilder()
                .setChannelTypes(ChannelType.GuildCategory)
                .setCustomId(`destekKategoriAyar-${author.id}`)
                .setPlaceholder('Destek kategorisini seç!')
                .setMaxValues(1))

        return message.reply({ embeds: [embed], components: [logSelect, yetkiliSelect, kategoriSelect, button] });
    },
};