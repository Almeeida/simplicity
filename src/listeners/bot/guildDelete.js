'use strict';

const { SimplicityEmbed, SimplicityListener, Utils: { getServerIconURL } } = require('../../');

class GuildDeleteListener extends SimplicityListener {
  constructor(client) {
    super(client);
  }

  async on(client, guild) {
    await client.database.guilds.remove(guild.id);
    const owner = guild.owner;

    this.sendMessage('guild_leave',
      new SimplicityEmbed({ author: owner.user })
        .addField('Guild Name', guild.name, true)
        .addField('Guild ID', guild.id, true)
        .addField('Members | Channels | Emojis', `${guild.memberCount} | ${guild.channels.size} | ${guild.emojis.size}`)
        .setThumbnail(getServerIconURL(guild)));
  }
}

module.exports = GuildDeleteListener;
