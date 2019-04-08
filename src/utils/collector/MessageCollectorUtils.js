const SimplicityEmbed = require('../../structures/discord/SimplicityEmbed')

class MessageCollectorUtils {
  static run (dependencies, responses, callback) {
    const { channel, author, command } = dependencies

    const filter = (m) => m.author.id === author.id
    const collector = channel.createMessageCollector(filter, { max: 3, time: 30000, errors: ['time'] })

    command.running.add(channel.id, author.id)

    collector.on('collect', (message) => {
      if (this.checkContent(message, 'confirm')) {
        callback(dependencies)
        collector.stop('finish')
      } else if (this.checkContent(message, 'cancel')) {
        collector.stop('cancel')
      } else {
        if (collector.collected !== collector.options.max) this.incorrectResponse(dependencies, message, collector.collected)
      }
    })

    collector.on('end', (...params) => this.onEnd(dependencies, responses, ...params))
  }

  static incorrectResponse ({ send, t }, message, collected) {
    const embed = new SimplicityEmbed(t)
      .setDescription('utils:messageCollector:incorrectResponse', { count: collected.size })
      .setText('@description')

    send(embed).then(m => setTimeout(() => {
      m.delete()
      this.deleteMessage(message)
    }, 10000))
  }

  static checkContent (message, query) {
    const content = message.content.toLowerCase()
    return (content === query) || (content.startsWith(query))
  }

  static onEnd ({ t, channel, command, author, send, msg }, responses = {}, _, reasonParam) {
    command.running.remove(channel.id, author.id)
    msg.delete()

    responses = Object.assign({
      time: t('utils:messageCollector.time'),
      cancel: t('utils:messageCollector.cancel'),
      limit: t('utils:messageCollector.limit')
    }, responses)

    const response = responses[reasonParam]
    if (response) {
      const embed = new SimplicityEmbed(author, { autoAuthor: false })
        .setDescription(response)
        .setText('@description')
      send(embed).then(m => m.delete({ timeout: 60000 }))
    }
  }

  static deleteMessage (message) {
    const client = message.client
    const guild = message.guild
    const memberClient = guild && client && guild.member(client.user)
    if (!message.deleted && memberClient && message.channel.permissionsFor(memberClient).has('MANAGE_MESSAGS')) message.delete()
  }
}

module.exports = MessageCollectorUtils
