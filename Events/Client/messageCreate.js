const { Message, Client, PermissionsBitField } = require('discord.js');
const { prefix, kurucular } = require('../../config.json');
const db = require('mzrdb');

module.exports = {
    name: 'messageCreate',
    /**
     * @param {Message} message
     * @param {Client} client
     */
    async execute(message, client) {
        const { channel, author, content, guild, member } = message;

        if (channel.type !== 0) return;
        if (author.bot) return;
        if (!guild) return;

        if (content.toLowerCase() === 'sa' || content.toLowerCase() === 'selam' || content.toLowerCase() === 'selamın aleyküm') {
            const saas = db.get(`saasSistem.${guild.id}`);
            if (!saas) return;

            await message.reply({ content: 'Aleykümselam hoşgeldin!' });
        };

        const scrimKanal = db.get(`scrim.${guild.id}.kanal`);
        if (channel.id === scrimKanal && member.manageable) {
            await member.setNickname(`${content} | ${author.username}`);
            await message.react('✅');

            const scrimRol = db.get(`scrim.${guild.id}.otorol`);
            if (!scrimRol) return;

            await member.roles.add(scrimRol);
        };

        if (!content.startsWith(prefix)) return;
        if (!member) member = await guild.fetchMember(message);

        const args = content.slice(prefix.length).trim().split(/ +/g);
        const cmd = args.shift().toLowerCase();
        if (cmd.length == 0) return;

        let command = client.commands.get(cmd);
        if (!command) return;

        if (command) {
            if (command.izinler && !member.permissions.has(PermissionsBitField.resolve(command.izinler || []))) return message.reply({ content: 'Bu komutu kullana bilmek için gerekli izinlere sahip değilsin.' });
            if (command.kurucu && !kurucular.includes(author.id)) return message.reply({ content: 'Bu komutu kullanmak için benim sahibim olmalısın.' });

            try {
                command.execute(client, message, args, prefix);
            } catch (error) {
                console.error(error);
            }
        };
    },
};