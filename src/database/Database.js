const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Collection = require('./DBCollection')

class Database {
  constructor (client) {
    this.client = client
    this._url = `mongodb://${process.env.MLAB_LOGIN}:${process.env.MLAB_PASSWORD}@${process.env.MLAB_EMAIL}.mlab.com:${process.env.MLAB_ID}`
    this._guilds = mongoose.model('guilds', new Schema({
      _id: { type: String, required: true },
      lang: { type: String },
      prefix: { type: String },
      channels: [{ id: String, userID: String, date: Date }],
      logs: { channelID: String, logs: [String] }
    }))
    this.guilds = new Collection(this._guilds)
    mongoose.connect(this._url, { useNewUrlParser: true })
      .catch(e => console.log(e))
  }
}
module.exports = Database
