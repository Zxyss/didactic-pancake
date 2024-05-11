const { Client, GatewayIntentBits, Partials, Collection, ChannelType, EmbedBuilder, AuditLogEvent } = require('discord.js');
const { token } = require('./config.json');
const mzr = require('mzrdjs');
const db = require('mzrdb');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildScheduledEvents,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.MessageContent,
    ],
    partials: [
        Partials.Message,
        Partials.Channel,
        Partials.GuildMember,
        Partials.User,
        Partials.GuildScheduledEvent
    ],
});

client.config = require('./config.json');
client.commands = new Collection();
client.events = new Collection();

const { loadEvents } = require('./Handlers/eventHandler');
loadEvents(client);

module.exports = client;

require(`./Handlers/commandHandler`)(client);

client.on('messageUpdate', async (oldMessage, newMessage) => {
    const logID = db.get(`mesajLog.${newMessage.guildId}`);
    if (!logID) return;

    const { author, content, channel } = newMessage;
    try {
        if (author.bot || author.system || newMessage.webhookId) return;
    } catch { return; }

    const mesajDuzenTimes = mzr.timestamp(Date.now())
    const mesajDuzen = `**<t:${mesajDuzenTimes}:f> (**<t:${mesajDuzenTimes}:R>**)**`;

    const mesajDuzeltildiTimes = mzr.timestamp(Date.now())
    const mesajDuzeltildi = `**<t:${mesajDuzeltildiTimes}:f> (**<t:${mesajDuzeltildiTimes}:R>**)**`;
    const mesajSahibi = `${author} **(**[**${author.username}**](https://discord.com/users/${author.id})**)**`;

    const duzenlendigiYer = `- [**Düzenlendiği Yere Git**](${newMessage.url})`;

    const embed = new EmbedBuilder()
        .setAuthor({ name: `${author.username} adlı kişinin mesajı silindi!`, iconURL: author.displayAvatarURL() })
        .setFooter({ text: `Düzenleyen: ${newMessage.author.username}`, iconURL: newMessage.author.displayAvatarURL() })
        .setThumbnail(author.displayAvatarURL())
        .setColor('Blurple')
        .setTimestamp()
        .addFields(
            { name: '__Düzenlenen Mesajın İçeriği__', value: `- Yeni Mesaj: ${content}\n- Eski Mesaj: ${oldMessage.content || 'Bilinmiyor'}`, inline: false },
            { name: 'Mesaj Bilgileri', value: `- Mesaj Düzenlenmeden Önce: ${mesajDuzen}\n- Mesaj Düzeltilmiş Hâli: ${mesajDuzeltildi}\n- Mesaj Sahibi: ${mesajSahibi}`, inline: false },
            { name: 'Mesajın Konumu', value: `- Mesajın Kanalı: ${channel}\n${duzenlendigiYer}`, inline: false }
        )

    const log = client.channels.cache.get(logID);
    return log.send({ embeds: [embed] });
});

client.on('channelUpdate', async (oldChannel, newChannel) => {
    if (newChannel.type === ChannelType.DM) return;

    const logID = db.get(`kanalLog.${newChannel.guildId}`);
    if (!logID) return;

    const log = client.channels.cache.get(logID);

    const denetimKanal = await newChannel.guild.fetchAuditLogs({
        limit: 1,
        type: AuditLogEvent.ChannelUpdate
    });

    if (denetimKanal) {
        const detail = denetimKanal.entries.first();
        if (detail.executor.bot && detail.executor.id === client.user.id) return;

        const kanalDuzenleTimes = mzr.timestamp(Date.now())
        const kanalDuzenle = `**<t:${kanalDuzenleTimes}:f> (**<t:${kanalDuzenleTimes}:R>**)**`;

        const embed = new EmbedBuilder()
            .setAuthor({ name: `${newChannel.guild.name} adlı kanal güncellendi!`, iconURL: newChannel.guild.iconURL() })
            .setThumbnail(newChannel.guild.iconURL())
            .setColor('Blurple')
            .setTimestamp()
            .addFields(
                { name: 'Kanal', value: `- ${newChannel} \`(${newChannel.name})\``, inline: true },
                { name: 'Tarih', value: `- ${kanalDuzenle}`, inline: true },
                { name: 'Kullanıcı', value: `- ${detail.executor}`, inline: true },
            )

        const güncellenen = [];
        if (oldChannel.name !== newChannel.name) güncellenen.push(`- Kanal İsmi\n - ${oldChannel.name} **->** ${newChannel.name}`);
        if (oldChannel.parent !== newChannel.parent) güncellenen.push(`- Kanal Kategorisi\n - ${oldChannel.parent} **->** ${newChannel.parent}`);
        if (oldChannel.nsfw !== newChannel.nsfw) güncellenen.push(`- Kanal NSFW Durumu\n - ${oldChannel.nsfw} **->** ${newChannel.nsfw}`);
        if (oldChannel.rateLimitPerUser !== newChannel.rateLimitPerUser) güncellenen.push(`- Kanal Yavaşmod Süresi\n - ${oldChannel.rateLimitPerUser} **->** ${newChannel.rateLimitPerUser}`);
        if (oldChannel.rawPosition !== newChannel.rawPosition) güncellenen.push(`- Kanal Konumu\n - ${oldChannel.rawPosition} **->** ${newChannel.rawPosition}`);

        if (güncellenen.length > 0) embed.addFields({ name: 'Güncellenen Özellikler', value: güncellenen.join('\n'), inline: true });

        if (oldChannel.permissionOverwrites.cache !== newChannel.permissionOverwrites.cache) {
            const changedPerms = [];

            for (const [userId, oldPerm] of oldChannel.permissionOverwrites.cache.entries()) {
                const newPerm = newChannel.permissionOverwrites.cache.get(userId);

                if (newPerm) {
                    const addedPerms = newPerm.allow.toArray().filter(perm => !oldPerm.allow.has(perm));
                    const removedPerms = oldPerm.allow.toArray().filter(perm => !newPerm.allow.has(perm));

                    changedPerms.push({
                        addedPerms: addedPerms.length ? addedPerms.join(', ') : 'Yok',
                        removedPerms: removedPerms.length ? removedPerms.join(', ') : 'Yok'
                    });
                };
            }

            if (changedPerms.length > 0) {
                changedPerms.forEach(perm => {
                    embed.addFields({ name: 'Güncellenen İzinler', value: `✅ ${perm.addedPerms}\n❌ ${perm.removedPerms}`, inline: true });
                });
            } else {
                embed.addFields({ name: 'Güncellenen İzinler', value: `Yetkilerde değişiklik bulunmuyor.`, inline: true });
            };
        };

        await log.send({ embeds: [embed] });
    };
});

client.login(token);