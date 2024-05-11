const { StringSelectMenuInteraction, Client, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ChannelType, PermissionFlagsBits, UserSelectMenuBuilder } = require('discord.js');
const { prefix } = require('../../config.json');
const mzr = require('mzrdjs');
const db = require('mzrdb');

module.exports = {
    name: 'interactionCreate',
    /**
     * @param {StringSelectMenuInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        if (!interaction.isStringSelectMenu()) return;

        const { customId, user, guild } = interaction;
        const cId = customId.split('-')[0];
        const userId = customId.split('-')[1];
        let id = null;

        if (cId) id = interaction.values[0];
        if (cId !== 'destekSelect' && user.id !== userId) return interaction.reply({ content: `Bu menüyü sadece komutu kullanan kişi kullanabilir.`, ephemeral: true });

        if (id && cId === 'yardimSelect') {
            const modKomutlar = client.commands
                .filter(cmd => cmd.kategori === 'mod')
                .map(cmd => `📕 \`${prefix}${cmd.name}\`**: ${cmd.description}**`);

            const userKomutlar = client.commands
                .filter(cmd => cmd.kategori === 'kullanıcı')
                .map(cmd => `📗 \`${prefix}${cmd.name}\`**: ${cmd.description}**`);

if (id === 'komut-yetkili') {
                const embed = new EmbedBuilder()
                    .setAuthor({ name: `${client.user.username} Komutlar`, iconURL: client.user.displayAvatarURL() })
                    .setThumbnail(client.user.displayAvatarURL())
                    .setDescription(modKomutlar.join('\n'))
                    .setColor('Blurple')
                    .setFooter({ text: user.username, iconURL: user.displayAvatarURL() })

                return interaction.update({ embeds: [embed] });
            } else if (id === 'komut-kullanıcı') {
                const embed = new EmbedBuilder()
                    .setAuthor({ name: `${client.user.username} Komutlar`, iconURL: client.user.displayAvatarURL() })
                    .setThumbnail(client.user.displayAvatarURL())
                    .setDescription(userKomutlar.join('\n'))
                    .setColor('Blurple')
                    .setFooter({ text: user.username, iconURL: user.displayAvatarURL() })

return interaction.update({ embeds: [embed] });
            } else if (id === 'komut-sistemler') {
                const basvuruLogKanal = db.get(`basvuru.${guild.id}.log`);
                const basvuruYetkiliRol = db.get(`basvuru.${guild.id}.yetkili`);
                const basvuruKabulRol = db.get(`basvuru.${guild.id}.verilecek`);

                const butonRol = db.get(`butonRol.${guild.id}`);

                const hgbbGiris = db.get(`hgbb.${guild.id}.giris`);
                const hgbbCikis = db.get(`hgbb.${guild.id}.cikis`);

                const mesajLog = db.get(`mesajLog.${guild.id}`);
                const kanalLog = db.get(`kanalLog.${guild.id}`);

                const scrimKanal = db.get(`scrim.${guild.id}.kanal`);
                const scrimOtorol = db.get(`scrim.${guild.id}.otorol`);

                const selamSistemi = db.get(`saasSistem.${guild.id}`);

                const destekLog = db.get(`destek.${guild.id}.log`);
                const destekYetkili = db.get(`destek.${guild.id}.yetkili`);
                const destekKategori = db.get(`destek.${guild.id}.kategori`);

      const embed = new EmbedBuilder()
                    .setAuthor({ name: `${client.user.username} Sistemler`, iconURL: client.user.displayAvatarURL() })
                    .setThumbnail(client.user.displayAvatarURL())
                    .setColor('Blurple')
                    .addFields(
                        { name: 'Başvuru Ayarları', value: `Log Kanalı: ${basvuruLogKanal ? `<#${basvuruLogKanal}>` : 'Ayarlanmamış'}\nYetkili Rolü: ${basvuruYetkiliRol ? `<@&${basvuruYetkiliRol}>` : 'Ayarlanmamış'}\nKabul Rolü: ${basvuruKabulRol ? `<@&${basvuruKabulRol}>` : 'Ayarlanmamış'}`, inline: false },
                        { name: 'Buton Rol', value: `Buton Rol: ${butonRol ? `<@&${butonRol}>` : 'Ayarlanmamış'}`, inline: false },
                        { name: 'Giriş - Çıkış Ayarları', value: `Giriş Kanalı: ${hgbbGiris ? `<#${hgbbGiris}>` : 'Ayarlanmamış'}\nÇıkış Kanalı: ${hgbbCikis ? `<#${hgbbCikis}>` : 'Ayarlanmamış'}`, inline: false },
                        { name: 'Log Ayarları', value: `Mesaj Log: ${mesajLog ? `<#${mesajLog}>` : 'Ayarlanmamış'}\nKanal Log: ${kanalLog ? `<#${kanalLog}>` : 'Ayarlanmamış'}`, inline: false },
                        { name: 'Scrim Oto Rol Ayarları', value: `Scrim Kanal: ${scrimKanal ? `<#${scrimKanal}>` : 'Ayarlanmamış'}\nScrim Oto Rol: ${scrimOtorol ? `<#${scrimOtorol}>` : 'Ayarlanmamış'}`, inline: false },
                        { name: 'Selam Sistemi', value: `Selam Sistemi: ${selamSistemi ? '✅' : 'Ayarlanmamış'}`, inline: false },
                        { name: 'Destek Ayarları', value: `Destek Log Kanalı: ${destekLog ? `<#${destekLog}>` : 'Ayarlanmamış'}\nDestek Yetkili Rolü: ${destekYetkili ? `<@&${destekYetkili}>` : 'Ayarlanmamış'}\nDestek Kategorisi: ${destekKategori ? `<#${destekKategori}>` : 'Ayarlanmamış'}`, inline: false },
                    )
                    
                              return interaction.update({ embeds: [embed] });
            };
        } else if (id && cId === 'rollerSelect') {
            let roller = await guild.roles.fetch();
            roller = roller.filter(role => !role.tags || !role.tags.botId);

            if (id === 'roller-fazla_az') roller = roller.sort((a, b) => b.members.size - a.members.size);
            else if (id === 'roller-az_fazla') roller = roller.sort((a, b) => a.members.size - b.members.size);

            const sayfaBK = 10;

const arr = Array.from(roller.values());
            const toplamSayfa = Math.ceil(arr.length / sayfaBK);

            let sayfa = 1;

            const start = (sayfa - 1) * sayfaBK;
            const end = start + sayfaBK;
            const page = arr.slice(start, end);
            let format = null;

            if (id === 'roller-fazla_az') {
                format = page
                    .filter(role => role.id !== guild.id)
                    .map((role, index) => `${role} (**${role.members.size}**)`)
                    .join('\n');
            } else if (id === 'roller-az_fazla') {
            format = page
                    .filter(role => role.id !== guild.id)
                    .map((role, index) => `${role} (**${role.members.size}**)`)
                    .join('\n');
            };

            const embed = new EmbedBuilder()
                .setAuthor({ name: `${guild.name} adlı sunucunun rolleri`, iconURL: client.user.displayAvatarURL() })
                .addFields({ name: `Roller [${roller.size}]`, value: format, inline: false })
                .setThumbnail(client.user.displayAvatarURL())
                .setColor('Blurple')
                .setFooter({ text: `Sayfa: ${sayfa} / ${toplamSayfa}`, iconURL: user.displayAvatarURL() })

            let buttons = new ActionRowBuilder();
            let buttons2 = new ActionRowBuilder();

if (id === 'roller-fazla_az') {
                buttons.addComponents(
                    new ButtonBuilder()
                        .setEmoji('◀')
                        .setCustomId(`solgit-${user.id}-fazla_az`)
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(true))

                if (sayfa < toplamSayfa) {
                    buttons.addComponents(
                        new ButtonBuilder()
                            .setEmoji('▶')
                            .setCustomId(`saggit-${user.id}-fazla_az`)
                            .setStyle(ButtonStyle.Primary)
                    );
                } else {
                    buttons.addComponents(
                        new ButtonBuilder()
                            .setEmoji('▶')
                            .setCustomId(`saggit-${user.id}-fazla_az`)
                            .setStyle(ButtonStyle.Primary)
                            .setDisabled(true)
                    );
                };
                } else {
                buttons2.addComponents(
                    new ButtonBuilder()
                        .setEmoji('◀')
                        .setCustomId(`solgit-${user.id}-az_fazla`)
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(true))

                if (sayfa < toplamSayfa) {
                    buttons2.addComponents(
                        new ButtonBuilder()
                            .setEmoji('▶')
                            .setCustomId(`saggit-${user.id}-az_fazla`)
                            .setStyle(ButtonStyle.Primary)
                    );
                } else {
                    buttons2.addComponents(
                        new ButtonBuilder()
                            .setEmoji('▶')
                            .setCustomId(`saggit-${user.id}-az_fazla`)
                            .setStyle(ButtonStyle.Primary)
                            .setDisabled(true)
                    );
                };
            };

            const select = new 
            ActionRowBuilder().addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId(`rollerSelect-${user.id}`)
                    .setPlaceholder('Kategoriler')
                    .addOptions(
                        new StringSelectMenuOptionBuilder()
                            .setLabel(`Fazla üyeden az üyeye`)
                            .setDefault(id === 'roller-fazla_az' ? true : false)
                            .setValue(`roller-fazla_az`),
                        new StringSelectMenuOptionBuilder()
                            .setLabel(`Az üyeden fazla üyeye`)
                            .setDefault(id === 'roller-az_fazla' ? true : false)
                            .setValue(`roller-az_fazla`)
                    )
            )
            
            if (id === 'roller-fazla_az') return await interaction.update({ embeds: [embed], components: [select, buttons] });
            else return await interaction.update({ embeds: [embed], components: [select, buttons2] });
        } else if (cId === 'destekSelect') {
            const destekLog = db.get(`destek.${guild.id}.log`);
            const destekYetkili = db.get(`destek.${guild.id}.yetkili`);
            const destekKategori = db.get(`destek.${guild.id}.kategori`);

            if (!destekLog || !destekYetkili || !destekKategori) return interaction.reply({ content: 'Destek sistemini kullanabilmek için destek sistemi kurulmalıdır. Lütfen yetkililere bildir.', ephemeral: true });

            await guild.channels.create({
                name: `destek-${user.username}`,
                parent: destekKategori,
                type: ChannelType.GuildText,
                permissionOverwrites: [
                    {
                    id: user.id,
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.AttachFiles, PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.ReadMessageHistory],
                    },
                    {
                        id: destekYetkili,
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.AttachFiles, PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.ReadMessageHistory],
                    },
                    {
                        id: guild.id,
                        deny: [PermissionFlagsBits.ViewChannel]
                    }
                ]
                            }).then(async (kanal) => {
                await interaction.deferUpdate();
                let sebep = 'Yardım almak';

                if (id === 'destek-vipSlot') sebep = 'VIP Slot almak istiyorum';
                else if (id === 'destek-diger') sebep = 'Diğer';

                const okEmbed = new EmbedBuilder()
                    .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
                    .setTitle('Senin için bir destek kanalı oluşturuldu!')
                    .setDescription(`${kanal}`)
                    .setColor('Green')

                const embed = new EmbedBuilder()
                    .setAuthor({ name: `${user.username} Kullanıcısının Destek Talebi`, iconURL: client.user.displayAvatarURL() })
                    .setThumbnail(user.displayAvatarURL())
                    .setColor('Blurple')
                    .addFields(
                        { name: 'Talebi Oluşturan', value: `${user}`, inline: false },
                        { name: 'Talebin Oluşturulma Zamanı', value: `<t:${mzr.timestamp(Date.now())}:R>`, inline: false },
                        { name: 'Talebin Açılış Sebebi', value: `${sebep}`, inline: false },
                        { name: 'VIP Bilgilendirme', value: `**FİYAT LİSTESİ**\nSlot 40₺\nHAFTALIK 200₺\nAYLIK 700₺\nSINIRSIZ 2000₺`, inline: false },
                    )

                const buton = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setLabel('Destek Talebini Kapat')
                        .setCustomId('destekKapat')
                        .setStyle(ButtonStyle.Danger))

                const userEkleSelect = new ActionRowBuilder().addComponents(
                    new UserSelectMenuBuilder()
                        .setPlaceholder('Üye Ekle')
                        .setCustomId('destekUyeEkle')
                        .setMaxValues(1))

                const userCikartSelect = new ActionRowBuilder().addComponents(
                    new UserSelectMenuBuilder()
                        .setPlaceholder('Üye Çıkart')
                        .setCustomId('destekUyeCikart')
                        .setMaxValues(1))

                   const okButon = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setLabel('Destek Talebine Git')
                        .setStyle(ButtonStyle.Link)
                        .setURL(kanal.url))

                await kanal.send({ content: `<@&${destekYetkili}> | ${user}`, embeds: [embed], components: [userEkleSelect, userCikartSelect, buton] });
                return interaction.followUp({ embeds: [okEmbed], components: [okButon], ephemeral: true });
            });
        };
    },
};