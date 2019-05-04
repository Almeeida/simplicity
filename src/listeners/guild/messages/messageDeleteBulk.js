const { Constants, SimplicityEmbed, SimplicityListener, Utils } = require('../../../index')
const { getServerIconURL } = Utils

class MessageDeleteBulk extends SimplicityListener {
  constructor (client) {
    super(client)
  }

  on (_, messages) {
    const message = messages.first()

    this.sendLogMessage(message.guild.id, 'MessageUpdate',
      new SimplicityEmbed(this.getFixedT(message.guild.id))
        .setTimestamp()
        .setAuthor(message.guild.name, getServerIconURL(message.guild.id))
        .setDescription('loggers:messageDeleteBulk', { amount: messages.size, channel: message.channel })
        .setColor(Constants.COLORS.MESSAGE_BULK_DELETE)).catch(() => null)
  }
}

module.exports = MessageDeleteBulk
