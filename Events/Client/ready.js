const { ActivityType, Client } = require('discord.js');

module.exports = {
    name: 'ready',
    once: true,
    /**
     * @param {Client} client
     */
    async execute(client) {
        client.user.setStatus('dnd');
        client.user.setActivity({ name: 'MZR | Just Coding...', type: ActivityType.Playing });
    },
};


/*
const { ActivityType } = require('discord.js');
const client = require('../../index');

module.exports = {
    name: 'ready.js'
};

client.once('ready', async () => {
    client.user.setStatus('dnd');
    client.user.setActivity({ name: 'MZR | Just Coding...', type: ActivityType.Playing });
});
*/