const mongoose = require("mongoose");
const { Schema } = mongoose;

const Session = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Session", Session);
