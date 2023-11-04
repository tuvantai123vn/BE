const Mess = require("../model/Rooms");
const User = require("../model/User");

exports.index = async (req, res, next) => {
  try {
    const id_user = req.params.id;
    const messenger = await Mess.findOne({
      id_user: id_user,
    });
    res.status(200).json(messenger);
  } catch (err) {
    next(err);
  }
};

exports.all = async (req, res, next) => {

  try {
    const messenger = await Mess.find({});
    res.status(200).json(messenger);
  } catch (err) {
    next(err);
  }
};
