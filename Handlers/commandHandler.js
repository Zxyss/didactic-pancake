const fs = require('fs');

module.exports = (client) => {
    fs.readdirSync('./Commands/').forEach((dir) => {
        const commands = fs.readdirSync(`./Commands/${dir}`).filter((file) => file.endsWith('.js'));

        for (let file of commands) {
            let cmd = require(`../Commands/${dir}/${file}`);

            if (cmd.name) {
                client.commands.set(cmd.name, cmd);
            } else {
                console.log(`${file} isimli komut yüklenemedi!`);
                continue;
            };
        }
    });

    setTimeout(() => { console.log('Komutlar Yüklendi ✅') }, 500);
};