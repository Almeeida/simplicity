'use strict';

const CommandError = require('../../CommandError.js');
const Parameter = require('./Parameter.js');

class BooleanParameter extends Parameter {
  static parseOptions(options = {}) {
    return {
      ...super.parseOptions(options),
      falseValues: options.falseValues || ['false', 'no', 'off'],
      trueValues: options.trueValues || ['true', 'yes', 'on'],
    };
  }

  static parse(arg, { t }) {
    if (!this.trueValues.concat(this.falseValues).includes(arg)) throw new CommandError(t('errors:notTrueOrFalse'));
    return this.trueValues.includes(arg);
  }
}

module.exports = BooleanParameter;
