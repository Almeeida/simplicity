'use strict';

class CommandError extends Error {
  constructor(message, options = {}) {
    super(message);
    this.options = options;
    this.onUsage = !!options.onUsage;
    this.fields = [];
    this.notEmbed = !!options.notEmbed;
  }

  addField(name, value, inline = false, options = {}, valueOptions = {}) {
    this.fields.push({ inline, name, options, value, valueOptions });
    return this;
  }
}

module.exports = CommandError;
