const mongoose = require("mongoose");
const { Schema } = mongoose;

const Rooms = new Schema({
    id_user: {type: Schema.Types.ObjectId},
    name: String,
    content: Array,
    isAdmin: Boolean
});

module.exports = mongoose.model("Rooms", Rooms);
