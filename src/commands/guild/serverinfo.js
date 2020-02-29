'use strict';

const { Command, SimplicityEmbed } = require('@structures');
const { getServerIconURL } = require('@util/Util');
const moment = require('moment');

class ServerInfo extends Command {
  constructor(client) {
    super(client, {
      aliases: ['si', 'server', 'svinfo', 'sv', 'guild', 'serverinformation', 'svinformation'],
      category: 'guild',
      name: 'serverinfo',
    });
  }

  async run({ author, channel, emoji, guild, send, t, language }) {
    if (guild.memberCount !== guild.members.size || guild.large) await guild.members.fetch();

    moment.locale(language);

    const totalMembers = guild.memberCount;
    const onlineMembers = guild.members.filter(m => m.user.presence.status !== 'offline').size;
    const offlineMembers = guild.members.filter(m => m.user.presence.status === 'offline').size;

    const totalChannels = guild.channels.cache.filter(c => c.type === 'text' || c.type === 'voice').size;
    const textChannels = guild.channels.cache.filter(c => c.type === 'text').size;
    const voiceChannels = guild.channels.cache.filter(c => c.type === 'voice').size;

    const totalRoles = guild.roles && guild.roles.cache.filter(r => r.id !== guild.id).size;
    const roles = guild.roles && guild.roles.cache.sort((a, b) => b.position - a.position).map(r => r).slice(0, -1);
    const rolesClean = roles && roles.map(r => r.name || r.toString());

    const guildIconURL = getServerIconURL(guild);
    const emojis = guild.emojis && guild.emojis.cache.size;
    const owner = (guild.owner && guild.owner.user.tag) || t('commands:serverinfo.unknown');
    const date = moment(guild.createdAt);

    const boostTier = guild.premiumTier;
    const boosters = guild.premiumSubscriptionCount;

    const embed = new SimplicityEmbed({ author, guild, t })
      .setThumbnail(guildIconURL)
      .addField('» $$commands:serverinfo.name', guild.name, true)
      .addField('» $$commands:serverinfo.id', guild.id, true)
      .addField('» $$commands:serverinfo.owner', owner, true)
      .addField('» $$commands:serverinfo.emotes', emojis, true);

    if (roles.length <= 5) embed.addField('» $$commands:serverinfo.roles', rolesClean.join(', '), true, { totalRoles });
    else embed.addField('» $$commands:serverinfo.totalRoles', totalRoles, true);

    if (boostTier && boosters) {
      embed.addField(
        '» $$commands:serverinfo.boostTier', 'commands:serverinfo.tier', true, {}, { boostTier },
      );
    }

    embed
      .addFields(
        {
          inline: true,
          name: '» $$commands:serverinfo.members',
          options: { totalMembers },
          value: 'commands:serverinfo.onlineOffline',
          valueOptions: { offlineMembers, onlineMembers },
        },
        {
          inline: true,
          name: '» $$commands:serverinfo.channels',
          options: { totalChannels },
          value: 'commands:serverinfo.textVoice',
          valueOptions: { textChannels, voiceChannels },
        },
        {
          name: '» $$commands:serverinfo.created',
          value: `${date.format('LLL')} (${date.fromNow()})`,
        },
        {
          inline: true,
          name: '» $$commands:serverinfo.verificationLevel',
          options: { level: guild.verificationLevel },
          value: `commands:serverinfo.verificationDetails.${guild.verificationLevel}`,
        },
      );

    const message = await send(embed);

    const permissions = channel.permissionsFor(guild.me);
    const roleRestriction = rolesClean && rolesClean.length > 5;

    if (permissions.has('ADD_REACTIONS') && roleRestriction) {
      const role = {
        embed: createEmbedRoles(roles, guild, { author, t }),
        emoji: emoji('ROLES', { id: true }),
      };
      await message.react(role.emoji);

      const serverinfoEmoji = emoji('BACK', { id: true });
      await message.react(serverinfoEmoji);

      const filter = (r, u) => r.me && author.id === u.id;
      const collector = await message.createReactionCollector(filter, { errors: ['time'], time: 30000 });

      collector.on('collect', async ({ emoji: emote, users, message: collectorMessage }) => {
        const name = emote.id || emote.name;
        const checkEmbed = e => e.author.name === collectorMessage.embeds[0].author.name;

        if (permissions.has('MANAGE_MESSAGES')) await users.remove(author.id);
        if (name === serverinfoEmoji && !checkEmbed(embed)) await collectorMessage.edit(embed);
        if (role && name === role.emoji && !checkEmbed(role.embed)) await collectorMessage.edit(role.embed);
      });

      collector.on('end', async () => {
        if (message && permissions.has('MANAGE_MESSAGES')) await message.reactions.removeAll().catch(() => null);
      });
    }
  }
}

function createEmbedRoles(roles, guild, embedOptions = {}) {
  const guildIconURL = getServerIconURL(guild);
  const clean = a => a.slice(0, 25).join('\n') + (a.length > 25 ? '\n...' : '');
  return new SimplicityEmbed(embedOptions)
    .setAuthor('$$commands:serverinfo.roles', guildIconURL, '', { totalRoles: roles.length })
    .setDescription(clean(roles))
    .setColor(process.env.COLOR);
}

module.exports = ServerInfo;
