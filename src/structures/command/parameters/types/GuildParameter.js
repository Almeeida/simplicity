'use strict';

const CommandError = require('../../CommandError.js');
const Parameter = require('./Parameter.js');

class GuildParameter extends Parameter {
  static parse(arg, { t, client }) {
    if (!arg) return;
    const guild = client.guilds.cache.get(arg);
    if (!guild) throw new CommandError(t('errors:invalidGuild'));
    return guild;
  }
}

module.exports = GuildParameter;
