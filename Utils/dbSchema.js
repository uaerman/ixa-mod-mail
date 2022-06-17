const { Schema , model } = require("mongoose");

const userSchema = new Schema({
  user: {type: String, required: true},
  channel: {type: String, required: true},
  blacklist: {type: Boolean, required: false, default: false},
  hold: {type: Boolean, require: false, default: false},
  ticket: {type: Boolean, required: false, default: false}
})

const channelSchema = new Schema({
  userId: {type: String, required: true},
  channelId: {type: String, required: true}
})

const User = model("Users", userSchema);
const Channel = model("Channels", channelSchema);

module.exports = {User,Channel}