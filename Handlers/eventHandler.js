const { loadFiles } = require('../Functions/fileLoader');

async function loadEvents(client) {

    client.events = new Map();
    client.subCommands = new Map();

    const files = await loadFiles('Events');

    for (const file of files) {
        try {
            const event = require(file);
            const execute = (...args) => event.execute(...args, client);
            const target = event.rest ? client.rest : client;

            target[event.once ? 'once' : 'on'](event.name, execute);
            client.events.set(event.name, execute);
        } catch (error) {
            console.log(error);
        }
    }

    console.info('Events Yüklendi ✅');
}

module.exports = { loadEvents };