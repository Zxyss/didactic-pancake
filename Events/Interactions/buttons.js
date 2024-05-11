const { ButtonInteraction, Client, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ButtonBuilder, ButtonStyle, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');
const { defaultBasvuruSorular } = require('../../config.json');
const db = require('mzrdb');

module.exports = {
    name: 'interactionCreate',
    /**
     * @param {ButtonInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        if (!interaction.isButton()) return;

        const { customId, user, guild, member } = interaction;
        const cId = customId.split('-')[0];
        const userId = customId.split('-')[1];

        const butonRol = db.get(`butonRol.${guild.id}`);
        let idGerektirmeyen = ['destekKapat', 'basvuruYap', 'basvuruKabulEt', 'basvuruReddet', 'kanalSil'];

        if (butonRol) idGerektirmeyen.push(butonRol);

        if (!idGerektirmeyen.includes(cId) && user.id !== userId) return interaction.reply({ content: `Bu butonu sadece komutu kullanan kiÅi kullanabilir.`, ephemeral: true });

        if (cId === 'embedDuzenle') {
            const modal = new ModalBuilder()
                .setCustomId(`embedOlustur`)
                .setTitle(`Embed OluÅturucu`)


const baslik = new TextInputBuilder()
                .setCustomId(`embedOlustur-baslik`)
                .setLabel('Embed BaÅlÄ±ÄÄ±')
                .setValue('Ä°stediÄin baÅlÄ±k')
                .setStyle(TextInputStyle.Short)
                .setMaxLength(20)
                .setRequired(false)

            const aciklama = new TextInputBuilder()
                .setCustomId(`embedOlustur-aciklama`)
                .setLabel('Embed AÃ§Ä±klamasÄ±')
                .setValue('Ä°stediÄin aÃ§Ä±klama')
                .setStyle(TextInputStyle.Paragraph)
                .setMaxLength(100)
                .setRequired(true)

            const hex = new TextInputBuilder()
                .setCustomId(`embedOlustur-hex`)
                .setLabel('Embed Rengi (HEX)')
                .setValue('#ffffff')
                .setStyle(TextInputStyle.Short)
                .setMaxLength(7)
                .setRequired(true)

            const footer = new TextInputBuilder()
                .setCustomId(`embedOlustur-footer`)
                .setLabel('Embed FooterÄ±')
                .setValue('Ä°stediÄin bir footer')
                .setStyle(TextInputStyle.Short)
                .setMaxLength(20)
                .setRequired(false)

            const thumbnail = new TextInputBuilder()
                .setCustomId(`embedOlustur-thumbnail`)
                .setLabel('Embed Yan Resmi')
                .setPlaceholder('Ä°stediÄin bir yan resim URLsi')
                .setStyle(TextInputStyle.Paragraph)
                .setMaxLength(200)
                .setRequired(false)

            const row = new ActionRowBuilder().addComponents(baslik);
            const row2 = new ActionRowBuilder().addComponents(aciklama);
            const row3 = new ActionRowBuilder().addComponents(hex);
            const row4 = new ActionRowBuilder().addComponents(footer);
            const row5 = new ActionRowBuilder().addComponents(thumbnail);
            modal.addComponents(row, row2, row3, row4, row5);
            
             await interaction.showModal(modal);
        } else if (cId === 'solgit' || cId === 'saggit') {
            const tÃ¼r = customId.split('-')[2];

            let roller = await guild.roles.fetch();
            roller = roller.filter(role => !role.tags || !role.tags.botId);

            if (tÃ¼r === 'fazla_az') roller = roller.sort((a, b) => b.members.size - a.members.size);
            else if (tÃ¼r === 'az_fazla') roller = roller.sort((a, b) => a.members.size - b.members.size);

            const sayfaBK = 10;

            const arr = Array.from(roller.values());
            const toplamSayfa = Math.ceil(arr.length / sayfaBK);

            let sayfa = parseInt(interaction.message.embeds[0].footer.text.split('Sayfa: ')[1]);

            if (cId === 'saggit') sayfa = Math.min(toplamSayfa, sayfa + 1);
            else sayfa = Math.min(toplamSayfa, sayfa - 1);

            const start = (sayfa - 1) * sayfaBK;
            const end = start + sayfaBK;
            const page = arr.slice(start, end);
            let format = null;

            if (tÃ¼r === 'fazla_az') {
                format = page
                    .filter(role => role.id !== guild.id)
                    .map((role, index) => `${role} (**${role.members.size}**)`)
                    .join('\n');
            } else if (tÃ¼r === 'az_fazla') {
                format = page
                    .filter(role => role.id !== guild.id)
                    .map((role, index) => `${role} (**${role.members.size}**)`)
                    .join('\n');
            };

            const embed = new EmbedBuilder()
                .setAuthor({ name: `${guild.name} adlÄ± sunucunun rolleri`, iconURL: client.user.displayAvatarURL() })
                .addFields({ name: `Roller [${roller.size}]`, value: format, inline: false })
                .setThumbnail(client.user.displayAvatarURL())
                .setColor('Blurple')
                .setFooter({ text: `Sayfa: ${sayfa} / ${toplamSayfa}`, iconURL: user.displayAvatarURL() })

const buttons = new ActionRowBuilder();
            const buttons2 = new ActionRowBuilder();

            if (tÃ¼r === 'fazla_az') {
                if (sayfa > 1) {
                    buttons.addComponents(
                        new ButtonBuilder()
                            .setEmoji('â')
                            .setCustomId(`solgit-${user.id}-fazla_az`)
                            .setStyle(ButtonStyle.Primary)
                    );
                } else {
                    buttons.addComponents(
                        new ButtonBuilder()
                            .setEmoji('â')
                            .setCustomId(`solgit-${user.id}-fazla_az`)
                            .setStyle(ButtonStyle.Primary)
                            .setDisabled(true)
                    );
                };

                if (sayfa < toplamSayfa) {
                    buttons.addComponents(
                        new ButtonBuilder()
                            .setEmoji('â¶')
                            .setCustomId(`saggit-${user.id}-fazla_az`)
                            .setStyle(ButtonStyle.Primary)
                    );
                } else {
                    buttons.addComponents(
                        new ButtonBuilder()
                            .setEmoji('â¶')
                            .setCustomId(`saggit-${user.id}-fazla_az`)
                            .setStyle(ButtonStyle.Primary)
                            .setDisabled(true)
                    );
                };
            } else {
                if (sayfa > 1) {
                    buttons2.addComponents(
                        new ButtonBuilder()
                            .setEmoji('â')
                            .setCustomId(`solgit-${user.id}-az_fazla`)
                            .setStyle(ButtonStyle.Primary)
                    );
                } else {
                    buttons2.addComponents(
                        new ButtonBuilder()
                            .setEmoji('â')
                            .setCustomId(`solgit-${user.id}-az_fazla`)
                            .setStyle(ButtonStyle.Primary)
                            .setDisabled(true)
                    );
                };

if (sayfa < toplamSayfa) {
                    buttons.addComponents(
                        new ButtonBuilder()
                            .setEmoji('â¶')
                            .setCustomId(`saggit-${user.id}-fazla_az`)
                            .setStyle(ButtonStyle.Primary)
                    );
                } else {
                    buttons.addComponents(
                        new ButtonBuilder()
                            .setEmoji('â¶')
                            .setCustomId(`saggit-${user.id}-fazla_az`)
                            .setStyle(ButtonStyle.Primary)
                            .setDisabled(true)
                    );
                };
            } else {
                if (sayfa > 1) {
                    buttons2.addComponents(
                        new ButtonBuilder()
                            .setEmoji('â')
                            .setCustomId(`solgit-${user.id}-az_fazla`)
                            .setStyle(ButtonStyle.Primary)
                    );
                } else {
                    buttons2.addComponents(
                        new ButtonBuilder()
                            .setEmoji('â')
                            .setCustomId(`solgit-${user.id}-az_fazla`)
                            .setStyle(ButtonStyle.Primary)
                            .setDisabled(true)
                    );
                };

                if (sayfa < toplamSayfa) {
                    buttons2.addComponents(
                        new ButtonBuilder()
                            .setEmoji('â¶')
                            .setCustomId(`saggit-${user.id}-az_fazla`)
                            .setStyle(ButtonStyle.Primary)
                    );
                } else {
                    buttons2.addComponents(
                        new ButtonBuilder()
                            .setEmoji('â¶')
                            .setCustomId(`saggit-${user.id}-az_fazla`)
                            .setStyle(ButtonStyle.Primary)
                            .setDisabled(true)
                    );
                };
            };

            const select = new ActionRowBuilder().addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId(`rollerSelect-${user.id}`)
                    .setPlaceholder('Kategoriler')
                    .addOptions(
                        new StringSelectMenuOptionBuilder()
                            .setLabel(`Fazla Ã¼yeden az Ã¼yeye`)
                            .setDefault(tÃ¼r === 'fazla_az' ? true : false)
                            .setValue(`roller-fazla_az`),
                        new StringSelectMenuOptionBuilder()
                            .setLabel(`Az Ã¼yeden fazla Ã¼yeye`)
                            .setDefault(tÃ¼r === 'az_fazla' ? true : false)
                            .setValue(`roller-az_fazla`)
                    )
            )

            if (tÃ¼r === 'fazla_az') return await interaction.update({ embeds: [embed], components: [select, buttons] });
            else return await interaction.update({ embeds: [embed], components: [select, buttons2] });
        } else if (cId === 'destekSifirla') {
            db.delete(`destek.${guild.id}`);

            return interaction.reply({ content: 'BaÅarÄ±yla sÄ±fÄ±rlanmÄ±ÅtÄ±r!', ephemeral: true });
        } else if (cId === 'destekKapat') {
            const logID = db.get(`destek.${guild.id}.log`);
            if (!logID) return interaction.reply({ content: 'Destek Log kanalÄ± ayarlanmamÄ±Å!', ephemeral: true });

            const modal = new ModalBuilder()
                .setCustomId('nedenSoyle')
                .setTitle('Neden Kapatmak Ä°stiyorsun?')
            const text = new TextInputBuilder()
                .setCustomId('nedenBelirt')
                .setLabel('Kapatma Nedeni Belirt')
                .setStyle(TextInputStyle.Paragraph)
                .setPlaceholder('ÃÃ¶zÃ¼m saÄlandÄ±!')
                .setRequired(true)

            const row = new ActionRowBuilder().addComponents(text);
            modal.addComponents(row);

            return interaction.showModal(modal);
        } else if (cId === 'saasSistemKapat' || cId === 'saasSistemAc') {
            const embed = new EmbedBuilder()
                .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
                .setDescription('AÅaÄÄ±daki menÃ¼den sistemleri kontrol edebilirsin.')
                .setThumbnail(client.user.displayAvatarURL())

            if (cId === 'saasSistemKapat') db.delete(`saasSistem.${guild.id}`);
            else db.set(`saasSistem.${guild.id}`, true);

            const saas = db.get(`saasSistem.${guild.id}`);

            if (saas) {
                embed.setColor('Red');
                embed.addFields({ name: 'Selam Sistemi', value: 'â' });

                const buton = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setLabel('Sistemi Kapat')
                        .setCustomId(`saasSistemKapat-${user.id}`)
                        .setStyle(ButtonStyle.Danger))

                return interaction.update({ embeds: [embed], components: [buton] });
            } else {
                embed.setColor('Green');
                embed.addFields({ name: 'Selam Sistemi', value: 'â' });

                const buton = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setLabel('Sistemi AÃ§')
                        .setCustomId(`saasSistemAc-${user.id}`)
                        .setStyle(ButtonStyle.Success))

                return interaction.update({ embeds: [embed], components: [buton] });
            };
        } else if (cId === 'scrimSifirla') {
            db.delete(`scrim.${guild.id}`);

            return interaction.reply({ content: 'BaÅarÄ±yla sÄ±fÄ±rlanmÄ±ÅtÄ±r!', ephemeral: true });
        } else if (cId === 'hgbbSifirla') {
            db.delete(`hgbb.${guild.id}`);

            return interaction.reply({ content: 'BaÅarÄ±yla sÄ±fÄ±rlanmÄ±ÅtÄ±r!', ephemeral: true });
        } else if (cId === 'basvuruSifirla') {
            db.delete(`basvuru.${guild.id}`);

            return interaction.reply({ content: 'BaÅarÄ±yla sÄ±fÄ±rlanmÄ±ÅtÄ±r!', ephemeral: true });
        } else if (cId === 'soruSifirla') {
            db.delete(`basvuru.${guild.id}.soru`);

            return interaction.reply({ content: 'BaÅarÄ±yla sÄ±fÄ±rlanmÄ±ÅtÄ±r!', ephemeral: true });
        } else if (cId === 'soruDuzenle') {
            const modal = new ModalBuilder()
                .setCustomId('basvuruSorular')
                .setTitle('Sorular')

            let sorular = db.get(`basvuru.${guild.id}.soru`);
            if (!sorular) sorular = defaultBasvuruSorular;

            for (i = 0; i < 4; i++) {
                let placeHolder = 'Ä°sim ve YaÅÄ±n';

                if (i == 0) placeHolder = sorular[i];
                else if (i == 1) placeHolder = sorular[i];
                else if (i == 2) placeHolder = sorular[i];
                else if (i == 3) placeHolder = sorular[i];

                const text = new TextInputBuilder()
                    .setCustomId(`soru${i + 1}`)
                    .setLabel(`Soru ${i + 1}`)
                    .setStyle(TextInputStyle.Paragraph)
                    .setPlaceholder(placeHolder)
                    .setRequired(true)
                    .setMaxLength(50)

                const row = new ActionRowBuilder().addComponents(text);
                modal.addComponents(row);
            }

            return interaction.showModal(modal);
        } else if (cId === 'basvuruKabulEt') {

            const verilecekRolID = db.get(`basvuru.${guild.id}.verilecek`);
            if (!verilecekRolID) return interaction.reply({ content: 'Verilecek rol ayarlanmamÄ±Å!', ephemeral: true });

            const logID = db.get(`basvuru.${guild.id}.log`);
            if (!logID) return interaction.reply({ content: 'BaÅvuru log kanalÄ± ayarlanmamÄ±Å!', ephemeral: true });

            const log = client.channels.cache.get(logID);

            try {
                const Ã¼ye = await guild.members.fetch(userId);

                await Ã¼ye.roles.add(verilecekRolID);
            } catch {
                return interaction.reply({ content: 'Bu Ã¼ye sunucudan ayrÄ±lmÄ±Å!', ephemeral: true });
            }

            return log.send({ content: `${Ã¼ye} baÅvurunuz baÅarÄ±yla kabul edildi!` });
        } else if (cId === 'basvuruReddet') {
            const logID = db.get(`basvuru.${guild.id}.log`);
            if (!logID) return interaction.reply({ content: 'BaÅvuru log kanalÄ± ayarlanmamÄ±Å!', ephemeral: true });

            const Ã¼ye = await client.users.fetch(userId);
            const log = client.channels.cache.get(logID);

            return log.send({ content: `${Ã¼ye} Ã¼zgÃ¼nÃ¼m, baÅvurunuz kabul edilmedi. Sizi reddeten yetkili ${user}` });
        } else if (cId === 'butonRolSifirla') {
            db.delete(`butonRol.${guild.id}`);

            return interaction.reply({ content: 'BaÅarÄ±yla sÄ±fÄ±rlanmÄ±ÅtÄ±r!', ephemeral: true });
        } else if (butonRol && cId === butonRol) {
            await interaction.reply({ content: `Rol baÅarÄ±yla verildi!`, ephemeral: true });

            await member.roles.add(butonRol);
        } else if (cId === 'kanalLogSifirla') {
            db.delete(`kanalLog.${guild.id}`);

            return interaction.reply({ content: 'BaÅarÄ±yla sÄ±fÄ±rlanmÄ±ÅtÄ±r!', ephemeral: true });
        } else if (cId === 'mesajLogSifirla') {
            db.delete(`mesajLog.${guild.id}`);

            return interaction.reply({ content: 'BaÅarÄ±yla sÄ±fÄ±rlanmÄ±ÅtÄ±r!', ephemeral: true });
        } else if (cId === 'kanalSil') {
            const kanal = client.channels.cache.get(userId); // userId = Kanal ID
            if (!kanal) return interaction.reply({ content: 'BÃ¶yle bir kanal bulunamadÄ±.', ephemeral: true });

            await kanal.delete();
            return interaction.reply({ content: `**${kanal.name}** kanalÄ± baÅarÄ±yla silinmiÅtir.`, ephemeral: true });
        };
    },
};
