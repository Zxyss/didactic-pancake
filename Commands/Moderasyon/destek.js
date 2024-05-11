const { Message, Client, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');
const db = require('mzrdb');

module.exports = {
    name: 'destek',
    description: 'Destek mesajı gönderirsiniz.',
    kategori: 'mod',
    izinler: ['Administrator'],
    kurucu: false,
    /**
     * @param {Client} client
     * @param {Message} message
     */
    async execute(client, message, args, prefix) {
        const { author, channel } = message;

        const embed = new EmbedBuilder()
            .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
            .setThumbnail(client.user.displayAvatarURL())
            .setTitle('Destek Kanalına Hoşgeldiniz')
            .setDescription('Bu Kanal Üzerinden Destek Talebi Açarak Bizden Her Konuda Destek Alabilirsiniz.')
            .addFields({ name: 'Destek Talebi Oluşturmak İçin Aşağıdaki Butona Tıklayabilirsin!', value: '**NOT:** Gereksiz Destek Talebi Açman Ceza Almana Neden Olabilir.', inline: false })
            .setColor('Blurple')

        const select = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId(`destekSelect`)
                .setPlaceholder('Oluşturulacak destek türünü seçin!')
                .addOptions(
                    new StringSelectMenuOptionBuilder()
                        .setLabel(`VIP Slot almak istiyorum`)
                        .setValue(`destek-vipSlot`),
                    new StringSelectMenuOptionBuilder()
                        .setLabel(`Diğer`)
                        .setValue(`destek-diger`)
                )
        )

        return channel.send({ embeds: [embed], components: [select] });
    },
};